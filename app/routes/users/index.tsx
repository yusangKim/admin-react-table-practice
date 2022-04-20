import { useRoutePagination } from "~/utils/hooks/use-route-pagination";

const UserIndexRoute = () => {
  const {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    sortBy,
    setSortBy,
  } = useRoutePagination();

  console.log(pageIndex);
  console.log(filters);

  return (
    <>
      <div>
        검색창. 테이블 뿌리는 곳 총 두개 컴포넌트를 가지고 있는 컴포넌트를
        렌더링
      </div>
      <div></div>
    </>
  );
};

export default UserIndexRoute;
