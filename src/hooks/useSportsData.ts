import { useQuery } from '@tanstack/react-query';
import { SportsApiResponse } from '@/types/sports';

const fetchSportsData = async (): Promise<SportsApiResponse> => {
  const response = await fetch('https://topembed.pw/api.php?format=json');
  if (!response.ok) {
    throw new Error('Failed to fetch sports data');
  }
  return response.json();
};

export const useSportsData = () => {
  return useQuery({
    queryKey: ['sports-data'],
    queryFn: fetchSportsData,
    refetchInterval: 60000, // Refetch every minute for live updates
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};