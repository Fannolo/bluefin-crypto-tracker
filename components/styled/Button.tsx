import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from "@shopify/restyle";
import React, { ReactElement } from "react";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";

import Box from "./Box";
import { Theme } from "../../theme";
import Text from "./Text";

type ButtonProps = {
  title: string;
  icon?: ReactElement<any, any>;
  textVariant?: keyof Theme["textVariants"];
} & TouchableOpacityProps;

const Button = createRestyleComponent<
  VariantProps<Theme, "buttonVariants"> & ButtonProps,
  Theme
>(
  [createVariant({ themeKey: "buttonVariants" })],
  ({ title, icon, textVariant, ...touchableOpacityProps }) => {
    return (
      <TouchableOpacity
        {...touchableOpacityProps}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Box flexDirection="row" alignItems="center" justifyContent="center">
          {icon && <Box marginRight="m">{icon}</Box>}
          {title && <Text variant={textVariant}>{title}</Text>}
        </Box>
      </TouchableOpacity>
    );
  }
);

export default Button;
