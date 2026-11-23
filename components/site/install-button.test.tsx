import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { InstallButton } from "./install-button";

test("InstallButton: browser मौका न दे तो कुछ नहीं", () => {
  expect(renderToStaticMarkup(<InstallButton />)).toBe("");
});
