import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'app/constants';
import { GetClassrooms } from 'app/services/apiShortRequests';

export default function useGetClassrooms() {
	return useQuery({
		queryKey: queryKeys.classrooms.list,
		queryFn: () => GetClassrooms(),
		select: (res) => res.data
	});
}
