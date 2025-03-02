import { defineStore } from "pinia";

/**
 * store for managing search functionality
 * handles search query state and URL synchronization
 */
export const useSearchStore = defineStore("search", () => {
  const query = ref("");

  const setQuery = (newQuery: string) => {
    query.value = newQuery;

    const router = useRouter();
    router.push({ query: query.value ? { search: query.value } : undefined });
  };

  return { query, setQuery };
});
