import {
  staffApi,
  type AddStaffDto,
  type StaffMember,
  type UpdateStaffDto,
} from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../../utils/statusMessage";

export function useGymStaff(gymId: string | undefined) {
  return useQuery({
    queryKey: ["gymStaff", gymId],
    queryFn: async () => {
      if (!gymId) return [];
      const response = await staffApi.getGymStaff(gymId);
      return response.data || [];
    },
    enabled: !!gymId,
  });
}

export function useAddStaff() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AddStaffDto) => {
      const response = await staffApi.addStaff(dto);
      if (!response.success) {
        throw response;
      }
      return { response, gymId: dto.gymId };
    },
    onMutate: async (dto) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["gymStaff", dto.gymId] });

      // Snapshot the previous value
      const previousStaff = queryClient.getQueryData<StaffMember[]>([
        "gymStaff",
        dto.gymId,
      ]);

      // Optimistically add the new staff member
      const optimisticStaff: StaffMember = {
        membershipId: `temp-${Date.now()}`,
        fullName: dto.fullName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
        joinedAt: new Date().toISOString(),
        userId: "",
      };

      queryClient.setQueryData<StaffMember[]>(
        ["gymStaff", dto.gymId],
        (old) => [...(old || []), optimisticStaff]
      );

      return { previousStaff, gymId: dto.gymId };
    },
    onSuccess: ({ response, gymId }) => {
      // Invalidate to get the real data from server
      queryClient.invalidateQueries({ queryKey: ["gymStaff", gymId] });
      const statusMessage = getMessage(response, t);
      showStatusToast(statusMessage, toast);
    },
    onError: (error: any, dto, context) => {
      // Rollback on error
      if (context?.previousStaff) {
        queryClient.setQueryData(
          ["gymStaff", context.gymId],
          context.previousStaff
        );
      }
      const statusMessage = getMessage(error, t);
      showStatusToast(statusMessage, toast);
    },
  });
}

export function useUpdateStaff() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gymId,
      membershipId,
      dto,
    }: {
      gymId: string;
      membershipId: string;
      dto: UpdateStaffDto;
    }) => {
      const response = await staffApi.updateStaff(gymId, membershipId, dto);
      if (!response.success) {
        throw response;
      }
      return { response, gymId, membershipId, dto };
    },
    onMutate: async ({ gymId, membershipId, dto }) => {
      await queryClient.cancelQueries({ queryKey: ["gymStaff", gymId] });

      const previousStaff = queryClient.getQueryData<StaffMember[]>([
        "gymStaff",
        gymId,
      ]);

      // Optimistically update the staff member
      queryClient.setQueryData<StaffMember[]>(["gymStaff", gymId], (old) =>
        old?.map((staff) =>
          staff.membershipId === membershipId
            ? {
                ...staff,
                fullName: dto.fullName ?? staff.fullName,
                email: dto.email ?? staff.email,
                phoneNumber: dto.phoneNumber ?? staff.phoneNumber,
                role: dto.role ?? staff.role,
              }
            : staff
        )
      );

      return { previousStaff, gymId };
    },
    onSuccess: ({ response, gymId }) => {
      queryClient.invalidateQueries({ queryKey: ["gymStaff", gymId] });
      const statusMessage = getMessage(response, t);
      showStatusToast(statusMessage, toast);
    },
    onError: (error: any, variables, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(
          ["gymStaff", context.gymId],
          context.previousStaff
        );
      }
      const statusMessage = getMessage(error, t);
      showStatusToast(statusMessage, toast);
    },
  });
}

export function useRemoveStaff() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gymId,
      membershipId,
    }: {
      gymId: string;
      membershipId: string;
    }) => {
      const response = await staffApi.removeStaff(gymId, membershipId);
      if (!response.success) {
        throw response;
      }
      return { response, gymId, membershipId };
    },
    onMutate: async ({ gymId, membershipId }) => {
      await queryClient.cancelQueries({ queryKey: ["gymStaff", gymId] });

      const previousStaff = queryClient.getQueryData<StaffMember[]>([
        "gymStaff",
        gymId,
      ]);

      // Optimistically remove the staff member
      queryClient.setQueryData<StaffMember[]>(["gymStaff", gymId], (old) =>
        old?.filter((staff) => staff.membershipId !== membershipId)
      );

      return { previousStaff, gymId };
    },
    onSuccess: ({ response, gymId }) => {
      queryClient.invalidateQueries({ queryKey: ["gymStaff", gymId] });
      const statusMessage = getMessage(response, t);
      showStatusToast(statusMessage, toast);
    },
    onError: (error: any, variables, context) => {
      if (context?.previousStaff) {
        queryClient.setQueryData(
          ["gymStaff", context.gymId],
          context.previousStaff
        );
      }
      const statusMessage = getMessage(error, t);
      showStatusToast(statusMessage, toast);
    },
  });
}
