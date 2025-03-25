import useSWR from 'swr';
import { Restaurant } from '@/lib/data/restaurants';

// Fetcher function for SWR with logging
const fetcher = async (url: string) => {
  console.log(`🔄 Fetching data from ${url} at ${new Date().toLocaleTimeString()}`);

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ Error fetching from ${url}: ${res.status}`);
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data = await res.json();
  console.log(`✅ Successfully fetched data from ${url}`);
  return data;
};

export function useRestaurant() {
  const {
    data: restaurant,
    error,
    isLoading,
  } = useSWR<Restaurant>('/api/restaurant', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 3600000, // Cache for 1 hour
  });

  return {
    restaurant,
    error,
    isLoading,
  };
}