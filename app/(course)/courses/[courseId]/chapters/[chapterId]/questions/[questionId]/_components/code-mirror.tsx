"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
const CodeMirrorCpn = () => {
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  return (
    <div className="h-full overflow-auto">
      <CodeMirror
        value={value}
        height=""
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeMirrorCpn;
