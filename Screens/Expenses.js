import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Badge } from "react-native-elements";
import BottomToolbar from "./BottomToolbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Expenses = ({ navigation, route }) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const isBoss = route.params?.isBoss;

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const endpoint = isBoss 
        ? "http://10.0.0.221:5001/api/expense/approvals"
        : "http://10.0.0.221:5001/api/expense/expenses";
  
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const formattedData = response.data.data.map(expense => ({
        ...expense,
        submittedDate: expense.createdAt ? new Date(expense.createdAt) : null,
        mileageAmount: expense.mileageAmount || 0,
        expenseAmount: expense.expenseAmount || 0,
        submittedBy: expense.submittedBy || { username: "Unknown" },
      }));
  
      // Sort expenses by newest first
      const sortedData = formattedData.sort((a, b) => b.submittedDate - a.submittedDate);
  
      setDataList(sortedData);
      
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };
  

  

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#28a745';
      case 'Rejected': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Daily70", { 
        id: item._id, 
        expenses: item.expenses || [], 
        totalAmount: item.totalAmount || 0,
        isBoss: isBoss  // Add isBoss parameter here
      })}
    >
      <View style={styles.expenseItemContainer}>
        <View style={styles.expenseDetails}>
          <View style={styles.iconContainer}>
            <FontAwesome name="file" size={20} color="#4A90E2" />
          </View>
          <View style={styles.expenseTextContainer}>
  {/* Display Employee Name (Always, not just for Bosses) */}
  <Text style={styles.employeeName}>
  {item.submittedBy?.username || "Unknown Employee"}
</Text>

  {/* Show Expense Date */}
  <Text style={styles.expenseTitle}>
  Submitted: {item.submittedDate 
    ? item.submittedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
    : "Unknown Date"}
</Text>



</View>

        </View>
        
        {/* Status Badges */}
        <View style={styles.statusContainer}>
  {/* Mileage Status - Only show if mileageAmount > 0 */}
  {item.mileageAmount > 0 && item.mileageStatus && (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.mileageStatus) }]}>
      <Text style={styles.statusText}>{item.mileageStatus}</Text>
    </View>
  )}

  {/* Expense Status - Only show if expenseAmount > 0 */}
  {item.expenseAmount > 0 && item.expenseStatus && (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.expenseStatus) }]}>
      <Text style={styles.statusText}>{item.expenseStatus}</Text>
    </View>
  )}
</View>

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{isBoss ? "Expense Approvals" : "My Expenses"}</Text>
        {!isBoss && (
          <TouchableOpacity
            style={styles.addExpenseButton}
            onPress={() => navigation.navigate("Daily64")}
          >
            <Text style={styles.addExpenseButtonText}>Add New Expense</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : dataList.length > 0 ? (
          <FlatList
            data={dataList}
            keyExtractor={(item) => item._id}
            renderItem={renderExpenseItem}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={styles.noDataText}>
            {isBoss ? "No pending approvals" : "No expenses found"}
          </Text>
        )}
      </View>
      <BottomToolbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addExpenseButton: {
    backgroundColor: "#486ECD",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addExpenseButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  expenseItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 10,
  },
  expenseDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseTextContainer: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  expenseDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusContainer: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#666",
  },
  flatListContent: {
    paddingBottom: 100,
  },
});

export default Expenses;