import { User } from '../types/user';
import { ApiResponse } from '../types/api';
import { apiClient, handleApiError } from './helper';
import { CompleteOnboardingDto } from '../dto/users';

export const usersApi = {
    /** Complete Onboarding */
    completeOnboarding: async (data: CompleteOnboardingDto): Promise<ApiResponse<User>> => {
        try {
            const res = await apiClient.post<ApiResponse<User>>('/users/onboarding/complete', data);
            return res.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
