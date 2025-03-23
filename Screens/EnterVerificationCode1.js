import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import axios from 'axios'; // Import axios for making HTTP requests

// Correct Ionicons import
import Ionicons from 'react-native-vector-icons/Ionicons';
const API_BASE_URL = "http://10.0.0.221:5001/api"; // Replace with your actual API base URL

const EnterVerificationCode1 = ({ route, navigation }) => {
  // Retrieve email from route.params (passed from the previous screen)
  const { email } = route.params;

  const [code, setCode] = useState(['', '', '', '']);
  const [isCodeComplete, setIsCodeComplete] = useState(false);

  // Create refs for each TextInput
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleInputChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }

    // Focus on the next input field if the current one is filled
    if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      setIsCodeComplete(true);
      Keyboard.dismiss();
    } else {
      setIsCodeComplete(false);
    }
  }, [code]);

  // API to verify the code
  const verifyCode = async (enteredCode) => {
    try {
        console.log("Making API call with email:", email, " code:", enteredCode);
      const response = await axios.post(`${API_BASE_URL}/auth/verify-code`, {
        email: email,  // Use the email passed from the previous screen
          code: enteredCode,
      });
        console.log("API response:", response);
      return response.data;  // Return the response data if successful
    } catch (error) {
       console.log("API Error:", error)
      throw new Error(error.response ? error.response.data.message : 'An error occurred during verification');
    }
  };

  // API to resend the code
  const resendCode = async () => {
    try {
      console.log("Making API call with email:", email);
        const response = await axios.post(`${API_BASE_URL}/auth/resend-code`, {
            email: email,
         });
         console.log("API response:", response);
      return response.data;  // Return the response data if successful
    } catch (error) {
        console.log("API Error:", error)
      throw new Error(error.response ? error.response.data.message : 'An error occurred while resending the code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const enteredCode = code.join('');
      const response = await verifyCode(enteredCode);
      Alert.alert('Success', response.message);
      navigation.navigate('ResetPassword', { email: email }); // Navigate to ResetPassword screen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCode();
      Alert.alert('Info', response.message);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Verification Code</Text>
      <Text style={styles.subHeader}>We have sent a code to {email}</Text>

      {/* Code Input Fields */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleInputChange(index, value)}
            ref={inputRefs[index]}  // Set the ref for each input field
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, { backgroundColor: isCodeComplete ? '#486ECD' : '#A9C1F4' }]}
        disabled={!isCodeComplete}
        onPress={handleVerifyCode}
      >
        <Text style={styles.verifyButtonText}>Verify Now</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>
        Didn't you receive any code?{' '}
        <Text style={styles.resendLink} onPress={handleResendCode}>Resend Code</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 10,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 20,
  },
  verifyButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7f8c8d',
  },
  resendLink: {
    color: '#486ECD',
    fontWeight: 'bold',
  },
});

export default EnterVerificationCode1;