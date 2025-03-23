import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Daily89 = ({ navigation, route }) => {
  // Retrieve dynamic equipment details and project name from route parameters
  const projectName = route.params?.projectName || 'Default Project Name';
  const equipmentDetails = route.params?.equipmentDetails || [
    { name: 'TBM', quantity: 1, days: 5 },
    { name: 'Crawler Crane', quantity: 1, days: 5 },
    { name: 'Crawler Excavator (Big)', quantity: 1, days: 5 },
    { name: 'Crawler Excavator (small)', quantity: 1, days: 5 },
    { name: 'Clamp Sheal', quantity: 1, days: 5 },
    { name: 'Compactor', quantity: 1, days: 5 },
    { name: 'Dewatering Pumps', quantity: 1, days: 5 },
    { name: 'Hydro Excavation Truck', quantity: 1, days: 5 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Daily83')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{projectName} Weekly Equipment Details</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>View Equipment Details</Text>

      {/* Equipment List */}
      <View style={styles.detailsContainer}>
        {equipmentDetails.map((item, index) => (
          <View key={index} style={styles.detailItem}>
            <Text style={styles.equipmentName}>{item.name}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
              <Text style={styles.detailText}>Number of Days: {item.days}</Text>
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
  equipmentName: {
    fontSize: 16,
    color: '#486ECD',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Daily89;
