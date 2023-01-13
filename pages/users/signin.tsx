import { useState } from "react";
import UsersServices from "../../services/users.services";
import { user } from "../model-ts";

const signin = () => {
  const initValue = {
    email: "",
    password: "",
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
    setFormErrors(validate(formValues));
  };

  /**
   * Permet de valider l'intégrités des données du formulaire
   */
  const validate = async (value: any) => {
    const errors: any = {};
    const mail_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!value.email) {
      errors.email = "Mail is required";
    } else if (!mail_regex.test(value.email)) {
      errors.email = "Wrong mail structure";
    }

    if (!value.password) {
      errors.password = "Enter a password";
    } else if (value.password.length < 6 || value.password.length > 40) {
      errors.password = "Password should be between 6 and 40 caracters";
    }

    if (Object.keys(errors).length === 0) {
      handleFetch();
    }

    return errors;
  };

  /**
   * Permet l'envoi à l'api
   */
  const handleFetch = async () => {
    try {
      let user = await UsersServices.signin(formValues as user);
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
          Login into <span className="postit-span">Postit</span>
        </h2>
        <hr />
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email"
            required={true}
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.email ? (
            <div className="alert alert-danger" role="alert">
              {formErrors.email}
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
            required={true}
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.password ? (
            <div className="alert alert-danger" role="alert">
              {formErrors.password}
            </div>
          ) : null}
        </div>
        <div className="form-group col-md-12 text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            Sign In
          </button>
        </div>
      </form>
      <div className="hint-text">
        You don't have an account? <a href="/users/signup">Sign Up here</a>
      </div>
    </div>
  );
};

export default signin;
