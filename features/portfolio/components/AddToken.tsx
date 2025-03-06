// AddTokenSheet.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { FormikConfig, useFormik } from "formik";
import { number, object, string } from "yup";

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
  const { addToken } = usePortfolio();

  const handleSave = useCallback(
    (values: { amount: string; purchasePrice: string }) => {
      try {
        addToken({
          address: tokenAddress ?? "",
          symbol: symbol ?? "",
          amount: values.amount,
          purchasePrice: values.purchasePrice,
        });
        onClose();
        // Reset fields after saving
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    },
    []
  );

  const formik = useFormik({
    initialValues: {
      amount: "",
      purchasePrice: "",
    },
    onSubmit: handleSave,
    validationSchema: object({
      amount: number()
        .typeError("Amount must be a number")
        .required("Amount is required"),
      purchasePrice: number()
        .typeError("Purchase price must be a number")
        .required("Purchase price is required"),
    }),
    validateOnChange: true,
  });

  // Expand or close sheet based on isOpen
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

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
              value={formik.values.amount}
              onChangeText={formik.handleChange("amount")}
              onBlur={formik.handleBlur("amount")}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              style={styles.input}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <Text variant="body" style={{ color: "red" }}>
                {formik.errors.amount}
              </Text>
            ) : null}
            <Text variant="body">Purchase Price</Text>
            <TextInput
              value={formik.values.purchasePrice}
              onChangeText={formik.handleChange("purchasePrice")}
              onBlur={formik.handleBlur("purchasePrice")}
              placeholder="Enter purchase price"
              keyboardType="decimal-pad"
              style={styles.input}
            />
            {formik.touched.purchasePrice && formik.errors.purchasePrice ? (
              <Text
                variant="body"
                style={{
                  color: "red",
                }}
              >
                {formik.errors.purchasePrice}
              </Text>
            ) : null}
            <Box
              flexDirection="row"
              justifyContent="space-between"
              marginTop="m"
            >
              <Button title="Cancel" onPress={onClose} />
              <Button
                title="Save"
                onPress={() => {
                  formik.handleSubmit();
                }}
              />
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
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderColor: theme.colors.primary,
    borderRadius: 8,
  },
});
