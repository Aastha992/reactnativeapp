import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const BASE_URL = "http://10.0.0.221:5001"; // Ensure this matches your backend URL

const BaselineSchedules = ({ navigation }) => {
    const [data, setData] = useState([]); // State for schedules data
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh functionality
    const [loadingMore, setLoadingMore] = useState(false); // State for infinite scrolling
    const [page, setPage] = useState(1); // Current page for pagination
    const [hasMore, setHasMore] = useState(true); // If there are more schedules to load

    // Function to fetch schedules with pagination
    const fetchSchedules = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/schedules`);
            const schedules = response.data;
    
            console.log("Fetched Schedules:", schedules);
    
            if (!Array.isArray(schedules)) {
                throw new Error("Invalid data format received");
            }
    
            // Keep only the first 10 schedules
            setData(schedules.slice(0, 10));
        } catch (error) {
            console.error("Error fetching schedules:", error);
            Alert.alert("Error", "Failed to fetch schedules. Please try again.");
        } finally {
            setRefreshing(false);
        }
    }, []);
    

    // Function to delete a project and its schedules
    const deleteSchedule = async (item) => {
        if (!item.projectId || !item.projectId._id) {
            console.error("Project ID is missing for deletion", item);
            Alert.alert("Error", "Project ID is missing, cannot delete.");
            return;
        }

        const projectId = item.projectId._id;
        console.log("Attempting to delete project ID:", projectId); // Debugging

        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this project and its schedules?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await axios.delete(`${BASE_URL}/api/projects/remove?projectId=${projectId}`);
                            
                            // Remove deleted project schedules from UI
                            setData((prevData) => prevData.filter(sch => sch.projectId._id !== projectId));

                            Alert.alert("Success", "Project and schedules deleted successfully");
                        } catch (error) {
                            console.error("Delete error:", error.response?.data || error.message);
                            Alert.alert("Error", "Failed to delete project and schedules");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    // Fetch schedules when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => fetchSchedules(true));
        return unsubscribe; // Cleanup the listener when the component unmounts
    }, [navigation]);

    // Render each schedule item
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.projectName}</Text>
                    
                    {/* Project Number and Owner should have the same font size and style */}
                    <Text style={styles.subtitle}>Project Number: {item.projectNumber}</Text>
                    <Text style={styles.subtitle}>Owner: {item.owner}</Text>
    
                    {/* Button to open the uploaded PDF */}
                    <TouchableOpacity onPress={() => navigation.navigate("PDFViewer", { pdfUrl: `${BASE_URL}${item.pdfUrl}` })}>
                        <Text style={{ color: "#486ECD", textDecorationLine: "underline" }}>View PDF</Text>
                    </TouchableOpacity>
                </View>
    
                {/* Delete Icon */}
                <TouchableOpacity onPress={() => deleteSchedule(item)}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
    

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.header}>Baseline Schedules</Text>
            </View>

            {/* List of schedules */}
            <FlatList
    data={data}
    keyExtractor={(item, index) => item?._id ? `${item._id}-${index}` : String(index)}
    renderItem={renderItem}
    refreshing={refreshing}
    onRefresh={fetchSchedules} // Only refreshes the first 10 schedules
    contentContainerStyle={styles.listContainer}
    ListEmptyComponent={() => (
        <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No schedules available.</Text>
        </View>
    )}
/>



            {/* Button to add a new schedule */}
            <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => navigation.navigate('UploadSchedule')}
            >
                <Text style={styles.uploadButtonText}>Add New Schedule</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 50,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#486ECD',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%"
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 5,
    },
    subtitle: {
    fontSize: 14,  // Keep it the same size as Project No
    fontWeight: 'bold',  // Make it bold if needed
    color: '#666666',
    marginBottom: 5,
},

    contractor: {
        fontSize: 12,
        color: '#999999',
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: '#486ECD',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -90 }],
        height: 45,
    },
    uploadButtonText: {
        color: '#486ECD',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyList: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
    },
});

export default BaselineSchedules;
