"use client";
import { useState, CSSProperties } from "react";
import BeatLoader  from "react-spinners/BeatLoader";

// const override: CSSProperties = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };
const Loading = ({loading}: {loading: boolean}) => {
  let [color, setColor] = useState("#ffffff");
  return (
    <BeatLoader 
    
     
     color={color}
      loading={loading}
      // cssOverride={override}
      size={5}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loading;
