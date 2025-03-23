// DailyEntry1.js
import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DailyEntryContext } from '../utils/DailyEntryContext';

const BASE_URL = "http://10.0.0.221:5001";

const DailyEntry1 = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    /** Store Route Params in Context */
    useEffect(() => {
        if (route.params) {
            console.log('DailyEntry1 - route.params:', route.params); // ADD THIS LINE
            setDailyEntryData((prevData) => ({
                ...prevData,
                projectId: route.params.projectId || prevData.projectId,
                projectName: route.params.projectName || prevData.projectName,
                projectNumber: route.params.projectNumber || prevData.projectNumber,
                owner: route.params.owner || prevData.owner,
                ownerProjectManager: route.params.ownerProjectManager || prevData.ownerProjectManager,
                reportNumber: route.params.reportNumber || prevData.reportNumber,
                contractNumber: route.params.contractNumber || prevData.contractNumber,
                contractor: route.params.contractor || prevData.contractor,
                ownerContact: route.params.ownerContact || prevData.ownerContact,
                userId: route.params.userId || prevData.userId,
            }));
        }
    }, [route.params]);


    /** Log Updated Context */
    useEffect(() => {
        console.log("Updated Daily Entry Data:", dailyEntryData);
    }, [dailyEntryData]);

    /** Date Picker Function */
    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const formattedDate = date.toISOString().split("T")[0]; // Use ISO format
            setSelectedDate(formattedDate);
            setDailyEntryData({ ...dailyEntryData, selectedDate: formattedDate });
        }
    };

    /** Handle Next Navigation */
    const handleNext = () => {
        if (!selectedDate) {
            Alert.alert("Error", "Please select a date before proceeding.");
            return;
        }

        console.log('DailyEntry1 - dailyEntryData before navigation:', dailyEntryData); // ADD THIS LINE

        navigation.navigate("DailyEntry3", {
            ...dailyEntryData,
            selectedDate,
        });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView style={styles.container}>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.header} onPress={() => navigation.navigate("DiaryProjectList")}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text style={styles.headerText}>Daily Diary</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {[1, 2].map((step, index) => (
                        <React.Fragment key={index}>
                            <TouchableOpacity onPress={() => step === 2 && navigation.navigate("DailyEntry3")}>
                                <View style={[styles.progressCircle, step === 1 ? styles.activeCircle : styles.lightGreyCircle]}>
                                    <Text style={[styles.progressText, step === 1 ? styles.activeText : styles.blackText]}>{step}</Text>
                                </View>
                            </TouchableOpacity>
                            {index < 1 && <View style={[styles.progressLine, step === 1 ? styles.completedLine : styles.lightGreyLine]} />}
                        </React.Fragment>
                    ))}
                </View>

                {/* Form */}
                <Text style={styles.sectionTitle}>Enter Project Details</Text>

                {/* Date Picker */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity style={[styles.dateInputContainer, styles.blackBorder]} onPress={() => setShowDatePicker(true)}>
                        <Text style={[styles.dateInputText, selectedDate ? styles.selectText : styles.placeholderText]}>
                            {selectedDate || "Select"}
                        </Text>
                        <Ionicons name="calendar-outline" size={24} color="black" />
                    </TouchableOpacity>
                    {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onDateChange} />}
                </View>

                {/*Pre-filled Fields */}
                <View style={styles.formGroup}><Text style={styles.label}>Project Name</Text>
                    <TextInput style={styles.input} value={dailyEntryData.projectName} editable={false} />
                </View>
                <View style={styles.formGroup}><Text style={styles.label}>Project Number</Text>
                    <TextInput style={styles.input} value={dailyEntryData.projectNumber} editable={false} />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Owner</Text>
                    <TextInput
                        style={styles.input}
                        value={dailyEntryData.owner || ""}
                        editable={false} // Make it editable
                        placeholder="Owner Not Available"
                        onChangeText={(text) => { // ADD THIS LINE
                            console.log('DailyEntry1 - Owner TextInput onChangeText:', text);
                            setDailyEntryData({ ...dailyEntryData, owner: text });
                        }}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Report Number</Text>
                    <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter" placeholderTextColor="grey" value={dailyEntryData.reportNo}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, reportNumber: text })}
                    />
                </View>


                <View style={styles.formGroup}>
                    <Text style={styles.label}>Contract Number</Text>
                    <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter" placeholderTextColor="grey" value={dailyEntryData.contractNumber}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, contractNumber: text })} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Contractor</Text>
                    <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter" placeholderTextColor="grey" value={dailyEntryData.contractor}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, contractor: text })} />
                </View>



                <View style={styles.formGroup}>
                    <Text style={styles.label}>Owner Contact</Text>
                    <TextInput
                        style={[styles.input, styles.blackBorder]}
                        placeholder="Enter"
                        placeholderTextColor="grey"
                        value={dailyEntryData.ownerContact}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, ownerContact: text })}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Owner Project Manager</Text>
                    <TextInput
                        style={[styles.input, styles.blackBorder]}
                        placeholder="Enter"
                        placeholderTextColor="grey"
                        value={dailyEntryData.ownerProjectManager}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, ownerProjectManager: text })}
                    />
                </View>


                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 22,
        fontFamily: "Roboto",
        fontWeight: "bold",
        marginLeft: 10,
        color: "#333",

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
        borderWidth: 2,
        borderColor: "#d3d3d3",
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    activeCircle: {
        backgroundColor: "#d3d3d3",
        borderColor: "#486ECD",
    },
    lightGreyCircle: {
        backgroundColor: "#d3d3d3",
        borderColor: "#d3d3d3",
    },
    progressText: {
        fontSize: 16,
        color: "#000",
        fontFamily: "Roboto",
    },
    activeText: {
        color: "#486ECD",
    },
    blackText: {
        color: "#000",
    },
    progressLine: {
        height: 2,
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    completedLine: {
        backgroundColor: "#486ECD",
    },
    lightGreyLine: {
        backgroundColor: "#d3d3d3",
    },
    sectionTitle: {
        fontSize: 18,
        color: "#486ECD",
        marginBottom: 20,
        fontWeight: "bold",
    },

    title: {
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: "#486ECD",
        marginBottom: 15,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#333",
        marginBottom: 4,
        fontWeight: "600",
    },

    input: {
        height: 45,
        fontFamily: "Roboto",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 16,
        color: "#000000",
    },
    dateInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        fontFamily: "Roboto",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    dateInputText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontFamily: "Roboto",
    },
    icon: {
        marginLeft: 8,
    },
    nextButton: {
        backgroundColor: "#486ECD",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Roboto",
        fontWeight: "bold",
    },
    blackBorder: {
        borderColor: "black",
    },
    whiteBackground: {
        backgroundColor: "#ffffff",
    },
});

export default DailyEntry1;