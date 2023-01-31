/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//import { API_URL } from './const';
import { handleFetchResponse } from './utils';
import fetch from 'cross-fetch';
import { Fetcher } from '../kernel/utils/types';
import { API_TOKEN, API_URL } from '@vercel/commerce-shopify/const';


const defaultHeaderOptions = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': API_TOKEN!,
}

const fetcher: Fetcher = async ({
  url = API_URL,
  method = 'POST',
  variables,
  query,
  headerOptions
}) => {
  const { locale, ...vars } = variables ?? {};
  const headers = new Headers(headerOptions ? headerOptions : defaultHeaderOptions);


  let fetcherOptions = {
    method,
    headers,
    ...(locale && {
      'Accept-Language': locale,
    }),
  }

  if (query && vars) fetcherOptions.body = JSON.stringify({ query, variables: vars })
  //@ts-ignore
  else if (vars && headerOptions['Content-Type'] === "application/x-www-form-urlencoded") {
    var formBody = [];
    for (var property in vars) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(vars[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    fetcherOptions.body = formBody.join("&");
  }
  return handleFetchResponse(
    await fetch(url, fetcherOptions)
  );
};

export default fetcher;

