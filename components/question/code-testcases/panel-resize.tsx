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

import { TestCaseForm } from "./test-case-form";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { cpp } from "@codemirror/lang-cpp";
import TestCaseError from "./testcase-error";
import { TemplateForm } from "./template-form";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/clipLoader";
import { formatResult } from "@/lib/format";
import CodeMirrorCpn from "./code-mirror";
interface PanelReSizeProps {
  question: any;
  pathToUpdateAndGet: string

}

export default function PanelReSize({ question, pathToUpdateAndGet }: PanelReSizeProps) {
  console.log("question in page", question);

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
  const handleAddTestCase = () => {
    setTestCase([
      ...testCases,
      {
        input: "",
        ouput: "",
        asexample: false,
        position: testCases.length + 1,
      },
    ]);
  };
  useEffect(() => {
    setTestCase(question?.testCases);
  }, [question]);

  const [isLoading, setIsLoading] = useState(false);
  const [valueAnswerCode, setValueAnswerCode] = useState(question?.answer);
  const [resultCompiled, setResultCompiled] = useState<string[]>([]);
  const [statusCodeRealtime, setStatusCodeRealtime] = useState("");
  const [handelErrorCompiled, setHandelErrorCompiled] = useState<any>(null);
  const router = useRouter();
  const handleRunCode = async () => {
    try {
      setIsLoading(true);
      axios.patch(pathToUpdateAndGet, {
        answer: valueAnswerCode,
      });

      setStatusCodeRealtime("Compiling");
      const respone = await axios.post(`/api/hackerearth`, {
        testCases: question?.testCases,
        answer: valueAnswerCode,
        lang: "C",
        template: question?.template,
      });
      console.log("respone1", respone);


      if (respone?.data.he_id) {
       
        const he_id = respone.data.he_id;
        const respone2 = await axios.get(`/api/hackerearth/${he_id}`);
      
       
        let output = respone2?.data?.result?.run_status?.output;
      
        const compile_status = respone2?.data?.result?.compile_status;
        if (compile_status != "OK") {
          setHandelErrorCompiled(compile_status);
          setResultCompiled([]);
          //toast(" This answer will not save");
          return;
        }
        let startTime = Date.now();
        let timeout = 5000; // 5 seconds
        while (output == null) {
          if (Date.now() - startTime >= timeout) {
            console.log("Timeout reached. Exiting loop.");
            break;
          }
          const respone2 = await axios.get(`/api/hackerearth/${he_id}`);
          console.log("respone2ww", respone2);
          output = respone2?.data?.result?.run_status?.output;
          console.log("Timeout reached. Exiting loop222.");
        }

        setStatusCodeRealtime("Compiled");

       

        if (output) {
          const respone3 = await axios.get(output);
          console.log("respone3", respone3);
          const resultFormated = formatResult(respone3?.data);
          setResultCompiled(resultFormated);
   
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

  const [fullCode, setFullCode] = useState<string>("");

  const getFullCode = async () => {
    const fullsource: any = await axios.get(
      `${pathToUpdateAndGet}/fullsource`
    );
    console.log("full code", fullsource);
    if (fullsource?.data) {
      setFullCode(fullsource.data);
    }
  };
  useEffect(() => {
    getFullCode();
  }, [question]);

  return (
    <div className=" h-full  ">
      <div className=" h-full p-2 shadow-sm  ">
        <PanelGroup direction="horizontal" className="border rounded-sm h-full">
          <Panel defaultSize={50} maxSize={90} className="h-full">
            <Tabs
              defaultValue="testcases"
              className="flex flex-col h-full w-full "
            >
              <TabsList className="grid w-full grid-cols-2 rounded-none">
                <TabsTrigger value="testcases">Test cases</TabsTrigger>
                <TabsTrigger value="template">Custom template</TabsTrigger>
              </TabsList>
              <TabsContent
                value="testcases"
                className="  flex-1 overflow-auto "
              >
                <div className="  flex flex-col ">
                  {testCases?.length ? (
                    testCases?.map((testcase: any, index: number) => (
                      <TestCaseForm
                      pathToUpdateAndGet={pathToUpdateAndGet}
                        key={index}
                        questionId={question?._id}
                        initialData={testcase}
                        testCases={testCases}
                      ></TestCaseForm>
                    ))
                  ) : (
                    <TestCaseForm
                    pathToUpdateAndGet={pathToUpdateAndGet}
                      questionId={question?._id}
                      initialData={{
                        input: "",
                        output: "",
                        asexample: false,
                        position: 1,
                      }}
                      testCases={[]}
                    ></TestCaseForm>
                  )}
                  <Button
                    onClick={handleAddTestCase}
                    variant="outline"
                    size="sm"
                    className="  rounded-none rounded-b-sm"
                  >
                    {" "}
                    Add a testcase
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="template" className="h-full overflow-auto">
                <TemplateForm
                pathToUpdateAndGet={pathToUpdateAndGet}
                  initialData={question}
                  questionId={question._id}
                ></TemplateForm>
              </TabsContent>
            </Tabs>
          </Panel>
          <PanelResizeHandle className=" p-[2px] w-[2px] hover:bg-slate-500 bg-slate-200 cursor-pointer" />
          <Panel defaultSize={50}>
            <PanelGroup direction="vertical" ref={ref}>
              <Panel maxSize={95} minSize={5} defaultSize={95}>
                <Tabs
                  defaultValue="youranswer"
                  className="flex flex-col h-full w-full "
                >
                  <TabsList className="grid w-full grid-cols-2 rounded-none">
                    <TabsTrigger value="youranswer">Your answer</TabsTrigger>
                    <TabsTrigger value="fullcode">Full code</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="youranswer"
                    className="flex-1 overflow-auto"
                  >
                    <CodeMirrorCpn
                      valueProp={valueAnswerCode}
                      // content="Your answer"
                      
                      // extensions={[javascript({ jsx: true }),]}
                      extensionsProp={[cpp(), autocompletion()]}
                      //extensions={[cpp()]}
                      onChangeProp={(value) => {
                        setValueAnswerCode(value);
                      }}
                    />
                  </TabsContent>
                  <TabsContent
                    value="fullcode"
                    className="flex-1 overflow-auto"
                  >
                    <CodeMirrorCpn
                      valueProp={fullCode}
                      // content="Your answer"
                      onChangeProp={(value) => {
                        
                      }}
                  
                      // extensions={[javascript({ jsx: true }),]}
                      extensionsProp={[
                        cpp(),
                        autocompletion(),
                        EditorState.readOnly.of(true),
                      ]}
                      //extensions={[cpp()]}
                      // onChange={onChangeProp}
                    />
                  </TabsContent>
                </Tabs>
              </Panel>
              <PanelResizeHandle className=" p-[2px] h-[2px] hover:bg-slate-500 bg-slate-200 cursor-pointer" />
              <Panel
                className="flex  flex-col relative "
                minSize={7}
                maxSize={95}
                defaultSize={6}
              >
                <div className="  overflow-auto pb-[35px] h-full  bg-slate-100 dark:bg-black">
                  <TestCaseError
                    testCases={question?.testCases}
                    result={resultCompiled?.length ? resultCompiled : []}
                    errorCompiled={handelErrorCompiled}
                  ></TestCaseError>
                </div>
                <div className="  dark:bg-customDark dark:text-white rounded-sm px-2 bg-slate-300  hover:bg-slate-400 text-black  md:h-[45px]  h-[10px] sm:h-[30px]  
                absolute bottom-0 right-0 flex items-center justify-between w-full">
                  <div onClick={handleShowConsole}>
                    {" "}
                    {showConsole ? <FaChevronDown /> : <FaChevronUp />}{" "}
                  </div>
                  <div className="flex gap-x-2">
                    <Button  className="  dark:text-white dark:bg-[#1e1e1e] dark:hover:bg-[#151515]  bg-slate-300 hover:bg-slate-400   p-3 md:h-5 h-2  w-13"
                     onClick={handleRunCode}>
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
