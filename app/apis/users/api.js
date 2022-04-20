import axios from "axios";
import qs from "qs";

export async function fetchUserList(page, per_page = 10) {
  let apiEndPoint = "https://admin.glob-dev.kong.yk8s.me/admin/api";
  const params = { page, per_page };
  const queryString = qs.stringify(params);
  return await axios.get(`${apiEndPoint}/user/v1/users?${queryString}`);
}

export async function fetchUser(userId) {
  let apiEndPoint = "https://admin.glob-dev.kong.yk8s.me/admin/api";
  return await axios.get(`${apiEndPoint}/user/v1/users/${userId}`);
}
