import { TokenPrice } from "../types";

export const fetchTokenPrices = async (
  tokens: string[]
): Promise<TokenPrice[]> => {
  const response = await fetch(
    `https://swap.api.sui-prod.bluefin.io/api/v1/tokens/price?tokens=${tokens}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch token prices");
  }
  return response.json();
};
