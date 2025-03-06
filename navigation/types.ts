export enum RootStackScreenNames {
  Home = "Home",
  Portfolio = "Portfolio",
}

export type RootStackParamList = {
  [RootStackScreenNames.Home]: undefined;
  [RootStackScreenNames.Portfolio]: undefined;
};
