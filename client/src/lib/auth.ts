// import { autoLogin, getSession } from '@/api/auth';
// import { getCalendarRates } from '@/api/calendar-rates';
// import { getEmails } from '@/api/emails';
// import { getEntranceTypes } from '@/api/entrance-types';
// import { getExtraServices } from '@/api/extra-services';
// import { getFolders } from '@/api/folders';
// import { getMoveSizes } from '@/api/move-sizes';
// import { getPackings } from '@/api/packings';
// import { getRates } from '@/api/rates';
// import { getSettings } from '@/api/settings';
// import { getTrucks } from '@/api/trucks';
// import { queryClient } from '@/lib/query-client';
// import { getCurrentUser } from '@/lib/api';
import { validateSession } from '@/api/endpoints/auth';
import { useAuthStore } from '@/stores/auth-store';
import { redirect } from 'react-router';
import { queryClient } from './query-client';
import { getPortalForRole } from '@/lib/role-guards';
import { getSettings } from '@/api/endpoints/settings';
import { queryKeys } from './query-keys';

export interface AuthLoaderParams {
  request: Request;
  redirectTo?: string;
}

export interface AuthResult {
  user: any;
  isAuthenticated: boolean;
}

/**
 * Creates a redirect response to login page
 */
export const createLoginRedirect = (returnTo: string) => {
  return redirect(`/auth/login?return_to=${encodeURIComponent(returnTo)}`);
};

/**
 * Creates a redirect response to home page
 */
export const createHomeRedirect = () => {
  return redirect('/');
};

/**
 * Prefetches settings data for auth pages with error handling
 */
export const prefetchSettings = async (): Promise<void> => {
  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.settings.all,
      queryFn: getSettings,
      staleTime: Infinity,
    });

    // await queryClient.prefetchQuery({
    //   queryKey: ['trucks'],
    //   queryFn: getTrucks,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['packings'],
    //   queryFn: getPackings,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['extra-services'],
    //   queryFn: getExtraServices,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['rates'],
    //   queryFn: getRates,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['calendar-rates'],
    //   queryFn: getCalendarRates,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['move-sizes'],
    //   queryFn: getMoveSizes,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['entrance-types'],
    //   queryFn: getEntranceTypes,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['folders'],
    //   queryFn: getFolders,
    //   staleTime: Infinity,
    // });

    // await queryClient.prefetchQuery({
    //   queryKey: ['emails'],
    //   queryFn: getEmails,
    //   staleTime: Infinity,
    // });



  } catch (error) {
    console.error('Failed to prefetch settings:', error);
    // Don't throw here as settings are not critical for auth pages
  }
};

/**
 * Root `/` route loader — redirects to the user's portal or login.
 * Redirect happens in the loader so the component never renders with stale store state.
 */
export const rootLoader = async () => {
  prefetchSettings();

  try {
    const { user } = await validateSession();

    if (!user) {
      return redirect('/auth/login');
    }

    useAuthStore.getState().setUser(user);
    return redirect(getPortalForRole(user.role));
  } catch (err) {
    console.error('Root loader error:', err);
    return redirect('/auth/login');
  }
};

/**
 * CRM, Acc route loader
 */
export const appLoader = async ({ request }: AuthLoaderParams) => {
  const url = new URL(request.url);
  const returnTo = url.pathname + url.search;

  prefetchSettings();

  try {
    const { user } = await validateSession();

    if (!user) {
      return createLoginRedirect(returnTo);
    }

    useAuthStore.getState().setUser(user);

    return null;
  } catch (err) {
    console.error('CRM loader error:', err);
    return createLoginRedirect(returnTo);
  }
};


/**
 * Auth route loader
 */
export const authLoader = async () => {
  prefetchSettings();

  try {
    const { user } = await validateSession();

    // If user is authenticated, redirect to home
    if (user) {
      return createHomeRedirect();
    }

    const { clearAuth } = useAuthStore.getState();
    clearAuth();

    return null;
  } catch (error) {
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
    return null;
  }
};

/**
 * Should revalidate the app loader
 */
export function shouldRevalidate({ currentUrl, nextUrl }: { currentUrl: URL, nextUrl: URL }) {
  return currentUrl.pathname !== nextUrl.pathname;
}