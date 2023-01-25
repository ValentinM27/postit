import booksServices from "../services/books.services";

const book = (props: any) => {
  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleRead = (bookId: string) => {
    handleFetch(bookId);
  };

  const handleDelete = (bookId: string) => {
    handleFetchDelete(bookId);
  };

  const handleFetch = async (bookId: string) => {
    const book: any = await booksServices.getBook(bookId);
    props?.readBook(book, props?.book);
  };

  const handleFetchDelete = async (bookId: string) => {
    await booksServices.deleteBook(bookId);
    props?.fetchBooks();
  };

  return (
    <div
      className="card-container"
      style={{
        background: `linear-gradient(to bottom, rgb(0,0,0,0.3), rgb(0,0,0,0.3)), url(${props?.book?.cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="delete-btn-container">
        <button
          onClick={(event) => handleDelete(props?.book?._id)}
          className="btn btn-danger m-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
        </button>
      </div>
      {(!props?.book?.cover || props?.book?.cover?.length === 0) && (
        <div className="title-container">
          <h2>{props?.book?.title}</h2>
          <span>Book added the {getDate(props?.book?.uploadDate)}</span>
        </div>
      )}

      <div className="btn-container col-12 d-flex justify-content-center">
        <button
          onClick={(event) => handleRead(props?.book?._id)}
          className="btn btn-dark btn-lg m-2"
        >
          Read
        </button>
      </div>
    </div>
  );
};

export default book;
