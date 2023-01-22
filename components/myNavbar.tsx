import usersServices from "../services/users.services";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const myNavbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [largeur, setLargeur] = useState(window.innerWidth);

  const router = useRouter();

  const handleLogout = () => {
    usersServices.logout();
    router.push("/users/signup");
  };

  const toggleNavSmallScreen = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    const changeWidth = () => {
      setLargeur(window.innerWidth);

      if (window.innerWidth > 768) {
        setToggleMenu(false);
      }
    };

    window.addEventListener("resize", changeWidth);

    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  return (
    <nav className="header navbar navbar-dark bg-dark">
      <div className="left-container-header d-flex justify-content-between">
        <div className="left-header navbar-brand">
          <a href="/">
            <img width="40" height="40" alt="" src="/favicon.ico"></img>
            <span>The Archiver</span>
          </a>
        </div>
        {largeur <= 768 && (
          <div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarToggleExternalContent"
              aria-controls="navbarToggleExternalContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={toggleNavSmallScreen}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        )}
      </div>
      {(toggleMenu || largeur > 768) && (
        <div className="right-header">
          <div>
            <a href="/archives">Archives</a>
          </div>
          <div>
            <a href="/users/profil">Profil</a>
          </div>
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
      )}
    </nav>
  );
};

export default myNavbar;
