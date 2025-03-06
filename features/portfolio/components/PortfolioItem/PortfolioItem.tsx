import { TouchableOpacity, Alert, StyleSheet } from "react-native";
import React from "react";
import TokenCard from "../TokenCard";
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

type PortfolioItemProps = {
  item: PortfolioItem;
  tokenPrices: TokenPrice[];
};

const PortfolioItem = ({ item, tokenPrices }: PortfolioItemProps) => {
  const { removeToken } = usePortfolio();
  const priceInfo = tokenPrices?.find((p) => p.address === item.address);

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      console.log("showRightProgress:", prog.value);
      console.log("appliedTranslation:", drag.value);

      return {
        transform: [{ translateX: drag.value + 50 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <Text style={styles.rightAction}>Text</Text>
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
  rightAction: { width: 50, height: 50, backgroundColor: "purple" },
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    height: 50,
    backgroundColor: "papayawhip",
    alignItems: "center",
  },
});

export default PortfolioItem;
