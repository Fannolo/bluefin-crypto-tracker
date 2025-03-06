import { TouchableOpacity, Alert, StyleSheet } from "react-native";
import React from "react";
import TokenCard from "../TokenCard/TokenCard";
import { PortfolioItem } from "../../store";
import { TokenPrice } from "../../types";
import { usePortfolio } from "../../hooks/usePortfolio";
import Text from "../../../../components/styled/Text";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Box from "../../../../components/styled/Box";

type PortfolioItemProps = {
  item: PortfolioItem;
  tokenPrices: TokenPrice[];
};

const PortfolioItemRenderItem = ({ item, tokenPrices }: PortfolioItemProps) => {
  const { removeToken } = usePortfolio();
  const priceInfo = tokenPrices?.find((p) => p.address === item.address);

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 100 }],
      };
    });

    return (
      <Reanimated.View style={[styleAnimation]}>
        <TouchableOpacity onPress={() => removeToken(item.address)}>
          <Box justifyContent="center" alignItems="center">
            <Text
              variant="body"
              style={styles.rightAction}
              color="background"
              fontWeight={"800"}
            >
              Delete
            </Text>
          </Box>
        </TouchableOpacity>
      </Reanimated.View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Swipeable
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
      >
        <TokenCard
          address={item.address}
          symbol={item.symbol}
          currentPrice={priceInfo?.price}
          amount={item.amount}
          purchasePrice={item.purchasePrice}
        />
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    width: 100,
    height: "100%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    height: "100%",
    backgroundColor: "papayawhip",
    alignItems: "center",
  },
});

export default PortfolioItemRenderItem;
