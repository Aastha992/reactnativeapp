import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchProjectDetails } from '../utils/mockApi'; // Import the mock API

const Daily108 = ({ route }) => {
  const navigation = useNavigation();
  
  const defaultInspectors = ['Matt Friesen', 'Kathryn Murphy', 'Brooklyn Simmons'];
  const [inspectors, setInspectors] = useState(defaultInspectors);
  const [selectedInspector, setSelectedInspector] = useState(inspectors[0]);
  const [project, setProject] = useState({});

  const [totalHours, setTotalHours] = useState('');
  const [billableHours, setBillableHours] = useState('');
  const [rate, setRate] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [total, setTotal] = useState('');

  const totalHoursRef = useRef(null);
  const billableHoursRef = useRef(null);
  const rateRef = useRef(null);
  const subTotalRef = useRef(null);
  const totalRef = useRef(null);

  const loadInspectorData = (inspector, hoursData) => {
    setSelectedInspector(inspector);
    setTotalHours(hoursData.totalHours);
    setBillableHours(hoursData.billableHours);
    setRate(hoursData.rate);
    setSubTotal(hoursData.subTotal);
    setTotal(hoursData.total);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjectDetails(); // Correct function call
        setProject(data);
        setInspectors(data.employees);
        loadInspectorData(data.employees[0], data.defaultHours);
      } catch (error) {
        console.error('Error fetching project details:', error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Daily104')}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerText}>View Invoice Details</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Inspector Name & Their Details</Text>

      {/* Horizontal Scroll for Inspector Names */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nameScroll}>
        {inspectors.map((name, index) => (
          <TouchableOpacity key={index} onPress={() => loadInspectorData(name)} style={styles.nameContainer}>
            <Text style={[styles.nameText, selectedInspector === name && styles.activeNameText]}>
              {name}
            </Text>
            <View style={[styles.underline, selectedInspector === name && styles.activeUnderline]} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Details Section */}
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 30 }]}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Total Hours Worked</Text>
          <View style={styles.detailRow}>
            <TextInput
              ref={totalHoursRef}
              style={styles.input}
              value={totalHours}
              onChangeText={setTotalHours}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => totalHoursRef.current && totalHoursRef.current.focus()}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Total Billable Hours</Text>
          <View style={styles.detailRow}>
            <TextInput
              ref={billableHoursRef}
              style={styles.input}
              value={billableHours}
              onChangeText={setBillableHours}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => billableHoursRef.current && billableHoursRef.current.focus()}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Rate</Text>
          <View style={styles.detailRow}>
            <TextInput
              ref={rateRef}
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => rateRef.current && rateRef.current.focus()}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Sub Total</Text>
          <View style={styles.detailRow}>
            <TextInput
              ref={subTotalRef}
              style={styles.input}
              value={subTotal}
              onChangeText={setSubTotal}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => subTotalRef.current && subTotalRef.current.focus()}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Total</Text>
          <View style={styles.detailRow}>
            <TextInput
              ref={totalRef}
              style={styles.input}
              value={total}
              onChangeText={setTotal}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => totalRef.current && totalRef.current.focus()}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Softer Yellow Entry Section with Brighter Border */}
        <View style={styles.entryContainer}>
          <Text style={styles.entryText}>2 Daily Dairy Entries</Text>
          <TouchableOpacity onPress={() => navigation.navigate('WorkFromHomeEntries')}>
            <MaterialIcons name="arrow-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={styles.previousButton}
  onPress={() => navigation.navigate('Daily104')} // Ensure this doesn’t trigger state changes
>
  <Text style={styles.buttonText}>Previous</Text>
</TouchableOpacity>

        <TouchableOpacity style={styles.previewButton} onPress={() => navigation.navigate('Daily109')}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 45,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#486ECD',
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  nameScroll: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  nameContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  nameText: {
    fontSize: 16,
    color: '#333',
  },
  activeNameText: {
    color: '#486ECD',
    fontWeight: 'bold',
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#D3D3D3', // Grey color for unselected
    marginTop: 5,
  },
  activeUnderline: {
    backgroundColor: '#486ECD', // Blue color for selected
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFD700', // Brighter yellow border
    backgroundColor: '#FFF8E1', // Softer yellow background
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  entryText: {
    fontSize: 14,
    color: '#000', // Black text color for readability
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  previousButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#486ECD',
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#486ECD',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#486ECD',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Daily108;
