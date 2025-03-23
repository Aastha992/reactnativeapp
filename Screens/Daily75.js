import React, { useState, useCallback, useContext, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { DailyEntryContext } from "../utils/DailyEntryContext";

export default function Daily75() {
    const navigation = useNavigation();
    const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);

    // Initialize labours from context or with a single default labour object if no data exist.
    const [labours, setLabours] = useState(() => {
        if (dailyEntryData.labours && dailyEntryData.labours.length > 0) {
            return dailyEntryData.labours;
        } else {
            return [
                { contractorName: "", roles: [{ roleName: "", quantity: "", hours: "", totalHours: "" }] },
            ]
        }
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPicker, setCurrentPicker] = useState({
        labourIndex: null,
        roleIndex: null,
        field: null,
    });

    
    // Update the context whenever the labours state changes.
    useEffect(() => {
        setDailyEntryData((prevData) => ({
            ...prevData,
            labours, // Always update labours in the context
        }));
    }, [labours]);
    

    // Function to calculate total hours
    const calculateTotalHours = (quantity, hours) => {
        const quantityNum = parseFloat(quantity);
        const hoursNum = parseFloat(hours);
        if (!isNaN(quantityNum) && !isNaN(hoursNum)) {
            return (quantityNum * hoursNum).toString();
        }
        return "";
    };


    const addNewLabour = () => {
        setLabours((prevLabours) => [
          ...prevLabours,
          {
            contractorName: "",
              roles: [{ roleName: "", quantity: "", hours: "", totalHours: "" }],
          },
        ]);
    };


    const removeLabour = (labourIndex) => {
        setLabours((prevLabours) => prevLabours.filter((_, index) => index !== labourIndex));
    };

    const addNewRole = (labourIndex) => {
        setLabours((prevLabours) =>
            prevLabours.map((labour, index) => {
                if (index === labourIndex) {
                    return {
                        ...labour,
                        roles: [...labour.roles, { roleName: "", quantity: "", hours: "", totalHours: "" }],
                    };
                }
                return labour;
            })
        );
    };

    const removeRole = (labourIndex, roleIndex) => {
        setLabours((prevLabours) =>
            prevLabours.map((labour, index) =>
                index === labourIndex
                    ? {
                          ...labour,
                          roles: labour.roles.filter((_, i) => i !== roleIndex),
                    }
                    : labour
            )
        );
    };

    const updateLabour = useCallback((labourIndex, roleIndex, field, value) => {
         setLabours((prevLabours) =>
           prevLabours.map((labour, i) => {
              if (i === labourIndex) {
                 return {
                     ...labour,
                       roles: labour.roles.map((role, j) =>
                        j === roleIndex
                            ? {
                                 ...role,
                                  [field]: value,
                                    totalHours: calculateTotalHours(
                                      field === "quantity" ? value : role.quantity,
                                      field === "hours" ? value : role.hours
                                ),
                            }
                             : role
                      ),
                 };
                }
            return labour;
         })
     );
    },[setLabours, calculateTotalHours]);


    const updateContractorName = (labourIndex, value) => {
        setLabours((prevLabours) =>
            prevLabours.map((labour, index) =>
                index === labourIndex ? { ...labour, contractorName: value } : labour
            )
        );
    };

    const openPicker = (labourIndex, roleIndex, field) => {
        setCurrentPicker({ labourIndex, roleIndex, field });
        setModalVisible(true);
    };

    const selectValue = (value) => {
        const { labourIndex, roleIndex, field } = currentPicker;
        updateLabour(labourIndex, roleIndex, field, value);
        setModalVisible(false);
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
            labours,
          };
      
          console.log("Sending request:", requestBody);
      
          const response = await fetch("http://10.0.0.221:5001/api/daily/daily-entry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
      
          const result = await response.json();
      
          if (response.ok) {
            Alert.alert("Success", "Labour details saved successfully!", [
              { text: "OK", onPress: () => navigation.navigate("Daily76") },
            ]);
          } else {
            console.error("Server Error:", result);
            Alert.alert("Error", result.message || "Failed to save labour details");
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          Alert.alert("Error", "Network request failed. Please check your connection.");
        }
      };
      
      

    // Navigate to Next Screen
    const handleNext = () => {
        navigation.navigate("Daily76", { labours });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: '#ffffff',
        },
        scrollContentContainer: {
            paddingBottom: 100,
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 15,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 18,
            fontFamily: 'Roboto',
            marginLeft: 10,
            fontWeight: 'bold',
            color: '#333',
        },
        headerRightContainer: {
            alignItems: 'flex-end',
        },
        seeAll: {
            color: '#486ECD',
            fontSize: 16,
            fontFamily: 'Roboto',
        },
        projectDetailsContainer: {
            marginBottom: 8,
        },
        projectDetailsTitle: {
            fontSize: 18,
            fontFamily: 'Roboto',
            color: '#333',
            fontWeight: 'bold',
        },
        progressContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 15,
        },
        progressCircle: {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#e0e0e0',
            borderWidth: 2,
            borderColor: '#d3d3d3',
            alignItems: 'center',
            justifyContent: 'center',
        },
        activeCircle: {
            borderColor: '#486ECD',
        },
        completedCircle: {
            borderColor: '#486ECD',
        },
        progressText: {
            fontSize: 16,
            fontFamily: 'Roboto',
            color: '#000',
        },
        activeText: {
            color: '#486ECD',
        },
        completedText: {
            color: '#486ECD',
        },
        progressLine: {
            height: 2,
            flex: 1,
            backgroundColor: '#d3d3d3',
        },
        completedLine: {
            backgroundColor: '#486ECD',
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: 'Roboto',
            color: '#486ECD',
            marginBottom: 15,
        },
        formGroupOuterBoxWithBorder: {
            borderWidth: 1,
            borderColor: '#d3d3d3',
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        formGroup: {
            marginBottom: 8,
        },
        reducedSpacing: {
          marginBottom: 5,
        },
        roleNameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        roleInput: {
            flex: 1,
             borderWidth: 1,
            borderColor: 'black',
            borderRadius: 8,
            padding: 10,
            fontSize: 16,
            backgroundColor: "#ffffff",
        },
       roleRow: {
           flexDirection: "row",
           alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
         },

        roleNameInput: {
            flex: 1,
            marginRight: -4,
        },
        smallerInputSize: {
            flex: 0.75,
        },
        innerLightGreyBox: {
             backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 10,
        },
        addRemoveIconContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
        },
        plusIconContainer: {
            marginLeft: 10,
        },
        formGroupRowAligned: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        formGroupEqualPickerAligned: {
            flex: 1,
             marginHorizontal: 5,
        },
         equalInputSize: {
           flex: 1,
             marginHorizontal: 5,
        },
        label: {
            marginBottom: 4,
            fontSize: 16,
            fontFamily: 'Roboto',
            color: '#333',
            fontWeight: '500',
        },
        dropdownButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: '#d3d3d3',
            borderRadius: 8,
            backgroundColor: '#ffffff',
        },
        selectedDropdown: {
            paddingRight: 40,
        },
        dropdownText: {
            fontSize: 16,
            color: '#000',
            flex: 1,
             fontFamily: 'Roboto',
        },
        placeholderText: {
            color: 'grey',
               fontFamily: 'Roboto',
        },
        selectedText: {
            color: 'black',
               fontFamily: 'Roboto',
        },
        dropdownIcon: {
            marginLeft: 'auto',
        },
        input: {
            borderWidth: 1,
            borderColor: '#d3d3d3',
            padding: 10,
            borderRadius: 8,
            fontSize: 16,
            fontFamily: 'Roboto',
            backgroundColor: '#ffffff',
        },
         inputRowContainer: {
              flexDirection: 'row',
              alignItems: 'center',
                justifyContent: 'space-between',
          },
        totalHoursInput: {
            textAlign: 'center',
        },
        inputSpacingSmall: {
            marginBottom: 8,
        },
         deleteLabourButton: {
             marginLeft: 10,
            marginTop: 17,
         },
        addButtonContainerRight: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 15,
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#486ECD',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
        },
        addButtonText: {
            marginLeft: 5,
            color: '#486ECD',
              fontFamily: 'Roboto',
            fontSize: 16,
            fontWeight: 'bold',
        },
          deleteRoleButton: {
            position: 'absolute',
              top: 5,
            right: 5,
            zIndex: 1, // Ensure the minus icon is on top
        },
        plusIconContainer: {
            position: 'absolute',
            top: 5,
            right: 40, // Ensure the plus icon is placed on the left of the minus icon
            zIndex: 0,
        },
        navigationButtonsContainerBottom: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
        },
           previousButtonWhiteBlueBorder: {
            flex: 0.48,
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#486ECD',
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: 'center',
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
           shadowRadius: 5,
           elevation: 3,
       },
        nextButton: {
            flex: 0.48,
            backgroundColor: '#486ECD',
            paddingVertical: 10,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
        },
        navigationButtonText: {
            color: '#ffffff',
            fontSize: 18,
              fontFamily: 'Roboto',
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContentSmall: {
            width: '80%',
            maxheight: '50%',
            backgroundColor: '#ffffff',
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

                {/* Labour Details Section Header */}
                <View style={styles.projectDetailsContainer}>
                    <Text style={styles.projectDetailsTitle}>3. Labour Details</Text>
                </View>

                {/* Connected Progress Indicators */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4, 5].map((step, index) => (
                        <React.Fragment key={index}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (step === 1) navigation.navigate("Daily73");
                                    else if (step === 2) navigation.navigate("Daily74");
                                    else if (step === 4) navigation.navigate("Daily76");
                                     else if (step === 5) navigation.navigate("Daily78");
                                }}
                                style={[
                                    styles.progressCircle,
                                    step === 1 || step === 2 ? styles.completedCircle : {},
                                    step === 3 ? styles.activeCircle : {},
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressText,
                                        step === 1 || step === 2 ? styles.completedText : {},
                                        step === 3 ? styles.activeText : {},
                                    ]}
                                >
                                    {step}
                                </Text>
                            </TouchableOpacity>
                            {index < 4 && (
                                <View
                                    style={[
                                        styles.progressLine,
                                        step < 3 ? styles.completedLine : {},
                                    ]}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </View>

                {/* Labour Form Section */}
                <Text style={[styles.sectionTitle, { fontWeight: "bold" }]}>
                    Enter Labour Details
                </Text>

                {labours.map((labour, labourIndex) => (
                    <View key={labourIndex} style={styles.formGroupOuterBoxWithBorder}>
                        {/* Label for Equipment Number */}
                        <Text style={styles.label}>Labour - {labourIndex + 1}</Text>
                        <View
                            style={[
                                styles.formGroup,
                                styles.reducedSpacing,
                                styles.inputRowContainer,
                            ]}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Construction/Contractor Name</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.inputSpacingSmall,
                                        styles.blackBorder,
                                        styles.flexConsistentInput,
                                    ]}
                                    placeholder="Ex: Construction/Contractor Name"
                                    value={labour.contractorName}
                                    onChangeText={(text) =>
                                        updateContractorName(labourIndex, text)
                                    }
                                />
                            </View>
                            {/* Red "-" Icon for removing entry */}
                            {labourIndex > 0 && (
                                <TouchableOpacity
                                    onPress={() => removeLabour(labourIndex)}
                                    style={styles.deleteLabourButton}
                                >
                                    <Ionicons name="remove-circle" size={24} color="red" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {labour.roles.map((role, roleIndex) => (
                            <View
                                key={roleIndex}
                                style={[styles.formGroup, styles.reducedSpacing]}
                            >
                                <Text style={styles.label}>Role/Name</Text>
                                <View style={styles.roleRow}>
                                    <TextInput
                                        style={[styles.roleInput, styles.equalInputSize, styles.consistentInputSize]}
                                        placeholder="Ex: Safety Officer/Name"
                                        value={role.roleName}
                                        onChangeText={(text) =>
                                            updateLabour(labourIndex, roleIndex, "roleName", text)
                                        }
                                        placeholderTextColor="#999"
                                    />
                                    <View style={styles.addRemoveIconContainer}>
                                        <TouchableOpacity onPress={() => addNewRole(labourIndex)}>
                                            <Ionicons name="add-circle-outline" size={24} color="#486ECD" />
                                        </TouchableOpacity>
                                        {roleIndex > 0 && (
                                            <TouchableOpacity onPress={() => removeRole(labourIndex, roleIndex)} style={{ marginLeft: 10 }}>
                                                <Ionicons name="remove-circle" size={24} color="red" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.formGroupRowAligned}>
                                    <View
                                        style={[
                                            styles.formGroupEqualPickerAligned,
                                            styles.equalInputSize,
                                        ]}
                                    >
                                        <Text style={styles.label}>Quantity</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.input,
                                                styles.dropdownButton,
                                                styles.inputSpacingSmall,
                                                styles.blackBorder,
                                                styles.equalInputSize,
                                            ]}
                                            onPress={() =>
                                                openPicker(labourIndex, roleIndex, "quantity")
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownText,
                                                    role.quantity
                                                        ? styles.selectedText
                                                        : styles.placeholderText,
                                                ]}
                                            >
                                                {role.quantity || ""}
                                            </Text>
                                             { !role.quantity && <MaterialIcons
                                                name="arrow-drop-down"
                                                size={24}
                                                color="black"
                                                style={styles.dropdownIcon}
                                            />}
                                        </TouchableOpacity>
                                    </View>

                                    <View
                                        style={[
                                            styles.formGroupEqualPickerAligned,
                                            styles.equalInputSize,
                                        ]}
                                    >
                                        <Text style={styles.label}>Hours</Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.input,
                                                styles.dropdownButton,
                                                styles.inputSpacingSmall,
                                                styles.blackBorder,
                                                 styles.equalInputSize,
                                            ]}
                                            onPress={() => openPicker(labourIndex, roleIndex, "hours")}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownText,
                                                    role.hours
                                                        ? styles.selectedText
                                                        : styles.placeholderText,
                                                ]}
                                            >
                                                {role.hours || ""}
                                            </Text>
                                            { !role.hours && <MaterialIcons
                                                name="arrow-drop-down"
                                                size={24}
                                                color="black"
                                                style={styles.dropdownIcon}
                                            />}
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.formGroupEqualPickerAligned, styles.equalInputSize]}>
                                        <Text style={styles.label}>Total Hours</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                styles.inputSpacingSmall,
                                                styles.blackBorder,
                                                styles.equalInputSize,
                                            ]}
                                            value={
                                               role.hours && role.quantity
                                                  ? (role.hours * role.quantity).toString()
                                                  : ""
                                              }
                                            editable={false}
                                            placeholder="Ex: 10 hrs"
                                             placeholderTextColor="lightgrey"
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
                {/* Add New Labour Button */}
                <View style={styles.addButtonContainerRight}>
                    <TouchableOpacity style={styles.addButton} onPress={addNewLabour}>
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
                    style={styles.previousButtonWhiteBlueBorder}
                    onPress={() => navigation.navigate("Daily74")}
                >
                    <Text style={[styles.navigationButtonText, { color: "#486ECD" }]}>
                        Previous
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={[styles.navigationButtonText, { color: "white" }]}>
                        Next
                    </Text>
                </TouchableOpacity>
            </View>
       
               </KeyboardAvoidingView>
    );
}