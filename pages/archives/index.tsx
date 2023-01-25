import { useState, useEffect } from "react";
import { Uploader } from "../../components/index";
import booksServices from "../../services/books.services";
import { Book, MyEbookReader } from "../../components/index";

const Archive = () => {
  const [isUpload, setIsUpload] = useState(false);
  const [booksRef, setBooksRef] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentBookRef, setCurrentBookRef] = useState(null);

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

        {!isUpload && (
          <div className="box-card">
            {booksRef
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
              .reverse()}
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
