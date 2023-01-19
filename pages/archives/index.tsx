import { useState, useEffect } from "react";
import { Uploader } from "../../components/index";
import booksServices from "../../services/books.services";
import { Book, MyEbookReader } from "../../components/index";

const Archive = () => {
  const [isUpload, setIsUpload] = useState(false);
  const [booksRef, setBooksRef] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const fetchData = async () => {
    const data = await booksServices.getBooksRef();
    setBooksRef(data.booksRef);
    setIsUpload(false);
  };

  if (!currentBook) {
    return (
      <div>
        {!isUpload && (
          <div className="form-group mt-3 col-md-12 d-flex justify-content-between align-middle p-2">
            <h2 className="font-weight-bold">Your books</h2>
            <button
              onClick={() => setIsUpload(true)}
              className="btn flat btn-outline-warning btn-lg"
            >
              Upload
            </button>
          </div>
        )}
        {isUpload && (
          <Uploader cancel={() => setIsUpload(false)} fetchBooks={fetchData} />
        )}

        {!isUpload &&
          booksRef.map((bookRef: any) => {
            return (
              <Book
                key={bookRef?._id}
                book={bookRef}
                readBook={(book: any) => setCurrentBook(book)}
                fetchBooks={fetchData}
              />
            );
          })}
      </div>
    );
  } else {
    return <div>{currentBook && <MyEbookReader book={currentBook} />}</div>;
  }
};

export default Archive;
