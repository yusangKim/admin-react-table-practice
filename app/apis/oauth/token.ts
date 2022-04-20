import axios from "axios";
import qs from "qs";
import { Buffer } from "buffer";

interface IRequestTokenResp {
  access_token: string;
  expires_in: number;
  id_token: string;
  "not-before-policy": number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
}

export const requestToken = async (
  // grant_type: string,
  username?: string,
  password?: string,
  refresh_token?: string
) => {
  const oauthClientId = "proxy-client";
  const oauthClientSecret = "d60227dc-ac65-4f6c-88fd-42fb76530858";
  const oauthScope = "openid profile";
  const oauthTokenEndpoint =
    "https://keycloak.kong.yk8s.me/auth/realms/tarangire-dev/protocol/openid-connect/token";

  const basicHeader = Buffer.from(
    `${oauthClientId}:${oauthClientSecret}`
  ).toString("base64");

  const headers = {
    authorization: `Basic ${basicHeader}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  let grant_type = "password";
  console.log(grant_type);
  let params;
  if (grant_type === "password") {
    params = qs.stringify({
      grant_type,
      username,
      password,
      scope: oauthScope,
    });
  }
  // else if (grant_type === "refresh_token") {
  //   params = qs.stringify({
  //     grant_type,
  //     refresh_token,
  //   });
  // }
  const resp = await axios.post(oauthTokenEndpoint, params, {
    headers,
  });
  // console.log(resp);
  return resp;
};
