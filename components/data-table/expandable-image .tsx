import { useState } from "react";
import Image from "next/image";

const ExpandableImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex justify-center items-center   p-0">
      <div
        onClick={handleClick}
        className="cursor-pointer transition-all duration-300 relative group  p-0"
        style={{
          width: isExpanded ? "400px" : "100px", // Container width based on the image size
          height: isExpanded ? "300px" : "100px", // Container height based on the image size
        }}
      >
        <Image
          src={src}
          layout="fill"  // This allows the image to fill the parent div
          objectFit="contain"  // Maintain aspect ratio and contain within the container
          alt={alt}
        />

        {/* Tooltip */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {isExpanded ? "Click to Collapse" : "Click to Expand"}
        </div>
      </div>
    </div>
  );
};

export default ExpandableImage;
