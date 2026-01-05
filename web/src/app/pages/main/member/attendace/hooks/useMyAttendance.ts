import { attendanceApi } from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";

export const useMyAttendance = () => {
  return useQuery({
    queryKey: ["myAttendance"],
    queryFn: async () => {
      const response = await attendanceApi.getMyAttendance();
      return response;
    },
  });
};
