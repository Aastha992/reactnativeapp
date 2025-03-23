// DailyEntry3.js
import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DailyEntryContext } from "../utils/DailyEntryContext";
import axios from "axios";

const BASE_URL = "http://10.0.0.221:5001";

const DailyEntry3 = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);

    /** Load `description` from Context */
    const [description, setDescription] = useState(dailyEntryData.description || "");

    /** Update Context When Description Changes */
    useEffect(() => {
		console.log('DailyEntry3 - dailyEntryData:', dailyEntryData);
        setDailyEntryData((prevData) => ({
            ...prevData,
            description,
        }));
    }, [description]);

    /**  Extract Navigation Params */
    const {
        projectId = "",
        projectName = "",
        projectNumber = "",
        selectedDate = "", // <--- Get selectedDate here
        contractor = "",
		owner = "",
        ownerContact = "",
        contractNumber = "",
        ownerProjectManager = "",
        reportNumber = "",
        userId = "",
    } = dailyEntryData || {};


    /** Voice-to-Text */
    const startSpeaking = () => {
        Speech.speak("Please start describing your project.");
    };

    /** Submit Daily Entry to API */
    const handleSubmit = async () => {
		console.log('DailyEntry3 - projectId before API call:', projectId);
        try {
            /** Check for missing fields */
            const missingFields = [];
            if (!projectId) missingFields.push("projectId");
            if (!selectedDate) missingFields.push("selectedDate");
            if (!description) missingFields.push("description");
            if (!contractNumber) missingFields.push("contractNumber");
            if (!reportNumber) missingFields.push("reportNumber");
            if (!contractor) missingFields.push("contractor");
            if (!ownerContact) missingFields.push("ownerContact");
            if (!ownerProjectManager) missingFields.push("ownerProjectManager");
            if (!userId) missingFields.push("userId");

            if (missingFields.length > 0) {
                Alert.alert("Error", `Missing required fields: ${missingFields.join(", ")}`);
                console.error("Missing Fields: ", missingFields);
                return;
            }

            /** Construct request */
            const requestBody = {
                projectId,
                projectName,
                projectNumber,
                selectedDate: selectedDate, // Use the selectedDate directly
                description,
				owner,
                contractor,
                ownerContact,
                contractNumber,
                ownerProjectManager,
                reportNumber,
                userId,
            };

            console.log("DailyEntry3 - Submitting Entry:", requestBody);

            /** Make API call */
            const response = await axios.post(`${BASE_URL}/api/diary/daily-diary`, requestBody);

            if (response.status === 201) {
                Alert.alert("Success", "Daily diary entry saved successfully!");
                navigation.navigate("DailyDiaryPreview", requestBody);
            } else {
                throw new Error(response.data.message || "Failed to save entry");
            }
        } catch (error) {
            if (error.response) {
                console.error("Server Response Error:", error.response.data);
                Alert.alert("Error", `Failed to submit: ${error.response.data.message || "Invalid request."}`);
            } else if (error.request) {
                console.error(" No Response from Server:", error.request);
                Alert.alert("Error", "No response from the server. Check your network.");
            } else {
                console.error("Request Setup Error:", error.message);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => navigation.navigate("Daily72")}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.headerText}>Daily Diary</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity>
          <Text style={styles.seeAllText}>See All (2)</Text>
        </TouchableOpacity> */}
            </View>

            <View style={styles.progressContainer}>
                {[1, 2].map((step, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            onPress={() => {
                                if (step === 1) navigation.navigate("DailyEntry1");
                            }}>
                            <View
                                style={[
                                    styles.progressCircle,
                                    styles.lightGreyBackground,
                                    styles.blueBorder,
                                ]}>
                                <Text style={[styles.progressText, styles.blueText]}>
                                    {step}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {index < 1 && (
                            <View style={[styles.progressLine, styles.completedLine]} />
                        )}
                    </React.Fragment>
                ))}
            </View>

            {/* Description Input */}
            <Text style={styles.title}>Enter Description</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Add Project Description</Text>
                <TextInput
                    style={[styles.textArea, styles.blackBorder, styles.whiteBackground]}
                    placeholder="Type your project description here"
                    multiline={true}
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            {/* Voice-to-Text */}
            <View style={styles.voiceContainer}>
                <TouchableOpacity style={styles.voiceButton} onPress={startSpeaking}>
                    <Ionicons name="mic" size={20} color="black" />
                    <Text style={styles.voiceText}>Voice to Text</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationButtonsContainerBottom}>
                <TouchableOpacity style={styles.previousButton} onPress={() => navigation.navigate("DailyEntry1", dailyEntryData)}>
                    <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#333",
    },
    seeAllText: {
        color: "#486ECD",
        fontSize: 16,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    progressCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    blueBorder: {
        borderWidth: 2,
        borderColor: "#486ECD",
    },
    lightGreyBackground: {
        backgroundColor: "#f5f5f5", // very light grey color
    },
    progressText: {
        fontSize: 16,
        color: "#486ECD",
    },
    progressLine: {
        height: 2,
        flex: 1,
        backgroundColor: "#d3d3d3",
    },
    completedLine: {
        backgroundColor: "#486ECD",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: "#486ECD",
        marginBottom: 4,
        fontWeight: "bold",
    },
    textArea: {
        height: 450,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    voiceContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    voiceButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    voiceText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    navigationButtonsContainerBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    previousButton: {
        flex: 0.48,
        borderWidth: 1,
        borderColor: "#486ECD",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    previousButtonText: {
        color: "#486ECD",
        fontSize: 18,
        fontWeight: "600",
    },
    submitButton: {
        flex: 0.48,
        backgroundColor: "#486ECD",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default DailyEntry3;