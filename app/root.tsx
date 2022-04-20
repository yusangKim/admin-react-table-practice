import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "react-query";
// import "./utils/axios";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import QueryString from "qs";
import { requestToken } from "~/apis/oauth/token";

export interface IRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

type refrechToken = {
  refresh_token: string;
  grant_type: string;
};

if (typeof window !== "undefined") {
  console.log("인터셉터");
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
      console.log(response);
      console.log("asdasdasdasda");
      return response;
    },
    function (error: AxiosError) {
      const originalRequest = error.config as IRequestConfig;
      console.log(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) return Promise.reject(error);

        const data = QueryString.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        });
        // return axios({
        //   method: "POST",
        //   data,
        //   url: "/api/oauth/token",
        // })
        let grant_type = "refresh_token";
        return requestToken(refreshToken, grant_type)
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
            window.location.replace("/");
            console.log({ err });
            return false;
          });
      }

      return Promise.reject(error);
    }
  );
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

// export function links() {
//   return [{ rel: "stylesheet", href: styles }];
// }

const queryClient = new QueryClient();

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </QueryClientProvider>
      </body>
    </html>
  );
}
