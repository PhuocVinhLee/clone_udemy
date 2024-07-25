"use client";

import { TestCaseType } from "@/lib/database/models/questions.model";

interface ExampleProps {
  examples: {
    _id: string;
    input: string;
    output: string;
    asexample: boolean;
    position: number;
  }[];
}
const Example = ({ examples }: ExampleProps) => {
  return (
    <div>
      {examples.map((testcase, index) => {
        return ( testcase.asexample &&
          <div key={index} className="flex flex-col gap-y-2 mb-5">
            <div className=" font-bold">Example {index + 1}:</div>
            <div>
              <div>
                <span className=" font-semibold">Input:</span> {testcase.input}
              </div>
              <div>
                <span className=" font-semibold">Output:</span>{" "}
                {testcase.output}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Example;
