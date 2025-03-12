import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { TOKEN_LIST, TokenData } from "../types";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";
import theme from "../../../theme";
import AddTokenSheet from "../../portfolio/components/AddTokenSheet/AddTokenSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBoolean } from "ahooks";
import { CacheKey } from "../../../hooks/useQuery";
import { useQuery } from "@tanstack/react-query";

const fetchTokens = async (): Promise<TokenData[]> => {
  const response = await fetch(
    `https://swap.api.sui-prod.bluefin.io/api/v1/tokens`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch token prices");
  }
  return response.json();
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [
    isSheetVisible,
    { setTrue: setSheetVisible, setFalse: setSheetNotVisible },
  ] = useBoolean(false);

  const {
    data: tokensListQueryData,
    isLoading: tokensListQueryDataIsLoading,
    error: tokensListQueryError,
  } = useQuery({
    queryFn: async () => {
      return await fetchTokens();
    },
    queryKey: [CacheKey.TOKENS],
  });

  // Filter tokens by search input
  const filteredTokens = useMemo(
    () =>
      tokensListQueryData?.filter((token) => {
        const lowerQuery = search.toLowerCase();
        return (
          token.name.toLowerCase().includes(lowerQuery) ||
          token.symbol.toLowerCase().includes(lowerQuery)
        );
      }),
    []
  );

  const handleTokenPress = useCallback(
    (token: TokenData) => () => {
      setSelectedToken(token);
      setSheetVisible();
    },
    []
  );

  const handleCloseSheet = useCallback(() => {
    setSheetNotVisible();
    setSelectedToken(null);
  }, []);

  const renderItem: ListRenderItem<TokenData> = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={handleTokenPress(item)}>
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
    ),
    []
  );

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
          renderItem={renderItem}
          ListEmptyComponent={() => {
            // tokens, [], undefined
            if (tokensListQueryError) {
              return <Text>error message</Text>;
            }
            // skeleton
            return <></>;
          }}
        />

        {/* Bottom Sheet for Adding Token */}
        {selectedToken && (
          <AddTokenSheet
            tokenAddress={selectedToken.address}
            symbol={selectedToken.symbol}
            isOpen={isSheetVisible}
            onClose={handleCloseSheet}
          />
        )}
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
