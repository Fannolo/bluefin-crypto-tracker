import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList, RootStackScreenNames } from "./types";
import Home from "../features/home/screens/Home";
import Portfolio from "../features/portfolio/screens/Portfolio";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

const RootStack = createBottomTabNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  return (
    <RootStack.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Portfolio") {
            iconName = "briefcase-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false, // Hide header for a cleaner look
      })}
    >
      <RootStack.Group screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={RootStackScreenNames.Home} component={Home} />
        <RootStack.Screen
          name={RootStackScreenNames.Portfolio}
          component={Portfolio}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
