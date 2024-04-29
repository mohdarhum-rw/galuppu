import React from "react";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native-paper";

const FontLoader = ({ children }) => {
  const [fontsLoaded] = useFonts({
    NotoSansBold: require("../assets/fonts/NotoSans-Bold.ttf"),
    NotoSansBlack: require("../assets/fonts/NotoSans-Black.ttf"),
    Rubik: require("../assets/fonts/Rubik-Bold.ttf"),
    RubikR: require("../assets/fonts/Rubik-Regular.ttf"),
    Ques: require("../assets/fonts/Questrial-Regular.ttf"),
    Urbanist: require("../assets/fonts/Urbanist-Medium.ttf"),
    Sono: require("../assets/fonts/Sono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    // Return null or a loading indicator until fonts are loaded
    return null;
  }

  // Once fonts are loaded, render children components
  return children;
};

export default FontLoader;
