// usePortfolio.ts

import { usePortfolioStore } from "../store";

export function usePortfolio() {
  const portfolio = usePortfolioStore((state) => state.portfolio);
  const addToken = usePortfolioStore((state) => state.addToken);
  const editToken = usePortfolioStore((state) => state.editToken);
  const removeToken = usePortfolioStore((state) => state.removeToken);

  return { portfolio, addToken, editToken, removeToken };
}
