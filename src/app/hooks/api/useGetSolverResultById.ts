import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'app/constants';
import { GetSolverResultById } from 'app/services/apiShortRequests';
import { IReqId } from 'app/services/requestTypes';

type IParams = Partial<IReqId>;

export default function useGetSolverResultById({ id }: IParams) {
	return useQuery({
		queryKey: queryKeys.solver.byId({ id }),
		queryFn: () => GetSolverResultById({ id }),
		select: (res) => res.data,
		enabled: !!id?.toString()
	});
}
