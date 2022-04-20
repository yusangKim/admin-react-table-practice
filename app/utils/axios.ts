import axios, { AxiosError, AxiosRequestConfig } from "axios";
import QueryString from "qs";

export interface IRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

if (typeof window !== "undefined") {
  axios.interceptors.request.use(
    function (config: AxiosRequestConfig) {
      const pass = ["/token"];

      if (pass.filter((u) => config.url?.includes(u)).length !== 0)
        return config;

      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return Promise.reject("No Token");

      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error: AxiosError) {
      const originalRequest = error.config as IRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) return Promise.reject(error);

        const data = QueryString.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        });
        return axios({
          method: "POST",
          data,
          url: "/api/oauth/token",
        })
          .then((resp) => {
            const { access_token, refresh_token } = resp.data;

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem(
              "refresh_token_expires_at",
              (new Date().getTime() + 1800000).toString()
            );

            originalRequest.headers.authorization = `Bearer ${
              access_token as string
            }`;

            return axios(originalRequest);
          })
          .catch((err) => {
            // logout api 호출
            window.location.replace("/login");
            console.log({ err });
            return false;
          });
      }

      return Promise.reject(error);
    }
  );
}
