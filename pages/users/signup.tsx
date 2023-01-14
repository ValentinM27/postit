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
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!value.firstname) {
      errors.firstname = "Enter your firstname";
    }

    if (!value.lastname) {
      errors.lastname = "Enter your lastname";
    }

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

    if (value.password && !value.confirmPassword) {
      errors.password = "Confirm your password";
    } else if (value.password !== value.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
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
          Sign Up to <span className="postit-span">Postit</span>
        </h2>
        <p>Please fill in this form to create an account!</p>
        <hr />
        <div className="form-group">
          <div className="row">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="firstname"
                value={formValues.firstname}
                onChange={handleChange}
                placeholder="First Name"
                required={true}
              />
              {/* Gestion de l'affichage des erreurs */}
              {formErrors.firstname ? (
                <div className="alert alert-danger" role="alert">
                  {formErrors.firstname}
                </div>
              ) : null}
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="lastname"
                value={formValues.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                required={true}
              />
              {/* Gestion de l'affichage des erreurs */}
              {formErrors.lastname ? (
                <div className="alert alert-danger" role="alert">
                  {formErrors.lastname}
                </div>
              ) : null}
            </div>
          </div>
        </div>
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
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required={true}
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.confirmPassword ? (
            <div className="alert alert-danger" role="alert">
              {formErrors.confirmPassword}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="checkbox-inline">
            <input type="checkbox" required={true} /> I accept the{" "}
            <a href="#">Terms of Use</a> &amp; <a href="#">Privacy Policy</a>
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
