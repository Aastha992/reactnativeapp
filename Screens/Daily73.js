import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation , useRoute } from '@react-navigation/native';
import { DailyEntryContext } from '../utils/DailyEntryContext';

const Daily73 = () => {
    const navigation = useNavigation();
    const route = useRoute(); 
    const { projectId, projectName, projectNumber, owner } = route.params || {};
    const { dailyEntryData, setDailyEntryData } = useContext(DailyEntryContext);

    useEffect(() => {
        if (route.params) {
            setDailyEntryData((prevData) => ({
                ...prevData,
                userId: route.params.userId || prevData.userId,
                projectId: route.params.projectId || prevData.projectId,
                projectName: route.params.projectName || prevData.projectName,
                projectNumber: route.params.projectNumber || prevData.projectNumber,
                ownerProjectManager: route.params.ownerProjectManager || prevData.ownerProjectManager,
                owner: route.params.owner || prevData.owner,
                location: route.params.location || prevData.location,
                tempHigh: route.params.tempHigh || prevData.tempHigh,
                tempLow: route.params.tempLow || prevData.tempLow,
                onShore: route.params.onShore || prevData.onShore,
                weather: route.params.weather || prevData.weather,
                workingDay: route.params.workingDay || prevData.workingDay,
                contractNumber: route.params.contractNumber || prevData.contractNumber,
                contractor: route.params.contractor || prevData.contractor,
                siteInspector: route.params.siteInspector || prevData.siteInspector,
                timeIn: route.params.timeIn || prevData.timeIn,
                timeOut: route.params.timeOut || prevData.timeOut,
                ownerContact: route.params.ownerContact || prevData.ownerContact,
                component: route.params.component || prevData.component,
            }));
        }
    }, [route.params]);
    
    useEffect(() => {
        console.log("Updated Daily Entry Data:", dailyEntryData);
    }, [dailyEntryData]);
    
    
    


    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimeInPicker, setShowTimeInPicker] = useState(false);
    const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);
    const [showTempHighDropdown, setShowTempHighDropdown] = useState(false);
    const [showTempLowDropdown, setShowTempLowDropdown] = useState(false);
    const temperatures = Array.from({ length: 141 }, (_, i) => `${i - 70}°C`); // Generate temperatures from -70°C to 70°C

    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            setDailyEntryData({ ...dailyEntryData, selectedDate: date.toLocaleDateString() });
        }
    };

    const onTimeChange = (event, selectedTime, setter) => {
        if (selectedTime) {
            setDailyEntryData({ ...dailyEntryData, [setter] : selectedTime.toLocaleTimeString()});
        }
    };

    // The active step, you can change this value to change which step is highlighted.
    const activeStep = 1;

    const handleSubmit = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/daily/daily-entry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dailyEntryData),
          });
    
          const result = await response.json();
    
          if (response.ok) {
            Alert.alert('Success', 'Daily entry saved successfully!', [
              { text: 'OK', onPress: () => handleNext() },
            ]);
          } else {
            throw new Error(result.message || 'Failed to save entry');
          }
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      };
    const handleNext = () => {
        navigation.navigate("Daily74", {
            projectId: dailyEntryData.projectId,
            projectName: dailyEntryData.projectName,
            projectNumber: dailyEntryData.projectNumber,
            owner: dailyEntryData.owner,
            tempHigh: dailyEntryData.tempHigh,
            tempLow: dailyEntryData.tempLow,
            location: dailyEntryData.location,
            onShore: dailyEntryData.onShore,
            weather: dailyEntryData.weather,
            workingDay: dailyEntryData.workingDay,
            reportNumber: dailyEntryData.reportNo,
            contractNumber: dailyEntryData.contractNumber,
            contractor: dailyEntryData.contractor,
            siteInspector: dailyEntryData.siteInspector,
            timeIn: dailyEntryData.timeIn,
            timeOut: dailyEntryData.timeOut,
            ownerContact: dailyEntryData.ownerContact,
            ownerProjectManager: dailyEntryData.ownerProjectManager,
            component: dailyEntryData.component,
        });
    };
    
  
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: '#fff',
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 50,
            marginBottom: 20,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 18,
            marginLeft: 10,
             fontFamily: 'Roboto',
            fontWeight: 'bold',
        },
        seeAll: {
            color: '#486ECD',
            fontSize: 16,
        },
        projectDetailsContainer: {
            marginBottom: 10,
        },
        projectDetailsTitle: {
            fontSize: 18,
            color: 'black',
            fontWeight: 'bold',
        },
        progressContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 20,
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
            borderColor: '#486ECD', // Highlight the active step
        },
        progressText: {
            fontSize: 16,
            color: '#000',
        },
        activeText: {
            color: '#486ECD', // Highlight the text color for active step
        },
        progressLine: {
            height: 2,
            flex: 1,
            backgroundColor: '#d3d3d3',
        },
        completedLine: {
            backgroundColor: '#486ECD', // Change color for completed lines
        },
        sectionTitle: {
            fontSize: 18,
            color: '#486ECD',
            marginBottom: 20,
            fontWeight: 'bold',
        },
        formGroup: {
            marginBottom: 15,
        },
        formGroupRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        formGroupHalf: {
            width: '48%',
        },
        label: {
            marginBottom: 5,
            fontSize: 16,
            color: '#000',
              fontFamily: 'Roboto',
              fontWeight: 'bold',
        },
        input: {
            borderWidth: 1,
            borderColor: '#000', // Set border color to black
            padding: 10,
            borderRadius: 5,
            fontSize: 16,
             fontFamily: 'Roboto',
        },
         inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 5,
        },
         inputRowInput: {
            flex: 1,
            padding: 10,
            fontSize: 16,
        },
          placeholderText: {
            color: 'grey',
            fontFamily: 'Roboto',
          },
           selectText: {
              color: 'black',
             fontFamily: 'Roboto',
          },
        nextButton: {
            backgroundColor: '#486ECD',
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginVertical: 30,
        },
        nextButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: '#ffffff',
            borderRadius: 10,
            padding: 20,
        },
        modalItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
        },
        modalItemText: {
            fontSize: 16,
              fontFamily: 'Roboto',
        },
        modalCloseButton: {
            marginTop: 20,
            backgroundColor: '#486ECD',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: 'center',
        },
        modalCloseButtonText: {
            color: '#ffffff',
            fontWeight: 'bold',
              fontFamily: 'Roboto',
        },
    });

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.navigate('DailyProjectList')}
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text style={styles.headerTitle}>Daily Entry</Text>
                    </TouchableOpacity>
                </View>

                {/* Project Details Section Header */}
                <View style={styles.projectDetailsContainer}>
                    <Text style={styles.projectDetailsTitle}>1. Project Details</Text>
                </View>

                {/* Connected Progress Indicators */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4, 5].map((step, index) => (
                        <React.Fragment key={index}>
                            {/* Progress Circle */}
                            <TouchableOpacity
                                onPress={() => {
                                    if (step === 2) navigation.navigate('Daily74');
                                    else if (step === 3) navigation.navigate('Daily75');
                                    else if (step === 4) navigation.navigate('Daily76');
                                    else if (step === 5) navigation.navigate('Daily78');
                                }}
                                style={[styles.progressCircle, step === activeStep ? styles.activeCircle : {}]}
                            >
                                <Text style={[styles.progressText, step === activeStep ? styles.activeText : {}]}>
                                    {step}
                                </Text>
                            </TouchableOpacity>
                            {/* Line between circles, except after the last circle */}
                            {index < 4 && (
                                <View style={[styles.progressLine, step < activeStep ? styles.completedLine : {}]} />
                            )}
                        </React.Fragment>
                    ))}
                </View>

                {/* Form */}
                <Text style={styles.sectionTitle}>Enter Project Details</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Date</Text>
                    <View style={[styles.inputRow, styles.blackBorder]}>
                        <TextInput
                            style={[styles.inputRowInput, dailyEntryData.selectedDate !== 'Select' ? styles.selectText : styles.placeholderText ]}
                            value={dailyEntryData.selectedDate || 'Select'}
                            editable={false}
                             placeholderTextColor='grey'
                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Ionicons name="calendar-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={dailyEntryData.selectedDate ? new Date(dailyEntryData.selectedDate) : new Date()}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>

                {/* Remaining Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        style={[styles.input, styles.blackBorder]}
                        placeholder="Enter"
                        placeholderTextColor="grey"
                        value={dailyEntryData.location}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, location: text })}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Onshore/Offshore</Text>
                    <TextInput
                        style={[styles.input, styles.blackBorder]}
                        placeholder="Enter"
                        placeholderTextColor="grey"
                        value={dailyEntryData.onShore}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, onShore: text })}
                    />
                </View>


                <View style={styles.formGroupRow}>
                    {/* Temp - High (°C) */}
                    <View style={styles.formGroupHalf}>
                        <Text style={styles.label}>Temp - High (°C)</Text>
                        <TouchableOpacity onPress={() => setShowTempHighDropdown(true)} style={[styles.inputRow, styles.blackBorder]}>
                            <Text style={[styles.inputRowInput, dailyEntryData.tempHigh !== 'Select' ? styles.selectText : styles.placeholderText]}>
                                {dailyEntryData.tempHigh || 'Select'}
                            </Text>
                            <Ionicons name="caret-down-outline" size={14} color="black" />
                        </TouchableOpacity>
                        <Modal visible={showTempHighDropdown} transparent animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={[styles.modalContent, { maxHeight: 200 }]}>
                                    <FlatList
                                        data={temperatures}
                                        keyExtractor={(item) => item}
                                        getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })}
                                        initialScrollIndex={70}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.modalItem}
                                                onPress={() => {
                                                    setDailyEntryData({ ...dailyEntryData, tempHigh: item });
                                                    setShowTempHighDropdown(false);
                                                }}
                                            >
                                                <Text style={styles.modalItemText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity onPress={() => setShowTempHighDropdown(false)} style={styles.modalCloseButton}>
                                        <Text style={styles.modalCloseButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    {/* Temp - Low (°C) */}
                    <View style={styles.formGroupHalf}>
                        <Text style={styles.label}>Temp - Low (°C)</Text>
                         <TouchableOpacity onPress={() => setShowTempLowDropdown(true)} style={[styles.inputRow, styles.blackBorder]}>
                            <Text style={[styles.inputRowInput, dailyEntryData.tempLow !== 'Select' ? styles.selectText : styles.placeholderText]}>
                                {dailyEntryData.tempLow || 'Select'}
                            </Text>
                            <Ionicons name="caret-down-outline" size={14} color="black" />
                        </TouchableOpacity>
                        <Modal visible={showTempLowDropdown} transparent animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={[styles.modalContent, { maxHeight: 200 }]}>
                                    <FlatList
                                        data={temperatures}
                                        keyExtractor={(item) => item}
                                        getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })}
                                        initialScrollIndex={70}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.modalItem}
                                                onPress={() => {
                                                    setDailyEntryData({ ...dailyEntryData, tempLow: item });
                                                    setShowTempLowDropdown(false);
                                                }}
                                            >
                                                <Text style={styles.modalItemText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity onPress={() => setShowTempLowDropdown(false)} style={styles.modalCloseButton}>
                                        <Text style={styles.modalCloseButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Weather Conditions</Text>
                    <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter"  placeholderTextColor="grey" value={dailyEntryData.weather}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, weather: text })} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Working Day</Text>
                   <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter" placeholderTextColor="grey" value={dailyEntryData.workingDay}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, workingDay: text })} />
                </View>
                <View style={styles.formGroup}>
                <Text style={styles.label}>Project Name</Text>
<TextInput
  style={styles.input}
  value={dailyEntryData.projectName} // Use value from context
  editable={false}  // Prevents users from editing
/>
</View>
<View style={styles.formGroup}>
<Text style={styles.label}>Project Number</Text>
<TextInput
  style={styles.input}
  value={dailyEntryData.projectNumber}
  editable={false}
/>
</View>

<View style={styles.formGroup}>
    <Text style={styles.label}>Owner</Text>
    <TextInput 
        style={styles.input} 
        value={dailyEntryData.owner || ""} 
        editable={false} 
        placeholder="Owner Not Available"
    />
</View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Report Number</Text>
                    <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter" placeholderTextColor="grey" value={dailyEntryData.reportNo}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, reportNumber: text })} />
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
                    <Text style={styles.label}>Site Inspector</Text>
                      <TextInput style={[styles.input, styles.blackBorder]} placeholder="Enter" placeholderTextColor="grey" value={dailyEntryData.siteInspector}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, siteInspector: text })} />
                </View>


                <View style={styles.formGroupRow}>
                    {/* Inspector In Time */}
                    <View style={styles.formGroupHalf}>
                        <Text style={styles.label}>Inspector In Time</Text>
                         <TouchableOpacity
                            onPress={() => setShowTimeInPicker(true)}
                            style={[styles.inputRow, styles.blackBorder]}
                        >
                            <Text
                                style={[
                                    styles.inputRowInput,
                                   dailyEntryData.timeIn !== 'Select' ? styles.selectText : styles.placeholderText
                                ]}
                            >
                                {dailyEntryData.timeIn || 'Select'}
                            </Text>
                            <Ionicons name="time-outline" size={24} color="#7f8c8" />
                        </TouchableOpacity>
                        {showTimeInPicker && (
                            <DateTimePicker
                                value={dailyEntryData.timeIn ? new Date(dailyEntryData.timeIn) : new Date()}
                                mode="time"
                                display="default"
                                onChange={(event, time) => {
                                    setShowTimeInPicker(false);
                                    onTimeChange(event, time, "timeIn");
                                }}
                            />
                        )}
                    </View>

                    {/* Inspector Out Time */}
                    <View style={styles.formGroupHalf}>
                        <Text style={styles.label}>Inspector Out Time</Text>
                        <TouchableOpacity
                            onPress={() => setShowTimeOutPicker(true)}
                            style={[styles.inputRow, styles.blackBorder]}
                        >
                            <Text
                                style={[
                                    styles.inputRowInput,
                                      dailyEntryData.timeOut !== 'Select' ? styles.selectText : styles.placeholderText
                                ]}
                            >
                                {dailyEntryData.timeOut || 'Select'}
                            </Text>
                            <Ionicons name="time-outline" size={24} color="#7f8c8" />
                        </TouchableOpacity>
                        {showTimeOutPicker && (
                            <DateTimePicker
                                value={dailyEntryData.timeOut ? new Date(dailyEntryData.timeOut) : new Date()}
                                mode="time"
                                display="default"
                                onChange={(event, time) => {
                                    setShowTimeOutPicker(false);
                                     onTimeChange(event, time, "timeOut");
                                }}
                            />
                        )}
                    </View>
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

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Component</Text>
                    <TextInput
                         style={[styles.input, styles.blackBorder]}
                         placeholder="Enter"
                        placeholderTextColor="grey"
                        value={dailyEntryData.component}
                        onChangeText={(text) => setDailyEntryData({ ...dailyEntryData, component: text })}
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


export default Daily73;