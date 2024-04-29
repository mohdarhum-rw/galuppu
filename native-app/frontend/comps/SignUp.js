import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import FontLoader from "./FontLoader";
import { FIREBASE_AUTH } from "../firebaseconfig";

// import IconButton from "react-native-paper";
const SignUp = ({ navigation }) => { // Pass navigation as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH; 

  const signUp = async () => {
    setLoading(true);
    try {
      // Create a new user with the provided email and password
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert("Sign up successful!");
    } catch (error) {
      alert("Error signing up: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <FontLoader />
      <View style={[styles.containerWithBackground, { borderColor: "white", borderWidth: 1 }]}>
        <View style={styles.innerContainer}>
            <IconButton icon={'account-group'} />
          <Text style={styles.title}>Welcome to Gullp!</Text>
          <Text style={styles.subtitle}>Create a new account as an executive.</Text>
          <TextInput
            label="Username"
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            value={email}
            autoCapitalize="none"
            outlineStyle={{borderRadius:20,borderColor: "#bdced9"}}
          />
          <TextInput
            label="Password"
            mode="outlined"
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
            outlineStyle={{borderRadius:20,borderColor: "#bdced9"}}
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={signUp}
              icon={"arrow-right"}
              loading={loading}
              contentStyle={{ flexDirection: "row-reverse" }}
              textColor="black"
              buttonColor="#9ed9ff"
            >
              Sign Up
            </Button>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Already signed up? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f5f7",
  },
  containerWithBackground: {
    backgroundColor: "white",
    borderRadius: 21,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#f7faff",
    fontFamily:'Rubik',
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  button: {
    width: "50%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Rubik",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 40,
    fontFamily: "RubikR",
  },
  loginLink: {
    marginTop: 20,
    color: "#4498f2",
    fontFamily: "Rubik",
  },
});

export default SignUp;
