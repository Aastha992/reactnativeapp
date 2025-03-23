import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "../FormContext";

const Hazard1 = ({ navigation }) => {
    const { updateFormData, formData } = useForm(); // ✅ Use Form Context to manage data

    const handleNext = () => {
        updateFormData("hazard1", { ...formData.hazard1, hasVisited: true });
        navigation.navigate("Hazard2", { formData }); // ✅ Pass data forward
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.header}>Job Hazard Analysis</Text>
            </View>

            {/* Display First Image */}
            <Image source={require("../Assets/JHAtriangle.png")} style={styles.image} />

            {/* Display Second Image */}
            <Image source={require("../Assets/JHAsquare.png")} style={styles.image} />

            {/* Navigation Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleNext}>
                <Ionicons name="add-circle-outline" size={20} color="#ffffff" style={styles.addIcon} />
                <Text style={styles.addButtonText}>Add Job Hazard Analysis</Text>
            </TouchableOpacity>
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
        marginLeft: 5,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 20,
        resizeMode: "contain",
    },
    addButton: {
        backgroundColor: "#486ECD",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "center",
    },
    addButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    addIcon: {
        marginRight: 5,
    },
});

export default Hazard1;
