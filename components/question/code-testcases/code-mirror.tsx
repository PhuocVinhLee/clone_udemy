"use client";

import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark, vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import { vscodeLight, vscodeLightInit } from "@uiw/codemirror-theme-vscode";
import { useTheme } from "next-themes";

const CodeMirrorCpn = ({
  className,
  valueProp,
  onChangeProp,
  extensionsProp,
}: {
  valueProp: string;
  onChangeProp?: (value: string) => void;
  extensionsProp?: any[];
  className?: string;
}) => {
  const { theme } = useTheme();

  const [resolvedTheme, setResolvedTheme] = useState(theme);
  useEffect(() => {
    if (theme === "system") {
      // Detect system color scheme
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
      };

      // Set initial theme
      setResolvedTheme(matchMedia.matches ? "dark" : "light");

      // Add event listener
      matchMedia.addEventListener("change", updateTheme);

      // Clean up the event listener on component unmount
      return () => matchMedia.removeEventListener("change", updateTheme);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);
  const themeSettings =
    resolvedTheme === "dark"
      ? vscodeDarkInit({
          settings: { caret: "#c6c6c6", fontFamily: "monospace" },
        })
      : vscodeLightInit({
          settings: { caret: "#c6c6c6", fontFamily: "monospace" },
        });
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
        className={className}
        value={valueProp}
        height=""
        // extensions={[javascript({ jsx: true }),]}
        extensions={extensionsProp}
        theme={themeSettings}
        //extensions={[cpp()]}
        onChange={onChangeProp}
      />
    </div>
  );
};

export default CodeMirrorCpn;
