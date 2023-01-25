import { useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import booksServices from "../services/books.services";

function MyEbookReader(props: any) {
  const [location, setLocation] = useState(props?.bookRef?.epubcfi || "0");

  const epubOptions: any = {
    disableSrcdoc: true,
  };

  const saveCurrentEpubcfi = async () => {
    booksServices.saveCurrentEpubcfi(props?.bookRef?._id, location);
  };

  const ownStyles = {
    ...ReactReaderStyle,
    arrow: {
      ...ReactReaderStyle.arrow,
      color: "orange",
    },
  };

  const locationChanged = (epubcfi: any) => {
    setLocation(epubcfi);
    saveCurrentEpubcfi();
  };

  return (
    <div style={{ height: "100vh" }} className="myReader">
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url={props?.book}
        readerStyles={ownStyles}
        epubOptions={epubOptions}
      />
    </div>
  );
}

export default MyEbookReader;
