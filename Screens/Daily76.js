import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { DailyEntryContext } from "../utils/DailyEntryContext";

export default function Daily76() {
  const navigation = useNavigation();
  const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);

  // Initialize visitors from context or with a default visitor object if no data exists
  const [visitors, setVisitors] = useState(() => {
    if (dailyEntryData.visitors && dailyEntryData.visitors.length > 0) {
      return dailyEntryData.visitors;
    } else {
      return [{ visitorName: "", company: "", quantity: "", hours: "", totalHours: "" }];
    }
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState({
    visitorIndex: null,
    field: null,
  });

  // Update the context whenever the visitors state changes
  useEffect(() => {
    setDailyEntryData((prevData) => ({
        ...prevData,
        visitors, // Always update visitors in the context
    }));
}, [visitors]);


  const addNewVisitor = () => {
    setVisitors((prevVisitors) => [
      ...prevVisitors,
      { visitorName: "", company: "", quantity: "", hours: "", totalHours: "" },
    ]);
  };

  const removeVisitor = (visitorIndex) => {
    setVisitors((prevVisitors) =>
      prevVisitors.filter((_, index) => index !== visitorIndex)
    );
  };

  const updateVisitor = (visitorIndex, field, value) => {
    setVisitors((prevVisitors) => {
      return prevVisitors.map((visitor, index) => {
        if (index === visitorIndex) {
          let updatedVisitor = { ...visitor, [field]: value };

          // Ensure visitorName is used correctly
          if (field === "name") {
            updatedVisitor.visitorName = value; // Convert "name" to "visitorName"
          }

          // Calculate totalHours if quantity or hours are updated
          if (field === "quantity" || field === "hours") {
            const quantity = parseInt(updatedVisitor.quantity || '0', 10);
            const hours = parseInt(updatedVisitor.hours || '0', 10);
            updatedVisitor.totalHours = (quantity * hours).toString();
          }

          return updatedVisitor;
        }
        return visitor;
      });
    });
  };

  const openPicker = (visitorIndex, field) => {
    setCurrentPicker({ visitorIndex, field });
    setModalVisible(true);
  };

  const selectValue = (value) => {
    const { visitorIndex, field } = currentPicker;
    if (visitorIndex !== null && field) {
      updateVisitor(visitorIndex, field, value.toString());
    }
    setModalVisible(false);
  };

  console.log("UserID before sending:", dailyEntryData.userId);
  console.log("ProjectID before sending:", dailyEntryData.projectId);

  const handleSubmit = async () => {
    try {
      const { userId, projectId, selectedDate, location } = dailyEntryData;

      //Ensure userId and projectId are present
      if (!userId || !projectId) {
        Alert.alert("Error", "Missing userId or projectId. Please try again.");
        return;
      }

      // Validate userId format (MongoDB ObjectId should be 24-character hex)
      const objectIdRegex = /^[a-fA-F0-9]{24}$/;
      if (!objectIdRegex.test(userId)) {
        console.error("Invalid userId format:", userId);
        Alert.alert("Error", "Invalid user ID format. Please contact support.");
        return;
      }

      //Ensure selectedDate and location are present
      if (!selectedDate || !location) {
        Alert.alert("Error", "Missing required fields: selectedDate or location.");
        return;
      }

      //Convert visitors array to match backend expectations
      const formattedVisitors = visitors.map(v => ({
        visitorName: v.visitorName || "", // Ensure visitorName is always used
        company: v.company,
        quantity: v.quantity,
        hours: v.hours,
        totalHours: v.totalHours
      }));

      const requestBody = {
        userId,
        projectId,
        selectedDate,
        location,
        visitors: formattedVisitors, // Include visitor details
      };

      console.log("Sending API Request:", requestBody);

      const response = await fetch("http://10.0.0.221:5001/api/daily/daily-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        navigation.navigate("Daily78");
      } else {
        console.error("Server Error:", result);
        Alert.alert("Error", result.message || "Failed to save visitor details");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Network request failed. Please check your connection.");
    }
  };

  const handlePrevious = () => {
    navigation.navigate("Daily75"); // Fix: Ensuring function exists
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
                        onPress={() => navigation.navigate("Daily74")}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text style={styles.headerTitle}>Daily Entry</Text>
                    </TouchableOpacity>
                    <View style={styles.headerRightContainer}>
                    </View>
                </View>

                {/* Visitor Details Section Header */}
                <View style={styles.projectDetailsContainer}>
                    <Text style={styles.projectDetailsTitle}>4. Visitor Details</Text>
                </View>

                {/* Step Indicator */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4, 5].map((step, index) => (
                        <React.Fragment key={index}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (step === 1)
                                        navigation.navigate("Daily73");
                                    else if (step === 2) navigation.navigate("Daily74");
                                    else if (step === 3) navigation.navigate("Daily75");
                                     else if (step === 5) navigation.navigate("Daily78");
                                }}
                                style={[
                                    styles.progressCircle,
                                    step <= 3 ? styles.completedCircle : {},
                                    step === 4 ? styles.activeCircle : {},
                                    step === 5 ? styles.lightGreyCircle : {}
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressText,
                                        step <= 3 ? styles.completedText : {},
                                        step === 4 ? styles.activeText : {},
                                            step === 5 ? styles.blackext: {}
                                    ]}
                                >
                                    {step}
                                </Text>
                            </TouchableOpacity>
                            {index < 4 && (
                                <View
                                    style={[
                                        styles.progressLine,
                                        step < 4
                                            ? styles.completedLine
                                            : step === 4
                                                ? styles.futureLine
                                                : {},
                                    ]}
                                />
                            )}
            </React.Fragment>
          ))}
        </View>

        {/* Visitor Form Section */}
        <Text style={[styles.sectionTitle, { fontWeight: "bold" }]}>
          Worked Visited By
        </Text>

        {visitors.map((visitor, visitorIndex) => (
  <View key={visitorIndex} style={styles.formGroupOuterBoxWithBorder}>
    {/* Visitor Heading */}
    <Text style={styles.visitorLabel}>Visitor - {visitorIndex + 1}</Text>

    <View
      style={[styles.formGroup, styles.reducedSpacing, styles.inputRowContainer]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Visitor Name/Role</Text>
        <TextInput
          style={[
            styles.input,
            styles.inputSpacingSmall,
            styles.blackBackground,
            styles.flexConsistentInput,
          ]}
          placeholder="Ex: Joe/Inspector"
          placeholderTextColor="grey"
          value={visitor.name}
          onChangeText={(text) => updateVisitor(visitorIndex, "name", text)}
        />
      </View>
      {/* Red "-" Icon for removing entry */}
      {visitorIndex > 0 && (
        <TouchableOpacity
          onPress={() => removeVisitor(visitorIndex)}
          style={styles.deleteLabourButton}
        >
          <Ionicons name="remove-circle" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>

    <View style={[styles.formGroup, styles.reducedSpacing]}>
      <Text style={styles.label}>Visitor's Company</Text>
      <TextInput
        style={[
          styles.input,
          styles.inputSpacingSmall,
          styles.blackBackground,
        ]}
        placeholder="Ex: Company's Name"
        placeholderTextColor="grey"
        value={visitor.company}
        onChangeText={(text) =>
          updateVisitor(visitorIndex, "company", text)
        }
      />
    </View>

    {/* Additional fields for Quantity, Hours, and Total Hours */}
    <View style={styles.formGroupRowAligned}>
      {/* Quantity */}
      <View
        style={[
          styles.formGroupEqualPickerAligned,
          styles.equalSizeBox,
        ]}
      >
        <Text style={styles.label}>Quantity</Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.dropdownButton,
            styles.inputSpacingSmall,
            styles.blackBackground,
          ]}
          onPress={() => openPicker(visitorIndex, "quantity")}
        >
          <Text style={styles.dropdownText}>{visitor.quantity || ""}</Text>
          {!visitor.quantity && (
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color="black"
              style={styles.dropdownIcon}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Hours */}
      <View
        style={[
          styles.formGroupEqualPickerAligned,
          styles.equalSizeBox,
        ]}
      >
        <Text style={styles.label}>Hours</Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.dropdownButton,
            styles.inputSpacingSmall,
            styles.blackBackground,
          ]}
          onPress={() => openPicker(visitorIndex, "hours")}
        >
          <Text style={styles.dropdownText}>{visitor.hours || ""}</Text>
          {!visitor.hours && (
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color="black"
              style={styles.dropdownIcon}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Total Hours */}
      <View
        style={[
          styles.formGroupEqualPickerAligned,
          styles.equalSizeBox,
        ]}
      >
        <Text style={styles.label}>Total Hours</Text>
        <TextInput
          style={[
            styles.input,
            styles.dropdownButton,
            { backgroundColor: "white" },
            styles.inputSpacingSmall,
          ]}
          value={visitor.totalHours || ""}
          editable={false}
          placeholder="Ex:10 Hrs"
          placeholderTextColor="lightgrey"
        />
      </View>
    </View>
  </View>
))}


        {/* Add New Visitor Button */}
        <View style={styles.addButtonContainerRight}>
          <TouchableOpacity style={styles.addButton} onPress={addNewVisitor}>
            <Ionicons name="add-circle-outline" size={24} color="#486ECD" />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {/* Padding to prevent button being hidden */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal for Picker */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContentSmall}>
            <FlatList
              data={[...Array(25).keys()].map((item) => item + 1)}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectValue(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: 200 }}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Navigation Buttons (Previous and Next) */}
<View style={styles.navigationButtonsContainerBottom}>
  <TouchableOpacity
    style={styles.previousButton}
    onPress={handlePrevious} // Use handlePrevious here
  >
    <Text style={styles.previousButtonText}>Previous</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.nextButton}
    onPress={handleSubmit} // Use handleSubmit here
  >
    <Text style={styles.nextButtonText}>Next</Text>
  </TouchableOpacity>
</View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  equalInputSize: {
    flex: 1,
    marginHorizontal: 5,
  },
  flexConsistentInput: {
    flex: 1,
    marginHorizontal: 5,
  },
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
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  lightGreyCircle: {
  borderColor: "#d3d3d3", // Light grey border
  backgroundColor: "#e0e0e0", // White background
},
blackText: {
  color: "#000000", // Black text
},

  activeCircle: {
    borderColor: "#486ECD",
  },
  completedCircle: {
    borderColor: "#486ECD",
  },
  futureCircle: {
    borderColor: "#e0e0e0",
  },
  darkGreyCircle: {
    borderColor: "#a9a9a9",
  },
  progressText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Roboto",
  },
  activeText: {
    color: "#486ECD",
  },
  completedText: {
    color: "#486ECD",
  },
  futureText: {
    color: "#e0e0e0",
  },
  darkGreyText: {
    color: "#a9a9a9",
  },
  progressLine: {
    height: 2,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  completedLine: {
    backgroundColor: "#486ECD",
  },
  futureLine: {
    backgroundColor: "#e0e0e0",
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
    visitorLabel: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#333",
        marginBottom: 10,
        fontWeight: "500",
    },
  formGroup: {
    marginBottom: 8,
  },
  reducedSpacing: {
    marginBottom: 5,
  },
  inputRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  equalSizeBox: {
    width: "100%",
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontFamily: "Roboto",
    color: "#333",
    fontWeight: "500",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  selectedDropdown: {
    paddingRight: 40,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "#000",
    flex: 1,
  },
  placeholderText: {
    color: "grey",
  },
  selectedText: {
    color: "black",
  },
  dropdownIcon: {
    marginLeft: "auto",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  totalHoursInput: {
    textAlign: "center",
  },
  inputSpacingSmall: {
    marginBottom: 8,
  },
  blackBackground: {
    backgroundColor: "#ffffff",
    color: "#000000",
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
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteLabourButton: {
    marginLeft: 10,
    marginTop: 17,
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
  previousButtonText: {
    color: "#486ECD",
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
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
  nextButtonText: {
    color: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 18,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  modalItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Roboto",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#486ECD",
    fontSize: 16,
    fontWeight: "bold",
  },
  blackBorder: {
    borderColor: "black",
  },
});