import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const BASE_URL = "http://10.0.0.221:5001"; // Ensure this matches your backend URL

const DailyProjectList = ({ navigation }) => {
    const [data, setData] = useState([]); // State for project data
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh functionality

    // Function to fetch projects
    const fetchProjects = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/schedules`);
            const projects = response.data;
    
            console.log("Fetched Projects:", projects);
    
            if (!Array.isArray(projects)) {
                throw new Error("Invalid data format received");
            }
    
            // Keep only the first 10 projects
            setData(projects.slice(0, 10));
        } catch (error) {
            console.error("Error fetching projects:", error);
            Alert.alert("Error", "Failed to fetch projects. Please try again.");
        } finally {
            setRefreshing(false);
        }
    }, []);

    // Fetch projects when the screen is focused
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => fetchProjects());
        return unsubscribe;
    }, [navigation]);

    // Render each project item
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate("Daily73", { 
                projectId: item.projectId?._id, 
                projectName: item.projectName,
                projectNumber: item.projectNumber,
                owner: item.owner
            })}
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
    

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Daily72')}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.header}>Daily Project List</Text>
            </View>

            {/* List of projects */}
            <FlatList
                data={data}
                keyExtractor={(item, index) => item?._id ? `${item._id}-${index}` : String(index)}
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

export default DailyProjectList;
