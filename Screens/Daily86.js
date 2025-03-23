import React, { useState, useEffect } from 'react'; // Import useEffect
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Use axios or the Fetch API

const Daily86 = ({ navigation, route }) => {
  const [isExpandedFirst, setIsExpandedFirst] = useState(false);
  const [isExpandedSecond, setIsExpandedSecond] = useState(false);
  const [loading, setLoading] = useState(true);  // Add the loading state
  const [companyDetails, setCompanyDetails] = useState(null);

  // Use parameters passed from Daily75.js
  const companyName = route.params?.companyName || 'Default Company Name';
  const firstCompanyDetails = route.params?.firstCompanyDetails || [];
  const secondCompanyDetails = route.params?.secondCompanyDetails || [];
  // Debug: Log the route params to verify the received data
  console.log('Received route params:', route.params);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoading(true);  // Set loading to true before fetching
      try {
        const response = await axios.get('https://mockapi.example.com/companyDetails'); // Replace with your mock API URL
        setCompanyDetails(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchCompanyDetails();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Daily83')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Project 2017-5134 Labour Details</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>View Labour Details</Text>

      {/* Loading Indicator */}
      {loading && <Text>Loading labour details...</Text>}

      {/* First Company Name Box with Dropdown Arrow */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => setIsExpandedFirst(!isExpandedFirst)}
      >
        <Text style={styles.boxText}>{companyName}</Text>
        <Ionicons
          name={isExpandedFirst ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#333"
        />
      </TouchableOpacity>

      {/* Expandable List for First Company Details */}
      {isExpandedFirst && (
        <View style={styles.detailsContainer}>
          {firstCompanyDetails.map((item, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.roleText}>{item.role}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
                <Text style={styles.detailText}>Number of Days: {item.days}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Second Company Name Box with Dropdown Arrow */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => setIsExpandedSecond(!isExpandedSecond)}
      >
        <Text style={styles.boxText}>Kusiar Project Services</Text>
        <Ionicons
          name={isExpandedSecond ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#333"
        />
      </TouchableOpacity>

      {/* Expandable List for Second Company Details */}
      {isExpandedSecond && (
        <View style={styles.detailsContainer}>
          {secondCompanyDetails.map((item, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.roleText}>{item.role}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
                <Text style={styles.detailText}>Number of Days: {item.days}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
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
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: '#d9e7ff',
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
  },
  detailItem: {
    marginBottom: 16,
  },
  roleText: {
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

export default Daily86;