import { render, screen } from "@testing-library/react";
import { Home } from "../../Home";

describe("Home", () => {
  it("renders welcome message", () => {
    render(<Home />);

    const message = screen.getByText(/welcome to the shakers/i);
    expect(message).toBeInTheDocument();

    expect(message.tagName).toBe("P");
  });

  it("renders image", () => {
    render(<Home />);

    const image = screen.getByRole("img", {
      name: "Shakers logo",
    });

    expect(image).toBeInTheDocument();
  });

  it("renders with correct styles", () => {
    render(<Home />);

    const div = screen.getByRole("main");

    expect(div).toHaveClass("container");
  });
});
