import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'app/constants';
import { GetCourses } from 'app/services/apiShortRequests';

export default function useGetCourses() {
	return useQuery({
		queryKey: queryKeys.courses.list,
		queryFn: () => GetCourses(),
		select: (res) => res.data
	});
}
