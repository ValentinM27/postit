import usersServices from "./users.services";

export default async function sendRequest(
  url: string,
  method: string,
  isAuth?: boolean,
  body?: {}
) {
  if (isAuth) {
    return await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        authorization: usersServices.getToken(),
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
