import type { SignupResponse } from "@/usecases/signupUser";

import {
  setLocalStorageUser,
  setLocalStorageAccessToken,
  setLocalStorageRefreshToken,
} from "@/utils/localstorage/localstorageUser";
import type {
  LocalStorageUser,
  LocalStorageAccessToken,
  LocalStorageRefreshToken,
} from "@/utils/localstorage/localstorageUser";

export function SignUpHelper(response:SignupResponse){

      const localstorageuser: LocalStorageUser = {
        id: response.data.user.id,
        firstname: response.data.user.firstname,
        lastname: response.data.user.lastname,
        email: response.data.user.email,
      };

      const localstorageaccesstoken: LocalStorageAccessToken = {
        token: response.data.tokens.access_token.token,
        expires_in: response.data.tokens.access_token.expires_in,
        created_at: response.data.tokens.access_token.updated_at,
      };

      const localstoragerefreshtoken: LocalStorageRefreshToken = {
        token: response.data.tokens.refresh_token.token,
        expires_in: response.data.tokens.refresh_token.expires_in,
        created_at: response.data.tokens.refresh_token.created_at,
      };

      setLocalStorageUser(localstorageuser);
      setLocalStorageAccessToken(localstorageaccesstoken);
      setLocalStorageRefreshToken(localstoragerefreshtoken)
}