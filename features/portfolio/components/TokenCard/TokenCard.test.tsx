// TokenCard.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TokenCard from "../TokenCard";
import { usePortfolio } from "../../hooks/usePortfolio";

// Mock the portfolio hook
jest.mock("../../hooks/usePortfolio", () => ({
  usePortfolio: jest.fn(),
}));

const mockRemoveToken = jest.fn();

describe("TokenCard", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (usePortfolio as jest.Mock).mockReturnValue({
      removeToken: mockRemoveToken,
    });
  });

  const props = {
    address: "0x123",
    symbol: "TEST",
    currentPrice: "200",
    amount: "10",
    purchasePrice: "100",
  };

  it("renders token details correctly", () => {
    const { getByText } = render(<TokenCard {...props} />);
    expect(getByText("TEST - 0x123")).toBeTruthy();
    expect(getByText("Current Price: $200")).toBeTruthy();
    expect(getByText("Amount: 10")).toBeTruthy();
    expect(getByText("Purchase Price: $100")).toBeTruthy();
  });

  it("calls removeToken when long pressed", () => {
    const { getByText } = render(<TokenCard {...props} />);
    const touchable = getByText("TEST - 0x123").parent; // Assuming parent is the TouchableOpacity
    if (touchable) {
      fireEvent(touchable, "longPress");
    }
    expect(mockRemoveToken).toHaveBeenCalledWith("0x123");
  });
});
