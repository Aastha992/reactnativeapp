import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

const API_BASE_URL = "http://10.0.0.221:5001"; // Replace with your API URL
const { width, height } = Dimensions.get("window");

const Daily71 = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params; // This is the overall expense report ID
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setModalVisible] = useState(false); // Corrected state name
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBoss, setIsBoss] = useState(false);
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);

  const scale = useRef(new Animated.Value(1)).current; // Ref for zoom scale

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const profileResponse = await axios.get(
          `${API_BASE_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsBoss(profileResponse.data.isBoss);

        const expenseResponse = await axios.get(
          `${API_BASE_URL}/api/expense/expenses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const foundExpense = expenseResponse.data.data.find(
          (exp) => exp._id === id
        );

        if (foundExpense) {
          setData(foundExpense);
        } else {
          Alert.alert("Error", "Expense not found");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    // Calculate total approved amount whenever data changes
    if (data) {
      calculateTotalApprovedAmount();
    }
  }, [data]);

  const handleApproval = async (type, itemId, status) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.patch(
        `${API_BASE_URL}/api/expense/approve/${id}`, // Corrected URL: /api/expense/approve/:id
        { type, itemId, status }, // Send type, itemId, and status in the body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistically update the UI
      setData((prevData) => {
        const updatedData = { ...prevData };

        if (type === "expense") {
          const updatedExpenses = prevData.expenses.map((expense) =>
            expense._id === itemId ? { ...expense, status } : expense
          );
          updatedData.expenses = updatedExpenses;
        } else if (type === "mileage") {
          updatedData.mileageStatus = status;
        }
        return updatedData;
      });

      Alert.alert("Success", `${type} item ${status.toLowerCase()} successfully`);
      calculateTotalApprovedAmount(); // Recalculate after approval
    } catch (error) {
      console.error("Approval error:", error);
      Alert.alert("Error", "Failed to update approval status");
    }
  };

  const calculateTotalApprovedAmount = () => {
    if (!data) return;

    let total = 0;

    // Calculate approved expenses
    data.expenses.forEach((expense) => {
      if (expense.status === "Approved") {
        total += expense.amount;
      }
    });

    // Add mileage if approved
    if (data.mileageStatus === "Approved") {
      total += data.mileageAmount || 0;
    }

    setTotalApprovedAmount(total);
  };

  const handlePinchGesture = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#486ECD" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container} // Important: Add flex: 1 to the ScrollView itself
      contentContainerStyle={styles.contentContainer} // Use a separate style for content
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            if (route.params && route.params.onGoBack) {
              route.params.onGoBack();
            }
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={[styles.headerText, { fontWeight: "bold", marginLeft: 5 }]}>
            Expense Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Expense Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Information</Text>
        <Text>Employee: {data.employeeName}</Text>
        <Text>
          Date Range: {new Date(data.startDate).toLocaleDateString()} -{" "}
          {new Date(data.endDate).toLocaleDateString()}
        </Text>
        <Text>Total Expense: ${data.totalAmount.toFixed(2)}</Text>
        <Text style={styles.approvedAmount}>
          Total Approved Amount: ${totalApprovedAmount.toFixed(2)}
        </Text>
      </View>

      {/* Expense Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expense Items</Text>
        {data.expenses.map((expense, index) => (
          <View key={index} style={styles.expenseCard}>
            <View style={styles.expenseContent}>
              <View>
                <Text>{expense.title}: ${expense.amount}</Text>
                {expense.images.map((img, imgIndex) => (
                  <TouchableOpacity
                    key={imgIndex}
                    onPress={() => openImageModal(`${API_BASE_URL}${img}`)} // Open modal on press
                  >
                    <Image
                      source={{ uri: `${API_BASE_URL}${img}` }}
                      style={styles.thumbnail}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {isBoss && expense.amount > 0 && (
  <View style={styles.approvalButtonsContainer}>
    <Button
      title="Approve"
      buttonStyle={styles.approveButton}
      titleStyle={styles.approveButtonText}
      onPress={() => handleApproval("expense", expense._id, "Approved")}
    />
    <Button
      title="Reject"
      buttonStyle={styles.rejectButton}
      titleStyle={styles.rejectButtonText}
      onPress={() => handleApproval("expense", expense._id, "Rejected")}
    />
  </View>
)}

            </View>
            {expense.amount > 0 && expense.status && expense.status !== "Approved" && expense.status !== "Rejected" && (
  <Text style={styles.statusText}>Status: Pending</Text>
)}

{expense.amount > 0 && (expense.status === "Approved" || expense.status === "Rejected") && (
  <Text style={styles.statusText}>Status: {expense.status}</Text>
)}


          </View>
        ))}
      </View>

      {/* Mileage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mileage Expense</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date Range:</Text>
          <Text style={styles.detailValue}>
            {new Date(data.startDate).toLocaleDateString()} -{" "}
            {new Date(data.endDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mileage Amount:</Text>
          <Text style={styles.detailValue}>
            ${data.mileageAmount?.toFixed(2) || "0.00"}
          </Text>
        </View>

        {/* Boss Approval Buttons */}
        {isBoss && data.mileageAmount > 0 && (
  <View style={styles.approvalButtonsContainer}>
    <Button
      title="Approve Mileage"
      buttonStyle={styles.approveButton}
      titleStyle={styles.approveButtonText}
      onPress={() => handleApproval("mileage", "mileageId", "Approved")}
    />
    <Button
      title="Reject Mileage"
      buttonStyle={styles.rejectButton}
      titleStyle={styles.rejectButtonText}
      onPress={() => handleApproval("mileage", "mileageId", "Rejected")}
    />
  </View>
)}

{data.mileageAmount > 0 && data.mileageStatus && data.mileageStatus !== "Approved" && data.mileageStatus !== "Rejected" && (
  <Text style={styles.statusText}>Status: Pending</Text>
)}

{data.mileageAmount > 0 && (data.mileageStatus === "Approved" || data.mileageStatus === "Rejected") && (
  <Text style={styles.statusText}>Status: {data.mileageStatus}</Text>
)}


      </View>

      {/* Image Modal */}
      <Modal visible={imageModalVisible} transparent={true} onRequestClose={closeImageModal}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={closeImageModal}
        >
          <PinchGestureHandler
            onGestureEvent={handlePinchGesture}
            onHandlerStateChange={handlePinchStateChange}
          >
            <Animated.Image
              source={{ uri: selectedImage }}
              style={[styles.zoomedImage, { transform: [{ scale }] }]}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, // Make the ScrollView take up the entire screen
      backgroundColor: "#fff",
    },
    contentContainer: {
      flexGrow: 1, // Enable the content to grow and fill the ScrollView
      paddingBottom: 16, // Add padding at the bottom of the content
    },
    headerContainer: {
      paddingTop: 45,
      paddingBottom: 10,
      backgroundColor: "#fff",
      paddingHorizontal: 16, // Add horizontal padding to the header container
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerText: {
      fontSize: 18,
      marginLeft: 5,
      fontWeight: "500",
    },
    sectionTitle: {
      fontSize: 18,
      color: "#486ECD",
      fontWeight: "bold",
      marginBottom: 20,
      marginHorizontal: 16,
    },
    section: {
      backgroundColor: "#F8F9FA",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      marginHorizontal: 16, // Add horizontal margin to the section
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#486ECD",
      marginBottom: 12,
    },
    expenseCard: {
      backgroundColor: "#FFF",
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
      elevation: 2,
    },
    expenseContent: {
      flexDirection: "row", // Arrange content and buttons in a row
      justifyContent: "space-between", // Space them apart
      alignItems: "center", // Align items vertically in the center
    },
    thumbnail: { width: 80, height: 80, borderRadius: 8, marginTop: 8 },
    approvalButtonsContainer: {
      flexDirection: "column", // Stack buttons vertically
      justifyContent: "space-around", // Distribute space evenly
      //marginTop: 10, // No need for margin top, as we're using space-around
    },
    approveButton: { // Style for the button
      backgroundColor: "#fff",
      borderColor: "#486ECD",
      borderWidth: 1,
      marginBottom: 10, // Add margin bottom for gap
    },
    approveButtonText: { // Style for the button text
      color: "#486ECD",
    },
    rejectButton: {  // Style for the button
      backgroundColor: "#486ECD",
      borderColor: "#fff",
      borderWidth: 1,
    },
    rejectButtonText: {  // Style for the button text
      color: "#fff",
    },
    approvedAmount: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 10,
      color: "#2E7D32", // Green color for approved amount
    },
    statusText: {
      marginTop: 8,
      fontWeight: "bold",
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    detailLabel: {
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      justifyContent: "center",
      alignItems: "center",
    },
    zoomedImage: {
      width: width,
      height: height / 2,
    },
  });

export default Daily71;