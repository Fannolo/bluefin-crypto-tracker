// PortfolioItemRenderItem.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { usePortfolio } from "../../hooks/usePortfolio";
import { PortfolioItem } from "../../store";
import { TokenPrice } from "../../types";
import PortfolioItemRenderItem from "./PortfolioItem";

// Create mock implementations for usePortfolio
jest.mock("../../hooks/usePortfolio", () => ({
  usePortfolio: jest.fn(),
}));

const mockRemoveToken = jest.fn();

// Dummy portfolio item and token price
const dummyItem: PortfolioItem = {
  address: "0x123",
  symbol: "TEST",
  amount: "10",
  purchasePrice: "100",
};

const dummyTokenPrice: TokenPrice = {
  address: "0x123",
  price: "200",
  priceChangePercent24Hrs: "5",
};

describe("PortfolioItemRenderItem", () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockRemoveToken.mockReset();
    (usePortfolio as jest.Mock).mockReturnValue({
      removeToken: mockRemoveToken,
    });
  });

  it("renders the token card with correct details", () => {
    const { getByText } = render(
      <PortfolioItemRenderItem
        item={dummyItem}
        tokenPrices={[dummyTokenPrice]}
      />
    );

    // Check that the token symbol and amount details are rendered
    expect(getByText("TEST")).toBeTruthy();
    expect(getByText("Amount: 10")).toBeTruthy();
    expect(getByText("Purchase Price: $100")).toBeTruthy();
    expect(getByText(/Price: \$200/)).toBeTruthy();
  });

  it("calls removeToken when Delete is pressed", async () => {
    const { getByText } = render(
      <PortfolioItemRenderItem
        item={dummyItem}
        tokenPrices={[dummyTokenPrice]}
      />
    );

    // Since the "Delete" text is rendered inside the swipeable right action,
    // find it and simulate a press.
    const deleteText = getByText("Delete");
    fireEvent.press(deleteText);

    // Wait for the asynchronous event, if any.
    await waitFor(() => {
      expect(mockRemoveToken).toHaveBeenCalledWith(dummyItem.address);
    });
  });
});
