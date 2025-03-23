import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";

const Daily104 = ({ navigation }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [clientName, setClientName] = useState('');
    const [consultantProjectManager, setConsultantProjectManager] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectNumber, setProjectNumber] = useState('');
    const [description, setDescription] = useState('');

    const handleFromDateChange = (event, selectedDate) => {
        setShowFromDatePicker(Platform.OS === 'ios' ? false : false);
        if (selectedDate) {
            setFromDate(selectedDate);
            if (Platform.OS === 'android') {
                setShowFromDatePicker(false);
            }
        }
    };

    const handleToDateChange = (event, selectedDate) => {
        setShowToDatePicker(Platform.OS === 'ios' ? false : false);
        if (selectedDate) {
            setToDate(selectedDate);
            if (Platform.OS === 'android') {
                setShowToDatePicker(false);
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleNext = () => {
         navigation.navigate('Daily108'); 
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => navigation.navigate("Invoicing")}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text
                            style={[styles.headerText, { fontWeight: "bold", marginLeft: 5 }]}>
                            View Invoice Details
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.expenseDetailsTitle}>View Invoice Details</Text>
                <View style={styles.card}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Client</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Enter"
                            value={clientName}
                            onChangeText={setClientName}
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.dateContainer}>
                        <View style={styles.dateField}>
                            <Text style={styles.label}>From Date</Text>
                            <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowFromDatePicker(true)}>
                                <Text style={styles.dateInputText}>
                                    {fromDate ? formatDate(fromDate) : 'Select'}
                                </Text>
                                <Ionicons name="calendar" size={24} color="black" style={styles.icon} />
                            </TouchableOpacity>
                            {showFromDatePicker && (
                                <DateTimePicker
                                    value={fromDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleFromDateChange}
                                />
                            )}
                        </View>
                        <View style={styles.dateField}>
                            <Text style={styles.label}>To Date</Text>
                            <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowToDatePicker(true)}>
                                <Text style={styles.dateInputText}>
                                    {toDate ? formatDate(toDate) : 'Select'}
                                </Text>
                                <Ionicons name="calendar" size={24} color="black" style={styles.icon} />
                            </TouchableOpacity>
                            {showToDatePicker && (
                                <DateTimePicker
                                    value={toDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleToDateChange}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Consultant Project Manager</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Enter"
                            value={consultantProjectManager}
                            onChangeText={setConsultantProjectManager}
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Project Name</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Enter"
                            value={projectName}
                            onChangeText={setProjectName}
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Project Number</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Enter"
                            value={projectNumber}
                            onChangeText={setProjectNumber}
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.inputBox, styles.descriptionInput]}
                            placeholder="Enter"
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 7,
    },
    headerContainer: {
        paddingTop: 45,
        paddingBottom: 10,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: -10,
    },
    headerText: {
        fontSize: 18,
        marginLeft: 5,
        fontWeight: "500",
    },
    expenseDetailsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#486ECD",
        marginBottom: 10,
        paddingLeft: 0,
        marginTop: 10,
    },
    card: {
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
        shadowColor: 'transparent',
        elevation: 0,
        marginTop: 15,
    },
    field: {
        marginBottom: 12,
        paddingLeft: 15,
        paddingRight: 15,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingLeft: 15,
        paddingRight: 15,
    },
    dateField: {
        width: '48%',
    },
    dateInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 45,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
    },
    dateInputText: {
        flex: 1,
        fontSize: 16,
        color: '#000'
    },
    icon: {
        marginLeft: 8,
    },
    inputBox: {
        height: 45,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginBottom: 12,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: "#000",
        marginBottom: 4,
    },
    nextButton: {
        backgroundColor: '#486ECD',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        margin: 16,
        marginTop: 30,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: "600",
    },
});

export default Daily104;