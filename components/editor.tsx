"use client"
import { useTheme } from "next-themes";
import dynamic from "next/dynamic"
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css"
import { from } from "svix/dist/openapi/rxjsStub";
interface EditorProps {
    onChange:(value: string)=>void,
    value: string
;
}
export const Editor = ({onChange, value}: EditorProps) => {

    const ReactQuill = useMemo(()=> dynamic(() => import("react-quill"), {ssr: false}),[])
    const { setTheme, theme } = useTheme();
  return (
    <div>
      <ReactQuill  className={theme === 'dark' ? 'quill-dark' : ''}
      value={value}
      onChange={onChange}>

      </ReactQuill>
    </div>
  )
}

