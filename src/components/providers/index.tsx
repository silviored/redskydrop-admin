'use client';
import { CacheService } from '@/services/cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Toast } from '../toast';
import { GlobalStateProvider } from '@/contexts/global-state';
export function Providers({ children }: { children: ReactNode }) {
  return (
    <GlobalStateProvider>
      <QueryClientProvider client={CacheService.queryClient}>
        <Toast>{children}</Toast>
      </QueryClientProvider>
    </GlobalStateProvider>
  );
}
