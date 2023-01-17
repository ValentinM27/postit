import { useRef, useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";

function MyEbookReader(props: any) {
  const [location, setLocation] = useState(null);

  const ownStyles = {
    ...ReactReaderStyle,
    arrow: {
      ...ReactReaderStyle.arrow,
      color: "orange",
    },
  };

  const locationChanged = (epubcifi: any) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };

  return (
    <div style={{ height: "100vh" }} className="myReader">
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url={props?.book}
        readerStyles={ownStyles}
      />
    </div>
  );
}

export default MyEbookReader;
