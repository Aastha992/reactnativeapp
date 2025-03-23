import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Daily109 = ({ route }) => {
  const navigation = useNavigation();
  const project = route?.params?.project || {};
  const defaultInspectors = ['Matt Friesen', 'Kathryn Murphy', 'Brooklyn Simmons'];
  const [inspectors, setInspectors] = useState(defaultInspectors);
  const [selectedInspector, setSelectedInspector] = useState(inspectors[0]);

  const loadInspectorData = (inspector) => {
    setSelectedInspector(inspector);
  };

  useEffect(() => {
    if (project.employees && project.employees.length > 0) {
      setInspectors(project.employees);
      loadInspectorData(project.employees[0]);
    }
  }, [project]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Daily108')}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerText}>Preview Details</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Client and Project Details */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Client Name</Text>
          <Text style={styles.detailText}>Associated Engineering</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>From Date</Text>
          <Text style={styles.detailText}>August 1, 2024</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>To Date</Text>
          <Text style={styles.detailText}>August 31, 2024</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Invoice To</Text>
          <Text style={styles.detailText}>Vincent</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Project Name</Text>
          <Text style={styles.detailText}>Zebra Mussels - Contract Admin</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Client PO/Reference Number</Text>
          <Text style={styles.detailText}>2017-5154</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Description</Text>
          <Text style={styles.detailText}>
            Contract Administration services by Thomas Vermeer for the Horgan/Clark WTP Zebra Mussel Project during the month of April 2024, specifically from April 1, 2024 up to and including May 3, 2024.
          </Text>
        </View>

        {/* Inspector Name & Their Details */}
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

        {/* Work Details Section */}
        <View style={styles.workDetailsContainer}>
          <Text style={styles.label}>Total Hours Worked</Text>
          <Text style={styles.detailText}>190</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Total Billable Hours</Text>
          <Text style={styles.detailText}>190</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Rate</Text>
          <Text style={styles.detailText}>190</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Sub Total</Text>
          <Text style={styles.detailText}>190</Text>
          <View style={styles.divider} />

          <Text style={styles.label}>Total</Text>
          <Text style={styles.detailText}>190</Text>
        </View>

        {/* Available Entries Section */}
        <View style={styles.entryContainer}>
          <Text style={styles.entryText}>2 Daily Dairy Entries</Text>
          <TouchableOpacity onPress={() => navigation.navigate('WorkFromHomeEntries')}>
            <MaterialIcons name="arrow-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Daily108')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('SuccessPopupInvoicing')}>
          <Text style={styles.saveButtonText}>Save & Download</Text>
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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  detailContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#486ECD',
    fontWeight: 'bold',
    marginVertical: 20,
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
    backgroundColor: '#D3D3D3',
    marginTop: 5,
  },
  activeUnderline: {
    backgroundColor: '#486ECD',
  },
  workDetailsContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginVertical: 1,
  },
  entryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#486ECD',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Daily109;
