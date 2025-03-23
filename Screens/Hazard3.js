import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "../FormContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Hazard3 = ({ navigation, route }) => {
    const prevData = route.params?.formData || {};

    const { formData, updateFormData } = useForm();
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');


    const [otherText, setOtherText] = useState({
        "Worksite Hazards": "",
        "Equipment Hazards": "",
        "Ergonomic Hazards": "",
        "Confined/Restricted Spaces": "",
        "Environmental Hazards": "",
        "Additional Requirements": "",
        "Misc. Hazards": "",
    });
    const [activeCategory, setActiveCategory] = useState("Worksite Hazards");

    const hazardCategories = [
        "Worksite Hazards",
        "Equipment Hazards",
        "Ergonomic Hazards",
        "Confined/Restricted Places",
        "Environmental Hazards",
        "Additional Requirements",
        "Misc. Hazards",
    ];

    const ergonomicHazards = [
        "Rough Terrain",
        "Traversing Steep Slopes",
        "Excessive Noise Levels",
        "Excessive Dust/Fumes",
        "Working in Darkness",
        "Lighting - Lack of",
        "Slips, Trips and Falls",
        "Awkward Body Positioning",
        "Prolonged Twisting/Bending",
        "Pinch Points",
        "Other",
    ];
    const equipmentHazards = [
        "Hand Tools",
        "Power Tools",
        "Field Equipment",
        "Ladders",
        "Scaffolds",
        "Aerial Work Platforms",
        "Stuck Vehicles",
        "Lockout/Tagout",
        "Other",
    ];
    const worksiteHazards = [
        "Heavy Construction Equipment",
        "Access / Egress at Site",
        "Open Excavations / Trenches",
        "Proper Shoring / Cut-Backs",
        "Overhead Lines",
        "Roadway Obstacles",
        "Underground Utilities",
        "U/G Locates Current and Available",
        "Potential For Electric Shock",
        "Pile Driving",
        "Floor/Dangerous Openings",
        "Hazardous Materials",
        "Pedestrians",
        "Public Traffic - High/Low Volume",
        "Traffic Control",
        "Cranes/Hoists/Lifting Devices",
        "Working at Heights",
        "Working On/Near/Over Water",
        "Working On/Near Ice",
        "Communications",
        "Housekeeping",
        "Welding",
        "Drilling",
        "Other",
    ];
    const confinedSpacesHazards = [
        "Access/Egress",
        "Hazardous Environment",
        "CSE Permit",
        "CSE Equipment",
        "Ventilation/Purging",
        "Enough Attendants/Monitor #",
        "Communications",
        "Atmosphere Monitoring",
        "Rescue Plan",
        "Other",
    ];
    const environmentalHazards = [
        "Extreme Weather",
        "Hot/Cold Working Conditions",
        "Spills/Leaks",
        "Dewatering",
        "Erosion Control/Storm Drains",
        "Other",
    ];
    const additionalRequirements = [
        "Sufficient Training",
        "Standard PPE in Good Condition",
        "Specialty PPE - Available",
        "Fire Extinguisher",
        "First Aid Kit",
        "First Aid Attendant/s Onsite",
        "Eye Wash Station - Available",
        "Is Your Site Orientation Done?",
        "Know Emergency Response Plan",
        "Are You Fit For Duty?",
        "Is 911 Available in Your Work Area?",
        "Other",
    ];
    const miscHazards = [
        "Hazardous Materials/Substances",
        "Are You Working Alone at Any Time",
        "New Workers",
        "Fatigue",
        "Lifting/Handling Loads",
        "Bridge Inspection",
        "Potential Violence/Harassment",
        "Other",
    ];

    //  const saveHazard3Data = useCallback(async (data) => {
    //     try {
    //         const hazard3DataToSave = JSON.stringify(data);
    //         await AsyncStorage.setItem("hazard3Data", hazard3DataToSave);
    //     } catch (e) {
    //         console.error("Error saving hazard3 data", e);
    //     }
    // }, []);

    // const loadHazard3Data = useCallback(async () => {
    //     try {
    //         const hazard3Data = await AsyncStorage.getItem("hazard3Data");
    //         if (hazard3Data) {
    //             const parsedData = JSON.parse(hazard3Data);
    //             setCheckedItems(parsedData.checkedItems || []);
    //             setOtherText(parsedData.otherText || {
    //                 "Worksite Hazards": "",
    //                 "Equipment Hazards": "",
    //                 "Ergonomic Hazards": "",
    //                 "Confined/Restricted Spaces": "",
    //                 "Environmental Hazards": "",
    //                 "Additional Requirements": "",
    //                 "Misc. Hazards": "",
    //             });
    //         }
    //     } catch (e) {
    //         console.error("Error loading hazard3 data", e);
    //     }
    // }, []);

    useEffect(() => {
        
    }, []);
    
    useEffect(() => {
        if (formData.hazard3) {
            setCheckedItems(formData.hazard3.checkedItems || []);
            setOtherText(formData.hazard3.otherText || {
                "Worksite Hazards": "",
                "Equipment Hazards": "",
                "Ergonomic Hazards": "",
                "Confined/Restricted Spaces": "",
                "Environmental Hazards": "",
                "Additional Requirements": "",
                "Misc. Hazards": "",
            });
        } else {
            setSelectedDate(prevData.selectedDate || '');
            setTime(prevData.time || '');
            setLocation(prevData.location || '');
            setProjectName(prevData.projectName || '');
            setDescription(prevData.description || '');
        }
    }, []);  
    


    const handleStateUpdate = (newCheckedItems, newOtherText) => {
        setCheckedItems(newCheckedItems);
        setOtherText(newOtherText);
        updateFormData('hazard3', { checkedItems: newCheckedItems, otherText: newOtherText });
    };
    

    const toggleCheckbox = (hazard) => {
        setCheckedItems((prevCheckedItems) => {
            const updatedCheckedItems = prevCheckedItems.includes(hazard)
                ? prevCheckedItems.filter((item) => item !== hazard)
                : [...prevCheckedItems, hazard];
    
            updateFormData('hazard3', { checkedItems: updatedCheckedItems, otherText });
    
            return updatedCheckedItems;
        });
    };
    
    const handleNext = () => {
        updateFormData('hazard3', { checkedItems, otherText });
        
        navigation.navigate("Hazard4");
    };
    

const handleBack = () => {
    navigation.navigate("Hazard2", { formData: prevData });
};

const handleOtherTextChange = (text, category) => {
    setOtherText((prevOtherText) => {
        const updatedOtherText = { ...prevOtherText, [category]: text };
        updateFormData('hazard3', { checkedItems, otherText: updatedOtherText });
        return updatedOtherText;
    });
};


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("HomeScreen")}
                        style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                        <Text style={styles.headerTitle}>Add JHA</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.projectDetailsContainer}>
                    <Text style={styles.projectDetailsTitle}>2. Hazard Selection</Text>
                </View>

                <View style={styles.progressContainer}>
                    {[1, 2, 3, 4].map((step, index) => (
                        <React.Fragment key={index}>
                            <TouchableOpacity
                                onPress={() => {
                                     if (step === 1) navigation.navigate("Hazard2",{
                                          selectedDate,
                                        time,
                                         location,
                                        projectName,
                                         description,
                                     });
                                    else if (step === 2) navigation.navigate("Hazard3",{
                                       selectedDate,
                                        time,
                                        location,
                                         projectName,
                                         description,
                                     });
                                    else if (step === 3) navigation.navigate("Hazard4", {
                                        selectedDate,
                                        time,
                                        location,
                                        projectName,
                                         description,
                                         checkedItems,
                                     });
                                     else if (step === 4) navigation.navigate("Hazard5", {
                                         selectedDate,
                                        time,
                                        location,
                                        projectName,
                                         description,
                                         checkedItems,
                                     });
                                }}
                                style={[
                                    styles.progressCircle,
                                    step <= 2 ? styles.activeCircle : {},
                                    step === 1 ? styles.completedCircle : {},
                                ]}>
                                <Text
                                    style={[
                                        styles.progressText,
                                        step <= 2 ? styles.activeText : {},
                                        step === 1 ? styles.completedText : {},
                                    ]}>
                                    {step}
                                </Text>
                            </TouchableOpacity>
                            {index < 3 && (
                                <View
                                    style={[
                                        styles.progressLine,
                                        step === 1 ? styles.completedLine : {},
                                        step === 2 ? styles.greyLine : {},
                                    ]}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabContainer}>
                    {hazardCategories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setActiveCategory(category)}>
                            <Text
                                style={[
                                    styles.tab,
                                    activeCategory === category ? styles.activeTab : {},
                                ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.hazardListContainer}>
                    {activeCategory === "Worksite Hazards" &&
                        worksiteHazards.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                    {activeCategory === "Equipment Hazards" &&
                        equipmentHazards.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                    {activeCategory === "Ergonomic Hazards" &&
                        ergonomicHazards.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                    {activeCategory === "Confined/Restricted Places" &&
                        confinedSpacesHazards.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                    {activeCategory === "Environmental Hazards" &&
                        environmentalHazards.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                    {activeCategory === "Additional Requirements" &&
                        additionalRequirements.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                    {activeCategory === "Misc. Hazards" &&
                        miscHazards.map((hazard, index) => (
                            <View key={index} style={styles.hazardItem}>
                                <Text style={styles.hazardText}>{hazard}</Text>
                                <TouchableOpacity onPress={() => toggleCheckbox(hazard)}>
                                    <Ionicons
                                        name={
                                            checkedItems.includes(hazard)
                                                ? "checkbox"
                                                : "square-outline"
                                        }
                                        size={24}
                                        color="#486ECD"
                                    />
                                </TouchableOpacity>
                                {hazard === "Other" && checkedItems.includes(hazard) && (
                                    <TextInput
                                        style={styles.inlineOtherInput}
                                        placeholder="Please specify..."
                                        value={otherText[activeCategory]}
                                        onChangeText={(text) => {
                                            handleOtherTextChange(text, activeCategory)
                                        }}
                                        placeholderTextColor="#666"
                                        multiline
                                    />
                                )}
                            </View>
                        ))}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.previousButton, { flex: 1, marginRight: 10 }]}
                        onPress={handleBack}>
                        <Text style={[styles.buttonText, { textAlign: "center" }]}>
                            Previous
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.nextButton, { flex: 1, marginLeft: 10 }]}
                        onPress={handleNext}>
                        <Text
                            style={[
                                styles.buttonText,
                                { color: "#fff", textAlign: "center" },
                            ]}>
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: "bold",
    },
    viewDetails: {
        color: "#486ECD",
        fontSize: 16,
    },
    projectDetailsContainer: {
        marginBottom: 10,
    },
    projectDetailsTitle: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20,
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
    greyBackground: {
        backgroundColor: "#d3d3d3",
    },
    progressText: {
        fontSize: 16,
        color: "#000",
    },
    activeText: {
        color: "#486ECD",
    },
    completedText: {
        color: "#486ECD",
    },
    progressLine: {
        height: 2,
        flex: 1,
        backgroundColor: "#d3d3d3",
    },
    completedLine: {
        backgroundColor: "#486ECD",
    },
    greyLine: {
        backgroundColor: "#d3d3d3",
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    tab: {
        fontSize: 16,
        color: "#000",
        marginRight: 15,
    },
    activeTab: {
        color: "#486ECD",
        fontWeight: "bold",
    },
    hazardListContainer: {
        marginBottom: 20,
    },
    hazardItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#486ECD",
        borderRadius: 10,
        marginBottom: 10,
    },
    hazardText: {
        fontSize: 16,
        color: "#000",
    },
    inlineOtherInput: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        borderBottomWidth: 1,
        borderColor: "#486ECD",
        marginTop: 5,
        paddingHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    previousButton: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#486ECD",
    },
    nextButton: {
        backgroundColor: "#486ECD",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    buttonText: {
        color: "#486ECD",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Hazard3;