import usersServices from "./users.services";

export default async function sendRequest(
  url: string,
  method: string,
  isAuth?: boolean,
  body?: {} | FormData,
  isFormData?: boolean
) {
  if (isAuth) {
    if (isFormData && body instanceof FormData) {
      return await fetch(url, {
        method: method,
        headers: {
          authorization: "Bearer " + usersServices.getToken(),
        },
        body: body,
      });
    }

    return await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + usersServices.getToken(),
      },
      body: JSON.stringify(body),
    });
  }

  return await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
