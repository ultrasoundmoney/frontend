import React from "react";
import { render } from "@testing-library/react";

const TestDom = () => {
  return (
    <>
      <span data-testid="ancestor">
        <span data-testid="descendant"></span>
      </span>
    </>
  );
};

test("test", () => {
  const { getByTestId } = render(<TestDom />);

  const ancestor = getByTestId("ancestor");
  const descendant = getByTestId("descendant");

  expect(ancestor).toContainElement(descendant);
  expect(descendant).not.toContainElement(ancestor);
});
