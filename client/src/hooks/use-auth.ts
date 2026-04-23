import { login, logout } from '@/api/endpoints/auth';
import { useAuthStore } from '@/stores/auth-store';

import { extractError } from '@/lib/axios';
import { queryClient } from '@/lib/query-client';
import { getPortalForRole } from '@/lib/role-guards';
import type { LoginResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

export function useAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('return_to');
  const {
    user,
    setUser,
  } = useAuthStore();

  const { mutate: loginMutation, isPending: isPendingLogin } = useMutation<LoginResponse, Error, { email_address: string, password: string }>({
    mutationFn: ({ email_address, password }) => login(email_address, password),
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
        if (returnTo) {
          navigate(returnTo);
          return;
        }
        navigate(getPortalForRole(data.user.role));
      }
      if (data.error) {
        useAuthStore.getState().clearAuth();
        toast.error(extractError(data.error));
      }
    },
    onError: (err) => {
      useAuthStore.getState().clearAuth();
      toast.error(extractError(err));
    },
  });

  const { mutate: logoutMutation, isPending: isPendingLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      useAuthStore.getState().clearAuth();
      queryClient.clear();
      window.location.assign('/auth/login');
    },
  });

  return {
    user,
    login: loginMutation,
    isPendingLogin,
    logout: logoutMutation,
    isPendingLogout
  };
}; 