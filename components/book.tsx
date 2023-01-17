import booksServices from "../services/books.services";

const book = (props: any) => {
  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleRead = (bookId: string) => {
    handleFetch(bookId);
  };

  const handleFetch = async (bookId: string) => {
    const book: any = await booksServices.getBook(bookId);
    props?.readBook(book);
  };

  return (
    <div className="card-container">
      <div id="area"></div>
      <h2>{props?.book?.title}</h2>
      <span>Book added the {getDate(props?.book?.uploadDate)}</span>
      <hr />
      <div className="form-group col-md-12 text-center">
        <button
          onClick={(event) => handleRead(props?.book?._id)}
          className="btn btn-dark btn-lg"
        >
          Read
        </button>
      </div>
    </div>
  );
};

export default book;
