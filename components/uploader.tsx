import React, { useState } from "react";

import BookServices from "../services/books.services";
import { book } from "../pages/api/model-ts";

import ePub from "epubjs";

const Uploader = (props: any) => {
  const initValue: book = {
    title: "",
    bookFile: undefined,
    bookCover: undefined,
  };

  const [currentCover, setCurrentCover] = useState("");
  const [formValues, setFormValues] = useState<book>(initValue);
  const [formErrors, setFormErrors] = useState({} as any);

  const [apiErrors, setApiErrors] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;

    if (!fileList) return;

    // Récupération de la couverture
    const coverUrl = await ePub(await fileList[0].arrayBuffer()).coverUrl();
    let tempBookCover: typeof formValues.bookCover = "";

    if (coverUrl) {
      setCurrentCover(coverUrl);

      if (coverUrl) {
        console.log(coverUrl);
        const response = await fetch(coverUrl);

        if (!response.ok) return;

        const blob = await response.blob();

        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onloadend = resolve;
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        tempBookCover = reader.result;
      }
    }

    setFormValues({
      ...formValues,
      bookFile: fileList[0],
      bookCover: tempBookCover,
    });
  };

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
      handleFetch();
    }

    setFormErrors(errors);
  };

  const handleFetch = async () => {
    try {
      if (!formValues.bookFile) {
        return;
      }

      // Construct form data
      const formData = new FormData();
      formData.append("title", formValues.title || "");
      formData.append("bookCover", formValues.bookCover || ("" as any));
      formData.append(
        "bookFile",
        formValues.bookFile,
        formValues.bookFile.name
      );

      const message = await BookServices.uploadBook(formData);
      setApiSuccess(message);

      props?.fetchBooks();
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
      {/* Gestion de l'affichage des succes */}
      {apiSuccess ? (
        <div className="alert alert-success" role="alert">
          {apiSuccess}
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
        {currentCover && (
          <div className="form-group">
            <img
              className="form-cover"
              src={currentCover}
              alt="Current book cover"
            />
          </div>
        )}
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
          <button
            onClick={props.cancel}
            type="button"
            className="btn btn-outline-danger btn-lg m-1"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-dark btn-lg m-1">
            Archive
          </button>
        </div>
      </form>
    </div>
  );
};

export default Uploader;
