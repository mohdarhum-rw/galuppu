// MainStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomBarr from './BottomBar';
const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="BottomBarr" headerMode="none">
      <Stack.Screen name="BottomBarr" component={BottomBarr} />
      {/* Define other screens here if needed */}
    </Stack.Navigator>
  );
};

export default MainStack;
