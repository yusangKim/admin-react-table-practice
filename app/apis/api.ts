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

export const requestToken = async (username: string, password: string) => {
  const oauthClientId = "proxy-client";
  const oauthClientSecret = "d60227dc-ac65-4f6c-88fd-42fb76530858";
  const oauthScope = "openid profile";
  const oauthTokenEndpoint =
    "https://keycloak.kong.yk8s.me/auth/realms/tarangire-dev/protocol/openid-connect/token";
  const grant_type = "password";
  const basicHeader = Buffer.from(
    `${oauthClientId}:${oauthClientSecret}`
  ).toString("base64");

  const headers = {
    authorization: `Basic ${basicHeader}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let params;
  if (grant_type === "password") {
    params = qs.stringify({
      grant_type,
      username,
      password,
      scope: oauthScope,
    });
  }
  const resp = await axios.post(oauthTokenEndpoint, params, {
    headers,
  });
  // console.log(resp);
  return resp;
};
