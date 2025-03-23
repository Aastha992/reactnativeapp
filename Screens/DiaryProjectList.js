import React, { useState, useEffect, useCallback } from "react";
import { 
    View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const BASE_URL = "http://10.0.0.221:5001"; // ✅ Ensure this is correct

const DiaryProjectList = ({ navigation }) => {
    const [data, setData] = useState([]);  // ✅ Stores projects list
    const [refreshing, setRefreshing] = useState(false);  // ✅ Pull-to-refresh state
    const [loading, setLoading] = useState(true);  // ✅ Initial loading state

    /** ✅ Function to Fetch Project List from Backend **/
    const fetchProjects = useCallback(async () => {
        setRefreshing(true);
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/schedules`);
            const projects = response.data;

            console.log("Fetched Projects:", projects);

            if (!Array.isArray(projects)) {
                throw new Error("Invalid data format received");
            }

            setData(projects.slice(0, 10)); // ✅ Show first 10 projects
        } catch (error) {
            console.error("Error fetching projects:", error);
            Alert.alert("Error", "Failed to fetch projects. Please try again.");
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, []);

    /** ✅ Fetch Projects When Screen is Focused **/
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchProjects);
        return unsubscribe;
    }, [navigation]);

    /** ✅ Render Each Project Item **/
     const renderItem = ({ item }) => (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate("DailyEntry1", { 
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
            {/* ✅ Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.header}>Daily Project List</Text>
            </View>

            {/* ✅ Show Loading Indicator */}
            {loading && <ActivityIndicator size="large" color="#486ECD" style={{ marginTop: 20 }} />}

            {/* ✅ List of Projects */}
            {!loading && (
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingTop: 50,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000",
        marginLeft: 10,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#486ECD",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#666666",
        marginBottom: 5,
    },
    emptyList: {
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: "#666666",
    },
});

export default DiaryProjectList;
