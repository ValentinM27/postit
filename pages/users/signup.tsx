import { useState } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../model-ts";
import { useRouter } from "next/router";

/**
 * Permet de créer un compte
 */
const signup = () => {
  const router = useRouter();

  const initValue = {
    login: "",
    password: "",
    confirmPassword: "",
    checkbox: false,
  };
  const [formValues, setFormValues] = useState(initValue);
  const [formErrors, setFormErrors] = useState({} as any);

  const [apiErrors, setApiErrors] = useState("");

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
  const validate = async (value: any) => {
    const errors: any = {};

    if (!value.login) {
      errors.login = "Login is required";
    } else if (value.login.length < 3 && value.login.length > 24) {
      errors.login = "Login lenght should be between 3 and 24 caracters";
    }

    if (!value.password) {
      errors.password = "Enter a password";
    } else if (value.password.length < 6 || value.password.length > 40) {
      errors.password = "Password lenght should be between 6 and 40 caracters";
    }

    if (value.password && !value.confirmPassword) {
      errors.password = "Confirm your password";
    } else if (value.password !== value.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    }

    if (!value.checkbox) {
      errors.checkbox = "Please accept our terms and policies";
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
      let user = await UsersServices.signup(formValues as user);
      router.push("/");
    } catch (e: any) {
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
          Sign Up to <br />
          <span className="the-archiver-span">The Archiver</span>
        </h2>
        <p>Please fill in this form to create an account!</p>
        <hr />
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="login"
            value={formValues.login}
            onChange={handleChange}
            placeholder="Login"
            autoComplete="username"
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
            autoComplete="new-password"
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.password ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.password}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.confirmPassword ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.confirmPassword}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={formValues.checkbox}
              onChange={() => (formValues.checkbox = !formValues.checkbox)}
            />{" "}
            I accept the <a href="#">Terms of Use</a> &amp;{" "}
            <a href="#">Privacy Policy</a>
            {/* Gestion de l'affichage des erreurs */}
            {formErrors.checkbox ? (
              <div className="alert alert-danger mt-1" role="alert">
                {formErrors.checkbox}
              </div>
            ) : null}
          </label>
        </div>
        <div className="form-group col-md-12 text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            Sign Up
          </button>
        </div>
      </form>
      <div className="hint-text">
        Already have an account? <a href="/users/signin">Login here</a>
      </div>
    </div>
  );
};

export default signup;
