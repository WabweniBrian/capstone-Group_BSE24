import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // for extended matchers like .toBeInTheDocument()
import Counter from "./Counter";

describe("Counter Component", () => {
  // Test 1: Check if the initial count is 0
  test("renders with initial count of 0", () => {
    render(<Counter />);

    // Expect the heading to display "Counter: 0"
    const counterText = screen.getByText(/Counter: 0/i);
    expect(counterText).toBeInTheDocument(); // Checks if "Counter: 0" exists in the document
  });

  // Test 2: Check if the increment button increases the count by 1
  test("increments the count by 1 when the increment button is clicked", () => {
    render(<Counter />);

    // Get the increment button
    const incrementButton = screen.getByText(/Increment/i);

    // Simulate a click on the increment button
    fireEvent.click(incrementButton);

    // Expect the heading to display "Counter: 1"
    const counterText = screen.getByText(/Counter: 1/i);
    expect(counterText).toBeInTheDocument();
  });

  // Test 3: Check if the decrement button decreases the count by 1
  test("decrements the count by 1 when the decrement button is clicked", () => {
    render(<Counter />);

    // Get the decrement button
    const decrementButton = screen.getByText(/Decrement/i);

    // Simulate a click on the decrement button
    fireEvent.click(decrementButton);

    // Expect the heading to display "Counter: -1"
    const counterText = screen.getByText(/Counter: -1/i);
    expect(counterText).toBeInTheDocument();
  });
});
