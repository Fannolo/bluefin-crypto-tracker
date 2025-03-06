// AddTokenSheet.tsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";
import Button from "../../../components/styled/Button";
import { usePortfolio } from "../../portfolio/hooks/usePortfolio";
import theme from "../../../theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface AddTokenSheetProps {
  tokenAddress?: string;
  symbol?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTokenSheet({
  tokenAddress,
  symbol,
  isOpen,
  onClose,
}: AddTokenSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const { addToken } = usePortfolio();

  // Expand or close sheet based on isOpen
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      addToken({
        address: tokenAddress ?? "",
        symbol: symbol ?? "",
        amount,
        purchasePrice,
      });
      onClose();
      // Reset fields after saving
      setAmount("");
      setPurchasePrice("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={["50%"]} enablePanDownToClose>
      <BottomSheetView style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <Box backgroundColor="background" padding="m">
            <Text variant="header" marginBottom="m">
              Add {symbol} to Portfolio
            </Text>
            <Text variant="body">Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              style={{
                borderWidth: 1,
                marginBottom: 10,
                padding: 8,
                borderColor: theme.colors.primary,
                borderRadius: 8,
              }}
            />
            <Text variant="body">Purchase Price</Text>
            <TextInput
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="Enter purchase price"
              keyboardType="decimal-pad"
              style={{
                borderWidth: 1,
                marginBottom: 10,
                padding: 8,
                borderColor: theme.colors.primary,
                borderRadius: 8,
              }}
            />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              marginTop="m"
            >
              <Button title="Cancel" onPress={onClose} />
              <Button title="Save" onPress={handleSave} />
            </Box>
          </Box>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
