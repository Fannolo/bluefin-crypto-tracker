import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Decimal from "decimal.js";

interface PortfolioItem {
  address: string;
  symbol: string;
  amount: string; // keep as string for input, parse with Decimal
  purchasePrice: string; // same reason as above
}

const STORAGE_KEY = "@my_portfolio_data";

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Load data on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPortfolio(JSON.parse(stored));
      }
    })();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const addToken = (item: PortfolioItem) => {
    // Basic validation: check for duplicates
    const alreadyExists = portfolio.some((p) => p.address === item.address);
    if (alreadyExists) {
      throw new Error("Token already in portfolio");
    }

    // Validate numeric input using decimal.js
    const amountDecimal = new Decimal(item.amount);
    if (amountDecimal.isNegative()) {
      throw new Error("Amount cannot be negative");
    }

    setPortfolio([...portfolio, item]);
  };

  const editToken = (updatedItem: PortfolioItem) => {
    setPortfolio((prev) =>
      prev.map((p) => (p.address === updatedItem.address ? updatedItem : p))
    );
  };

  const removeToken = (address: string) => {
    setPortfolio((prev) => prev.filter((p) => p.address !== address));
  };

  return {
    portfolio,
    addToken,
    editToken,
    removeToken,
  };
}
