"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCaseType } from "@/lib/database/models/questionschapter.model";
import { cn } from "@/lib/utils";
import test from "node:test";

interface TestCaseErrorProps {
  testCases?:
    | {
        _id: string;
        input: string;
        output: string;
        asexample: boolean;
        position: number;
      }[]
    | null;
  result: string[];
  errorCompiled: string;
}
const TestCaseError = ({
  testCases,
  result,
  errorCompiled,
}: TestCaseErrorProps) => {
  return (
    <Tabs defaultValue="testcase" className="w-full ">
      <TabsList className=" dark:bg-black">
        <TabsTrigger value="testcase">Test case</TabsTrigger>
        <TabsTrigger
          className={cn(errorCompiled && " border border-red-500")}
          value="password"
        >
          Console
        </TabsTrigger>
      </TabsList>
      <TabsContent className="px-2  text-sm" value="testcase">
        {testCases && (
          <Tabs defaultValue={testCases[0]?._id} className="w-full  ">
            <TabsList className=" dark:bg-black  space-x-2">
              {testCases?.map(
                (
                  testcase: {
                    _id: string;
                    input: string;
                    output: string;
                    asexample: boolean;
                    position: number;
                  },
                  index
                ) => {
                  return (
                    <TabsTrigger
                      key={index}
                      value={testcase._id}
                      className={cn(
                        "   bg-none",
                        !errorCompiled &&
                          result &&
                          (result[index] === testcase?.output
                            ? "border border-green-400"
                            : "border border-red-400")
                      )}
                    >
                      {" "}
                      <p>Case{index + 1}</p>{" "}
                    </TabsTrigger>
                  );
                }
              )}
            </TabsList>

            {testCases?.map((testcase, index) => {
              return (
                <TabsContent
                  key={index}
                  className="  p-2 text-sm w-full "
                  value={testcase._id}
                >
                  <div className="flex flex-col gap-y-2">
                    <div className=" grid w-full  items-center gap-2">
                      <Label htmlFor={testcase._id + index}>Input</Label>
                      <Input
                        className="w-full border-2"
                        readOnly={true}
                        value={testcase?.input}
                        id={testcase._id + index}
                        type="text"
                      />
                    </div>
                    <div className=" grid w-full  items-center gap-2">
                      <Label htmlFor={testcase._id + index}>Ouput</Label>
                      <Input
                        className={cn(
                          "w-full border-2",
                          result &&
                            result[index] !== testcase?.output &&
                            "border border-red-400"
                        )}
                        readOnly={true}
                        value={testcase?.output}
                        id={testcase._id + index}
                        type="text"
                      />
                    </div>
                    <div className=" grid w-full  items-center gap-2">
                      <Label htmlFor={testcase._id + index}>Got</Label>
                      <Input
                        className={cn("w-full border-2")}
                        readOnly={true}
                        value={!errorCompiled && result ? result[index] : ""}
                        id={testcase._id + index + "got"}
                        type="text"
                      />
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </TabsContent>

      <TabsContent className="px-4   " value="password">
        <p className="  p-0 text-sm text-red-500">{errorCompiled}</p>
      </TabsContent>
    </Tabs>
  );
};

export default TestCaseError;
