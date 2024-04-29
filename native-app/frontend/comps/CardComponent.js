import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import {
  Provider as PaperProvider,
  Card,
  Button,
  Text,
  Snackbar,
  Searchbar,
  ActivityIndicator
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import FontLoader from "./FontLoader";
import Collapsible from "react-native-collapsible";
import { useNavigation } from "@react-navigation/native";

const App = ({ sharedData, loading, setSharedData }) => {
  const { shopData, exName, managerName } = sharedData;
  const [isUpdated, setIsUpdated] = useState(false)
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedShop, setExpandedShop] = useState(null);
  const [cardCoverUri, setCardCoverUri] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#3E8260" });
  const navigation = useNavigation();

  const handleCardPress = (shopName) => {
    if (expandedShop === shopName) {
      // If the clicked card is already expanded, collapse it
      setExpandedShop(null);
    } else {
      // If the clicked card is not expanded, expand it
      setExpandedShop(shopName);
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    else if (hour < 18) return "Good Afternoon";
    else return "Good Evening";
  };

  const setFilteredShopData = (query, items) => {
    if (!query) {
      return items;
    }
    return items.filter((shop) =>
      shop.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleUpdateShop = (shopName) => {
    const updatedShopData = shopData.map((shop) =>
      shop.name === shopName ? { ...shop, isUpdated } : false
    );
    setSharedData((prevSharedData) => ({
      ...prevSharedData,
      shopData: updatedShopData,
    }));
    setSnackbarMessage("Shop updated successfully!");
    setSnackbarVisible(true);
  };

  useEffect(() => {
    if (expandedShop) {
      setCardCoverUri(
        "https://source.unsplash.com/collection/1163637/480x480"
      );
    }
  }, [expandedShop]);

  const filteredShopData = setFilteredShopData(searchQuery, shopData);

  return (
    <PaperProvider>
      <FontLoader />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ backgroundColor: theme[colorScheme].onPrimary }}>
          <Searchbar
            placeholder="Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ backgroundColor: "#d7eefc", margin: 20 }}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#bdced9"
              style={{ padding: 20 }}
            />
          ) : (
            <Text
              variant="bodyLarge"
              style={{
                paddingLeft: 25,
                paddingTop: 20,
                fontFamily: "Rubik",
                fontSize: 20,
              }}
            >
              {getTimeOfDayGreeting()}, {exName}!
            </Text>
          )}

          {filteredShopData.length === 0 ? (
            <Text
              style={{
                alignSelf: "center",
                marginTop: 40,
                fontSize: 16,
                color: "gray",
              }}
            >
              No matching results found.
            </Text>
          ) : (
            filteredShopData.map((shop, index) => (
              !shop.isUpdated && (
                <View key={index} style={{ margin: 20 }}>
                  <Button
                    icon={
                      expandedShop === shop.name
                        ? "chevron-down"
                        : "chevron-right"
                    }
                    buttonColor="#edf8ff"
                    onPress={() => handleCardPress(shop.name)}
                    textColor="black"
                    style={{
                      padding: 10,
                      borderRadius: 20,
                      borderColor: "#bdced9",
                    }}
                    contentStyle={{ flexDirection: "row-reverse" }}
                    mode="outlined"
                    uppercase="True"
                  >
                    {shop.name} 
                  </Button>
                  <Collapsible collapsed={expandedShop !== shop.name}>
                    <Card
                      style={{
                        elevation: 5,
                        borderRadius: 21,
                        backgroundColor: "#f0f2f2",
                        borderColor: "#bdced9",
                        marginTop: 10,
                      }}
                      onPress={() =>
                        navigation.navigate("ShopInfo", {
                          shopName: shop.name,
                          handleUpdateShop: handleUpdateShop,
                          location_shop: shop.location,
                        })
                      }
                    >
                      <Card.Cover
                        source={{ uri: cardCoverUri }}
                        style={{
                          borderRadius: 24,
                          backgroundColor: "#f0f2f2",
                        }}
                      />

                      <Card.Title
                        title={shop.name}
                        subtitle={shop.location}
                        titleStyle={{
                          fontSize: 22,
                          fontWeight: "900",
                          paddingTop: 10,
                          color: "black",
                        }}
                        subtitleStyle={{ fontSize: 14, color: "black" }}
                      />
                      <Text
                        style={{
                          paddingTop: 5,
                          paddingLeft: 17,
                          paddingRight: 20,
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Assigned by: {managerName}
                      </Text>
                      <Text
                        style={{
                          paddingTop: 5,
                          paddingLeft: 17,
                          paddingRight: 20,
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Pending credit: x
                      </Text>
                      <Text
                        style={{
                          paddingTop: 5,
                          paddingLeft: 17,
                          paddingRight: 20,
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        total bottles: x
                      </Text>

                      <Card.Actions>
                        <Button
                          onPress={() =>
                            navigation.navigate("ShopInfo", {
                              shopName: shop.name + '- Update Panel',
                              handleUpdateShop: handleUpdateShop,
                              location_shop: shop.location,
                              
                            })
                            
                          }
                          icon="arrow-right"
                          mode="elevated"
                          style={{ margin: 10 }}
                          buttonColor="#9ed9ff"
                          textColor="black"
                        >
                          Update
                        </Button>
                      </Card.Actions>
                    </Card>
                  </Collapsible>
                </View>
              )
            ))
          )}
        </ScrollView>
      </SafeAreaView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ marginBottom: 20 }}
      >
        {snackbarMessage}
      </Snackbar>
    </PaperProvider>
  );
};

export default App;
