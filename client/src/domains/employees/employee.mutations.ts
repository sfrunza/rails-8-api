import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { createEmployee, updateEmployee } from "./employee.api";
import type { Employee } from "./employee.types";

export function useCreateEmployee(mutationOptions?: Omit<UseMutationOptions<Employee, Error, Partial<Employee>>, "mutationFn">) {
  return useMutation({
    mutationFn: createEmployee,
    ...mutationOptions,
  });
}

export function useUpdateEmployee(mutationOptions?: Omit<UseMutationOptions<Employee, Error, { id: number, data: Partial<Employee> }>, "mutationFn">) {
  return useMutation({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    ...mutationOptions,
  });
}
