import sendRequest from "./api.services";
import { user } from "../pages/model-ts";

class UsersServices {
  getUser() {
    const user = sessionStorage.getItem("user");
    if (user) return JSON.parse(user);
  }

  async signin(user: user) {
    const response = await sendRequest("/api/auth/signin", "POST", false, user);

    if (!response.ok) {
      const fail = await response.json();
      throw { error: fail.error };
    }

    const data = await response.json();
    sessionStorage.setItem("token", data?.token);
    sessionStorage.setItem("user", JSON.stringify(data?.user));

    return data.user as user;
  }

  async signup(user: user) {
    const response = await sendRequest("/api/auth/signup", "POST", false, user);

    if (!response.ok) {
      const fail = await response.json();
      throw { error: fail.error };
    }

    const data = await response.json();
    sessionStorage.setItem("token", data?.token);
    sessionStorage.setItem("user", JSON.stringify(data?.user));

    return data.user as user;
  }

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }

  isAuthentificated() {
    return sessionStorage.getItem("token") !== null;
  }

  getToken() {
    return sessionStorage.getItem("token") || "";
  }

  async updatePassword(user: user) {
    const response = await sendRequest("/api/users/user", "POST", true, user);

    if (!response.ok) {
      const fail = await response.json();
      throw { error: fail.error };
    }

    const data = await response.json();

    return data?.message;
  }
}

export default new UsersServices();
