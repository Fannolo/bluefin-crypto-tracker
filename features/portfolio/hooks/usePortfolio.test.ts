// usePortfolio.test.ts
import { renderHook } from "@testing-library/react-hooks";
import { usePortfolio } from "./usePortfolio";
import { usePortfolioStore } from "../store";

// Mock the underlying store
jest.mock("../store", () => ({
  usePortfolioStore: jest.fn(),
}));

describe("usePortfolio hook", () => {
  it("should return portfolio, addToken, editToken, and removeToken from the store", () => {
    const mockPortfolio = [
      { address: "0x123", symbol: "TEST", amount: "10", purchasePrice: "100" },
    ];
    const mockAddToken = jest.fn();
    const mockEditToken = jest.fn();
    const mockRemoveToken = jest.fn();

    // Set up the mock implementation so every call to usePortfolioStore returns the same mock store object
    (usePortfolioStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        portfolio: mockPortfolio,
        addToken: mockAddToken,
        editToken: mockEditToken,
        removeToken: mockRemoveToken,
      })
    );

    const { result } = renderHook(() => usePortfolio());

    expect(result.current.portfolio).toEqual(mockPortfolio);
    expect(result.current.addToken).toBe(mockAddToken);
    expect(result.current.editToken).toBe(mockEditToken);
    expect(result.current.removeToken).toBe(mockRemoveToken);
  });
});
