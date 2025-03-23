import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { DailyEntryContext } from "../utils/DailyEntryContext";

export default function Daily78() {
  const navigation = useNavigation();
  const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);

  // Initialize description from context or with an empty string
  const [description, setDescription] = useState(dailyEntryData.description || "");

  // Update the context whenever the description state changes.
  useEffect(() => {
    setDailyEntryData((prevData) => ({
        ...prevData,
        description,
    }));
}, [description]);


  // Function to start speech for voice to text
  const startSpeaking = () => {
    Speech.speak("Please start describing your project.");
  };

  // API Integration (Same as Daily76.js)
  const handleSubmit = async () => {
    try {
      // Extract required fields
      const { userId, projectId, selectedDate, location } = dailyEntryData;

      // ensure all required fields are present
      if (!userId || !projectId) {
        Alert.alert("Error", "Missing userId or projectId. Please try again.");
        return;
      }

      if (!selectedDate || !location) {
        Alert.alert("Error", "Missing required fields: selectedDate or location.");
        return;
      }

      // Construct request body
      const requestBody = {
        userId,
        projectId,
        selectedDate,
        location,
        description, //Send project description to API
      };

      console.log("Sending API Request:", requestBody);

      // Send API request
      const response = await fetch("http://10.0.0.221:5001/api/daily/daily-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        // No alert, just navigate to Preview Screen
        navigation.navigate("DailyEntryPreview");
      } else {
        console.error("Server Error:", result);
        Alert.alert("Error", result.message || "Failed to save project description.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Network request failed. Please check your connection.");
    }
  };

   // Function to navigate to the next screen, data is saved in context.
    const handleNext = () => {
        navigation.navigate("DailyEntryPreview");
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: "#ffffff",
        },
        scrollContentContainer: {
            paddingBottom: 100,
        },
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
            marginBottom: 15,
        },
        backButton: {
            flexDirection: "row",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 10,
            color: "#333",
             fontFamily: "Roboto",
        },
        headerRightContainer: {
            alignItems: "center",
        },
        headerSubText: {
            color: "#486ECD",
            fontSize: 16,
              fontFamily: "Roboto",
        },
        descriptionHeader: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#000000",
            marginBottom: 20,
              fontFamily: "Roboto",
        },
        stepContainer: {
            marginBottom: 20,
        },
        stepsBackground: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
        },
        stepCircle: {
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0", // light gray background for all steps
        },
        completedCircle: {
            borderColor: "#486ECD",
        },
        futureStep: {
            borderColor: "#e0e0e0",
        },
        stepText: {
            fontSize: 16,
              fontFamily: "Roboto",
            color: "#486ECD", // blue color for numbers in completed steps
        },
        completedText: {
            color: "#486ECD",
        },
        currentStepText: {
            color: "#000000", // Black color for step 5
        },
        futureStepText: {
            color: "#e0e0e0",
        },
        progressLine: {
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "#e0e0e0",
            zIndex: -1,
        },
        completedLine: {
            backgroundColor: "#486ECD", // blue line for completed steps
        },
        futureLine: {
            backgroundColor: "#e0e0e0",
        },
        boldLabel: {
            fontSize: 16,
            marginBottom: 5,
            color: "#486ECD",
            fontWeight: "bold",
             fontFamily: 'Roboto',
        },
        textArea: {
            borderColor: "#ddd",
            borderWidth: 1,
            borderRadius: 8,
            height: 450, // Increased height
            padding: 10,
            marginBottom: 20,
        },
        voiceContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
        },
        voiceButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 8,
        },
        voiceText: {
            marginLeft: 10,
            fontSize: 16,
             fontFamily: "Roboto",
        },
        navContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 40,
        },
        previousButton: {
            flex: 0.48,
            borderWidth: 1,
            borderColor: "#486ECD",
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
            backgroundColor: "transparent",
        },
        previousButtonText: {
            color: "#486ECD",
            fontSize: 18,
            fontWeight: "bold",
              fontFamily: "Roboto",
        },
        submitButton: {
            flex: 0.48,
            backgroundColor: "#486ECD",
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
        },
        submitText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
              fontFamily: "Roboto",
        },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("Daily72")}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text style={styles.headerTitle}>Daily Entry</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.headerRightContainer}>
            <Text style={styles.headerSubText}>See All (5)</Text>
          </View> */}
                </View>

                {/* Description Section Header */}
                <Text style={styles.descriptionHeader}>5. Description</Text>

                {/* Step Indicator */}
                <View style={styles.stepContainer}>
                    <View style={styles.stepsBackground}>
                        {[1, 2, 3, 4, 5].map((step, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (step === 1) navigation.navigate("Daily73");
                                        else if (step === 2) navigation.navigate("Daily74");
                                        else if (step === 3) navigation.navigate("Daily75");
                                        else if (step === 4) navigation.navigate("Daily76");
                                    }}>
                                    <View style={[styles.stepCircle, styles.completedCircle]}>
                                        <Text style={[styles.stepText, styles.completedText]}>
                                            {step}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {index < 4 && (
                                    <View style={[styles.progressLine, styles.completedLine]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Description Input */}
                <Text style={styles.boldLabel}>Add Project Description</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Type your project description here"
                    multiline={true}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />

                {/* Voice to Text */}
                <View style={styles.voiceContainer}>
                    <TouchableOpacity style={styles.voiceButton} onPress={startSpeaking}>
                        <MaterialIcons name="keyboard-voice" size={20} color="black" />
                        <Text style={styles.voiceText}>Voice to Text</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Navigation */}
                <View style={styles.navContainer}>
                    <TouchableOpacity
                        style={styles.previousButton}
                        onPress={() => navigation.navigate("Daily76")}>
                        <Text style={styles.previousButtonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleNext}>
                        <Text style={styles.submitText}>Preview</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}