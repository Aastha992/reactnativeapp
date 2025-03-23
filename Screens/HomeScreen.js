import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Image, ActionSheetIOS, Platform, Modal, FlatList, ImageBackground, Alert } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import polyline from '@mapbox/polyline';
import debounce from 'lodash.debounce';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomToolbar from './BottomToolbar';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';


const API_BASE_URL = "http://10.0.0.221:5001/api"; // Replace with your actual API base URL


const HomeScreen = ({ navigation, route }) => { // Removed const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    const [showNotification, setShowNotification] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState(
        "Water Truck needs to be on the location"
    );
    const [notifications, setNotifications] = useState([
        {
            id: "1",
            message: "Update available in Baseline Schedules for Project A",
        },
        { id: "2", message: "New safety guidelines added to Project B" },
        { id: "3", message: "New visitor log entry for Project C" },
    ]);
    const [notificationModalVisible, setNotificationModalVisible] =
        useState(false);
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locationText, setLocationText] = useState("Fetching Location...");
    const [weatherData, setWeatherData] = useState({
        city: "Fetching Location...",
        description: "Fetching weather...",
        temp: 0,
        icon: "",
    });
    const mapRef = useRef(null);
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState('');
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                let user_id = userId;
                if (!userId) {
                    user_id = await AsyncStorage.getItem('userId');
                    setUserId(user_id);
                }
                console.log("Fetched User Id:", user_id);
        
                // Location Permissions
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permission Denied",
                        "Please enable location permissions to access weather data.",
                        [{ text: "OK" }]
                    );
                    setIsLoading(false);
                    return;
                }
        
                // Get Location
                const locationData = await Location.getCurrentPositionAsync({}).catch((error) => {
                    console.error("Error fetching location:", error);
                    return null;
                });
        
                let latitude = 43.6532; // Default to Toronto
                let longitude = -79.3832;
        
                if (locationData?.coords) {
                    latitude = locationData.coords.latitude;
                    longitude = locationData.coords.longitude;
                }
        
                // Update backend with location
                if (user_id) {
                    await axios.post(`${API_BASE_URL}/auth/update-location`, {
                        userId: user_id,
                        latitude: latitude.toString(),
                        longitude: longitude.toString(),
                    });
        
                    // Fetch weather data
                    const response = await axios.post(
                        `${API_BASE_URL}/location/getLocationAndWeather`,
                        { userId: user_id }
                    );
        
                    if (response?.data?.weather) {
                        setWeatherData({
                            city: response.data.location.formattedAddress || "Unknown City",
                            description: response.data.weather.condition || "Unknown Weather",
                            temp: response.data.weather.temperature || 0,
                            icon: response.data.weather.icon || "",
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
                Alert.alert("Error", "Failed to fetch weather data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        
    
        fetchWeatherData();
      }, [userId]);

    const handleProfilePicture = async () => {
      const { status: mediaLibraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();

      if (mediaLibraryStatus !== "granted" || cameraStatus !== "granted") {
        alert(
            "Sorry, we need camera and media library permissions to make this work!"
        );
        return;
      }

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Take Photo", "Choose from Library", "Cancel"],
                cancelButtonIndex: 2,
            },
            async (buttonIndex) => {
                if (buttonIndex === 0) {
                    await takePhoto();
                } else if (buttonIndex === 1) {
                    await pickImage();
                }
            }
        );
      } else {
          // For Android or other platforms, use a similar action sheet or modal
          const options = [
              { text: "Take Photo", onPress: async () => await takePhoto() },
              { text: "Choose from Library", onPress: async () => await pickImage() },
              { text: "Cancel", style: "cancel" },
          ];
          // Assuming you will replace this with a proper Android implementation later
          Alert.alert("Choose Option", null, options);
      }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            console.log("Profile Image URI:", result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
    <View />
    <View style={styles.profileContainer}>
        <TouchableOpacity
            style={styles.notificationBell}
            onPress={() => setNotificationModalVisible(true)}>
            <Ionicons name="notifications-outline" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleProfilePicture()}>
            {profileImage ? (
                <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                    onError={(e) =>
                        console.log("Image Load Error:", e.nativeEvent.error)
                    }
                />
            ) : (
                <FontAwesome name="user-circle" size={40} color="#486ECD" />
            )}
        </TouchableOpacity>
    </View>
</View>


            {/* Notification Section */}
            {showNotification && (
                <LinearGradient
                    colors={["#2A0C95", "#B9A7F9"]} // Dark purple to light purple
                    style={styles.notificationContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="#ffffff"
                        style={{ marginRight: 10 }}
                    />
                    <Text style={styles.notificationText}>{notificationMessage}</Text>
                    <TouchableOpacity onPress={() => setShowNotification(false)}>
                        <MaterialIcons name="close" size={20} color="#ffffff" />
                    </TouchableOpacity>
                </LinearGradient>
            )}

            {/* Weather Section */}
            <View style={styles.weatherContainer}>
    <Text style={styles.weatherTitle}>Today's Weather</Text>
    {isLoading ? (
        <Text>Loading...</Text>
    ) : weatherData?.temp ? (
        <View style={styles.weatherCard}>
            <View style={styles.currentWeather}>
                <View>
                    <Text style={styles.weatherCity}>{weatherData.city}</Text>
                    <Text style={styles.weatherDescription}>
                        {weatherData.description}
                    </Text>
                </View>
                <Text style={styles.weatherTemp}>
                    {Math.round(weatherData.temp)}°C
                </Text>
                {weatherData.icon ? (
                    <Image
                        source={{ uri: weatherData.icon }}
                        style={{ width: 50, height: 50, marginRight: 20 }}
                    />
                ) : null}
            </View>
        </View>
    ) : (
        <Text style={styles.weatherDescription}>
            Weather data not available.
        </Text>
    )}
</View>


            {/* Notification Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={notificationModalVisible}
                onRequestClose={() => {
                    setNotificationModalVisible(!notificationModalVisible);
                }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Notifications</Text>
                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.notificationItem}>
                                    <Text style={styles.notificationItemText}>
                                        {item.message}
                                    </Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() =>
                                setNotificationModalVisible(!notificationModalVisible)
                            }>
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Explore Menu */}
            <View style={styles.exploreContainer}>
                <Text style={styles.exploreTitle}>Explore Menu</Text>
                <View style={styles.exploreGrid}>
                    {/* Baseline Schedules */}
                    <TouchableOpacity
                        style={styles.exploreCardContainer}
                        onPress={() => navigation.navigate("BaselineSchedules")}>
                        <ImageBackground
                            source={require("../Assets/HomeScreenImage.png")}
                            style={styles.cardImageBackground}
                            resizeMode="cover">
                            <View style={styles.cardOverlay}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardText}>Baseline</Text>
                                    <Text style={styles.cardText}>Schedules</Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward-outline"
                                    size={18}
                                    color="#ffffff"
                                />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Photo Files */}
                    <TouchableOpacity
                        style={styles.exploreCardContainer}
                        onPress={() => navigation.navigate("PhotosF")}>
                        <ImageBackground
                            source={require("../Assets/PhotoFiles.png")}
                            style={styles.cardImageBackground}
                            resizeMode="cover">
                            <View style={styles.cardOverlay}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardText}>Photo</Text>
                                    <Text style={styles.cardText}>Files</Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward-outline"
                                    size={18}
                                    color="#ffffff"
                                />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* Job Hazard Analysis */}
                    <TouchableOpacity
                        style={styles.exploreCardWideContainer} // Larger card for Job Hazard Analysis
                        onPress={() => navigation.navigate("Hazard1")}>
                        <ImageBackground
                            source={require("../Assets/JobHazard.png")}
                            style={styles.cardImageWideBackground}
                            resizeMode="cover">
                            <View style={styles.cardOverlay}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardText}>Job Hazard</Text>
                                    <Text style={styles.cardText}>Analysis</Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward-outline"
                                    size={18}
                                    color="#ffffff"
                                />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>

            <BottomToolbar/>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#ffffff",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10,
    },
    locationButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F7FF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    locationText: {
        color: "#000000",
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    notificationBell: {
        margin: 10,
    },
    notificationContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    notificationText: {
        color: "#ffffff",
        flex: 1,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        width: "100%",
    },
    notificationItemText: {
        fontSize: 16,
    },
    closeModalButton: {
        marginTop: 20,
        backgroundColor: "#486ECD",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeModalButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    weatherContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
},
weatherTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
},
weatherCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
},
currentWeather: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
},
weatherCity: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#486ECD",
},
weatherDescription: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
},
weatherTemp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#486ECD",
    marginHorizontal : -100,
    marginRight : 10,
},
weatherForecastContainer: {
    flexDirection: "row",
    marginTop: 10,
},
weatherHourBlock: {
    alignItems: "center",
    marginHorizontal: 10,
},
weatherHourIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
},
weatherHourTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#486ECD",
},
weatherHourTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
},

    exploreContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    exploreTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
    },
    exploreGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    exploreCardContainer: {
        width: "48%",
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        overflow: "hidden",
    },
    cardImageBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    exploreCardWideContainer: {
        width: "100%",
        height: 120,
        marginBottom: 10,
        borderRadius: 10,
        overflow: "hidden",
    },
    cardImageWideBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: "column",
    },
    cardText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    exploreCardContainer: {
        width: "48%", // Matches the grid layout width
        height: 100, // Adjust height for your button size
        marginBottom: 10,
        borderRadius: 10, // Ensures rounded edges
        overflow: "hidden", // Ensures everything is clipped to fit within the rounded corners
    },

    baselineCardImageBackground: {
        flex: 1, // Ensures the image fills the entire container
        justifyContent: "center", // Centers the overlay content vertically
        alignItems: "center", // Centers the overlay content horizontally
    },

    baselineCardOverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire card
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Black overlay with transparency
        flexDirection: "row", // Aligns text and arrow horizontally
        justifyContent: "space-between", // Separates text and arrow
        alignItems: "center", // Vertically aligns items
        paddingHorizontal: 10, // Adds padding on both sides
    },

    textContainer: {
        flexDirection: "column", // Arranges "Baseline" and "Schedules" in two lines
    },

    baselineText: {
        color: "#ffffff", // White text for contrast
        fontSize: 16,
        fontWeight: "bold",
    },

    baselineArrowIcon: {
        marginLeft: 10, // Spacing for the arrow
    },
    photoFilesCardImageBackground: {
        flex: 1,
        width: "48%", // Matches the grid layout
        height: 100, // Adjust height for uniformity
        marginBottom: 10,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },

    photoFilesCardOverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire card
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Black overlay with transparency
        flexDirection: "row", // Aligns text and arrow horizontally
        justifyContent: "space-between", // Separates text and arrow
        alignItems: "center",
        paddingHorizontal: 10,
    },

    photoFilesText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },

    photoFilesArrowIcon: {
        marginLeft: 10, // Spacing for the arrow
    },

    exploreText: {
        color: "#ffffff",
        fontSize: 16,
    },
    arrowIcon: {
        marginLeft: 10,
    },
    bottomNavAdjustedSlightlyUp: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        position: "absolute",
        bottom: 30,
        width: "100%",
        backgroundColor: "#ffffff",
    },
});
export default HomeScreen;