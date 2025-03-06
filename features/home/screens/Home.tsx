import React, { useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { TOKEN_LIST, TokenData } from "../types";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";
import theme from "../../../theme";
import { usePortfolio } from "../../portfolio/hooks/usePortfolio";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const { addToken } = usePortfolio();

  // Filter tokens by search input
  const filteredTokens = TOKEN_LIST.filter((token) => {
    const lowerQuery = search.toLowerCase();
    return (
      token.name.toLowerCase().includes(lowerQuery) ||
      token.symbol.toLowerCase().includes(lowerQuery)
    );
  });

  const handleTokenPress = (token: TokenData) => {
    try {
      addToken({
        address: token.address,
        symbol: token.symbol,
        amount: "0", // default value for amount
        purchasePrice: "0", // default value for purchase price
      });
      Alert.alert(
        "Token Added",
        `${token.symbol} was added to your portfolio.`
      );
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="background">
        <Box
          backgroundColor="primary"
          paddingVertical="m"
          paddingHorizontal="m"
          alignItems="center"
        >
          <Text variant="header">Select a Token to Add</Text>
        </Box>

        {/* Search Bar */}
        <Box padding="m">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tokens..."
            style={styles.searchInput}
          />
        </Box>

        {/* Token List */}
        <FlatList
          data={filteredTokens}
          keyExtractor={(item) => item.address}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTokenPress(item)}>
              <Box
                backgroundColor="card"
                marginHorizontal="m"
                marginVertical="s"
                padding="m"
                borderRadius={8}
              >
                <Text variant="body" fontWeight="bold">
                  {item.symbol}
                </Text>
                <Text variant="body" color="text">
                  {item.name}
                </Text>
              </Box>
            </TouchableOpacity>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
