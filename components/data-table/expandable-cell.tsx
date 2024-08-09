import { useRef, useState } from "react";

const ExpandableCell = ({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="relative group">
      <div
        ref={contentRef}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer transition-all duration-300 ${
          isExpanded
            ? "line-clamp-none h-auto w-auto "
            : children
            ? "line-clamp-4 max-h-20  max-w-80 overflow-hidden"
            : "line-clamp-4 max-h-20  max-w-40 overflow-hidden"
        }`}
      >
        {children ? children : text}
      </div>

      {/* Tooltip */}
      <div className="absolute left-0 -top-8 px-1 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {isExpanded ? "Click to Collapse" : "Click to Expand"}
      </div>
    </div>
  );
};

export default ExpandableCell;
