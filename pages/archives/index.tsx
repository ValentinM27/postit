import { useState, useEffect } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../model-ts";

import Uploader from "../../components/uploader";

const Archive = () => {
  return (
    <div>
      <h1>Archives</h1>
      <Uploader />
    </div>
  );
};

export default Archive;
