"use server";

import ejs from "ejs";

export const renderedTemplate = (
  template: string,
  { answer, testCases }: { answer: string; testCases: any[] }
) => {
  const source = ejs.render(template, {
    ANSWER: answer,
    TESTCASE: testCases,
  });
  return source;
};
