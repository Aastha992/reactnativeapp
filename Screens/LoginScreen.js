import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CustomStatusBar from "../utils/CustomStatusBar";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    console.log("Login button pressed");
    console.log("Email:", email, "Password:", password);

    const userData = {
        email: email,
        password: password,
    };

    try{
      const response = await axios.post(
       'http://10.0.0.221:5001/api/auth/login', {email:email, password: password}
      );
     console.log("Response data for login: ",response.data);
       if(response.data.status === "success"){
           const token = response.data.data.token;
           const userId = response.data.data.userId;
           const isBoss = response.data.data.isBoss; //Get isBoss from response

            console.log("User token during login: ", token); //verify the token is a string.
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('isBoss', JSON.stringify(isBoss)); //Store isBoss

           console.log("User token saved:", token); // check token after saving
           console.log("User Id saved:", userId);
           console.log("Is Boss saved:", isBoss);
            navigation.navigate('HomeScreen') // navigate to home screen
         }else {
            Alert.alert("Login Failed");
            console.log("Login failed response: ", response)
           }
      }catch(error){
         Alert.alert("Login Failed", "Please try again later");
           console.error("Error during login :", error);
     }
}

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log(data, "at app.js");
  }

  useEffect(() => {
    getData();
    console.log("Hii");
  }, []);

  return (
    <View style={styles.container}>
      {/* Use CustomStatusBar */}
      <CustomStatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image source={require("../Assets/logo.png")} style={styles.logo} />
        <Text style={styles.companyName}>BRICKX.</Text>
      </View>
      <Text style={styles.greeting}>Hey,</Text>
      <Text style={styles.greeting}>Login Now!</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail Id</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="E-mail ID"
            placeholderTextColor="#7f8c8d"
            value={email}
            onChangeText={setEmail}
          />
          <FontAwesome name="user" size={20} color="#000" />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7f8c8d"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={styles.customCheckbox}>
            {rememberMe ? (
              <FontAwesome name="check-square" size={24} color="#486ECD" />
            ) : (
              <FontAwesome name="square-o" size={24} color="#707070" />
            )}
          </TouchableOpacity>
          <Text style={styles.rememberMeText}>Remember me</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleSubmit()}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Registration")}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Powered by</Text>
        <TouchableOpacity>
          <Text style={styles.companyLink}>Kusiar Project Services Inc.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
	greeting: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#000",
		marginBottom: 5,
	},
	footerContainer: {
		position: "absolute",
		bottom: 20,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	customCheckbox: {
		padding: 5,
		marginRight: 5,
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F8F9FA",
	},
	logoContainer: {
		alignItems: "center",
		marginVertical: 30,
	},
	companyName: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#486ECD",
		marginTop: 10,
	},
	loginNowText: {
		color: "#486ECD",
	},
	inputContainer: {
		marginVertical: 10,
	},
	label: {
		fontSize: 16,
		color: "#000",
		marginBottom: 5,
	},
	inputBox: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#000",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	input: {
		flex: 1,
		fontSize: 16,
		marginRight: 10,
		color: "#000",
	},
	optionsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
	},
	rememberMeContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	rememberMeText: {
		marginLeft: 5,
		fontSize: 16,
	},
	forgotPasswordText: {
		color: "#486ECD",
		fontSize: 16,
		fontWeight: "bold", // Make the text bold
	},
	loginButton: {
		backgroundColor: "#486ECD",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginVertical: 20,
		flex: 1, // Take up equal space in the row
		marginRight: 10, // Space between buttons
	},
	loginButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
	},
	signUpButton: {
		backgroundColor: "#486ECD",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginVertical: 20,
		flex: 1, // Take up equal space in the row
	},
	signUpButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
	},
	footerText: {
		textAlign: "center",
		fontSize: 14,
		color: "#707070",
	},
	companyLink: {
		textAlign: "center",
		fontSize: 14,
		color: "#486ECD",
		textDecorationLine: "underline",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center", // Vertically center the buttons
		marginVertical: 20,
	},
});

export default LoginScreen;