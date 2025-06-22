'use client';
import { useSetupApiInterceptor } from '@/hooks/useSetupApiInterceptor';

export default function ClientWrapper() {
  useSetupApiInterceptor();
  return null; // just sets up the interceptor
}
