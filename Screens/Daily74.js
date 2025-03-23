import React, { useState, useEffect, useCallback, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Modal,
    FlatList,
	KeyboardAvoidingView, Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DailyEntryContext } from "../utils/DailyEntryContext";

export default function Daily74() {
    const navigation = useNavigation();
    const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentPicker, setCurrentPicker] = useState("");
    const [equipments, setEquipments] = useState(() => {
        // Initialize with a default object if no equipments exist.
        if (dailyEntryData.equipments && dailyEntryData.equipments.length > 0) {
            return dailyEntryData.equipments;
        } else {
            return [{ id: 1, name: "", quantity: "", hours: "", totalHours: "" }];
        }
    });
    const [currentEquipmentIndex, setCurrentEquipmentIndex] = useState(null);


    // Update the context whenever the equipments state changes.
    useEffect(() => {
        setDailyEntryData(prevData => ({
            ...prevData,
            equipments //Ensures that equipment data is stored in the context
        }));
    }, [equipments, setDailyEntryData]); // Run whenever `equipments` changes
    
      


    // Function to calculate total hours
    const calculateTotalHours = (quantity, hours) => {
        const quantityNum = parseFloat(quantity);
        const hoursNum = parseFloat(hours);
        if (!isNaN(quantityNum) && !isNaN(hoursNum)) {
            return (quantityNum * hoursNum).toString();
        }
        return "";
    };


    // Function to open the picker (modal) for quantity or hours
    const openPicker = (pickerType, index) => {
        setCurrentPicker(pickerType);
        setCurrentEquipmentIndex(index);
        setModalVisible(true);
    };
    // Callback function to handle value selection from the modal.
    const selectValue = useCallback((value) => {
        if (currentPicker && currentEquipmentIndex !== null) {
            // Map over equipments and update the specific equipment at currentEquipmentIndex.
            setEquipments((prevEquipments) =>
                prevEquipments.map((equipment, index) => {
                    if (index === currentEquipmentIndex) {
                        return {
                            ...equipment,
                            [currentPicker]: value,
                            totalHours: calculateTotalHours(
                                currentPicker === "quantity" ? value : equipment.quantity,
                                currentPicker === "hours" ? value : equipment.hours
                            ),
                        };
                    }
                    return equipment;
                })
            );
        }
        setModalVisible(false); // Close the modal
    }, [currentEquipmentIndex, currentPicker, setEquipments, calculateTotalHours]);

    // Function to add new equipment entry.
    const addNewEquipment = () => {
        setEquipments((prevEquipments) => [
            ...prevEquipments,
            {
                id: prevEquipments.length + 1,
                name: "",
                quantity: "",
                hours: "",
                totalHours: "",
            },
        ]);
    };

    // Function to remove equipment entry based on id.
    const removeEquipment = (id) => {
        setEquipments((prevEquipments) => prevEquipments.filter(equipment => equipment.id !== id));
    };

    const handleSubmit = async () => {
        try {
          const userId = dailyEntryData?.userId;
          const projectId = dailyEntryData?.projectId;
      
          if (!userId || !projectId) {
            Alert.alert("Error", "Missing userId or projectId. Please check your data.");
            return;
          }
      
          const requestBody = {
            userId,
            projectId,
            equipments: equipments.map(e => ({
                equipmentName: e.name || "Unknown Equipment",
                quantity: e.quantity || "0",
                hours: e.hours || "0",
                totalHours: e.totalHours || "0"
            }))
        };
        
      
          console.log("Sending request:", requestBody);
      
          const response = await fetch("http://10.0.0.221:5001/api/daily/daily-entry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
      
          const result = await response.json();
      
          if (response.ok) {
            Alert.alert("Success", "Equipment details saved successfully!", [
              { text: "OK", onPress: () => navigation.navigate("Daily75") },
            ]);
          } else {
            console.error("Server Error:", result);
            Alert.alert("Error", result.message || "Failed to save equipment details");
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          Alert.alert("Error", "Network request failed. Please check your connection.");
        }
      };
      
    return (
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate("Daily72")}>
                        {/* Back button with an icon */}
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text style={styles.headerTitle}>Daily Entry</Text>
                    </TouchableOpacity>
                     <View style={styles.headerRightContainer}>
                        {/* See All button */}
                        {/* <TouchableOpacity>
              <Text style={styles.seeAll}>See All (5)</Text>
            </TouchableOpacity> */}
                    </View>
                </View>

                {/* Equipment Details Section Header */}
                <View style={styles.projectDetailsContainer}>
                    <Text style={styles.projectDetailsTitle}>2. Equipment Details</Text>
                </View>

                {/* Connected Progress Indicators */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4, 5].map((step, index) => (
                        <React.Fragment key={index}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (step === 1) navigation.navigate("Daily73");
                                    else if (step === 3) navigation.navigate("Daily75");
                                    else if (step === 4) navigation.navigate("Daily76");
                                    else if (step === 5) navigation.navigate("Daily78");
                                }}>
                                <View
                                    style={[
                                        styles.progressCircle,
                                        step === 1 ? styles.completedCircle : {},
                                        step === 2 ? styles.activeCircle : {},
                                    ]}>
                                    <Text
                                        style={[
                                            styles.progressText,
                                            step === 1 ? styles.completedText : {},
                                            step === 2 ? styles.activeText : {},
                                        ]}>
                                        {step}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {/* Line between progress circles, except after the last circle */}
                            {index < 4 && (
                                <View
                                    style={[
                                        styles.progressLine,
                                        step < 2 ? styles.completedLine : {},
                                    ]}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </View>

                {/* Form Section */}
                <Text style={[styles.sectionTitle, { fontWeight: "bold" }]}>
                    Enter Equipment Details
                </Text>

                {equipments.map((equipment, index) => (
                    <View key={equipment.id} style={styles.formGroupOuterBoxWithBorder}>
                        {/* Red '-' Icon to Remove Equipment */}
                        {index > 0 && (
                            <TouchableOpacity
                                onPress={() => removeEquipment(equipment.id)}
                                style={styles.deleteEquipmentButton}>
                                <Ionicons name="remove-circle" size={24} color="red" />
                            </TouchableOpacity>
                        )}

                        {/* Label for Equipment Number */}
                        <Text style={styles.label}>Equipment - {index + 1}</Text>

                        {/* Added extra space below for better readability */}
                        <Text style={{ marginBottom: 1 }}></Text>

                        {/* Equipment Name/Make/Model Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Equipment Name/Make/Model</Text>
                            <TextInput
                                style={[styles.input, styles.blackBorder]}
                                placeholder="Ex: CAT Backhoe Loader 430F21T"
                                value={equipment.name}
                                onChangeText={(text) =>
                                    setEquipments((prevEquipments) =>
                                        prevEquipments.map((eq, i) => {
                                            if (i === index) {
                                                return { ...eq, name: text };
                                            }
                                            return eq;
                                        })
                                    )
                                }
                            />
                        </View>

                        {/* Quantity, Hours, and Total Hours Inputs */}
                        <View style={styles.formGroupRowTemp}>
                            {/* Quantity Dropdown */}
                            <View style={styles.formGroupEqualPickerAligned}>
                                <Text style={styles.label}>Quantity</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.input,
                                        styles.dropdownButton,
                                        styles.inputSpacingSmall,
                                        { borderColor: "black" },
                                    ]}
                                    onPress={() => openPicker("quantity", index)}>
                                    <Text
                                        style={[
                                            styles.dropdownText,
                                            { color: equipment.quantity ? "black" : "grey" },
                                        ]}>
                                        {equipment.quantity || ""}
                                    </Text>
                                      { !equipment.quantity && <MaterialIcons
                                        name="arrow-drop-down"
                                        size={24}
                                        color="black"
                                        style={styles.dropdownIcon}
                                    />}
                                </TouchableOpacity>
                            </View>

                            {/* Hours Dropdown */}
                            <View style={styles.formGroupEqualPickerAligned}>
                                <Text style={styles.label}>Hours</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.input,
                                        styles.dropdownButton,
                                        styles.inputSpacingSmall,
                                        { borderColor: "black" },
                                    ]}
                                    onPress={() => openPicker("hours", index)}>
                                    <Text
                                        style={[
                                            styles.dropdownText,
                                            { color: equipment.hours ? "black" : "grey" },
                                        ]}>
                                        {equipment.hours || ""}
                                    </Text>
                                      { !equipment.hours && <MaterialIcons
                                        name="arrow-drop-down"
                                        size={24}
                                        color="black"
                                        style={styles.dropdownIcon}
                                    />}
                                </TouchableOpacity>
                            </View>

                            {/* Total Hours Input */}
                            <View style={styles.formGroupEqualPickerAligned}>
                                <Text style={styles.label}>Total Hours</Text>
                                <TextInput
                                    style={[styles.input, styles.whiteBox]}
                                    value={equipment.totalHours}
                                    editable={false}
                                    placeholderTextColor="lightgrey"
                                    placeholder="Ex: 10 hrs"
                                />
                            </View>
                        </View>
                    </View>
                ))}

                {/* Add New Equipment Button */}
                <View style={styles.addButtonContainerRight}>
                    <TouchableOpacity style={styles.addButton} onPress={addNewEquipment}>
                        <Ionicons name="add-circle-outline" size={24} color="#486ECD" />
                        <Text style={styles.addButtonText}>Add New Equipment</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Modal for Picker */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContentSmall, { maxHeight: "50%" }]}>
                        <FlatList
                            data={[...Array(25).keys()].map((item) => item + 1)}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => selectValue(item)}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={true}
                            style={{ maxHeight: 200 }}
                        />
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Navigation Buttons (Previous and Next) */}
            <View style={styles.navigationButtonsContainerBottom}>
                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={() => navigation.navigate("Daily73")}>
                    <Text style={styles.navigationButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() =>
                        navigation.navigate("Daily75")
                    }>
                    <Text style={[styles.navigationButtonText, { color: "white" }]}>
                        Next
                    </Text>
                </TouchableOpacity>
				</View>
        </KeyboardAvoidingView>
    );
}
   



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
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
        fontFamily: "Roboto",
        marginLeft: 10,
        fontWeight: "bold",
        color: "#333",
    },
    headerRightContainer: {
        alignItems: "flex-end",
    },
    seeAll: {
        color: "#486ECD",
        fontSize: 16,
        fontFamily: "Roboto",
    },
    scrollContentContainer: {
        paddingBottom: 100,
    },
    projectDetailsContainer: {
        marginBottom: 8,
    },
    projectDetailsTitle: {
        fontSize: 18,
        fontFamily: "Roboto",
        color: "#333",
        fontWeight: "bold",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 15,
    },
    progressCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#e0e0e0",
        borderWidth: 2,
        borderColor: "#d3d3d3",
        alignItems: "center",
        justifyContent: "center",
    },
    activeCircle: {
        borderColor: "#486ECD",
    },
    completedCircle: {
        borderColor: "#486ECD",
    },
    progressText: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#000",
    },
    activeText: {
        color: "#486ECD",
    },
    completedText: {
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
     sectionTitle: {
        fontSize: 18,
        fontFamily: "Roboto",
        color: "#486ECD",
        marginBottom: 15,
    },
    formGroupOuterBoxWithBorder: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    formGroup: {
        marginBottom: 8,
    },
      formGroupRowTemp:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
      },
    formGroupRowAligned: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
      formGroupEqualPickerAligned: {
        flex: 1,
        marginHorizontal: 5,
      },
    label: {
        marginBottom: 4,
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#333",
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#000", // Set border color to black
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        fontFamily: 'Roboto',
        backgroundColor: '#ffffff',
           color: '#000000'
    },
    lightGreyBox: {
        backgroundColor: "#f0f0f0",
           color:"#000000"
       },
    dropdownButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 8,
        backgroundColor: "#ffffff",
    },
    selectedDropdown: {
        paddingRight: 40,
    },
    dropdownText: {
        fontSize: 16,
        color: "#000",
        flex: 1,
           fontFamily: 'Roboto',
    },
    placeholderText: {
        color: "grey",
          fontFamily: 'Roboto',
    },
    selectedText: {
        color: "black",
         fontFamily: 'Roboto',
    },
    dropdownIcon: {
        marginLeft: "auto",
    },
    totalHoursInput: {
        textAlign: "center",
    },
    inputSpacingSmall: {
        marginBottom: 8,
    },
    deleteEquipmentButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
     addButtonContainerRight: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 15,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#486ECD",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    addButtonText: {
        marginLeft: 5,
        color: "#486ECD",
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: "bold",
    },
    navigationButtonsContainerBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    previousButton: {
        flex: 0.48,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#486ECD",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    nextButton: {
        flex: 0.48,
        backgroundColor: "#486ECD",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    navigationButtonText: {
        color: "#486ECD",
        fontSize: 18,
        fontFamily: 'Roboto',
        fontWeight: "bold",
    },
     modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContentSmall: {
        width: 250,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 10,
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 5,
         elevation: 3,
    },
     modalItem: {
           paddingVertical: 8,
           borderBottomWidth: 1,
           borderBottomColor: '#ddd',
        },
        modalItemText: {
          fontSize: 16,
          fontFamily: 'Roboto',
          textAlign: 'center',
     },
     closeButton: {
          marginTop: 10,
         alignItems: 'center',
     },
      closeButtonText: {
         color: '#486ECD',
           fontSize: 16,
            fontFamily: 'Roboto',
         fontWeight: 'bold',
      },
      blackBorder: {
         borderColor: 'black',
      },
});