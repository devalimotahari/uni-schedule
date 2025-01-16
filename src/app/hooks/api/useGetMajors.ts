import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'app/constants';
import { GetMajors } from 'app/services/apiShortRequests';

export default function useGetMajors() {
	return useQuery({
		queryKey: queryKeys.majors.list,
		queryFn: () => GetMajors(),
		select: (res) => res.data
	});
}
