import React, { useState } from "react";

import BookServices from "../services/books.services";
import { book } from "../pages/api/model-ts";
import Loader from "./loader";

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
  const [isWaitingApi, setIsWaitingApi] = useState(false);

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
    let tempBookCover: typeof formValues.bookCover = undefined;

    if (coverUrl) {
      setCurrentCover(coverUrl);

      if (coverUrl) {
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
    } else {
      setCurrentCover("");
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
    const maxSize = 5000;

    if (formValues?.bookCover === undefined && !value.title) {
      errors.title = "No cover found, you need to set a title";
    } else if (
      formValues?.bookCover === undefined &&
      value.title.length < 3 &&
      value.title.length > 40
    ) {
      errors.title = "Title lenght should be between 3 and 40 caracters";
    }

    if (!value.bookFile) {
      errors.bookFile = "Please select a file";
    } else if (value.bookFile?.name.split(".").pop().toLowerCase() !== "epub") {
      errors.bookFile = "Only epub are supported";
    } else if (value.bookFile?.size / 1024 > maxSize) {
      errors.bookFile = "File size exceed 5mo";
    }

    if (Object.keys(errors).length === 0) {
      handleFetch();
    }

    setFormErrors(errors);
  };

  const handleFetch = async () => {
    try {
      setIsWaitingApi(true);
      if (!formValues.bookFile) {
        setIsWaitingApi(false);
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
      setIsWaitingApi(false);

      props?.fetchBooks();
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
        Only .epub are allowed of maximum 5mo
        <hr />
        {formValues?.bookFile !== undefined &&
          formValues?.bookCover === undefined && (
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
          )}
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
          <label htmlFor="file-upload" className="custom-file-upload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-upload"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
            </svg>
            <input
              id="file-upload"
              className="form-control-sm"
              type="file"
              onChange={handleFileUpload}
            />{" "}
            {formValues?.bookFile === undefined
              ? "Upload your file"
              : "File uploaded"}
          </label>
          {/* Gestion de l'affichage des erreurs */}
          {formErrors.bookFile ? (
            <div className="alert alert-danger mt-1" role="alert">
              {formErrors.bookFile}
            </div>
          ) : null}
        </div>
        <div className="form-group col-md-12 text-center">
          {isWaitingApi ? (
            <Loader />
          ) : (
            <div>
              <button
                onClick={handleSubmit}
                className="btn btn-dark btn-lg m-1"
              >
                Archive
              </button>
              <button
                onClick={props.cancel}
                type="button"
                className="btn btn-outline-danger btn-lg m-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Uploader;
