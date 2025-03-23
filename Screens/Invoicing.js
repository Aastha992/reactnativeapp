import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import BottomToolbar from './BottomToolbar'; // Import BottomToolbar

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example mock API endpoint

const Invoicing = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch invoices from mock API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(MOCK_API_URL);
        const data = await response.json();
        // Transform mock API data to fit invoice structure
        const formattedData = data.slice(0, 5).map((item, index) => ({
          id: item.id.toString(),
          title: `Invoice Title ${index + 1}`,
          client: `Client ${index + 1}`,
          startDate: 'August 1, 2024',
          endDate: 'August 31, 2024',
        }));
        setInvoices(formattedData);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const renderInvoiceItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Daily104', { project: item })}>
      <View style={styles.invoiceItemContainer}>
        <View style={styles.invoiceDetails}>
          <View style={styles.iconContainer}>
            <FontAwesome name="file" size={20} color="#4A90E2" />
          </View>
          <View style={styles.invoiceTextContainer}>
            <Text style={styles.invoiceTitle}>{item.title}</Text>
            <Text style={styles.invoiceClient}>Client: {item.client}</Text>
            <Text style={styles.invoiceDateRange}>
              {item.startDate} - {item.endDate}
            </Text>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={20} color="#000" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Invoicing</Text>
      </View>

      <Text style={styles.listTitle}>List of Invoices</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={renderInvoiceItem}
          contentContainerStyle={styles.invoiceList}
        />
      )}

      <BottomToolbar/>
			{/* Replace bottom toolbar with BottomToolbar component */}
		</View>
	);
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginLeft: 10,
  },
  invoiceList: {
    paddingBottom: 20,
  },
  invoiceItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginLeft: 10,
    marginRight: 10,
  },
  invoiceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  invoiceTextContainer: {
    flexDirection: 'column',
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  invoiceClient: {
    fontSize: 14,
    color: '#6B7280',
  },
  invoiceDateRange: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default Invoicing;
