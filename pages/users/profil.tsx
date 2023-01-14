import { useState, useEffect } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../model-ts";

const profil = () => {
  const [user, setUser] = useState({} as user);

  useEffect(() => {
    setUser(UsersServices.getUser());
  });

  return (
    <div>
      <h1>{user?.firstname}</h1>
    </div>
  );
};

export default profil;
