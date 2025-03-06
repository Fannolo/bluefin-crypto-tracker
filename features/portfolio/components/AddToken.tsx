import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { usePortfolio } from "../hooks/usePortfolio";
import Box from "../../../components/styled/Box";
import Text from "../../../components/styled/Text";
import Button from "../../../components/styled/Button";

interface AddTokenModalProps {
  visible: boolean;
  onClose: () => void;
  tokenAddress?: string;
  symbol?: string;
}

export default function AddTokenModal({
  visible,
  onClose,
  tokenAddress,
  symbol,
}: AddTokenModalProps) {
  const { addToken } = usePortfolio();
  const [address, setAddress] = useState(tokenAddress || "");
  const [tokenSymbol, setTokenSymbol] = useState(symbol || "");
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const handleSave = () => {
    try {
      // Basic input sanitization for symbol
      if (!tokenSymbol.match(/^[A-Za-z0-9]+$/)) {
        throw new Error("Invalid symbol format");
      }
      // Attempt to add token
      addToken({
        address,
        symbol: tokenSymbol,
        amount,
        purchasePrice,
      });
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Box
          backgroundColor="background"
          margin="m"
          padding="m"
          borderRadius={10}
        >
          <Text variant="header" marginBottom="m">
            Add Token
          </Text>
          <Text variant="body">Token Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={{ borderWidth: 1, marginBottom: 10 }}
            placeholder="0x..."
          />
          <Text variant="body">Symbol</Text>
          <TextInput
            value={tokenSymbol}
            onChangeText={setTokenSymbol}
            style={{ borderWidth: 1, marginBottom: 10 }}
            placeholder="e.g. SUI"
          />
          <Text variant="body">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            style={{ borderWidth: 1, marginBottom: 10 }}
            placeholder="Enter amount"
            keyboardType="decimal-pad"
          />
          <Text variant="body">Purchase Price</Text>
          <TextInput
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            style={{ borderWidth: 1, marginBottom: 10 }}
            placeholder="Enter purchase price"
            keyboardType="decimal-pad"
          />
          <Box flexDirection="row" justifyContent="space-between" marginTop="m">
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
}
