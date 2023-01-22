import usersServices from "./users.services";
import Router from "next/router";

export default async function sendRequest(
  url: string,
  method: string,
  isAuth?: boolean,
  body?: {} | FormData,
  isFormData?: boolean
) {
  if (isAuth) {
    let response;

    if (isFormData && body instanceof FormData) {
      response = await fetch(url, {
        method: method,
        headers: {
          authorization: "Bearer " + usersServices.getToken(),
        },
        body: body,
      });
    } else {
      response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + usersServices.getToken(),
        },
        body: JSON.stringify(body),
      });
    }

    if (response.status === 401) {
      usersServices.logout();
      Router.push({
        pathname: "/users/signin",
        query: { auth: "expired" },
      });
    }

    return response;
  }

  return await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
