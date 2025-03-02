import { useSearchStore } from "~/stores/search";

/**
 * plugin that synchronizes URL search query parameters with the search store.
 *
 * @example
 * // if the URL is /?search=pasta
 * // the search store will be initialized with "pasta" as the query
 */
export default defineNuxtPlugin(() => {
  const router = useRouter();
  const { search } = router.currentRoute?.value.query;
  if (search) {
    const { setQuery } = useSearchStore();
    setQuery(search as string);
  }
});
