"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import CodeMirror from "./_components/code-mirror";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { set } from "mongoose";

import QuestionInfor from "./_components/question-infor";

export default function ClientComponent() {
  const ref = useRef<ImperativePanelGroupHandle>(null);

  const resetLayout = (top: number, bottom: number) => {
    const panelGroup = ref.current;
    if (panelGroup) {
      // Reset each Panel to 50% of the group's width
      panelGroup.setLayout([top, bottom]);
    }
  };
  const [showConsole, setShoConsole] = useState(false);
  const handleShowConsole = () => {
    if(showConsole){
      resetLayout(94,6)
      
    } else{
      resetLayout(60,40)
    }
    setShoConsole((pre) => !pre);
  };

  return (
    <div className=" h-full p-2 shadow-sm ">
      <PanelGroup direction="horizontal" className="border rounded-sm">
        <Panel className="" defaultSize={50}>
        <QuestionInfor></QuestionInfor>
        </Panel>
        <PanelResizeHandle className=" p-[2px] w-[2px] hover:bg-slate-500 bg-slate-200 cursor-pointer" />
        <Panel defaultSize={50}>
          <PanelGroup direction="vertical" ref={ref}>
            <Panel maxSize={95} minSize={5} defaultSize={95}>
              <CodeMirror></CodeMirror>
            </Panel>
            <PanelResizeHandle className=" p-[2px] h-[2px] hover:bg-slate-500 bg-slate-200 cursor-pointer" />
            <Panel
              className="flex items-stretch "
              minSize={6}
              maxSize={95}
              defaultSize={6}
            >
              <Button className=" h-9 self-end flex items-center justify-between w-full">
                <div onClick={handleShowConsole}>
                  {" "}
                  {showConsole ? <FaChevronDown /> : <FaChevronUp />}{" "}
                </div>
                <div>Run</div>
              </Button>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
