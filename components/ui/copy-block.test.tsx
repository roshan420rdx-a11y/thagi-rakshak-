import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { CopyBlock } from "./copy-block";

test("CopyBlock: text हमेशा दिखे (बिना JS के भी चुनकर copy हो सके)", () => {
  const html = renderToStaticMarkup(<CopyBlock text={"पहली लाइन\nदूसरी लाइन"} label="नमूना" />);
  expect(html).toContain("पहली लाइन");
  expect(html).toContain("<pre");
});
