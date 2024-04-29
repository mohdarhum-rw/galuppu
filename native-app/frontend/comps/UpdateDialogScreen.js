// UpdateDialogScreen.js

import React from 'react';
import { View } from 'react-native';
import UpdateDialog from './ShopInfo';

const UpdateDialogScreen = ({ route }) => {
  const { shopName, deliveryDetails, handleButtonPress2 } = route.params;

  return (
    <View>
      <UpdateDialog
        shopName={shopName}
        deliveryDetails={deliveryDetails}
        handleButtonPress={handleButtonPress2}
      />
    </View>
  );
};

export default UpdateDialogScreen;
