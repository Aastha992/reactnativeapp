import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { mockMileageData } from '../utils/mockData'; // Correct relative path for utils folder

const MileageCancelScreen = ({ navigation }) => {
  const { date, formattedDate, summary, mapMarkers } = mockMileageData;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainerAligned}>
        <TouchableOpacity style={styles.headerBackContainer} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.addMileageText}>Add Mileage</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.headerInnerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{date}</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBoxContainer}>
          <View style={styles.summaryBox}>
            <FontAwesome name="road" size={20} color="#486ECD" />
            <Text style={styles.summaryLabel}>kms</Text>
            <Text style={styles.summaryValue}>{summary.distance}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryBox}>
            <FontAwesome name="clock-o" size={20} color="#486ECD" />
            <Text style={styles.summaryLabel}>Travel Time</Text>
            <Text style={styles.summaryValue}>{summary.time}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryBox}>
            <FontAwesome name="dollar" size={20} color="#486ECD" />
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={styles.summaryValue}>${summary.expenses}</Text>
          </View>
        </View>
      </View>

      {/* Map Section */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: mapMarkers[0].latitude,
          longitude: mapMarkers[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {mapMarkers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
      </MapView>

      {/* Input Boxes */}
      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={24} color="black" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Enter Location" placeholderTextColor="grey" />
      </View>
      <View style={styles.connectorContainer}>
        <View style={styles.circle} />
        <View style={styles.verticalLine} />
        <View style={styles.circle} />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={24} color="black" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Destination" placeholderTextColor="grey" />
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate('ValidationPopupMileage')}
        >
          <Text style={styles.cancelButtonText}>Cancel Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endButton}>
          <Text style={styles.endButtonText}>End Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MileageCancelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainerAligned: {
    marginTop: 40,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMileageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#486ECD',
    alignItems: 'center',
  },
  headerInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
  },
  summaryContainer: {
    paddingVertical: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  summaryBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#486ECD',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#486ECD',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'black',
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#ccc',
  },
  map: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  connectorContainer: {
    alignItems: 'center',
    marginVertical: -10,
  },
  circle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#486ECD', // Blue color to match the reference image
    marginVertical: 2,
    marginLeft : -330,
    marginTop : 18,
  },
  verticalLine: {
    width: 1,
    height: 22,
    backgroundColor: '#486ECD', 
    marginLeft : -330, // Blue color to match the reference image
    marginBottom : -16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#2b6cb0',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
