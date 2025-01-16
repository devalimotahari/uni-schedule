import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'app/constants';
import { GetProfessors } from 'app/services/apiShortRequests';

export default function useGetProfessors() {
	return useQuery({
		queryKey: queryKeys.professors.list,
		queryFn: () => GetProfessors(),
		select: (res) => res.data
	});
}
