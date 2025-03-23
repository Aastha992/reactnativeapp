import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    Image,
    FlatList,
    ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const BASE_URL = "http://10.0.0.221:5001"; // Ensure correct backend URL

const DailyDiaryPreview = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [hasSaved, setHasSaved] = useState(false);
    const [logos, setLogos] = useState([]);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loadingLogos, setLoadingLogos] = useState(true);
    const [errorLoadingLogos, setErrorLoadingLogos] = useState(false);

    /** Extract Params */
    const {
        projectId,
        projectNumber,
        projectName,
        selectedDate,
        owner,
        description,
        contractor,
        ownerContact,
        contractNumber,
        reportNumber,
        ownerProjectManager,
        userId,
    } = route.params || {};

    console.log('DailyDiaryPreview - route.params:', route.params);

    useEffect(() => {
        const fetchLogos = async () => {
            setLoadingLogos(true);
            setErrorLoadingLogos(false);
            try {
                const response = await fetch(`${BASE_URL}/api/logos`); // Use BASE_URL
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("API Response Data:", data);

                setLogos(data);

                if (data.length > 0) {
                    setSelectedLogo(data[0]);
                }
            } catch (error) {
                console.error("Error fetching logos:", error);
                setErrorLoadingLogos(true);
            } finally {
                setLoadingLogos(false);
            }
        };

        fetchLogos();
    }, []);

    const handleLogoSelect = (logo) => {
        setSelectedLogo(logo);
        setIsDropdownOpen(false);
    };
    /** Function to Handle Back Navigation */
    const handleBack = () => {
        navigation.navigate("DailyEntry3", {
            projectId,
            projectNumber,
            projectName,
            owner,
            selectedDate,
            description,
            contractor,
            ownerContact,
            contractNumber,
            reportNumber,
            ownerProjectManager,
            userId,
        });
    };

    /** Function to Handle Editing */
    const handleEdit = (screenName) => {
        const data = {
            projectId,
            projectNumber,
            projectName,
            owner,
            selectedDate,
            description,
            contractor,
            ownerContact,
            contractNumber,
            reportNumber,
            ownerProjectManager,
            userId,
        };

        switch (screenName) {
            case "projectDetails":
                navigation.navigate("DailyEntry1", data);
                break;
            case "description":
                navigation.navigate("DailyEntry3", data);
                break;
            default:
                break;
        }
    };

    /** Function to Submit Data to API */
    const handlesubmit = async () => {
        console.log('DailyDiaryPreview - projectId before API call:', projectId);
        if (hasSaved) {
            Alert.alert("Alert", `Already Saved`);
            return;
        }

        if (!selectedLogo) {
            Alert.alert("Error", "Please select a company logo.");
            return;
        }

        try {
            /** Format `selectedDate` correctly */
            const formattedDate = selectedDate;

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

            /** Construct API request body */
            const requestData = {
                projectId,
                projectNumber,
                projectName,
                selectedDate: formattedDate, // using formatted date here
                owner,
                description,
                contractor,
                ownerContact,
                contractNumber,
                reportNumber,
                ownerProjectManager,
                userId,
                selectedLogoId: selectedLogo._id, // Include selected logo ID
            };

            console.log("DailyDiaryPreview - Sending Request Data:", JSON.stringify(requestData, null, 2));

            /** Make API request */
            const response = await axios.post(`${BASE_URL}/api/diary/daily-diary`, requestData);

            console.log("API Response:", response.data);

            if (response.status === 201) {
                setHasSaved(true);
                Alert.alert("Success", "Daily diary entry submitted successfully!");
                navigation.navigate("Daily72");
            } else {
                throw new Error(response.data.message || "Failed to submit entry");
            }
        } catch (error) {
            if (error.response) {
                console.error("Server Response Error:", error.response.data);
                Alert.alert("Error", `Failed to submit: ${error.response.data.message || "Invalid request."}`);
            } else if (error.request) {
                console.error("No Response from Server:", error.request);
                Alert.alert("Error", "No response from the server. Check your network.");
            } else {
                console.error("Request Setup Error:", error.message);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        }
    };

    const renderItem = () => (
        <View>
            {/* Project Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Project Details</Text>
                {[
                    { label: "Date", value: selectedDate },
                    { label: "Project Number", value: projectNumber },
                    { label: "Project Name", value: projectName },
                    { label: "Owner", value: owner },
                    { label: "Contract Number", value: contractNumber },
                    { label: "Contractor", value: contractor },
                    { label: "Report Number", value: reportNumber },
                    { label: "Owner Contact", value: ownerContact },
                    { label: "Owner Project Manager", value: ownerProjectManager },
                ].map((item, index) => (
                    <Text key={index} style={styles.detailText}>
                        <Text style={styles.boldText}>{item.label}:</Text> {item.value || "N/A"}
                    </Text>
                ))}
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit("projectDetails")}>
                    <Text style={styles.editButtonText}>Edit Project Details</Text>
                </TouchableOpacity>
            </View>

            {/* Logo Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose Logo</Text>

                <TouchableOpacity
                    style={styles.logoDropdownButton}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <View style={styles.selectedLogoContainer}>
                        {selectedLogo ? (
                            <Image
                                source={{ uri: `${BASE_URL}${selectedLogo.logoUrl}` }}
                                style={styles.selectedLogoImage}
                            />
                        ) : (
                            <Text>Select Logo</Text>
                        )}
                    </View>
                    <Icon
                        name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#333"
                        style={styles.dropdownIcon}
                    />
                </TouchableOpacity>

                {/* Loading and Error Handling */}
                {loadingLogos && <ActivityIndicator size="small" color="#0000ff" />}
                {errorLoadingLogos && (
                    <Text style={styles.errorText}>Error loading logos. Please check your network connection.</Text>
                )}

                {/* Dropdown List (Conditionally Rendered) */}
                {isDropdownOpen && (
                    <FlatList
                        data={logos}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.logoItem}
                                onPress={() => handleLogoSelect(item)}
                            >
                                <Image
                                    source={{ uri: `${BASE_URL}${item.logoUrl}` }}
                                    style={styles.logoItemImage}
                                />
                                <Text>{item.companyName}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.logoList}
                    />
                )}
            </View>
            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.detailText}>{description || "No description provided."}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit("description")}>
                    <Text style={styles.editButtonText}>Edit Description</Text>
                </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handlesubmit} disabled={hasSaved}>
                <Text style={styles.submitButtonText}>{hasSaved ? "Already Saved" : "Submit"}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review Daily Report</Text>
            </View>

            <FlatList
                data={[1]} // Use a single item to render all content
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", padding: 10 },
    backButton: { flexDirection: "row", alignItems: "center", padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, color: "#000" },
    container: { flexGrow: 1, padding: 20 },
    section: { marginBottom: 20, padding: 15, backgroundColor: "white", borderRadius: 8 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#555" },
    detailText: { fontSize: 16, marginBottom: 5, color: "#555", lineHeight: 20 },
    boldText: { fontWeight: "bold" },
    editButton: { backgroundColor: "#486ECD", padding: 10, borderRadius: 5, alignSelf: "flex-start" },
    editButtonText: { color: "white", fontSize: 14, fontWeight: "bold" },
    submitButton: { backgroundColor: "#486ECD", padding: 10, borderRadius: 5, alignItems: "center" },
    submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

    // Logo Dropdown Styles
    logoDropdownButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
    },
    selectedLogoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    selectedLogoImage: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        marginRight: 10,
    },
    dropdownIcon: {
        marginLeft: 10,
    },
    
    logoItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    logoItemImage: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginRight: 10,
    },
    errorText: {
        color: "red",
        marginTop: 5,
    },
});

export default DailyDiaryPreview;