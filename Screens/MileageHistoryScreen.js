import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomToolbar from './BottomToolbar';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://10.0.0.221:5001/api"; // Replace with dynamic URL if needed

const getMonthData = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    dates.push(formattedDate);
  }
  return dates;
};

const MileageHistoryScreen = () => {
  const navigation = useNavigation();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
  );
  const [monthDates, setMonthDates] = useState(
    getMonthData(today.getFullYear(), today.getMonth())
  );
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false);
  const [entries, setEntries] = useState([]); // State to hold fetched data
  const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);


  // Update dates when month changes
  useEffect(() => {
    setMonthDates(getMonthData(today.getFullYear(), selectedMonth));
      if(getMonthData(today.getFullYear(), selectedMonth) &&  getMonthData(today.getFullYear(), selectedMonth).length>0){
         setSelectedDate(getMonthData(today.getFullYear(), selectedMonth)[0]);
      }
  }, [selectedMonth]);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const user_id = await AsyncStorage.getItem('userId');
                if (token && user_id) {
                    setUserToken(token);
                    setUserId(user_id)
                }
            } catch (error) {
                console.error("Failed to fetch token", error);
            }
        };
        fetchToken();
    }, []);

  // Fetch mileage history from backend
  useEffect(() => {
    if (userToken && userId) {
        console.log("Fetching history for userId:", userId);
        const fetchRides = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/mileage/history/${userId}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                console.log("Full API Response Data:", JSON.stringify(response.data, null, 2)); // PRINT FULL RESPONSE

                setEntries(response.data.map(entry => ({
                    ...entry,
                    totalDistance: entry.totalDistance ? parseFloat(entry.totalDistance) : 0,
                    expenses: entry.expenses ? parseFloat(entry.expenses) : 0,
                })));

            } catch (error) {
                console.error("Error fetching mileage history:", error.response?.data || error.message);
            }
        };
        fetchRides();
    }
}, [userToken, userId]);


const renderDailyEntry = ({ item }) => {
  console.log("Rendering Entry:", item); // Debugging individual entries

  return (
      <View style={styles.entryCard}>
          <View style={styles.locationContainer}>
              <Text style={styles.locationText}>From: {item.startLocation || "N/A"}</Text>
              {item.constructionSites && item.constructionSites.length > 0 && (
                  <Text style={styles.locationText}>
                      To: {item.constructionSites.join(" -> ")}
                  </Text>
              )}
              <Text style={styles.locationText}>Back to: {item.startLocation || "N/A"}</Text>
          </View>

          <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                  <FontAwesome name="tachometer" size={20} color="black" />
                  <Text style={styles.infoText}>
                      {typeof item.totalDistance === 'number' ? item.totalDistance.toFixed(2) : "0.00"} Kms
                  </Text>
              </View>
              <View style={styles.infoBox}>
                  <FontAwesome name="money" size={20} color="black" />
                  <Text style={styles.infoText}>
                      ${typeof item.expenses === 'number' ? item.expenses.toFixed(2) : "0.00"} Expenses
                  </Text>
              </View>
          </View>
      </View>
  );
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mileage</Text>
      </View>
      <View style={styles.calendarContainer}>
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => setIsMonthModalVisible(true)}
        >
          <Text style={styles.monthText}>
            {new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}
          </Text>
          <FontAwesome name="caret-down" size={20} color="#486ECD" />
        </TouchableOpacity>
        <Modal
          visible={isMonthModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMonthModalVisible(false)}
        >
          <View style={styles.centeredModalContainer}>
            <View style={styles.smallModalContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {Array.from({ length: 12 }, (_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedMonth(index);
                      setIsMonthModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalText}>
                      {new Date(0, index).toLocaleString('default', { month: 'long' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateContainer}>
            {monthDates.map((dayDate, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dayContainer}
                onPress={() => setSelectedDate(dayDate)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === dayDate && styles.selectedDateText,
                  ]}
                >
                  {dayDate.split('-')[2]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.entriesContainer}>
        <Text style={styles.entriesTitle}>List of Daily Entries</Text>
      </View>
      <FlatList
   data={entries.filter((entry) => {
       return (
           entry.date && new Date(entry.date).toISOString().split('T')[0] === new Date(selectedDate).toISOString().split('T')[0]
       );
   })}
   keyExtractor={(item) => item._id}
   renderItem={renderDailyEntry}
/>
      <TouchableOpacity
        style={styles.addMileageButton}
        onPress={() => navigation.navigate('MileageStartScreen')}
      >
        <Text style={styles.addMileageText}>Add Mileage</Text>
      </TouchableOpacity>
      <BottomToolbar />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',

        paddingBottom: 90,
    },
    header: {
        marginTop: 40,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    calendarContainer: {
        backgroundColor: '#E3E8FF',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    picker: {
        height: 40,
        width: 200,
        color: '#486ECD',
        fontSize: 18,
    },
    dateContainer: {
        flexDirection: 'row',
    },
    dayContainer: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        padding: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
    },
    selectedDateText: {
        backgroundColor: '#486ECD',
        color: 'white',
    },
    entriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: 10,
    },
    entriesTitle: {
        fontSize: 18,
        fontWeight: '600',

    },
    entryCard: {
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        marginLeft: 5,
        fontSize: 16,
    },
    locationContainer: {
        marginVertical: 10,
    },
    locationText: {
        fontSize: 14,
        color: '#707070',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 5,
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        marginTop: 5,
    },
    addMileageButton: {
        backgroundColor: '#486ECD',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    addMileageText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    centeredModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    smallModalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '40%',
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default MileageHistoryScreen;