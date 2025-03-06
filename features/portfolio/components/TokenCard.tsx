import React from "react";
import { TouchableOpacity } from "react-native";
import { usePortfolio } from "../hooks/usePortfolio";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";

interface TokenCardProps {
  address: string;
  symbol: string;
  currentPrice?: string;
  amount: string;
  purchasePrice: string;
}

export default function TokenCard({
  address,
  symbol,
  currentPrice,
  amount,
  purchasePrice,
}: TokenCardProps) {
  const { removeToken } = usePortfolio();

  const handleRemove = () => {
    removeToken(address);
  };

  return (
    <TouchableOpacity onLongPress={handleRemove}>
      <Box
        padding="m"
        marginVertical="s"
        backgroundColor="card"
        borderRadius={8}
      >
        <Text variant="body" fontWeight="bold">
          {symbol} - {address}
        </Text>
        <Text variant="body">Current Price: ${currentPrice ?? "N/A"}</Text>
        <Text variant="body">Amount: {amount}</Text>
        <Text variant="body">Purchase Price: ${purchasePrice}</Text>
      </Box>
    </TouchableOpacity>
  );
}
