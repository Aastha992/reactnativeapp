import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Correct Ionicons import
import Ionicons from 'react-native-vector-icons/Ionicons';
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    
    setLoading(true); // Show loading indicator
   console.log("Making API call with this email:", email);
    try {
        // Send the email to the backend API
        const response = await axios.post('http://10.0.0.221:5001/api/auth/forgot-password', { email });
        console.log("API Response:", response);

        // Show success message
        Alert.alert("Success", response.data.message);

         // Navigate to the verification code screen
         navigation.navigate('EnterVerificationCode1', { email }); // Passing email to next screen for code verification
    } catch (error) {
        console.log("API Error:", error);
         // Show error message if the API call fails
        Alert.alert("Error", error.response?.data?.message || 'Something went wrong');
    } finally {
        setLoading(false); // Hide loading indicator
    }
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Forgot Password?</Text>
      <Text style={styles.subHeader}>Please enter your email account to reset your password</Text>

      {/* Image in place of lock icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../Assets/forgotpasswordphoto.png')} // Path to the image in the assets folder
          style={styles.icon}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your email address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Ionicons name="mail-outline" size={20} color="#486ECD" style={styles.inputIcon} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: 10, // Adjust top padding to give space from the top
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 70, // Margin to create space between the header and subheader
  },
  subHeader: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: -30,
    marginTop: -50,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: -50,
    marginTop: -20,
  },
  icon: {
    width: 240, // Adjust size as needed
    height: 240, // Adjust size as needed
    resizeMode: 'contain', // Ensures the image maintains its aspect ratio
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 200,
    marginTop : 10,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
  inputIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom :10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#486ECD',
    marginRight: 10,
    
  },
  cancelButtonText: {
    color: '#486ECD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#486ECD',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
