import usersServices from "../services/users.services";
import { useRouter } from "next/router";

const myNavbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    usersServices.logout();
    router.push("/users/signup");
  };

  return (
    <nav className="header">
      <div className="left-header">
        <a href="/">The Archiver</a>
      </div>
      <div className="right-header">
        <div>
          <a href="/">Notes</a>
        </div>
        |
        <div>
          <a href="/users/profil">Profil</a>
        </div>
        |
        <div>
          <button
            onClick={() => handleLogout()}
            type="button"
            className="btn btn-light"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default myNavbar;
