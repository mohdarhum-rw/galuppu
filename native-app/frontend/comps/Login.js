import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseconfig";

const Login = ({ navigation }) => { // Pass navigation as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH; 

  const signIn = async () => {
    setLoading(true);
    try { 
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      
    } catch (error) {
      // console.log(error);
      alert("Error Signing in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('Signup'); // Navigate to the Signup screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.containerWithBackground,
          { borderColor: "white", borderWidth: 1 },
        ]}
      >
        <View style={styles.innerContainer}>
          <IconButton icon={'account-key'}></IconButton>
          <Text style={styles.title}>Welcome to Gullp!</Text>
          <Text style={styles.subtitle}>Sign In using your account.</Text>
          <TextInput
            label="Username"
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            value={email}
            outlineStyle={{borderRadius:20,  borderColor: "#bdced9",}}
            autoCapitalize="none"
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
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
  
            <Button
              mode="contained"
              style={[styles.button, { marginRight: 10 }]}
              icon={"arrow-right"}
              contentStyle={{ flexDirection: "row-reverse" }}
              textColor="black"
              buttonColor="#9ed9ff"
              onPress={() => signIn()}
              loading={loading}
            >
              Login
            </Button>
          </View>
          <TouchableOpacity style={styles.signupButton} onPress={navigateToSignUp}>
              <Text style={styles.signupText}>Executive SignUp</Text>
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
    width:"50%"
  },
  signupButton: {
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 10,
    paddingHorizontal: 20,
  },
  signupText: {
    marginTop: 10,
    color: "#4498f2",
    fontFamily: "Rubik",
  },
  forgotPasswordContainer: {
    marginTop: 2,
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#147efb",
    fontSize: 12,
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
});

export default Login;
