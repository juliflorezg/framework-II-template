import { useCallback } from 'react';
import useOmniHook, { UseOmniHook } from '../../kernel/hook/use-omni-hook';
import { HookFetcherOptions, MutationHook } from '../../kernel/utils/types';
import set from 'lodash.set'
import { customerAccessTokenCreateMutation, getAllProductsQuery, getCollectionProductsQuery, getCustomerQuery } from '@vercel/commerce-shopify/utils';
import { addVarToString } from '../utils/addVarToString';
import isArray from 'lodash.isarray';
import get from 'lodash.get';

export default useOmniHook as UseOmniHook<typeof handler>;


const VarDefinitions = {
  array: [],
  varchar: "",
  object: {},
  bool: false,
  float: 0.0,
  int: 0,
};



interface ParseResponse<TO = unknown, FROM = unknown> {
  from: FROM;
  to: TO;
}
type Action = any

type ExecParams = {
  [x: string]: unknown
  template: {
    [x: string]: any
  }
  input: {
    exec: Action[]
  },
  options: HookFetcherOptions
}




const parseQueryInput = (response: any, output: { [x: string]: any }, to: { [x: string]: any },) => {
  if (typeof response === 'object') {
    const keys = Object.keys(response);
    keys?.forEach((key) => {
      if (response.hasOwnProperty(key)) {
        if (typeof response[key] == 'object') {

          parseQueryInput(response[key], output, to);
        } else {
          output[key] = addVarToString(response[key], to)
        }
      }
    });
  } else {
    Object.assign(output, addVarToString(response, to))

  }
};
const findPath = (ob: any, key: string) => {
  const path: string[] = [];
  const keyExists = (obj: { [x: string]: any }): boolean => {
    if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
      return false;
    }
    else if (obj?.hasOwnProperty(key)) {
      return true;
    }
    else if (Array.isArray(obj)) {
      let parentKey = path.length ? path.pop() : "";

      for (let i = 0; i < obj.length; i++) {
        path.push(`${parentKey}[${i}]`);
        const result = keyExists(obj[i]);
        if (result) {
          return result;
        }
        path.pop();
      }
    }
    else {
      for (const k in obj) {
        path.push(k);
        const result = keyExists(obj[k]);
        if (result) {
          return result;
        }
        path.pop();
      }
    }
    return false;
  };

  keyExists(ob);

  return path.join(".");
}

const parseFromTo = (response: any, output: { [x: string]: any }, parseResponse: ParseResponse) => {
  if (!response) return;
  Object.keys(response).forEach((key) => {
    if (response.hasOwnProperty(key)) {
      const responseValue = response[key]
      if (isArray(responseValue) || typeof responseValue !== 'object') {
        console.log(key, response)
        const toPath = findPath(parseResponse, key)

        const val = get(parseResponse, responseValue)
        console.log("Value", toPath)
        if (!toPath.length) output[key] = val
        else {
          set(output, toPath + "." + key, val)
        }
      } else if (typeof responseValue == 'object') {
        parseFromTo(responseValue, output, parseResponse);
      }
    }
  });
};

export const parseResponse = (
  responses: any,
  parseInput: ParseResponse,
  exec: (action: Action) => any
) => {

  let parsed = {}
  const parseFromTo = (response: any, output: { [x: string]: any }, parseResponse: any) => {
    if (!response) return;
    Object.keys(response).forEach(async (key) => {
      if (response.hasOwnProperty(key)) {
        const responseValue = response[key]
        if (isArray(responseValue) || typeof responseValue !== 'object') {
          const toPath = findPath(parseInput.to, key)
          const val = get(parseResponse, responseValue)
          if (!toPath.length) output[key] = val
          else {
            set(output, toPath + "." + key, val)
          }
        } else if (typeof responseValue == 'object') {
          if (responseValue?.pathValue && responseValue?.parseFunction) {

            const val = get(parseResponse, responseValue?.pathValue)

            const parsed = await exec({
              name: responseValue?.parseFunction,
              function: responseValue?.function,
              params: [val]
            })
            const toPath = findPath(parseInput.to, key)
            if (!toPath.length) output[key] = parsed
            else {
              set(output, toPath + "." + key, parsed)
            }
          } else {
            parseFromTo(responseValue, output, parseResponse);
          }
        }
      }
    });
  };

  parseFromTo(parseInput.to, parsed, responses)

  return parsed
};




const ExecHandler = async (params: ExecParams, MainAction: Record<string, any>) => {
  let arr: any = {
    params
  }

  const exec = (action: Action) => {
    const actionParams = action.params.map((param: string) => {
      return addVarToString(param, arr[action.dependsOn])
    })
    return params.utils[action.name][action.function](...actionParams)
  };
  const onSuccess = (successActions: Action[]) => {
    successActions?.forEach(async (action) => {
      await exec(action)
    })
  }
  const onError = (errorActions: Action[]) => {
    console.log(errorActions)
  }

  for (let i = 0; i < params.template.exec.length; i++) {
    const action = params.template.exec[i]


    try {
      if (!MainAction[action.name]) {
        const execRes = await exec(action)
        arr = {
          ...arr,
          [action.name]: execRes
        }

      } else {
        let output = {}


        action?.params?.forEach((param) => parseQueryInput(param, output, arr))


        const response = await MainAction[action.name]({
          ...params.options,
          variables: {
            ...params.input,
            ...output
          },
          headerOptions: params.template?.headerOptions
        })

        if (params.template?.parseResponse) {

          const parsedResponses = parseResponse(response, params.template?.parseResponse, exec);
          arr = {
            ...arr,
            [params.template.name]: parsedResponses
          }
        } else {

          arr = {
            ...arr,
            [params.template.name]: response
          }
        }



      }
      onSuccess(action.onSuccess)
    } catch (e) {
      console.log(e)
      onError(action.onError)
    }

  }
  if (arr?.params) delete arr?.params
  return arr
}

const queries = {
  customerAccessTokenCreateMutation,
  getCustomerQuery,
  getAllProductsQuery
}

export const handler: MutationHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher(defaultParams) {
    console.log(defaultParams)
    let params = {
      ...defaultParams,
      options: {
        ...defaultParams.options,
      }
    }

    if (defaultParams.template.fetchOptions.query) {
      params.options.query = queries[defaultParams.template.fetchOptions.query]
    } else if (defaultParams.template.fetchOptions.url) {
      params.options.url = defaultParams.template.fetchOptions.url
    }

    const actions = {
      [params.template.name]: params.fetch
    }
    const execResponses = await ExecHandler(params, actions)
    console.log("ExecResponses", execResponses)
    return execResponses;
  },
  useHook:
    ({ fetch }) =>
      (params) => {
        return useCallback(async function omniHook(input) {

          const cpyHooks = input?.hooks
          if (input?.hooks) delete input?.hooks
          const data = await fetch({
            input
          });

          const middles = params?.businessLogic?.middlewares?.map((middleware: { name: string | number; }) => ({ hook: cpyHooks[middleware.name], middleware })).filter((pred: any) => pred)
          if (middles?.length) {
            middles?.forEach(async (element) => {
              let allParams = {
                hooks: cpyHooks
              }

              element?.middleware?.params?.forEach((param) => parseQueryInput(param, allParams, {
                ...data[element?.middleware?.dependsOn],
                ...input
              }))

              const middlewareResponse = await element.hook(allParams)
              console.log("MDRes", middlewareResponse)
            });

          }
          return data;
        }, [fetch, params]);
      },
};
