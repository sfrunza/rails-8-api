import { createMoveSize, deleteMoveSize, getMoveSizes, updateMoveSize } from "@/api/endpoints/move-sizes";
import { STALE_TIME_CATALOG } from "@/lib/constants";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import type { MoveSize } from '@/types/index';
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";

export function useMoveSizes(
  options?: Omit<
    UseQueryOptions<MoveSize[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.moveSizes.all,
    queryFn: getMoveSizes,
    staleTime: STALE_TIME_CATALOG,
    ...options,
  });
}

export function useUpdateMoveSize(mutationOptions?: Omit<
  UseMutationOptions<MoveSize, Error, { id: number; data: Partial<MoveSize> & { image?: File | null; remove_image?: boolean } }>,
  'mutationFn' | 'mutationKey'
>) {
  return useMutation({
    mutationFn: ({ id, data }) => updateMoveSize(id, data),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moveSizes.all });

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useCreateMoveSize(mutationOptions?: Omit<
  UseMutationOptions<MoveSize, Error, Partial<MoveSize> & { image?: File | null }>,
  'mutationFn' | 'mutationKey'
>) {
  return useMutation({
    mutationFn: createMoveSize,
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moveSizes.all });

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useDeleteMoveSize(mutationOptions?: Omit<
  UseMutationOptions<void, Error, { id: number }>,
  'mutationFn' | 'mutationKey'
>) {
  return useMutation({
    mutationFn: ({ id }) => deleteMoveSize(id),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });

      mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

