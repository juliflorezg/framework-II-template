import { Provider, useCommerce } from '../../kernel';
import { useCallback } from 'react';
import type { MutationHook, PickRequired, SWRHook } from './types';
import useData from './use-data';
import Storage from './async-storage'
import { useStyleguide } from '../../../styleguide/context';
export function useFetcher() {
  const { providerRef, fetcherRef } = useCommerce();
  return providerRef.current.fetcher ?? fetcherRef.current;
}

export function useHook<
  P extends Provider,
  H extends MutationHook<any> | SWRHook<any>
>(fn: (provider: P) => H) {
  const { providerRef } = useCommerce<P>();
  const provider = providerRef.current;
  return fn(provider);
}

export function useSWRHook<H extends SWRHook<any>>(
  hook: PickRequired<H, 'fetcher'>
) {
  const fetcher = useFetcher();

  return hook.useHook({
    useData(ctx) {
      const response = useData(
        hook,
        ctx?.input ?? [],
        fetcher,
        ctx?.swrOptions
      );
      return response;
    },
  });
}

export function useMutationHook<H extends MutationHook<any>>(
  hook: PickRequired<H, 'fetcher'>
) {
  const fetcher = useFetcher();
  const { sharedComponents: { utils }} = useStyleguide()
  return hook.useHook({
    fetch: useCallback(
      ({ input } = {}) => {
      
        return hook.fetcher({
          input,
          options: hook.fetchOptions,
          fetch: fetcher,
          utils,
          template: hook.template || {}
        });
      },
      [fetcher, hook.fetchOptions]
    ),
  });
}
