import { useState, useEffect } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../model-ts";

const Profil = () => {
  const [user, setUser] = useState({} as user);

  useEffect(() => {
    setUser(UsersServices.getUser());
  }, []);

  return (
    <div>
      <h1>{user?.login}</h1>
    </div>
  );
};

export default Profil;
