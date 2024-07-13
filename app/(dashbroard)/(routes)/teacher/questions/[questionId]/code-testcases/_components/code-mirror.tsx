"use client";

import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import {  cpp} from "@codemirror/lang-cpp";

const CodeMirrorCpn = ({valueProp,onChangeProp,extensionsProp}:{valueProp: string; onChangeProp: (value: string) => void; extensionsProp: any[]}) => {
  //const [value, setValue] = React.useState(valueProp)
  // const onChange = React.useCallback((val: any, viewUpdate: any) => {
  //   onChangeProp(val)
  //   console.log("val", val)
  //   setValue(val);
  // }, [onChangeProp]);
  
  // useEffect(() => {
  //   setValue(valueProp);
  //   console.log("valueProp", valueProp)
  // }, [valueProp]);

  return (
    <div className="h-full overflow-auto">
      <CodeMirror
        value={valueProp}
        height=""
       // extensions={[javascript({ jsx: true }),]}
        extensions={extensionsProp}
        //extensions={[cpp()]}
        onChange={onChangeProp}
        
      />
    </div>
  );
};

export default CodeMirrorCpn;
