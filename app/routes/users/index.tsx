import { useEffect } from "react";
import { useRoutePagination } from "~/utils/hooks/use-route-pagination";
import { fetchUserList } from "../../apis/users/api";

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

  const handleUsers = async () => {
    const page = 1;
    const pageSize = 10;
    const result = await fetchUserList(page, pageSize);
    console.log(result);
  };

  useEffect(() => {
    handleUsers();
  }, []);

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
