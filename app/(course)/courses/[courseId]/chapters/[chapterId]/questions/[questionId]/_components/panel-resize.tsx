"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getQuestionById } from "@/lib/actions/question.action";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { cpp } from "@codemirror/lang-cpp";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/clipLoader";
import { formatResult } from "@/lib/format";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";
import TestCaseError from "@/components/question/code-testcases/testcase-error";
import QuestionInfor from "./question-infor";
import { QuestionStudentType } from "@/lib/database/models/questionstudents.model";
interface PanelReSizeProps {
  question: QuestionChapterType;
  questionStudent: QuestionStudentType
}

export default function PanelReSize({ questionStudent,question }: PanelReSizeProps) {
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
    if (showConsole) {
      resetLayout(93, 7);
    } else {
      resetLayout(60, 40);
    }
    setShoConsole((pre) => !pre);
  };

  const [testCases, setTestCase] = useState(question?.testCases || []);

  const [isLoading, setIsLoading] = useState(false);
  const [valueAnswerCode, setValueAnswerCode] = useState(question?.answer);
  const [resultCompiled, setResultCompiled] = useState<string[]>([]);
  const [statusCodeRealtime, setStatusCodeRealtime] = useState("");
  const [handelErrorCompiled, setHandelErrorCompiled] = useState<any>(null);
  const router = useRouter();
  const handleRunCode = async () => {
    try {
      setIsLoading(true);

      setStatusCodeRealtime("Compiling");
      const respone = await axios.post(`/api/hackerearth`, {
        testCases: question?.testCases,
        answer: valueAnswerCode,
        lang: "C",
        template: question?.template,
      });
      console.log("respone1", respone);
      //toast.success(" Question updated.");
      //  console.log("respone", respone);//"Compiling..."
      //  router.refresh(); // refresh state

      if (1) {
        //respone?.data.he_id
        //const he_id = respone.data.he_id;
        const he_id = "7c8cd661-fb51-49cc-b2d5-51a0c42e9a0b";
        //const he_id = "009dd95b-93d7-4fbd-a843-2f7439cef762";
        const respone2 = await axios.get(`/api/hackerearth/${he_id}`);
        console.log("respone2", respone2);
        setStatusCodeRealtime("Compiled");
        // const output = respone2?.data?.result?.run_status?.output;
        const output =
          "https://he-s3.s3.amazonaws.com/media/userdata/AnonymousUser/code/8c98722";
        // const output =  "32#<ab@17943918#@>#35#<ab@17943918#@>#36"
        const compile_status = respone2?.data?.result?.compile_status;
        if (compile_status != "OK") {
          setHandelErrorCompiled(compile_status);
          setResultCompiled([]);
        }
        if (output) {
          const respone3 = await axios.get(output);
          console.log("respone3", respone3);

          const resultFormated = formatResult(respone3?.data);

          const mapQuestionStudentGotAnwsers = question?.testCases.map(
            (testcase, index) => {
              return {
                ...testcase,
                got: resultFormated[index],
              };
            }
          );
          const responeQuestionStudent = await axios.patch(
            `/api/questionstudents/${question._id}`,
            {
              gotAnwsers: mapQuestionStudentGotAnwsers,
              answer: valueAnswerCode,
            }
          );
          console.log(responeQuestionStudent);
          if(responeQuestionStudent?.data?.isCorrect){
            toast.success(" You are passed question")
          }
         
          setResultCompiled(resultFormated);

          setHandelErrorCompiled(null);

          //           "32
          // #<ab@17943918#@>#
          // 35
          // #<ab@17943918#@>#
          // 36
          // "
        }
      }

      setStatusCodeRealtime("");
      if (!showConsole) {
        resetLayout(60, 40);
      }
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
      setStatusCodeRealtime("");
    }
  };

  return (
    <div className=" h-full  ">
      <div className=" h-full p-2 shadow-sm  ">
        <PanelGroup direction="horizontal" className="border rounded-sm h-full">
          <Panel defaultSize={50} maxSize={90} className="h-full">
            <QuestionInfor question={question}></QuestionInfor>
          </Panel>
          <PanelResizeHandle className=" p-[2px] w-[2px] hover:bg-slate-500 bg-slate-200 cursor-pointer" />
          <Panel defaultSize={50}>
            <PanelGroup direction="vertical" ref={ref}>
              <Panel maxSize={95} minSize={5} defaultSize={95} >
                <div className=" h-full overflow-auto">
                <CodeMirror
                className=" overflow-auto"
                  value={questionStudent?.answer}
                  // content="Your answer"
                  height="full"
                  // extensions={[javascript({ jsx: true }),]}
                  extensions={[cpp(), autocompletion()]}
                  //extensions={[cpp()]}
                  onChange={(value) => {
                    setValueAnswerCode(value);
                  }}
                />
                </div>
              </Panel>
              <PanelResizeHandle className=" p-[2px] h-[2px] hover:bg-slate-500 bg-slate-200 cursor-pointer" />
              <Panel
                className="flex  flex-col relative "
                minSize={7}
                maxSize={95}
                defaultSize={6}
              >
                <div className="  overflow-auto pb-[35px]">
                  <TestCaseError
                    testCases={question?.testCases}
                    result={questionStudent?.gotAnwsers.map((answer)=>{ return answer?.got})}
                    errorCompiled={handelErrorCompiled}
                  ></TestCaseError>
                </div>
                <div
                  className=" rounded-sm px-2 bg-slate-300  hover:bg-slate-400 text-black  md:h-[45px]  h-[10px] sm:h-[30px]  
                absolute bottom-0 right-0 flex items-center justify-between w-full"
                >
                  <div onClick={handleShowConsole}>
                    {" "}
                    {showConsole ? <FaChevronDown /> : <FaChevronUp />}{" "}
                  </div>
                  <div className="flex gap-x-2">
                    <Button
                      className="p-3 md:h-5 h-2  w-13"
                      onClick={handleRunCode}
                    >
                      {isLoading && (
                        <span className="flex items-center justify-between">
                          <Loading loading={isLoading}></Loading>
                          {statusCodeRealtime}
                        </span>
                      )}
                      {!isLoading && "Submit"}
                    </Button>
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
