import { title } from "process";
import { useState, useEffect } from "react";

import { book } from "../pages/model-ts";

const Uploader = () => {
  const initValue: book = {
    title: "",
    bookFile: undefined,
  };

  const [formValues, setFormValues] = useState<book>(initValue);
  const [formErrors, setFormErrors] = useState({} as any);

  const [apiErrors, setApiErrors] = useState("");

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList) return;

    setFormValues({ ...formValues, bookFile: fileList[0] });
  };

  //   const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (bookFile) {
  //       const formData = new FormData();
  //       formData.append("image", bookFile, bookFile?.name);
  //     }
  //   };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    validate(formValues);
  };

  const validate = (value: any) => {
    const errors: any = {};
    const maxSize = 2000;

    if (!value.title) {
      errors.title = "Title is required";
    } else if (value.title.length < 3 && value.title.length > 40) {
      errors.title = "Title lenght should be between 3 and 40 caracters";
    }

    if (!value.bookFile) {
      errors.bookFile = "Please select a file";
    } else if (value.bookFile?.name.split(".").pop().toLowerCase() !== "epub") {
      errors.bookFile = "Only epub are supported";
    } else if (value.bookFile?.size / 1024 > maxSize) {
      errors.bookFile = "File size exceed 2mo";
    }

    if (Object.keys(errors).length === 0) {
      console.log("all good");
    }

    setFormErrors(errors);
  };

  return (
    <div className="signup-form">
      {/* Gestion de l'affichage des erreurs */}
      {apiErrors ? (
        <div className="alert alert-danger" role="alert">
          {apiErrors}
        </div>
      ) : null}

      <form>
        <h2>
          Archive a book <br />
          <span className="the-archiver-span">The Archiver</span>
        </h2>
        Only .epub are allowed of maximum 2mo
        <hr />
        <div className="form-group">
          <input
            className="form-control"
            name="title"
            type="text"
            placeholder="Titre"
            onChange={handleChange}
            value={formValues.title}
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.title ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.title}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="file"
            onChange={handleFileUpload}
          />
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.bookFile ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.bookFile}
            </div>
          ) : null}
        </div>
        <div className="form-group col-md-12 text-center">
          <button onClick={handleSubmit} className="btn btn-primary btn-lg">
            Archive
          </button>
        </div>
      </form>
    </div>
  );
};

export default Uploader;
