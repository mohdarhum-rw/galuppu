import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Button,
  IconButton,
  Dialog,
  Paragraph,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const ProfilePage = ({ sharedData }) => {
  const { exName, exusn } = sharedData;
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#3E8260" });

  const openPrivacyPolicy = async () => {
    setLoading(true);
    try {
      await Linking.openURL("http://35.200.145.189:8000/privacypolicynew");
    } catch (error) {
      console.error("Error opening privacy policy link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = () => {
    console.log("Update password button clicked");
  };

  const handleDownloadReport = () => {
    console.log("Download Latest Report button clicked");
  };

  const handleSubmitReport = () => {
    console.log("Submit Latest Report button clicked");
  };

  const handlePrivacyPolicy = () => {
    fetchPrivacyPolicy();
    setPrivacyPolicyVisible(true);
  };

  const handlePrivacyPolicyDismiss = () => {
    setPrivacyPolicyVisible(false);
  };

  const handlelogoutbutton = () => {
    console.log("logout or something");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar.Image
        size={70}
        style={styles.avatar}
        source={{
          uri: "https://fastly.picsum.photos/id/168/700/700.jpg?hmac=TdvFbMN99iyiBXtZ2P8n01OzXKYcEjCkhlSnsZZ5LyU",
        }}
      />
      <Title style={styles.title}>{exName}</Title>
      <Caption style={styles.caption}>{exusn}</Caption>
      <Caption style={styles.caption}>phoneno</Caption>
      <Caption style={styles.caption}>email</Caption>

      <View style={styles.btncontainer}>
        <View style={styles.buttonRow}>
          <Button
            icon="account-edit"
            mode="text"
            textColor="black"
            style={{ padding: 5, marginTop: 20 }}
            onPress={handleUpdatePassword}
          >
            Update password
          </Button>
          <IconButton
            size={18}
            mode="contained"
            containerColor="#9ed9ff"
            iconColor="black"
            icon="arrow-right"
            style={{ marginTop: 20 }}
            onPress={handleUpdatePassword}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button
            icon="arrow-down"
            textColor="black"
            mode="text"
            style={{ padding: 5, marginTop: 20 }}
            onPress={handleDownloadReport}
          >
            Download Latest Report
          </Button>
          <IconButton
            size={18}
            mode="contained"
            containerColor="#9ed9ff"
            iconColor="black"
            icon="arrow-right"
            style={{ marginTop: 20 }}
            onPress={handleDownloadReport}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button
            icon="arrow-up"
            textColor="black"
            mode="text"
            style={{ padding: 5, marginTop: 20 }}
            onPress={handleSubmitReport}
          >
            Submit Latest Report
          </Button>
          <IconButton
            size={18}
            mode="contained"
            containerColor="#9ed9ff"
            iconColor="black"
            icon="arrow-right"
            style={{ marginTop: 20 }}
            onPress={handleSubmitReport}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button
            icon="text"
            textColor="black"
            mode="text"
            style={{ padding: 5, marginTop: 20 }}
            onPress={openPrivacyPolicy}
          >
            Privacy Policy
          </Button>
          <IconButton
            size={18}
            mode="contained"
            containerColor="#9ed9ff"
            iconColor="black"
            icon="arrow-right"
            style={{ marginTop: 20 }}
            onPress={openPrivacyPolicy}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button
            icon="logout"
            mode="text"
            textColor="black"
            style={{ padding: 5, marginTop: 20 }}
            onPress={handlelogoutbutton}
          >
            Logout
          </Button>
          <IconButton
            size={18}
            mode="contained"
            containerColor="#9ed9ff"
            iconColor="black"
            icon="arrow-right"
            style={{ marginTop: 20 }}
          />
        </View>
      </View>

      {/* Privacy Policy Dialog */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  avatar: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  caption: {
    fontSize: 16,
    marginBottom: 1,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
  },
  btncontainer: {
    alignItems: "left",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ProfilePage;
