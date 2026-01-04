import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 10 * 60 * 1000,   //10 min
      retry: 1,                    
      refetchOnWindowFocus: false, 
    },
    mutations: {
      retry: 0                     
    }
  }
});
