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
    props?.readBook(book);
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
      <div className="title-container">
        <h2>{props?.book?.title}</h2>
        <span>Book added the {getDate(props?.book?.uploadDate)}</span>
      </div>
      <div className="btn-container col-12 d-flex justify-content-center">
        <button
          onClick={(event) => handleRead(props?.book?._id)}
          className="btn btn-dark btn-lg m-2"
        >
          Read
        </button>
        <button
          onClick={(event) => handleDelete(props?.book?._id)}
          className="btn btn-danger btn-lg m-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default book;
