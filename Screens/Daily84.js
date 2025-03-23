import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProjectContext } from '../utils/ProjectContext'; // Import ProjectContext - **Check This Path!**
import { decode } from 'base-64';

const BASE_URL = "http://10.0.0.221:5001";

const Daily84 = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { projectData, setProjectData } = useContext(ProjectContext); // Access ProjectContext
    const [userId, setUserId] = useState(null);

    const fetchProjects = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/schedules`);
            const projects = response.data;

            console.log("Fetched Projects:", projects);

            if (!Array.isArray(projects)) {
                throw new Error("Invalid data format received");
            }

            setData(projects.slice(0, 10));
        } catch (error) {
            console.error("Error fetching projects:", error);
            Alert.alert("Error", "Failed to fetch projects. Please try again.");
        } finally {
            setRefreshing(false);
        }
    }, []);

     // Function to load userId - declared outside useEffect
     const loadUserId = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('jwtToken');
            if (storedToken) {
                const payloadBase64 = storedToken.split('.')[1];
                const payloadJson = decode(payloadBase64);
                const payload = JSON.parse(payloadJson);

                if (payload && payload.userId) {
                    // console.log("Loaded user ID from JWT:", payload.userId);
                    setUserId(payload.userId);
                    return payload.userId; // Return the userId
                } else {
                    console.log("JWT token missing userId property.");
                    return null; // Return null if no userId is missing
                }
            } else {
                console.log("No jwtToken found in AsyncStorage.");
                return null; // Return null if no token is found
            }
        } catch (error) {
            console.error("Error loading user ID from AsyncStorage:", error);
            return null; // Return null on error
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProjects();
            loadUserId();
        });
        return unsubscribe;
    }, [navigation, fetchProjects]);

    const renderItem = ({ item }) => {
        console.log("Daily84: Inspecting project item:", item);
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={async () => {
                    console.log("Daily84: userId before navigation:", userId);
                    // Load the userId synchronously
                    const currentUserId = await loadUserId();
                    // Update ProjectContext with selected project details before navigating
                    setProjectData({
                        projectId: item.projectId?._id,
                        projectName: item.projectName,
                        projectNumber: item.projectNumber,
                        owner: item.owner,
                        userId: currentUserId, // Use the resolved userId
                    });
                    navigation.navigate("Daily85"); // Navigate without passing params
                }}
            >
                <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.projectName}</Text>
                        <Text style={styles.subtitle}>Project Number: {item.projectNumber}</Text>
                        <Text style={styles.subtitle}>Owner: {item.owner}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={24} color="#486ECD" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Daily72')}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.header}>Daily Project List</Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={fetchProjects}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyList}>
                        <Text style={styles.emptyText}>No projects available.</Text>
                    </View>
                )}
            />
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
    emptyList: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
    },
});

export default Daily84;