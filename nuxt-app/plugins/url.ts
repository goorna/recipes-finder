import { useSearchStore } from "~/stores/search";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const { search } = router.currentRoute?.value.query;
  if (search) {
    const { setQuery } = useSearchStore();
    setQuery(search as string);
  }
});
