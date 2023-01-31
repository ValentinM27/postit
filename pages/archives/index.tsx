import { useState, useEffect } from "react";
import { Uploader } from "../../components/index";
import booksServices from "../../services/books.services";
import { Book, MyEbookReader } from "../../components/index";
import Loader from "../../components/loader";

const Archive = () => {
  const [isUpload, setIsUpload] = useState(false);
  const [booksRef, setBooksRef] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentBookRef, setCurrentBookRef] = useState(null);
  const [isWaitingApi, setIsWaitingApi] = useState(true);

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  const fetchData = async () => {
    setIsWaitingApi(true);
    const data = await booksServices.getBooksRef();
    setBooksRef(data.booksRef);
    setIsUpload(false);
    setIsWaitingApi(false);
  };

  if (!currentBook) {
    return (
      <div>
        {!isUpload && (
          <div className="form-group archive-container">
            <div className="d-flex justify-content-between">
              <h2>Your books</h2>
              <button
                onClick={() => setIsUpload(true)}
                className="btn flat btn-outline-warning btn-lg"
              >
                Upload
              </button>
            </div>
          </div>
        )}

        {isUpload && (
          <Uploader cancel={() => setIsUpload(false)} fetchBooks={fetchData} />
        )}

        {isWaitingApi && (
          <div className="center">
            <Loader />
          </div>
        )}

        {!isUpload && !isWaitingApi && (
          <div className="box-card">
            {booksRef.length === 0 ? (
              <div>Upload a book and it will be available here !</div>
            ) : (
              booksRef
                .map((bookRef: any) => {
                  return (
                    <Book
                      key={bookRef?._id}
                      book={bookRef}
                      readBook={(book: any, bookRef: any) => {
                        setCurrentBook(book);
                        setCurrentBookRef(bookRef);
                      }}
                      fetchBooks={fetchData}
                    />
                  );
                })
                .reverse()
            )}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {currentBook && currentBookRef && (
          <MyEbookReader book={currentBook} bookRef={currentBookRef} />
        )}
      </div>
    );
  }
};

export default Archive;
