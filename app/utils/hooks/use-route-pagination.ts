import { useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";

const parseSortBy = (sortByString: string | null) => {
  if (!sortByString) {
    return [];
  }

  return sortByString.split(",").map((s: any) => {
    const [key, direction] = s.split(":");
    return { id: key, desc: direction == "desc" };
  });
};

export const useRoutePagination = (
  defaultPageSize = 10,
  defaultUserId = ""
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setPageIndex = useCallback(
    (page) => {
      const params = Object.fromEntries(searchParams);
      if (page) {
        params.page = page;
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const setPageSize = useCallback(
    (per_page) => {
      const params = Object.fromEntries(searchParams);
      if (per_page) {
        params.per_page = per_page;
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const pageIndex = useMemo(
    () => Number(searchParams.get("page") ?? 0),
    [searchParams]
  );
  const pageSize = useMemo(
    () => Number(searchParams.get("per_page") ?? defaultPageSize),
    [defaultPageSize, searchParams]
  );

  const filters = useMemo(() => {
    return {
      userId: searchParams.get("userId") ?? defaultUserId,
    };
  }, [defaultUserId, searchParams]);

  const setFilters = useCallback(
    (filters) => {
      const userId = filters?.userId;
      const params: any = Object.fromEntries(searchParams);
      params.page = 0;
      params.userId = userId;
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const sortBy = useMemo(() => {
    return parseSortBy(searchParams.get("sort"));
  }, [searchParams]);

  const setSortBy = useCallback(
    (sortBy) => {
      /**
       * sortBy = [] or [{ id: 'userId', desc: true}]
       */
      let sort = "";
      if (sortBy.length > 0) {
        sort = sortBy
          .map(
            (el: { id: string; desc: string }) =>
              `${el.id}:${el.desc ? "desc" : "asc"}`
          )
          .join(",");
      }
      const params = Object.fromEntries(searchParams);
      params.sort = sort;
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  return {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    sortBy,
    setSortBy,
  };
};
