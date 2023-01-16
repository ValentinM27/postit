import { useState, useEffect } from "react";
import { Uploader } from "../../components/index";
import booksServices from "../../services/books.services";
import { Book } from "../../components/index";

const Archive = () => {
  const [isUpload, setIsUpload] = useState(false);
  const [booksRef, setBooksRef] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await booksServices.getBooksRef();
      setBooksRef(data.booksRef);
    };

    fetchData().catch(console.error);
  }, []);

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
      {isUpload && <Uploader cancel={() => setIsUpload(false)} />}

      {!isUpload &&
        booksRef.map((bookRef: any) => {
          return <Book key={bookRef?._id} book={bookRef} />;
        })}
    </div>
  );
};

export default Archive;
