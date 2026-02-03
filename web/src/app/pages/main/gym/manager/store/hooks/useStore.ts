import {
  type CreateProductDto,
  storeApi,
  type UpdateProductDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStore(
  gymId?: string,
  params: {
    search?: string;
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {},
) {
  return useQuery({
    queryKey: ["store", gymId, params],
    queryFn: () => storeApi.getProducts(gymId!, params),
    enabled: !!gymId,
  });
}

export function useProduct(gymId?: string, id?: string) {
  return useQuery({
    queryKey: ["product", gymId, id],
    queryFn: () => storeApi.getProduct(gymId!, id!),
    enabled: !!gymId && !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gymId, data }: { gymId: string; data: CreateProductDto }) =>
      storeApi.createProduct(gymId, data),
    onSuccess: (_, { gymId }) => {
      queryClient.invalidateQueries({ queryKey: ["store", gymId] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gymId,
      id,
      data,
    }: {
      gymId: string;
      id: string;
      data: UpdateProductDto;
    }) => storeApi.updateProduct(gymId, id, data),
    onSuccess: (_, { gymId, id }) => {
      queryClient.invalidateQueries({ queryKey: ["store", gymId] });
      queryClient.invalidateQueries({ queryKey: ["product", gymId, id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gymId, id }: { gymId: string; id: string }) =>
      storeApi.deleteProduct(gymId, id),
    onSuccess: (_, { gymId }) => {
      queryClient.invalidateQueries({ queryKey: ["store", gymId] });
    },
  });
}
