import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/api';
import type { UserOption } from '../types';

export function useUsers() {
  return useQuery<UserOption[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
