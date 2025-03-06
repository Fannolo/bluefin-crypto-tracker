import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Alert,
  LayoutAnimation,
} from "react-native";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";
import Button from "../../../components/styled/Button";
import theme from "../../../theme";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices } from "../api/fetchTokens";
import { CacheKey } from "../../../hooks/useQuery";
import AddTokenModal from "../components/AddToken";
import { usePortfolio } from "../hooks/usePortfolio";
import Decimal from "decimal.js";
import TokenCard from "../components/TokenCard";
import { SafeAreaView } from "react-native-safe-area-context";

interface TokenPrice {
  address: string;
  price: string;
  priceChangePercent24Hrs: string;
}

export default function PortfolioScreen() {
  const { portfolio } = usePortfolio();
  const [showModal, setShowModal] = useState(false);
  // Example token addresses. Replace with your dynamic list as needed.
  const tokens = [
    "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI,0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
  ];

  const {
    data: tokenPrices,
    error,
    isLoading,
    refetch,
  } = useQuery<TokenPrice[], Error>({
    queryKey: [CacheKey.TOKENS],
    queryFn: () => fetchTokenPrices(tokens),
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error.message);
    }
  }, [error]);

  const getPortfolioStats = () => {
    let totalValue = new Decimal(0);
    let totalCost = new Decimal(0);

    portfolio.forEach((item) => {
      // Match the item with current price if available
      const priceInfo = tokenPrices?.find((p) => p.address === item.address);
      const currentPrice = priceInfo
        ? new Decimal(priceInfo.price)
        : new Decimal(0);
      const amount = new Decimal(item.amount);
      const purchasePrice = new Decimal(item.purchasePrice);

      totalValue = totalValue.plus(currentPrice.mul(amount));
      totalCost = totalCost.plus(purchasePrice.mul(amount));
    });

    const profitLoss = totalValue.minus(totalCost);
    return {
      totalValue: totalValue.toFixed(2),
      profitLoss: profitLoss.toFixed(2),
    };
  };

  const { totalValue, profitLoss } = getPortfolioStats();

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [portfolio]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="background" padding="m">
        <Text variant="header" marginBottom="m">
          Your Portfolio
        </Text>

        {/* Portfolio Summary */}
        <Box marginBottom="m">
          <Text variant="body">Total Value: ${totalValue}</Text>
          <Text variant="body">Profit/Loss: ${profitLoss}</Text>
        </Box>

        <Button title="Refresh Prices" onPress={() => refetch()} />
        <Button title="Add Token" onPress={() => setShowModal(true)} />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={portfolio}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => {
              const priceInfo = tokenPrices?.find(
                (p) => p.address === item.address
              );
              return (
                <TokenCard
                  address={item.address}
                  symbol={item.symbol}
                  currentPrice={priceInfo?.price}
                  amount={item.amount}
                  purchasePrice={item.purchasePrice}
                />
              );
            }}
            style={{ marginTop: 20 }}
          />
        )}

        <AddTokenModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      </Box>
    </SafeAreaView>
  );
}
