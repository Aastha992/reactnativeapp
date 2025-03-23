import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Dailyabc = ({ navigation, route }) => {
  // Retrieve dynamic visitor details and project name from route parameters
  const projectName = route.params?.projectName || 'Default Project Name';
  const visitorDetails = route.params?.visitorDetails || [
    { name: 'John Doe', company: 'ABC Corp', hours: 8 },
    { name: 'Jane Smith', company: 'XYZ Ltd', hours: 6 },
    { name: 'Sam Wilson', company: '123 Industries', hours: 7 },
    { name: 'Linda Johnson', company: '456 Enterprises With A Long Name', hours: 5 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Daily83')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{projectName} Visitor Details</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>View Visitor Details</Text>

      {/* Visitor List */}
      <View style={styles.detailsContainer}>
        {visitorDetails.map((item, index) => (
          <View key={index} style={styles.detailItem}>
            <Text style={styles.visitorName}>{item.name}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.companyText}>{item.company}</Text>
              <Text style={styles.hoursText}>Number of Hours: {item.hours}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
  title: {
    fontSize: 18,
    color: '#486ECD',
    fontWeight: '500',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  detailItem: {
    marginBottom: 16,
  },
  visitorName: {
    fontSize: 16,
    color: '#486ECD',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  companyText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  hoursText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
});

export default Dailyabc;
