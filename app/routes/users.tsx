import { Outlet } from "@remix-run/react";

function Users() {
  return (
    <div>
      <h1>User</h1>
      <Outlet />
    </div>
  );
}

export default Users;
