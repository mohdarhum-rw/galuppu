import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  Text,
  Snackbar,
  Button,
  PaperProvider,
  Appbar,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import FontLoader from "./FontLoader";
import { Card } from "react-native-paper";
import { DataTable, TextInput } from "react-native-paper";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native";

import Appbarr from "./AppBar";

const ShopDataScreen = ({ route }) => {
  const { shopName, handleUpdateShop, location_shop } = route.params;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");

  const data = [
    { name: "Rose Milk", given: 10, received: 5 },
    { name: "Badaam Milk", given: 8, received: 3 },
    { name: "womp", given: 12, received: 9 },
  ];
  const handleSaveData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://172.16.1.221:8000/random-response");
      if (response.ok) {
        setSuccess(true);
        setError(false);
        navigation.goBack();
      } else {
        const errorText = await response.text(); // Get the error body from response
        setErrorMessage(errorText); // Set error message
        setSuccess(false);
        setError(true);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setSuccess(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const resetStatus = () => {
    setSuccess(false);
    setError(false);
  };

  return (
    <PaperProvider>
      <FontLoader />
      <Appbarr title={shopName} />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton icon={"map-marker"} iconColor="black" style={{}} />
            <Text style={{ fontFamily: "Rubik", color: "black", fontSize: 20 }}>
              {" "}
              {location_shop}{" "}
            </Text>
          </View>

          <Card style={{ margin: 20, width: "100%" }}>
            <Card.Cover
              source={{ uri: "https://picsum.photos/700" }}
              style={{
                borderRadius: 10,
                backgroundColor: "#f0f2f2",
                // padding:'40%',
                // marginTop:20
              }}
            />
          </Card>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Given</DataTable.Title>
              <DataTable.Title>Received</DataTable.Title>
            </DataTable.Header>

            {data.map((row, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{row.name}</DataTable.Cell>
                <DataTable.Cell style={{ padding: 5 }}>
                  <TextInput
                    value={row.received.toString()}
                    onChangeText={(text) => handleReceivedChange(index, text)}
                    keyboardType="numeric"
                    style={styles.input}
                    outlineStyle={{ borderRadius: 20, borderColor: "#bdced9" }}
                    mode="outlined"
                  />
                </DataTable.Cell>
                <DataTable.Cell>
                  <TextInput
                    value={row.received.toString()}
                    onChangeText={(text) => handleReceivedChange(index, text)}
                    keyboardType="numeric"
                    outlineStyle={{ borderRadius: 20, borderColor: "#bdced9" }}
                    mode="outlined"
                    style={styles.input}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              alignContent: "centre",
            }}
          >
            <Text
              style={{
                fontFamily: "NotoSansBlack",
                fontSize: 22,
                marginBottom: 20,
              }}
            >
              HELP SECTION
            </Text>
            <Button style={{ marginTop: 20 }} textColor="black" mode="outlined">
              Shop is Closed
            </Button>
            <Button style={{ marginTop: 20 }} textColor="black" mode="outlined">
              Shop is already Full of stocks.
            </Button>
            <Button style={{ marginTop: 20 }} textColor="black" mode="outlined">
              HEY
            </Button>
          </View>
          <Button
            mode="elevated"
            buttonColor="white"
            textColor="black"
            style={{ width: "40%", marginTop: 40 }}
            onPress={handleSaveData}
            disabled={loading}
          >
            Save
          </Button>

          {loading && (
            <ActivityIndicator color={"#bdced9"} style={{ marginTop: 20 }} />
          )}

          {/* the error card */}
          {error && (
            <Card
              style={{
                margin: 40,
                width: "100%",
                borderColor: "#ff8a8a",
                borderRadius: 21,
              }}
              mode="contained"
            >
              <Card.Content
                style={{ backgroundColor: "#f7cdcd", borderRadius: 21 }}
              >
                <View style={{ display: "flex", flexDirection: "column" }}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <IconButton icon={"alert-circle"} iconColor="#b32020" />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#b32020",
                        fontFamily: "Rubik",
                      }}
                    >
                      {" "}
                      Error{" "}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginTop: 10,
                      marginLeft: 14,
                      marginBottom: 10,
                      fontFamily: "Sono",
                      color: "gray",
                    }}
                  >
                    {errorMessage}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* {success && (
          <Snackbar
            visible={success}
            onDismiss={resetStatus}
            duration={Snackbar.DURATION_SHORT}
            style={{ marginBottom: 20 }} // Adjust margin bottom as needed
          >
            Data saved successfully!
          </Snackbar>
        )}
        {error && (
          <Snackbar
            visible={error}
            onDismiss={resetStatus}
            duration={Snackbar.DURATION_SHORT}
            style={{ marginBottom: 20 }} // Adjust margin bottom as needed
          >
            Failed to save data. Please try again.
          </Snackbar>
        )} */}
      </ScrollView>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  input: {
    width: "70%",
    marginBottom: 10,
    backgroundColor: "#f7faff",
    fontFamily: "Rubik",
    overflow: "hidden",
  },
});

export default ShopDataScreen;
