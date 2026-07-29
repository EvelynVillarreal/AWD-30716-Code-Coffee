'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (adminOnly && !isAdmin) {
      router.push('/products');
    }
  }, [isLoggedIn, isAdmin, adminOnly, isLoading, router]);

  if (isLoading) return null;
  if (!isLoggedIn) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
}
