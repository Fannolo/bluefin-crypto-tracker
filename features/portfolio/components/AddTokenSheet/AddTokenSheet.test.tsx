// AddTokenSheet.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AddTokenSheet from "../AddTokenSheet";
import { usePortfolio } from "../../hooks/usePortfolio";

// Mock usePortfolio so we can control addToken
jest.mock("../../hooks/usePortfolio", () => ({
  usePortfolio: jest.fn(),
}));

const mockAddToken = jest.fn();
const mockOnClose = jest.fn();

describe("AddTokenSheet", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAddToken.mockReset();
    mockOnClose.mockReset();
    (usePortfolio as jest.Mock).mockReturnValue({
      addToken: mockAddToken,
    });
  });

  it("shows validation errors when input is empty", async () => {
    const { getByText } = render(
      <AddTokenSheet
        isOpen={true}
        onClose={mockOnClose}
        tokenAddress="0x123"
        symbol="TEST"
      />
    );

    // Press Save without entering any values
    const saveButton = getByText("Save");
    fireEvent.press(saveButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(getByText("Amount is required")).toBeTruthy();
      expect(getByText("Purchase price is required")).toBeTruthy();
    });
  });

  it("calls addToken and onClose when valid input is provided", async () => {
    const { getByPlaceholderText, getByText } = render(
      <AddTokenSheet
        isOpen={true}
        onClose={mockOnClose}
        tokenAddress="0x123"
        symbol="TEST"
      />
    );

    const amountInput = getByPlaceholderText("Enter amount");
    const purchasePriceInput = getByPlaceholderText("Enter purchase price");

    fireEvent.changeText(amountInput, "10");
    fireEvent.changeText(purchasePriceInput, "100");

    const saveButton = getByText("Save");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockAddToken).toHaveBeenCalledWith({
        address: "0x123",
        symbol: "TEST",
        amount: "10",
        purchasePrice: "100",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when Cancel is pressed", async () => {
    const { getByText } = render(
      <AddTokenSheet
        isOpen={true}
        onClose={mockOnClose}
        tokenAddress="0x123"
        symbol="TEST"
      />
    );

    const cancelButton = getByText("Cancel");
    fireEvent.press(cancelButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
