import React, { useState, useEffect } from "react";
import { View, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { Snackbar } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./comps/Login";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseconfig";
import FontLoader from "./comps/FontLoader";
import SignUp from "./comps/SignUp";
import BottomBarr from "./comps/BottomBar";
import ShopDataScreen from "./comps/ShopInfo";

const Stack = createNativeStackNavigator();

export default function App() {
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#3E8260" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setVisible(!!user);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <FontLoader>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {user ? (
              <>
              <Stack.Screen name="Bottombar" component={BottomBarr} options={{headerShown:false}}/>
              <Stack.Screen name="ShopInfo" component={ShopDataScreen} options={{headerShown:false}}/>
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignUp}
                  options={{ headerShown: false }}
                />
              </>
              
            )}
          </Stack.Navigator>
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={1000} // Optional: set duration in milliseconds
            style={{
              borderRadius: 20,
            }}
          >
            Welcome!
          </Snackbar>
        </NavigationContainer>
      </FontLoader>
    </SafeAreaProvider>
  );
}
