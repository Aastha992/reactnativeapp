import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "../FormContext";
import DateTimePicker from '@react-native-community/datetimepicker';

const Hazard2 = ({ navigation, route }) => {
    const prevData = route.params?.formData || {}; 

    const { formData, updateFormData } = useForm();
    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const activeStep = 1; // Hazard2 is step 1

    useEffect(() => {
        if (formData.hazard2) {
            setSelectedDate(formData.hazard2.selectedDate || '');
            setTime(formData.hazard2.time || '');
            setLocation(formData.hazard2.location || '');
            setProjectName(formData.hazard2.projectName || '');
            setDescription(formData.hazard2.description || '');
        } else {
            
            setProjectName(prevData.projectName || '');
        }
    }, [formData.hazard2, prevData]);
    

    const handleSaveAndNext = () => {
        if (!selectedDate || !time || !location || !projectName || !description) {
            Alert.alert("Error", "Please fill in all fields before proceeding.");
            return;
        }
    
        const hazard2Data = { selectedDate, time, location, projectName, description };
    
        updateFormData('hazard2', hazard2Data); 
    
        
        navigation.navigate("Hazard3", { formData: { ...prevData, ...hazard2Data } });
    };
    
    

    const handleBack = () => {
        navigation.navigate("Hazard1"); 
    };
    
    
    

    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            setSelectedDate(`${year}-${month}-${day}`); // YYYY-MM-DD format
        }
    };
    
    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const hours = String(selectedTime.getHours()).padStart(2, "0");
            const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
            setTime(`${hours}:${minutes}`); // HH:MM format
        }
    };

    
    
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}
                            style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                            <Text style={styles.headerTitle}>Add JHA</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.projectDetailsContainer}>
                        <Text style={styles.projectDetailsTitle}>1. Project Details</Text>
                    </View>

                    <View style={styles.progressContainer}>
    {[1, 2, 3, 4].map((step, index) => (
        <React.Fragment key={index}>
            <TouchableOpacity
                onPress={() => {
                    if (step === 1) navigation.navigate("Hazard2", {
                        selectedDate,
                        time,
                        location,
                        projectName,
                        description,
                    });
                    else if (step === 2) navigation.navigate("Hazard3", {
                        selectedDate,
                        time,
                        location,
                        projectName,
                        description,
                    });
                    else if (step === 3) navigation.navigate("Hazard4", {
                        selectedDate,
                        time,
                        location,
                        projectName,
                        description,
                    });
                    else if (step === 4) navigation.navigate("Hazard5", {
                        selectedDate,
                        time,
                        location,
                        projectName,
                        description,
                    });
                }}
                style={[
                    styles.progressCircle,
                    step <= activeStep ? styles.activeCircle : {},
                ]}>
                <Text style={[
                    styles.progressText,
                    step <= activeStep ? styles.activeText : {},
                ]}>
                    {step}
                </Text>
            </TouchableOpacity>
            {index < 3 && (
                <View style={[
                    styles.progressLine,
                    step < activeStep ? styles.completedLine : {},
                ]}
                />
            )}
        </React.Fragment>
    ))}
</View>



                   <Text style={styles.sectionTitle}>Enter Project Details</Text>

                   <View style={styles.formGroup}>
                        <Text style={styles.label}>Date</Text>
                        <View style={[styles.inputRow, styles.blackBorder]}>
                            <TextInput
                                style={[styles.inputRowInput, { color: selectedDate === '' ? 'grey' : 'black' }]}
                                value={selectedDate || "Select"} // Shows 'Select' if no date is chosen
                                editable={false}
                            />
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <Ionicons name="calendar-outline" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange} // Calls onDateChange on date selection
                            />
                        )}
                    </View>

                <View style={styles.formGroup}>
                        <Text style={styles.label}>Time</Text>
                        <View style={[styles.inputRow, styles.blackBorder]}>
                            <TextInput
                                style={[styles.inputRowInput, { color: time === '' ? 'grey' : 'black' }]}
                                value={time || "Select"}
                                editable={false}
                            />
                            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                                <Ionicons name="time-outline" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {showTimePicker && (
                            <DateTimePicker
                                value={time ? new Date(`2024-01-01T${time}`) : new Date()}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}  // Make sure it calls the updated onTimeChange
                            />
                        )}
                    </View>

                   <View style={styles.formGroup}>
                        <Text style={styles.label}>Project Location</Text>
                        <TextInput
                            style={[styles.input, styles.blackBorder]}
                            placeholder="Enter"
                            onChangeText={setLocation}
                            value={location}
                            placeholderTextColor="#777"
                        />
                   </View>
                   <View style={styles.formGroup}>
                      <Text style={styles.label}>Project Name</Text>
                         <TextInput
                             style={[styles.input, styles.blackBorder]}
                           placeholder="Enter"
                            onChangeText={setProjectName}
                            value={projectName}
                           placeholderTextColor="#777"
                        />
                   </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Task Description</Text>
                       <TextInput
                            style={[styles.input, styles.blackBorder, styles.textArea]}
                            placeholder="Enter"
                            multiline
                            onChangeText={setDescription}
                            value={description}
                            placeholderTextColor="#777"
                        />
                  </View>

                    <TouchableOpacity
                         style={styles.nextButton}
                        onPress={handleSaveAndNext}>
                         <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                    <View style={{marginBottom: 100}} />
              </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

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
        marginTop: 50,
        marginBottom: 10,
    },
    backButton: {
         flexDirection: "row",
        alignItems: "center",
   },
   headerTitle: {
      fontSize: 18,
       marginLeft: 10,
        fontWeight: "bold",
   },
    projectDetailsContainer: {
       marginBottom: 5,
    },
    projectDetailsTitle: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
       marginVertical: 20,
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
    progressText: {
       fontSize: 16,
      color: "#000",
   },
   activeText: {
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
        color: "#486ECD",
       marginBottom: 10,
        fontWeight: "bold",
   },
    formGroup: {
        marginBottom: 15,
  },
  label: {
       marginBottom: 5,
       fontSize: 16,
       color: "#000",
    },
    input: {
        borderWidth: 1,
       borderColor: "#000",
         padding: 10,
       borderRadius: 5,
        fontSize: 16,
    },
   inputRow: {
       flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#000",
       borderRadius: 5,
   },
    inputRowInput: {
       flex: 1,
        padding: 10,
      fontSize: 16,
   },
    textArea: {
        height: 80,
   },
    nextButton: {
        backgroundColor: "#486ECD",
       paddingVertical: 15,
         borderRadius: 10,
       alignItems: "center",
         marginVertical: 90,
   },
   nextButtonText: {
        color: "#fff",
        fontSize: 18,
      fontWeight: "bold",
   },
     saveButton: {
         backgroundColor: "#486ECD",
       paddingVertical: 15,
        borderRadius: 10,
         alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 20,
    },
  saveButtonText: {
       color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
   },
 });

 export default Hazard2;