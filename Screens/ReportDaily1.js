import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';

const ReportDaily1 = ({ navigation }) => {
  const [form, setForm] = useState({
    projectName: '',
    client: '',
    projectManager: '',
    projectNumber: '',
    siteInspector: '',
    contractAdministrator: '',
    contractNumber: '',
    supportCA: '',
    date: '',
    tempHigh: '',
    tempLow: ''
  });

  const [showTempHighPicker, setShowTempHighPicker] = useState(false);
  const [showTempLowPicker, setShowTempLowPicker] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.date;
    setShowDatePicker(false);
    setForm({ ...form, date: currentDate.toLocaleDateString() });
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="#707070" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Daily Entries</Text>
      </View>
      <Text style={styles.headerText}>Enter Project Details</Text>
      <View style={styles.inputContainer}>
        {['Project Name', 'Client', 'Project Manager', 'Project Number', 'Site Inspector', 'Contract Administrator', 'Contract Number', 'Support CA'].map((label, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter"
              value={form[label.toLowerCase().replace(/ /g, '')]}
              onChangeText={(text) => handleInputChange(label.toLowerCase().replace(/ /g, ''), text)}
            />
          </View>
        ))}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Select"
              value={form.date}
              onChangeText={(text) => handleInputChange('date', text)}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <FontAwesome name="calendar" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Temperature</Text>
          <View style={styles.tempContainer}>
            <View style={styles.tempInputContainer}>
              <Text style={styles.tempLabel}>High</Text>
              <TouchableOpacity onPress={() => setShowTempHighPicker(true)} style={styles.pickerButton}>
                <Text style={styles.pickerText}>{form.tempHigh || 'Select'}</Text>
              </TouchableOpacity>
              {showTempHighPicker && (
                <ScrollView style={styles.pickerScroll}>
                  {[...Array(61).keys()].map((temp) => (
                    <TouchableOpacity key={temp} onPress={() => {
                      setForm({ ...form, tempHigh: temp.toString() });
                      setShowTempHighPicker(false);
                    }}>
                      <Text style={styles.pickerItem}>{temp}°C</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.tempInputContainer}>
              <Text style={styles.tempLabel}>Low</Text>
              <TouchableOpacity onPress={() => setShowTempLowPicker(true)} style={styles.pickerButton}>
                <Text style={styles.pickerText}>{form.tempLow || 'Select'}</Text>
              </TouchableOpacity>
              {showTempLowPicker && (
                <ScrollView style={styles.pickerScroll}>
                  {[...Array(61).keys()].map((temp) => (
                    <TouchableOpacity key={temp} onPress={() => {
                      setForm({ ...form, tempLow: temp.toString() });
                      setShowTempLowPicker(false);
                    }}>
                      <Text style={styles.pickerItem}>{temp}°C</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20
  },
  backButton: {
    padding: 5,
    marginRight: 10,
    marginRight: 10
  },
  titleText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF'
  },
  pickerText: {
    fontSize: 16,
    color: '#707070'
  },
  pickerScroll: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    marginVertical: 5
  },
  pickerItem: {
    padding: 10,
    fontSize: 16,
    color: '#000'
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tempInputContainer: {
    flex: 1,
    marginHorizontal: 5
  },
  tempLabel: {
    fontWeight: 'bold',
    color: '#707070',
    marginBottom: 5
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA'
  },
  headerText: {
    color: '#486ECD',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D1D1'
  },
  fieldContainer: {
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold',
    color: '#707070',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10
  },
  submitButton: {
    backgroundColor: '#486ECD',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default ReportDaily1;

