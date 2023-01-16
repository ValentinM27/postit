import { useState } from "react";
import { Uploader } from "../../components/index";

const Archive = () => {
  const [isUpload, setIsUpload] = useState(false);
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
    </div>
  );
};

export default Archive;
