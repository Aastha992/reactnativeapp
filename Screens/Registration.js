import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import axios from 'axios';  // Import axios for making HTTP requests
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const Registration = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleRegister = () => {
    // Input validation
    if (!userName || !email || !password) {
      Alert.alert("Please fill all fields!");
      return;
    }

    // Regex for email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailPattern)) {
      Alert.alert("Invalid email format!");
      return;
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
      Alert.alert("Password must be at least 8 characters long!");
      return;
    }

    const userData = {
      username: userName,
      email: email,
      password: password,
    };

    // Log data before sending the request to the backend
    console.log("Sending Registration Data:", userData);

    // Make the POST request to the backend registration API
    axios.post("http://10.0.0.221:5001/api/auth/register", userData)
      .then((response) => {
        console.log("Registration Successful:", response.data); // Log the response from the server
        Alert.alert("Registration Successful!");
        navigation.navigate("LoginScreen");  // Navigate to LoginScreen after successful registration
      })
      .catch((error) => {
        console.error("Registration Error:", error.response ? error.response.data : error.message);
        Alert.alert("Registration failed", error.response ? error.response.data.message : "An unknown error occurred. Please try again.");
      });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Hey,{' \n'}Register Now!</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail ID</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail ID"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} // Show password if 'showPassword' is true
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Powered by</Text>
        <Text style={styles.footerCompany}>Kusiar Project Services Inc.</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Ensures everything is centered
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding for footer space
  },
  heading: {
    fontSize: 30, // Increased font size for better visibility
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Darker color for contrast
    marginBottom: 40, // Increased margin to separate from form fields
  },
  inputContainer: {
    marginBottom: 20, // Adds space between each input field
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#000', // Set border color to black
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1, // Take up all available space
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  button: {
    backgroundColor: '#486ECD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  footerCompany: {
    color: '#486ECD',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default Registration;
