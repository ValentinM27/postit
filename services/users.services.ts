import sendRequest from "./api.services";
import { user } from "../pages/model-ts";

class UsersServices {
  login() {}

  signin() {}

  async signup(user: user) {
    const response = await sendRequest("/api/auth/signup", "POST", true, user);

    if (!response.ok) {
      const fail = await response.json();
      throw { error: fail.error };
    }

    const data = await response.json();
    localStorage.setItem("token", data?.token);
    localStorage.setItem("user", data?.user);

    return data.user as user;
  }

  logout() {}

  isAuthentificated() {}

  getToken() {
    return localStorage.getItem("token") || "";
  }
}

export default new UsersServices();
