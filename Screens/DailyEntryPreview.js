import React, { useContext, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    Image,
    FlatList,
    ActivityIndicator // Import ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { DailyEntryContext } from "../utils/DailyEntryContext";

const DailyEntryPreview = () => {
    const navigation = useNavigation();
    const { dailyEntryData } = useContext(DailyEntryContext);
    const [logos, setLogos] = useState([]);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loadingLogos, setLoadingLogos] = useState(true);
    const [errorLoadingLogos, setErrorLoadingLogos] = useState(false);

    useEffect(() => {
        const fetchLogos = async () => {
            setLoadingLogos(true);
            setErrorLoadingLogos(false);
            try {
                const response = await fetch("http://10.0.0.221:5001/api/logos");
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

     const handleSubmit = async () => {
        if (!selectedLogo) {
            Alert.alert("Error", "Please select a company logo.");
            return;
        }

        // Assuming your API expects the logo ID
        const requestBody = {
            ...dailyEntryData,
            selectedLogoId: selectedLogo._id,
        };

        try {
            // ... (rest of your submit logic)
            console.log("Submitting Daily Entry Data:", dailyEntryData);

            if (!dailyEntryData.userId || !dailyEntryData.projectId || !dailyEntryData.selectedDate || !dailyEntryData.location) {
              Alert.alert("Error", "Missing required fields. Please check your data.");
              return;
            }
      
            // Format data for API
            const formattedEquipments = dailyEntryData.equipments.map(e => ({
              equipmentName: e.equipmentName || "Unknown Equipment",
              quantity: e.quantity || "0",
              hours: e.hours || "0",
              totalHours: e.totalHours || "0"
            }));
            
      
            const formattedLabours = dailyEntryData.labours.map(l => ({
              contractorName: l.contractorName || "Unknown Contractor",
              roles: l.roles.map(role => ({
                roleName: role.roleName || "Unknown Role",
                quantity: role.quantity || "0",
                hours: role.hours || "0",
                totalHours: role.totalHours || "0"
              }))
            }));
      
            const formattedVisitors = dailyEntryData.visitors.map(v => ({
              visitorName: v.visitorName || "Unknown Visitor",
              company: v.company || "Unknown Company",
              quantity: v.quantity || "0",
              hours: v.hours || "0",
              totalHours: v.totalHours || "0"
            }));
      
            const requestBody = {
              userId: dailyEntryData.userId,
              projectId: dailyEntryData.projectId,
              selectedDate: dailyEntryData.selectedDate,
              location: dailyEntryData.location,
              onShore: dailyEntryData.onShore,
              tempHigh: dailyEntryData.tempHigh,
              tempLow: dailyEntryData.tempLow,
              weather: dailyEntryData.weather,
              workingDay: dailyEntryData.workingDay,
              reportNumber: dailyEntryData.reportNumber,
              projectNumber: dailyEntryData.projectNumber,
              projectName: dailyEntryData.projectName,
              owner: dailyEntryData.owner,
              contractNumber: dailyEntryData.contractNumber,
              contractor: dailyEntryData.contractor,
              siteInspector: dailyEntryData.siteInspector,
              timeIn: dailyEntryData.timeIn,
              timeOut: dailyEntryData.timeOut,
              ownerContact: dailyEntryData.ownerContact,
              ownerProjectManager: dailyEntryData.ownerProjectManager,
              component: dailyEntryData.component,
              equipments: formattedEquipments,
              labours: formattedLabours,
              visitors: formattedVisitors,
              description: dailyEntryData.description,
              selectedLogoId: selectedLogo._id, // Include selected logo ID in request
            };

            console.log("Sending API Request:", JSON.stringify(requestBody, null, 2));
      
            const response = await fetch("http://10.0.0.221:5001/api/daily/daily-entry", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody)
            });
      
            const result = await response.json();
            console.log("Server Response:", result);
      
            if (response.ok) {
              Alert.alert("Success", "Daily entry saved successfully!", [
                { text: "OK", onPress: () => navigation.navigate("Daily84") }
              ]);
            } else {
              Alert.alert("Error", result.message || "Failed to submit daily entry.");
            }
          } catch (error) {
            console.error("Fetch Error:", error);
            Alert.alert("Error", "Network request failed. Please check your connection.");
          }
    };

    const handleEdit = (screen) => {
      const screenMapping = {
        projectDetails: "Daily73",
        equipmentDetails: "Daily74",
        labourDetails: "Daily75",
        visitorDetails: "Daily76",
        description: "Daily78"
      };
      navigation.navigate(screenMapping[screen]);
    };

    const renderItem = () => (
        <View>
            {/* Project Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Project Details</Text>
                {[
                    { label: "Date", value: dailyEntryData.selectedDate },
                    { label: "Location", value: dailyEntryData.location },
                    { label: "OnShore/Off Shore", value: dailyEntryData.onShore },
                    { label: "Temp High", value: dailyEntryData.tempHigh },
                    { label: "Temp Low", value: dailyEntryData.tempLow },
                    { label: "Weather Condition", value: dailyEntryData.weather },
                    { label: "Working Day", value: dailyEntryData.workingDay },
                    { label: "Report Number", value: dailyEntryData.reportNumber },
                    { label: "Project Number", value: dailyEntryData.projectNumber },
                    { label: "Project Name", value: dailyEntryData.projectName },
                    { label: "Owner", value: dailyEntryData.owner },
                    { label: "Contract Number", value: dailyEntryData.contractNumber },
                    { label: "Contractor", value: dailyEntryData.contractor },
                    { label: "Site Inspector", value: dailyEntryData.siteInspector },
                    { label: "Inspector Time In", value: dailyEntryData.timeIn },
                    { label: "Inspector Time Out", value: dailyEntryData.timeOut },
                    { label: "Owner Contact", value: dailyEntryData.ownerContact },
                    { label: "Owner Project Manager", value: dailyEntryData.ownerProjectManager },
                    { label: "Component", value: dailyEntryData.component },
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
                                source={{ uri: `http://10.0.0.221:5001${selectedLogo.logoUrl}` }}
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
                                    source={{ uri: `http://10.0.0.221:5001${item.logoUrl}` }}
                                    style={styles.logoItemImage}
                                />
                                <Text>{item.companyName}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.logoList}
                    />
                )}
            </View>

            {/* Equipments */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Equipment Details</Text>
                {dailyEntryData.equipments.length > 0 ? (
                    dailyEntryData.equipments.map((equipment, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Equipment Name:</Text> {equipment.name || "N/A"}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Quantity:</Text> {equipment.quantity || "0"}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Hours:</Text> {equipment.hours || "0"}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Total Hours:</Text> {equipment.totalHours || "0"}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.detailText}>No Equipment Details Added</Text>
                )}
                 <TouchableOpacity style={styles.editButton} onPress={() => handleEdit("equipmentDetails")}>
                        <Text style={styles.editButtonText}>Edit Equipment Details</Text>
                    </TouchableOpacity>
            </View>

             <View style={styles.section}>
                <Text style={styles.sectionTitle}>Labour Details</Text>
                {dailyEntryData.labours.length > 0 ? (
                    dailyEntryData.labours.map((labour, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Contractor Name:</Text> {labour.contractorName}
                            </Text>
                            {labour.roles && labour.roles.map((role, roleIndex) => (
                                <View key={roleIndex}>
                                    <Text style={styles.detailText}>
                                        <Text style={styles.boldText}>Role:</Text> {role.roleName}
                                    </Text>
                                    <Text style={styles.detailText}>
                                        <Text style={styles.boldText}>Quantity:</Text> {role.quantity}
                                    </Text>
                                    <Text style={styles.detailText}>
                                        <Text style={styles.boldText}>Hours:</Text> {role.hours}
                                    </Text>
                                    <Text style={styles.detailText}>
                                        <Text style={styles.boldText}>Total Hours:</Text> {role.totalHours}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text style={styles.detailText}>No Labour Details Added</Text>
                )}
                 <TouchableOpacity
                        style={[styles.editButton, styles.smallButton]}
                        onPress={() => navigation.navigate("Daily75")}
                    >
                        <Text style={styles.editButtonText}>Edit Labour Details</Text>
                    </TouchableOpacity>
            </View>


            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visitor Details</Text>
                {dailyEntryData.visitors.length > 0 ? (
                    dailyEntryData.visitors.map((visitor, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Visitor Name:</Text> {visitor.visitorName}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Company:</Text> {visitor.company}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Quantity:</Text> {visitor.quantity}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Hours:</Text> {visitor.hours}
                            </Text>
                            <Text style={styles.detailText}>
                                <Text style={styles.boldText}>Total Hours:</Text> {visitor.totalHours}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.detailText}>No Visitor Details Added</Text>
                )}
                 <TouchableOpacity
                        style={[styles.editButton, styles.smallButton]}
                        onPress={() => navigation.navigate("Daily76")}
                    >
                        <Text style={styles.editButtonText}>Edit Visitor Details</Text>
                    </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.detailText}>{dailyEntryData.description || "No description provided."}</Text>
                 <TouchableOpacity style={styles.editButton} onPress={() => handleEdit("description")}>
                        <Text style={styles.editButtonText}>Edit Description</Text>
                    </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
    header: { flexDirection: "row", alignItems: "center", padding: 10 },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, color: "black" },
    container: { flexGrow: 1, padding: 20 },
    section: { marginBottom: 20, padding: 15, backgroundColor: "white", borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333" },
    detailText: { fontSize: 16, color: "#555", marginBottom: 5 },
    boldText: { fontWeight: "bold" },
    submitButton: { backgroundColor: "#486ECD", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
    submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    logoContainer: { alignItems: "center", marginTop: 10 },
    logoImage: { width: 150, height: 150, resizeMode: "contain", borderRadius: 10, marginTop: 10 },

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
    // logoList: {
    //     maxHeight: 200,
    // },
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
        editButton: {
        backgroundColor: "#486ECD",
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
      },
      editButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
      },
       itemContainer: {
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
      },
      errorText: {
        color: "red",
        marginTop: 5,
    },
});

export default DailyEntryPreview;