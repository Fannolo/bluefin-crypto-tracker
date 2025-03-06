// portfolioStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PortfolioItem {
  address: string;
  symbol: string;
  amount: string;
  purchasePrice: string;
}

interface PortfolioState {
  portfolio: PortfolioItem[];
  addToken: (item: PortfolioItem) => void;
  editToken: (updatedItem: PortfolioItem) => void;
  removeToken: (address: string) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolio: [],
      addToken: (item: PortfolioItem) => {
        // Prevent duplicates
        const exists = get().portfolio.some((p) => p.address === item.address);
        if (exists) {
          throw new Error("Token already exists in your portfolio.");
        }
        set((state) => ({ portfolio: [...state.portfolio, item] }));
      },
      editToken: (updatedItem: PortfolioItem) => {
        set((state) => ({
          portfolio: state.portfolio.map((p) =>
            p.address === updatedItem.address ? updatedItem : p
          ),
        }));
      },
      removeToken: (address: string) => {
        set((state) => ({
          portfolio: state.portfolio.filter((p) => p.address !== address),
        }));
      },
    }),
    {
      name: "portfolio-storage", // key for persistence
    }
  )
);
