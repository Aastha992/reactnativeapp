import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    ActionSheetIOS,
    Alert,
    PermissionsAndroid,
    Modal,
    Animated,
    Dimensions
} from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const Daily65 = ({ route, navigation }) => {
    const { employeeName, startDate, endDate, category, expenditure, projectNumber, task } = route.params;
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    const [expenses, setExpenses] = useState([{ title: "", amount: "", category: category, isInitial: true }]);
    const [total, setTotal] = useState(0);
    const [isImagePickerActive, setIsImagePickerActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const scale = useRef(new Animated.Value(1)).current;
    const [mileageAmount, setMileageAmount] = useState(0);
  const [userId, setUserId] = useState(null); // Local state for userId

    useEffect(() => {
      const loadUserId = async () => {
          try {
              const storedUserId = await AsyncStorage.getItem("userId");
              console.log("Retrieved userId from AsyncStorage:", storedUserId);
              // Ensure userId is not null before setting it to state
              if (storedUserId) {
                  setUserId(storedUserId);
              } else {
                  console.warn("No userId found in AsyncStorage");
              }
          } catch (error) {
              console.error("Error retrieving userId from AsyncStorage:", error);
          }
      }
      loadUserId();
    }, []);

    const fetchMileageAmount = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const userId = await AsyncStorage.getItem("userId");

            if (!token || !userId) {
                Alert.alert("Error", "User not logged in");
                return;
            }

            console.log("Fetching mileage for:", { userId, startDate: parsedStartDate, endDate: parsedEndDate });
            

            const response = await axios.get(`http://10.0.0.221:5001/api/mileage/history/${userId}`, {
                params: {
                    startDate: parsedStartDate.toISOString(),
                    endDate: parsedEndDate.toISOString(),
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response Data:", JSON.stringify(response.data, null, 2));

            if (response.status === 200) {
                //response.data is now a type array
                if (Array.isArray(response.data) && response.data.length > 0) {
                    response.data.forEach(trip => {
                        console.log("Trip Data:", JSON.stringify(trip, null, 2));
                    });
    
                    const mileageTotal = response.data.reduce((acc, trip) => {
                        const expenses = parseFloat(trip.expenses) || 0; // Parse as float
                        console.log(`Adding trip expenses: ${expenses}`);
                        return acc + expenses;
                    }, 0);
    
                    console.log("Total Mileage Expenses:", mileageTotal);
    
                    setMileageAmount(typeof mileageTotal === 'number' ? mileageTotal : 0);
                } else {
                    console.log("No mileage data found. Setting to 0.");
                    setMileageAmount(0);
                }
            } else {
                  console.error("API request failed with status:", response.status);
                   Alert.alert("Error", "Failed to fetch mileage data.");
                   setMileageAmount(0);
            }
        } catch (error) {
            console.error("Error fetching mileage data:", error?.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch mileage data.");
            setMileageAmount(0);
        }
    };

    // Fetch mileage when startDate or endDate changes
    useEffect(() => {
        if (parsedStartDate && parsedEndDate && userId) {
            fetchMileageAmount();
        }
    }, [parsedStartDate, parsedEndDate, userId]);
    

    async function handleSubmit() {
        try {
            const token = await AsyncStorage.getItem("userToken");

            if (!token) {
                Alert.alert("Error", "User not logged in");
                return;
            }

            if (!total || total <= 0) {
                Alert.alert("Error", "Total amount must be greater than 0");
                return;
            }

            const formData = new FormData();
            formData.append("employeeName", employeeName);
            formData.append("startDate", parsedStartDate.toISOString());
            formData.append("endDate", parsedEndDate.toISOString());
            formData.append("category", category);
            formData.append("expenditure", expenditure);
            formData.append("projectNumber", projectNumber);
            formData.append("task", task);
            formData.append("totalAmount", total + mileageAmount);

            // Attach expenses with images
            const expensesWithImage = expenses.map((expense, index) => {
                if (expense.image) {
                    const imageUri = Platform.OS === "android" ? expense.image : expense.image;
                    formData.append(`image_${index}`, {
                        uri: imageUri,
                        type: "image/jpeg",
                        name: `expense_receipt_${Date.now()}_${index}.jpg`,
                    });
                    return { ...expense, image: `/uploads/expense_receipt_${Date.now()}_${index}.jpg` };
                } else {
                    return { ...expense };
                }
            });

            formData.append("expenses", JSON.stringify(expensesWithImage));

            // Attach main receipt image if available
            if (expenses[0].image) {
                formData.append("receipt", {
                    uri: expenses[0].image,
                    type: "image/jpeg",
                    name: `expense_receipt_${Date.now()}.jpg`,
                });
            }

            console.log("Submitting expense data...");

            // API Call
            const response = await axios.post(
                "http://10.0.0.221:5001/api/expense/expense",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                }
            );

            console.log("Response data: ", response.data);

            if (response.status === 200 || response.status === 201) { // Treat 201 as success
                console.log("Success Response Data:", JSON.stringify(response.data, null, 2)); // Add this line
                Alert.alert("Success", "Expenses submitted successfully.");
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to submit expenses.");
                console.log("Expense submit failed with status code", response.status);
            }
        } catch (error) {
            console.error("Error during submitting expense", error);
            Alert.alert("Error", `Failed to submit expenses: ${error?.response?.data?.message || error.message}`);
        }
    }
    const handlePinchGesture = Animated.event(
        [{ nativeEvent: { scale } }],
        { useNativeDriver: true }
    );
    const handlePinchStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true
            }).start();
        }
    };
    // Function to add a new expense entry with a dynamic category
    const addExpense = () => {
        const newCategoryNumber = expenses.length + 1;
        const newExpense = {
            title: "",
            amount: "",
            category: `Category ${newCategoryNumber}`,
            isInitial: false, // Mark this as not the initial category
        };
        setExpenses([...expenses, newExpense]);
    };

    // Function to update expense information
    const updateExpense = (index, field, value) => {
        console.log("updateExpense called with:", index, field, value);
        const updatedExpenses = [...expenses];
        updatedExpenses[index][field] = value;
        setExpenses(updatedExpenses);
        calculateTotal(updatedExpenses);
    };

    // Function to remove an expense entry
    const removeExpense = (index) => {
        const updatedExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(updatedExpenses);
        calculateTotal(updatedExpenses);
    };

    // Function to calculate the total expenses
    const calculateTotal = (updatedExpenses) => {
        const totalAmount = updatedExpenses.reduce(
            (acc, expense) => acc + (parseFloat(expense.amount) || 0),
            0
        );
        setTotal(totalAmount);
    };
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: 'App Camera Permission',
                  message: 'App needs access to your camera ' +
                            'so you can take awesome pictures.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
                return true;
            } else {
                console.log('Camera permission denied');
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'App Storage Permission',
                    message: 'App needs access to your storage ' +
                        'so you can select images from gallery.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can access storage');
                return true;
            } else {
                console.log('Storage permission denied');
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    };
    // Function to handle taking a picture
    const handleTakePicture = async (index) => {
        // Request camera permissions
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
            Alert.alert(
               "Permission Denied",
               "Camera permissions are required to take a photo."
           );
           return;
        }
        // Launch camera
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
           });
           if (!result.canceled && result.assets && result.assets.length > 0) {
               const uri = result.assets[0].uri;
               console.log("Captured Image URI:", uri);
                 // Save the image URI to the corresponding expense
                updateExpense(index, "image", uri);
          }
        } catch (error) {
           console.error("Error taking image:", error);
            Alert.alert("Failed to take picture, please try again later.")
        }
    };
    // Function to handle picking a picture from gallery
    const handlePickImage = async (index) => {
        const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
       if (!galleryPermission.granted) {
           Alert.alert(
               "Permission Denied",
               "Gallery permissions are required to select a photo."
           );
           return;
       }
       try {
           const result = await ImagePicker.launchImageLibraryAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.Images,
             allowsEditing: true,
             aspect: [4, 3],
             quality: 1,
         });
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
              console.log("Selected Image URI:", uri);
             // Save the image URI to the corresponding expense
              updateExpense(index, "image", uri);
         }
       } catch (error) {
         console.error("Error while picking from gallery:", error);
         Alert.alert("Failed to pick from gallery, please try again later.");
       }
    };
    // Function to show image options for adding a picture to an expense
    const showImageOptions = async (index) => {
        if (isImagePickerActive) {
           console.log('Image picker already active.');
             return;
         }
         setIsImagePickerActive(true)
         console.log("showImageOptions called for index:", index)
         let cameraPermission = true;
         let storagePermission = true;
           if (Platform.OS === 'android') {
              cameraPermission = await requestCameraPermission();
              storagePermission = await requestStoragePermission();
           }
         if (cameraPermission && storagePermission) {
             if (Platform.OS === "ios") {
                 ActionSheetIOS.showActionSheetWithOptions(
                   {
                       options: ["Take Photo", "Choose from Library", "Cancel"],
                       cancelButtonIndex: 2,
                   },
                   async (buttonIndex) => {
                       console.log("ActionSheet option selected:", buttonIndex)
                       if (buttonIndex === 0) {
                           handleTakePicture(index);
                       } else if (buttonIndex === 1) {
                           handlePickImage(index);
                       }
                       setIsImagePickerActive(false);
                   }
                 );
             } else {
                 Alert.alert("Add Image", "Choose an option", [
                     {
                         text: "Take Photo",
                          onPress: async () => {
                                handleTakePicture(index);
                                setIsImagePickerActive(false)
                           },
                     },
                     {
                         text: "Choose from Library",
                         onPress: async () => {
                             handlePickImage(index);
                             setIsImagePickerActive(false)
                          },
                     },
                     { text: "Cancel", style: "cancel", onPress: () => setIsImagePickerActive(false) },
                 ]);
             }
          } else {
             Alert.alert("Error", 'Permissions not granted');
              setIsImagePickerActive(false);
         }

    };
    const handleImagePress = (imageUri) => {
        setSelectedImage(imageUri);
        setModalVisible(true);
    };
    const handleImageResponse = (response, index) => {
        console.log("handleImageResponse called for index:", index);
        if (response.didCancel) {
            console.log("User cancelled image picker");
        } else if (response.errorCode) {
            console.error("Image Picker Error: ", response.errorMessage);
            Alert.alert("Error", response.errorMessage || "Failed to select image");
        } else if (response.assets && response.assets.length > 0) {
            const selectedImage = response.assets[0];
           console.log("Image selected: ", selectedImage);
            updateExpense(index, "image", selectedImage.uri); // Corrected: Pass URI directly
        } else {
           console.log("No assets returned by the image picker");
        }
    };

    const handleProgressClick = (step) => {
        if (step === 1) {
            navigation.navigate("Daily64");
        }
    };

    console.log("mileageAmount in UI:", mileageAmount);
    console.log("Total Expenses Calculation: ", { total, mileageAmount });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Top bar with back button and page title */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate("Expenses")}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.heading}>Add New Expense</Text>
                </TouchableOpacity>
            </View>

            {/* Expense Categories Section */}
            <View style={styles.categorySection}>
                <Text style={styles.categoryTitle}>2. Expense Categories</Text>
            </View>

            {/* Progress indicator for expense categories */}
            <View style={styles.progressContainer}>
                {[1, 2].map((step, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            onPress={() => handleProgressClick(step)}
                            style={[
                                styles.progressCircle,
                                step <= 2 ? styles.activeCircle : {},
                            ]}>
                            <Text
                               style={[
                                    styles.progressText,
                                    step <= 2 ? styles.activeText : {},
                                ]}>
                                {step}
                            </Text>
                        </TouchableOpacity>
                        {index < 1 && (
                            <View style={[styles.progressLine, styles.activeLine]} />
                        )}
                    </React.Fragment>
                ))}
            </View>

            {/* Box displaying captured mileage expenses */}
            <View style={styles.expenseInfoBox}>
                <Text style={styles.mileageText}>Mileage Expenses:</Text>
                <Text style={styles.mileageDates}>
                    {parsedStartDate?.toDateString()} to {parsedEndDate?.toDateString()}
                </Text>
                 <Text style={[styles.mileageAmount, styles.alignRight]}>
                  Mileage: {typeof mileageAmount === 'number' ? `$${mileageAmount.toFixed(2)}` : "Loading..."}
                </Text>
            </View>

            {/* Render each expense entry */}
            {expenses.map((expense, index) => (
                <View key={index} style={styles.expenseEntryWrapper}>
                    <View style={styles.expenseEntry}>

                        {/* Conditionally render the remove button */}
                        {!expense.isInitial && (
                           <TouchableOpacity style={styles.removeButton} onPress={() => removeExpense(index)}>
                              <Ionicons name="remove-circle" size={24} color="red" />
                           </TouchableOpacity>
                        )}

                        <Text style={styles.categoryHeader}>
                            {expense.category || `Category ${index + 1}`}
                        </Text>

                        <Text style={styles.inputHeading}>Expense Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Transportation/Hotel/Meals/Misc"
                            value={expense.title}
                            onChangeText={(value) => updateExpense(index, "title", value)}
                        />

                        <Text style={styles.inputHeading}>Enter Amount</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: $0.00"
                            keyboardType="numeric"
                            value={expense.amount}
                            onChangeText={(value) => updateExpense(index, "amount", value)}
                        />

                        {/* Picture box with image options */}
                        <TouchableOpacity
                            style={styles.pictureBox}
                            onPress={() => showImageOptions(index)}
                        >
                            <Ionicons
                                name="camera"
                                size={24}
                                color="#8E8E93"
                                style={styles.icon}
                            />
                            <Text style={styles.pictureText}>
                                {expense.image ? "Edit Picture" : "Click here to add a Picture"}
                            </Text>
                        </TouchableOpacity>

                        {/* Show image preview if available */}
                        {expense.image && (
                             <View style={styles.imagePreviewContainer}>
                                       <TouchableOpacity  onPress={() => handleImagePress(expense.image)}>
                                       <Image source={{ uri: expense.image }} style={styles.imagePreview} />
                                   </TouchableOpacity>
                                </View>
                        )}
                    </View>
                </View>
            ))}

            {/* Button to add a new expense entry */}
            <TouchableOpacity style={styles.addButton} onPress={addExpense}>
                <View style={styles.addButtonContent}>
                    <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#3B82F6"
                        style={styles.addButtonIcon}
                    />
                    <Text style={styles.addButtonText}>Add New</Text>
                </View>
            </TouchableOpacity>

            {/* Box showing the total expenses */}
            <View style={styles.totalSectionBox}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalText}>Total (Including Mileage):</Text>
                      <Text style={styles.totalAmount}>
                        ${typeof total === 'number' && typeof mileageAmount === 'number' ? (total + mileageAmount).toFixed(2) : "0.00"}
                      </Text>
                </View>
            </View>

            {/* Navigation buttons: Previous and Submit */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={() => navigation.navigate("Daily64")}
                >
                    <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
                <TouchableOpacity
                   style={styles.modalContainer}
                      activeOpacity={1}
                      onPress={() => setModalVisible(false)}
                >
                   <PinchGestureHandler onGestureEvent={handlePinchGesture} onHandlerStateChange={handlePinchStateChange}>
                         <Animated.Image
                              source={{ uri: selectedImage }}
                             style={[styles.zoomedImage, {transform: [{scale}]}]}
                             resizeMode="contain"
                          />
                       </PinchGestureHandler>
                </TouchableOpacity>
           </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomedImage: {
        width: width,
        height: height / 2,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    alignRight: {
        alignSelf: "flex-end",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 15,
    },
    progressCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#e0e0e0",
        borderWidth: 2,
        borderColor: "#d3d3d3",
        alignItems: "center",
        justifyContent: "center",
    },
    activeCircle: {
        borderColor: "#486ECD",
    },
    progressText: {
        fontSize: 16,
        color: "#000",
    },
    activeText: {
        color: "#486ECD",
    },
    progressLine: {
        height: 2,
        flex: 1,
        backgroundColor: "#d3d3d3",
    },
    activeLine: {
        backgroundColor: "#486ECD",
    },
    headerSpacing: {
        marginTop: 20,
    },
    topBar: {
        marginTop: 30,
        marginBottom: 15,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: -10,
    },
    inputHeading: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 5,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    header: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000000",
        marginLeft: 10,
    },
    categorySection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000000",
    },
    expenseInfoBox: {
        padding: 10,
        backgroundColor: "#486ECD",
        borderRadius: 10,
        marginBottom: 20,
    },
    mileageText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    mileageDates: {
        color: "#FFFFFF",
        fontSize: 13,
        marginBottom: 1,
    },
    mileageAmount: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    categoryHeader: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#000000",
        color: "#000000",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    imagePreviewContainer: {
        marginTop: 10,
        alignItems: "center",
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d3d3d3",
    },
    pictureBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 8,
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    pictureText: {
        color: "#000000",
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#486ECD",
        alignSelf: "flex-end",
        marginBottom: 100,
    },
    addButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    addButtonIcon: {
        marginRight: 5,
    },
    addButtonText: {
        color: "#486ECD",
        fontSize: 16,
        fontWeight: "bold",
    },
    totalSectionBox: {
        backgroundColor: "#E5EDFB",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    previousButton: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        borderRadius: 8,
        flex: 0.45,
        borderWidth: 1,
        borderColor: "#486ECD",
    },
    previousButtonText: {
        color: "#486ECD",
        fontSize: 16,
        fontWeight: "600",
    },
    submitButton: {
        alignItems: "center",
        backgroundColor: "#486ECD",
        paddingVertical: 10,
        borderRadius: 8,
        flex: 0.45,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    expenseEntryWrapper: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    expenseEntry: {
        position: 'relative',
    }
});

export default Daily65;