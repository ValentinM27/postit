import { useState, useEffect } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../api/model-ts";
import { useRouter } from "next/router";
import Loader from "../../components/loader";

const signin = () => {
  const router = useRouter();

  const initValue = {
    login: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initValue);
  const [formErrors, setFormErrors] = useState({} as any);
  const [isWaitingApi, setIsWaitingApi] = useState(false);

  const [apiErrors, setApiErrors] = useState("");

  useEffect(() => {
    if (router.query.auth) {
      setApiErrors("Your session has expired, please log in again");
    }
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  /**
   * Permet de gérer l'envoi du formulaire
   */
  const handleSubmit = (event: any) => {
    event.preventDefault();
    validate(formValues);
  };

  /**
   * Permet de valider l'intégrités des données du formulaire
   */
  const validate = (value: any) => {
    const errors: any = {};

    if (!value.login) {
      errors.login = "Login is required";
    } else if (value.password.login < 3 || value.password.login > 24) {
      errors.login = "Login lenght should be between 3 and 24 caracters";
    }

    if (!value.password) {
      errors.password = "Enter your password";
    } else if (value.password.length < 6 || value.password.length > 40) {
      errors.password = "Password lenght should be between 6 and 40 caracters";
    }

    if (Object.keys(errors).length === 0) {
      handleFetch();
    }

    setFormErrors(errors);
  };

  /**
   * Permet l'envoi à l'api
   */
  const handleFetch = async () => {
    try {
      setIsWaitingApi(true);
      await UsersServices.signin(formValues as user);
      router.push("/");
    } catch (e: any) {
      setIsWaitingApi(false);
      setApiErrors(e.error);
    }
  };

  return (
    <div className="signup-form">
      {/* Gestion de l'affichage des erreurs */}
      {apiErrors ? (
        <div className="alert alert-danger" role="alert">
          {apiErrors}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <h2>
          Login into <br />
          <span className="the-archiver-span">The Archiver</span>
        </h2>
        <hr />
        <div className="form-group">
          <input
            type="login"
            className="form-control"
            name="login"
            value={formValues.login}
            onChange={handleChange}
            autoComplete="username"
            placeholder="login"
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.login ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.login}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            required={false}
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.password ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.password}
            </div>
          ) : null}
        </div>
        <div className="form-group col-md-12 text-center">
          {isWaitingApi ? (
            <Loader />
          ) : (
            <button type="submit" className="btn btn-dark btn-lg">
              Sign In
            </button>
          )}
        </div>
      </form>
      <div className="hint-text">
        You don't have an account? <a href="/users/signup">Sign Up here</a>
      </div>
    </div>
  );
};

export default signin;
