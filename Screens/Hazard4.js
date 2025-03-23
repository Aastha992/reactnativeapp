import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    FlatList,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "../FormContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Hazard4 = ({ route, navigation }) => {
    const { formData, updateFormData } = useForm();
    const [activeStep, setActiveStep] = useState(3);
    const [tasks, setTasks] = useState([
        { task: "Site Inspection", severity: "H", hazard: "", controlPlan: "" },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
    const [currentDropdown, setCurrentDropdown] = useState(null);

    const {
        selectedDate,
        time,
        location,
        projectName,
        description,
        checkedItems,
    } = route.params;

    const severityOptions = [
        { label: "High (H)", value: "H" },
        { label: "Medium (M)", value: "M" },
        { label: "Low (L)", value: "L" },
    ];

    const hazardOptions = [
        {
            label: "Claustrophobia Due to Tight Spaces",
            value: "Claustrophobia Due to Tight Spaces",
        },
        {
            label: "Communication or Lack Thereof",
            value: "Communication or Lack Thereof",
        },
        { label: "Confined Space Entry", value: "Confined Space Entry" },
        {
            label: "Confined Space Rescue Plan",
            value: "Confined Space Rescue Plan",
        },
        { label: "Construction Equipment", value: "Construction Equipment" },
        { label: "Excessive Dust/Fumes", value: "Excessive Dust/Fumes" },
        { label: "Excessive Noise Levels", value: "Excessive Noise Levels" },
        { label: "Floor/Dangerous Openings", value: "Floor/Dangerous Openings" },
        { label: "Grinding and Cutting", value: "Grinding and Cutting" },
        {
            label: "Hazardous Materials/Substances",
            value: "Hazardous Materials/Substances",
        },
        { label: "Inadequate/Defective PPEs", value: "Inadequate/Defective PPEs" },
        { label: "Insect Bites and Stings", value: "Insect Bites and Stings" },
        { label: "Mobile/Tower/Bridge Crane", value: "Mobile/Tower/Bridge Crane" },
        { label: "Needles/Sharp Objects", value: "Needles/Sharp Objects" },
        { label: "Open Excavation/Trenches", value: "Open Excavation/Trenches" },
        {
            label: "Potential for Electric Shock",
            value: "Potential for Electric Shock",
        },
        {
            label: "Presence of Hazardous Gases",
            value: "Presence of Hazardous Gases",
        },
        { label: "Scaffold Stairs/Ladders", value: "Scaffold Stairs/Ladders" },
        { label: "Slips/Trips/Falls", value: "Slips/Trips/Falls" },
        { label: "Traversing Steep Slopes", value: "Traversing Steep Slopes" },
        { label: "Welding", value: "Welding" },
        { label: "Working Alone", value: "Working Alone" },
        { label: "Working at Heights", value: "Working at Heights" },
        { label: "Working in Cold Weather", value: "Working in Cold Weather" },
        {
            label: "Working in Darkness/Low Light Conditions",
            value: "Working in Darkness/Low Light Conditions",
        },
        { label: "Working in Hot Weather", value: "Working in Hot Weather" },
        {
            label: "Working on/near/over water",
            value: "Working on/near/over water",
        },
    ];

    const controlPlans = {
        "Construction Equipment":
            "Wear appropriate PPE and ensure if possible, to make eye contact with equipment operator so that they are aware you are in the area",
        "Excessive Dust/Fumes":
            "In areas that dust/fumes cannot be controlled or vented, don respiratory protective equipment or avoid the area until dust/fumes can be reduced or eliminated.",
        "Excessive Noise Levels":
            "Ensure that you are wearing proper hearing protection in any areas where the decibel levels exceed 85 dBA and are unable to be controlled. Wear double hearing protection where required or instructed to do so.",
        "Floor/Dangerous Openings":
            "Ensure that proper controls are in place to protect the worker from any openings that are on the site. Ensure that proper PPE is worn and inspected if work is taking place around the opening. Do not lean, sit or stand onto a floor covering without first knowing if it can support your weight.",
        "Open Excavation/Trenches": "Do not stand/walk along edge of excavation",
        "Communication or Lack Thereof":
            "Ensure that a proper line of communication between the entrant and attendant has been established prior to confined space entry",
        "Confined Space Entry":
            "Ensure the confined space area that is being entered has been tested for atmospheric conditions prior to entry and work. Ensure all PPE has been inspected and is in full working order. Ensure that a Confined Space Entry Permit has been completed, fully understood, and signed prior to perfoming this task.",
        "Confined Space Rescue Plan":
            "Ensure that a proper confined space entry plan has been developed and discussed with all workers present who will be undertaking confined space entry/work. Do not attempt rescue if you are not trained to do so.",
        "Grinding and Cutting":
            "Ensure all proper PPE is being worn when completing this task. Ensure area is ventilated to remove any dust or fumes that arise from this task. Check all equipment to ensure it is in working order and all safety guards and precautions are taking when performing this task.",
        "Hazardous Materials/Substances":
            "Read MSDS prior to use of material. Wear appropriate PPE and follow guidelines with regards to MSDS.",
        "Inadequate/Defective PPEs":
            "Ensure that the correct PPE is being worn and that all PPE has been well inspected prior to confined space entry. Ensure that defective items of PPE are taken out of service.",
        "Insect Bites and Stings":
            "Use deet and/or try to avoid areas dense with ticks, mosquitoes, spiders, or any other insects that could potentially carry a virus or disease. If issues with insects persists. Consider fumigation. ",
        "Mobile/Tower/Bridge Crane":
            "Always know where the load is and never walk or stand under the load.",
        "Needles/Sharp Objects":
            "Identify areas that could potentially have sharp objects – have a “sharps” bin on site and remove the hazard following correct procedures and safety protocols. If pricked by an unknown needle or sharp object. Consult your doctor immediately.",
        "Potential for Electric Shock":
            "Stand clear of energized equipment when it is being worked on. Wear specialized PPE when required.",
        "Presence of Hazardous Gases":
            "Ensure that a CSA approved 4 head gas detection monitor is being used to test levels prior to entry as well as worn on the person/s who will be working in the confined space.",
        "Scaffold Stairs/Ladders":
            "Maintain 3 point contact and visually check for any danger or caution flag/tape that may be attached.",
        "Slips/Trips/Falls":
            "Watch footing and clear pathways of hazards and debris.",
        "Traversing Steep Slopes":
            "Ensure that you use any handrails or walkways intended for use to traverse steep slope. If those are not available, watch your footing and traverse with your body parallel to the slope. Ensure proper footwear is being worn.",
        "Welding":
            "Position yourself while welding or cutting is taking place so that your head is not in the fumes. Avoid looking or staring directly at welding flash and wear appropriate PPE. ",
        "Working Alone":
            "Sign in & out, and follow any specific protocols or procedures that are required on your site.",
        "Working at Heights":
            "If above 3m, make sure you have the appropriate training and are wearing the appropriate PPE for the job.",
        "Working in Cold Weather":
            "Layer up and take warm up breaks when necessary.",
        "Working in Darkness/Low Light Conditions":
            "Place temporary lighting if possible, if not, then ensure you have a well maintained and charged headlamp/flashlight. Ensure equipment is intrinsically safe if being used for confined space work.",
        "Working in Hot Weather":
            "Stay hydrated and take cool down breaks when necessary.",
        "Working on/near/over water":
            "Wear specialized PPE when required. Watch for tripping hazards when walking over or near water. Have proper rescue plan in place in the event of falling in.",
    };


   const saveTasksData = useCallback(async (updatedTasks) => {
       try {
           const tasksDataToSave = JSON.stringify(updatedTasks);
           await AsyncStorage.setItem("tasksData", tasksDataToSave);
       } catch (e) {
           console.error("Error saving tasks data", e);
       }
   }, []);

    const loadTasksData = useCallback(async () => {
        try {
            const tasksData = await AsyncStorage.getItem("tasksData");
            if (tasksData) {
                setTasks(JSON.parse(tasksData));
            }
        } catch (e) {
            console.error("Error loading tasks data", e);
        }
    }, []);


    useEffect(() => {
        (async () => {
            const storedTasks = await AsyncStorage.getItem("tasksData");
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            } else if (formData.hazard4) {
                setTasks(formData.hazard4.tasks || [
                    { task: "Site Inspection", severity: "H", hazard: "", controlPlan: "" },
                ]);
            }
        })();
    }, []); 


    const handleStateUpdate = (newTasks) => {
        setTasks(newTasks);
        updateFormData('hazard4', { tasks: newTasks });
    };
    


    const addNewTask = () => {
        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks, { task: "Site Inspection", severity: "H", hazard: "", controlPlan: "" }];
            updateFormData('hazard4', { tasks: updatedTasks });
            return updatedTasks;
        });
    };
    

    const removeTask = (index) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.filter((_, taskIndex) => taskIndex !== index);
            updateFormData('hazard4', { tasks: updatedTasks });
            return updatedTasks;
        });
    };
    


     const handleInputChange = (index, field, value) => {
         const updatedTasks = [...tasks];
         updatedTasks[index][field] = value;
         if (field === "hazard" && controlPlans.hasOwnProperty(value)) {
             updatedTasks[index]["controlPlan"] = controlPlans[value];
         }
        handleStateUpdate(updatedTasks)
    };

    const openDropdown = (index, dropdownType) => {
        setCurrentTaskIndex(index);
        setCurrentDropdown(dropdownType);
        setModalVisible(true);
    };

    const handleSelect = (value) => {
        if (currentTaskIndex !== null && currentDropdown) {
            handleInputChange(currentTaskIndex, currentDropdown, value);
            setModalVisible(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Hazard1")}
                    style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.headerTitle}>Add JHA</Text>
                </TouchableOpacity>
                
            </View>

            <View style={styles.projectDetailsContainer}>
                <Text style={styles.projectDetailsTitle}>3. Task Addition</Text>
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
                                     tasks
                                });
                            }}>
                            <View
                                style={[
                                    styles.progressCircle,
                                    step <= activeStep ? styles.activeCircle : {},
                                    (step === 1 || step === 2) && step <= activeStep
                                        ? styles.greyBackground
                                        : {},
                                ]}>
                                <Text
                                    style={[
                                        styles.progressText,
                                        step <= activeStep ? styles.activeText : {},
                                    ]}>
                                    {step}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {index < 3 && (
                            <View
                                style={[
                                    styles.progressLine,
                                    step < activeStep ? styles.completedLine : {},
                                    (step === 1 || step === 2) && step < activeStep
                                        ? styles.completedLine
                                        : {},
                                ]}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>

            {tasks.map((task, index) => (
                <View key={index} style={styles.taskContainer}>
                    {/* Show the - icon only if the task index is greater than 0 (Task 2 and onward) */}
                    {index > 0 && (
                        <TouchableOpacity
                            onPress={() => removeTask(index)}
                            style={styles.deleteTaskButton}>
                            <Ionicons name="remove-circle" size={24} color="red" />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.taskTitle}>Task - {index + 1}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Tasks"
                        value={task.task}
                        onChangeText={(text) => handleInputChange(index, "task", text)}
                    />

                    <View style={styles.rowContainer}>
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.label}>Severity</Text>
                            <TouchableOpacity
                                onPress={() => openDropdown(index, "severity")}
                                style={styles.pickerWrapper}>
                                <Text style={styles.pickerText}>
                                    {severityOptions.find(
                                        (option) => option.value === task.severity
                                    )?.label || "Select Severity"}
                                </Text>
                                <Ionicons
                                    name="caret-down"
                                    size={16}
                                    color="gray"
                                    style={styles.dropdownIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dropdownContainer}>
                            <Text style={styles.label}>Hazards</Text>
                            <TouchableOpacity
                                onPress={() => openDropdown(index, "hazard")}
                                style={styles.pickerWrapper}>
                                <Text style={styles.pickerText}>
                                    {hazardOptions.find((option) => option.value === task.hazard)
                                        ?.label || "Select Hazard"}
                                </Text>
                                <Ionicons
                                    name="caret-down"
                                    size={16}
                                    color="gray"
                                    style={styles.dropdownIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TextInput
                        style={[styles.input, styles.controlPlanInput, { marginTop: 20 }]}
                        placeholder="Plans to Eliminate/Control"
                        value={task.controlPlan}
                        onChangeText={(text) =>
                            handleInputChange(index, "controlPlan", text)
                        }
                        multiline
                    />
                </View>
            ))}

            <View style={styles.addNewButtonContainer}>
                <TouchableOpacity style={styles.addNewButton} onPress={addNewTask}>
                    <Ionicons name="add-circle-outline" size={24} color="#486ECD" />
                    <Text style={styles.addNewText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={() => navigation.navigate("Hazard3",{
                        selectedDate,
                        time,
                        location,
                        projectName,
                        description,
                        checkedItems,
                    })}>
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() =>
                        navigation.navigate("Hazard5", {
                            selectedDate,
                            time,
                            location,
                            projectName,
                            description,
                            checkedItems,
                            tasks,
                        })
                    }>
                    <Text style={[styles.buttonText, { color: "#fff" }]}>Next</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={
                                currentDropdown === "severity" ? severityOptions : hazardOptions
                            }
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelect(item.value)}>
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const { height } = Dimensions.get("window");

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
    completedLine: {
        backgroundColor: "#486ECD",
    },
    taskContainer: {
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#d3d3d3",
        position: "relative",
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 15,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    dropdownContainer: {
        flex: 1,
        marginRight: 10,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#d3d3d3",
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        height: 50,
    },
    pickerText: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    dropdownIcon: {
        marginLeft: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: "#000",
    },
    controlPlanInput: {
        height: 60,
    },
    deleteTaskButton: {
        position: "absolute",
        top: 10, // Position it at the top of the task box
        right: 10, // Right side of the task box
    },
    addNewButtonContainer: {
        alignItems: "flex-end",
        marginBottom: 20,
    },
    addNewButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#486ECD",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    addNewText: {
        color: "#486ECD",
        fontSize: 16,
        marginLeft: 5,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 150,
    },
    previousButton: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#486ECD",
        flex: 1,
        marginRight: 10,
    },
    nextButton: {
        backgroundColor: "#486ECD",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
    },
    buttonText: {
        color: "#486ECD",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        maxHeight: height * 0.5,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    modalItemText: {
        fontSize: 16,
        color: "#000",
    },
});

export default Hazard4;