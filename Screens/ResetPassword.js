import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = "http://10.0.0.221:5001/api"; // Replace with your actual API base URL

const ResetPassword = ({ route, navigation }) => {
  // Access email passed from the previous screen (e.g., EnterVerificationCode1)
    const { email } = route.params; // Destructure the email from route.params

    // If email is undefined or null, show an error and stop further execution
    if (!email) {
        console.error('Email is not defined!');
        Alert.alert('Error', 'Email is not defined.');
        return null; // Render nothing or display a fallback UI
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const [secureTextEntry2, setSecureTextEntry2] = useState(true);
    const [loading, setLoading] = useState(false);

    const resetPasswordAPI = async (email, newPassword) => {
        try {
           console.log("Calling reset password API with email:", email, " and password:", newPassword);
            const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                email: email, // Ensure you send the 'email' field here
                newPassword: newPassword,
            });
            console.log("Response:", response);
            return response.data;  // Return response data if successful
        } catch (error) {
             console.log("Error during API call:", error);
            throw new Error(error.response ? error.response.data.message : 'An error occurred while resetting the password');
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
          setErrorMessage('Passwords are not the same, re-enter again');
          return;
        }
        setErrorMessage('');
        setLoading(true);
         console.log("Making API call with email:", email, " and new password:", newPassword)
        try {
         const response = await resetPasswordAPI(email, newPassword);
            setLoading(false);
           console.log("API call successful, response:", response)
          Alert.alert('Success', response.message);
          navigation.navigate('LoginScreen'); // Navigate to LoginScreen after password reset
       } catch (error) {
         setLoading(false);
           console.log("API call Failed:", error);
           setErrorMessage(error.message);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Reset your Password</Text>
            <Text style={styles.subHeader}>The password must be different than before</Text>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#000" style={styles.icon} />
                <TextInput
                    style={[
                        styles.input,
                        { color: newPassword ? '#000000' : '#7f8c8d' }, // Dynamically change color
                    ]}
                    placeholder="New Password"
                    placeholderTextColor="#7f8c8d" // Ensure placeholder stays grey
                    secureTextEntry={secureTextEntry1}
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setSecureTextEntry1(!secureTextEntry1)}>
                    <Ionicons name={secureTextEntry1 ? 'eye-off' : 'eye'} size={20} color="#000" />
                </TouchableOpacity>
            </View>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#000" style={styles.icon} />
                <TextInput
                    style={[
                        styles.input,
                        { color: confirmPassword ? '#000000' : '#7f8c8d' }, // Dynamically change color
                    ]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#7f8c8d" // Ensure placeholder stays grey
                    secureTextEntry={secureTextEntry2}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setSecureTextEntry2(!secureTextEntry2)}>
                    <Ionicons name={secureTextEntry2 ? 'eye-off' : 'eye'} size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                style={styles.continueButton}
                onPress={handleResetPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.continueButtonText}>Continue</Text>
                )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
    },
    continueButton: {
        backgroundColor: '#486ECD',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    continueButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#486ECD',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'left',
        marginTop: 5,
        marginBottom: 10,
    },
    cancelButtonText: {
        color: '#486ECD',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ResetPassword;