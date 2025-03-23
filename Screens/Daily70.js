import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Badge } from "react-native-elements"; // Added Badge here
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://10.0.0.221:5001";

const handleApiError = (error, navigation, defaultMessage) => {
  if (error.response && error.response.status === 401) {
    Alert.alert("Session Expired", "Please login again");
    navigation.navigate("Login");
  } else {
    Alert.alert("Error", error.response?.data?.message || defaultMessage);
  }
};

const Daily70 = ({ route, navigation }) => {
  const { id, isBoss } = route?.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadExpenseDetails = async () => {
    // Function to load the expense details
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_BASE_URL}/api/expense/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const foundExpense = response.data.data.find((exp) => exp._id === id);
      setData(foundExpense);
    } catch (error) {
      handleApiError(error, navigation, "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenseDetails(); // Load initial data
  }, [id, navigation]);

  const handleApproval = async (type, status) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.patch(
        `${API_BASE_URL}/api/expense/approve/${id}`,
        { type, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedData = { ...data, [`${type}Status`]: status };
      setData(updatedData);
      Alert.alert("Success", `${type} ${status.toLowerCase()}`);
    } catch (error) {
      handleApiError(error, navigation, "Approval failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#28a745";
      case "Rejected":
        return "#dc3545";
      default:
        return "#ffc107";
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Expense not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.heading}>Expense Details</Text>
        </TouchableOpacity>
      </View>

      {/* All Original Form Fields */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <Text style={styles.inputHeading}>Employee Name</Text>
        <View style={styles.inputLineContainer}>
          <Text style={styles.inputLineText}>{data?.employeeName || "N/A"}</Text>
        </View>

        <Text style={styles.inputHeading}>Date Range</Text>
        <View style={styles.inputLineContainer}>
          <Text style={styles.inputLineText}>
            {data?.startDate
              ? new Date(data.startDate).toLocaleDateString()
              : "N/A"}{" "}
            - {new Date(data.endDate).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.inputHeading}>Details of Expenditure</Text>
        <View style={styles.inputLineContainer}>
          <Text style={styles.inputLineText}>{data?.expenditure || "N/A"}</Text>
        </View>

        <Text style={styles.inputHeading}>Project Number</Text>
        <View style={styles.inputLineContainer}>
          <Text style={styles.inputLineText}>{data?.projectNumber || "N/A"}</Text>
        </View>

        <Text style={styles.inputHeading}>Category</Text>
        <View style={styles.inputLineContainer}>
          <Text style={styles.inputLineText}>{data?.category || "N/A"}</Text>
        </View>

        <Text style={styles.inputHeading}>Task</Text>
        <View style={styles.inputLineContainer}>
          <Text style={styles.inputLineText}>{data?.task || "N/A"}</Text>
        </View>
      </View>

      {/* Approval Section */}
      {isBoss && (
        <View style={styles.approvalSection}>
          <Text style={styles.sectionTitle}>Approval Actions</Text>

          {/* Mileage Status Badge */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Mileage Status:</Text>
            <Badge value={data.mileageStatus} status={getStatusColor(data.mileageStatus)} />
          </View>

          {/* Expense Status Badge */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Expense Status:</Text>
            <Badge value={data.expenseStatus} status={getStatusColor(data.expenseStatus)} />
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Approve Mileage"
              buttonStyle={styles.approveButton}
              onPress={() => handleApproval("mileage", "Approved")}
            />
            <Button
              title="Reject Mileage"
              buttonStyle={styles.rejectButton}
              onPress={() => handleApproval("mileage", "Rejected")}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Approve Expenses"
              buttonStyle={styles.approveButton}
              onPress={() => handleApproval("expense", "Approved")}
            />
            <Button
              title="Reject Expenses"
              buttonStyle={styles.rejectButton}
              onPress={() => handleApproval("expense", "Rejected")}
            />
          </View>
        </View>
      )}

      {/* Original Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          navigation.navigate("Daily71", {
            id,
            expenses: data.expenses,
            totalAmount: data.totalAmount,
            onGoBack: () => {
              // Reload expense details after returning from Daily71
              loadExpenseDetails();
            },
          })
        }
      >
        <Text style={styles.nextButtonText}>View Full Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    marginTop: 30,
    marginBottom: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 10,
  },
  formContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#486ECD",
    marginBottom: 15,
  },
  inputHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 5,
    marginTop: 10,
  },
  inputLineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 10,
  },
  inputLineText: {
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#486ECD",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  approvalSection: {
    marginTop: 25,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  approveButton: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingHorizontal: 15,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
    paddingHorizontal: 15,
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 10,
  },
});

export default Daily70;