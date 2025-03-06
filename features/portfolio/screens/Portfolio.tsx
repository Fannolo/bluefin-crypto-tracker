import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Alert,
  LayoutAnimation,
  ListRenderItem,
} from "react-native";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";
import Button from "../../../components/styled/Button";
import theme from "../../../theme";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices } from "../api/fetchTokens";
import { CacheKey } from "../../../hooks/useQuery";
import { usePortfolio } from "../hooks/usePortfolio";
import Decimal from "decimal.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortfolioItem } from "../store";
import NetInfo from "@react-native-community/netinfo";
import { useAsyncEffect } from "ahooks";
import PortfolioRenderItem from "../components/PortfolioItem";

interface TokenPrice {
  address: string;
  price: string;
  priceChangePercent24Hrs: string;
}

export default function PortfolioScreen() {
  const { portfolio } = usePortfolio();

  const tokens = portfolio.map((item) => {
    return item.address;
  });

  const {
    data: tokenPrices,
    error,
    isLoading,
    refetch,
  } = useQuery<TokenPrice[], Error>({
    queryKey: [CacheKey.TOKENS],
    queryFn: () => fetchTokenPrices(tokens),
    refetchInterval: 1000,
  });

  useAsyncEffect(async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error(
        "No network connectivity. Please check your internet connection."
      );
    }
  }, []);

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

  const renderItem: ListRenderItem<PortfolioItem> = useCallback(({ item }) => {
    if (tokenPrices)
      return <PortfolioRenderItem item={item} tokenPrices={tokenPrices} />;
    return null;
  }, []);

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
            renderItem={renderItem}
            style={{ marginTop: 20 }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
