import { useState, useEffect } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../model-ts";

const Profil = () => {
  const [user, setUser] = useState({} as user);

  const initValue = {
    login: "",
    password: "",
    confirmPassword: "",
  };
  const [formValues, setFormValues] = useState(initValue);
  const [formErrors, setFormErrors] = useState({} as any);

  const [changePassword, setChangePassword] = useState(false);

  const [apiErrors, setApiErrors] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

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

    if (!value.password) {
      errors.password = "Enter your password";
    } else if (value.password.length < 6 || value.password.length > 40) {
      errors.password = "Password lenght should be between 6 and 40 caracters";
    }

    if (value.password && !value.confirmPassword) {
      errors.password = "Confirm your password";
    } else if (value.password !== value.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
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
      const message = await UsersServices.updatePassword(formValues as user);
      setApiSuccess(message);
      setChangePassword(false);
    } catch (e: any) {
      setApiErrors(e.error);
    }
  };

  useEffect(() => {
    setUser(UsersServices.getUser());
    setFormValues({ ...formValues, login: user?.login || "" });
  }, []);

  return (
    <div className="signup-form">
      {/* Gestion de l'affichage des erreurs */}
      {apiErrors ? (
        <div className="alert alert-danger" role="alert">
          {apiErrors}
        </div>
      ) : null}
      {/* Gestion de l'affichage des succes */}
      {apiSuccess ? (
        <div className="alert alert-success" role="alert">
          {apiSuccess}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <h2>
          Your <br />
          <span className="the-archiver-span">The Archiver</span> account
        </h2>
        <hr />
        <h3>
          Connected as <span className="the-archiver-span">{user?.login}</span>
        </h3>

        {!changePassword && (
          <div className="form-group col-md-12 text-center mt-3">
            <button
              onClick={() => {
                setChangePassword(true);
              }}
              className="btn btn-primary btn-lg"
            >
              Change your password
            </button>
          </div>
        )}

        {changePassword && (
          <div>
            <div className="form-group">
              Enter your new password
              <input
                hidden={true}
                type="login"
                className="form-control"
                name="login"
                autoComplete="username"
                value={formValues.login}
                onChange={handleChange}
              />
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
            <div className="form-group col-md-12 d-flex justify-content-around">
              <button className="btn btn-primary btn-lg">Save</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profil;
