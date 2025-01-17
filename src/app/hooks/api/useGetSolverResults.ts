import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'app/constants';
import { GetSolverResults } from 'app/services/apiShortRequests';

export default function useGetSolverResults() {
	return useQuery({
		queryKey: queryKeys.solver.results,
		queryFn: () => GetSolverResults(),
		select: (res) => res.data
	});
}
