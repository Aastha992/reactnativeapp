import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Modal,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useForm } from "../FormContext";
import jsPDF from "jspdf";
import SignatureCanvas from "react-native-signature-canvas";

const Hazard5 = ({ route, navigation }) => {
    const { formData, updateFormData } = useForm();
    const [workers, setWorkers] = useState([{ name: "", signature: null }]);
    const [reviewedBy, setReviewedBy] = useState("");
    const [reviewSignature, setReviewSignature] = useState(null);
    const [dateReviewed, setDateReviewed] = useState("");
    const [siteOrientationChecked, setSiteOrientationChecked] = useState(false);
    const [toolBoxMeetingChecked, setToolBoxMeetingChecked] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [workerSignatureModalVisible, setWorkerSignatureModalVisible] = useState(false);
    const [reviewSignatureModalVisible, setReviewSignatureModalVisible] = useState(false);
    const [currentWorkerIndex, setCurrentWorkerIndex] = useState(null);

    const sigCanvasRef = useRef(null);
    const sigReviewCanvasRef = useRef(null);

    const { selectedDate, time, location, projectName, description, checkedItems, tasks } = route.params;

    useEffect(() => {
        if (formData.hazard5) {
            setWorkers(formData.hazard5.workers || [{ name: "", signature: null }]);
            setReviewedBy(formData.hazard5.reviewedBy || "");
            setReviewSignature(formData.hazard5.reviewSignature || null);
            setDateReviewed(formData.hazard5.dateReviewed || "");
            setSiteOrientationChecked(formData.hazard5.siteOrientationChecked || false);
            setToolBoxMeetingChecked(formData.hazard5.toolBoxMeetingChecked || false);
        }
    }, [formData.hazard5]);

    const handleStateUpdate = (
        newWorkers,
        newReviewedBy,
        newReviewSignature,
        newDateReviewed,
        newSiteOrientationChecked,
        newToolBoxMeetingChecked
    ) => {
        setWorkers(newWorkers);
        setReviewedBy(newReviewedBy);
        setReviewSignature(newReviewSignature);
        setDateReviewed(newDateReviewed);
        setSiteOrientationChecked(newSiteOrientationChecked);
        setToolBoxMeetingChecked(newToolBoxMeetingChecked);

        const data = {
            workers: newWorkers,
            reviewedBy: newReviewedBy,
            reviewSignature: newReviewSignature,
            dateReviewed: newDateReviewed,
            siteOrientationChecked: newSiteOrientationChecked,
            toolBoxMeetingChecked: newToolBoxMeetingChecked,
        };
        updateFormData("hazard5", data);
    };

    const handleSubmit = async () => {
        if (!reviewedBy || !reviewSignature || !dateReviewed) {
            Alert.alert("Error", "Please fill all fields before submitting.");
            return;
        }

        const userData = {
            selectedDate,
            time,
            location,
            projectName,
            description,
            checkedItems,
            tasks,
            workers,
            reviewedBy,
            reviewSignature,
            dateReviewed,
        };

        try {
            const response = await axios.post("http://10.0.0.221:5001/api/jha/job-hazard", userData);
            if (response.data) {
                Alert.alert("Success", "Job Hazard submitted successfully.");

                // Generate PDF after successful submission
                generatePDF(userData);

                navigation.navigate("Hazard1");
            } else {
                Alert.alert("Error", "Failed to submit job hazard.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            Alert.alert("Error", "Submission failed. Please try again.");
        }
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Job Hazard Analysis Report", 10, 10);

        doc.setFontSize(12);
        doc.text(`Project Name: ${data.projectName}`, 10, 20);
        doc.text(`Location: ${data.location}`, 10, 30);
        doc.text(`Date: ${data.selectedDate}`, 10, 40);

        data.workers.forEach((worker, index) => {
            doc.text(`Worker ${index + 1}: ${worker.name}`, 10, 50 + index * 10);
        });

        doc.save("Job_Hazard_Analysis.pdf");
    };

    const handleWorkerChange = (index, field, value) => {
        const updatedWorkers = [...workers];
        updatedWorkers[index][field] = value;
        handleStateUpdate(
            updatedWorkers,
            reviewedBy,
            reviewSignature,
            dateReviewed,
            siteOrientationChecked,
            toolBoxMeetingChecked
        );
    };

    const handleWorkerSignatureOpen = (index) => {
        setCurrentWorkerIndex(index);
        setWorkerSignatureModalVisible(true);
    };

    const handleOKWorkerSignature = () => {
        if (sigCanvasRef.current) {
            const signature = sigCanvasRef.current.readSignature();
            const updatedWorkers = [...workers];
            updatedWorkers[currentWorkerIndex].signature = signature;
            setWorkers(updatedWorkers);
            setWorkerSignatureModalVisible(false);
            handleStateUpdate(
                updatedWorkers,
                reviewedBy,
                reviewSignature,
                dateReviewed,
                siteOrientationChecked,
                toolBoxMeetingChecked
            );
        }
    };

    const handleOKReviewerSignature = () => {
        if (sigReviewCanvasRef.current) {
            const signature = sigReviewCanvasRef.current.readSignature();
            setReviewSignature(signature);
            setReviewSignatureModalVisible(false);
            handleStateUpdate(
                workers,
                reviewedBy,
                signature,
                dateReviewed,
                siteOrientationChecked,
                toolBoxMeetingChecked
            );
        }
    };

    const handleReviewSignatureChange = () => {
        setReviewSignatureModalVisible(true);
    };

    const handleSiteOrientationChange = () => {
        setSiteOrientationChecked((prev) => !prev);
        handleStateUpdate(
            workers,
            reviewedBy,
            reviewSignature,
            dateReviewed,
            !siteOrientationChecked,
            toolBoxMeetingChecked
        );
    };

    const handleToolBoxMeetingChange = () => {
        setToolBoxMeetingChecked((prev) => !prev);
        handleStateUpdate(
            workers,
            reviewedBy,
            reviewSignature,
            dateReviewed,
            siteOrientationChecked,
            !toolBoxMeetingChecked
        );
    };

    const handleReviewedByChange = (text) => {
        setReviewedBy(text);
        handleStateUpdate(
            workers,
            text,
            reviewSignature,
            dateReviewed,
            siteOrientationChecked,
            toolBoxMeetingChecked
        );
    };

    const addNewWorker = () => {
        handleStateUpdate(
            [...workers, { name: "", signature: null }],
            reviewedBy,
            reviewSignature,
            dateReviewed,
            siteOrientationChecked,
            toolBoxMeetingChecked
        );
    };

    const removeWorker = (index) => {
        const updatedWorkers = workers.filter((_, workerIndex) => workerIndex !== index);
        handleStateUpdate(
            updatedWorkers,
            reviewedBy,
            reviewSignature,
            dateReviewed,
            siteOrientationChecked,
            toolBoxMeetingChecked
        );
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const day = String(selectedDate.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            setDateReviewed(formattedDate);
            handleStateUpdate(
                workers,
                reviewedBy,
                reviewSignature,
                formattedDate,
                siteOrientationChecked,
                toolBoxMeetingChecked
            );
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
                {/* <TouchableOpacity onPress={() => navigation.navigate("HazardDetails")}>
                    <Text style={styles.viewDetails}>View Hazard Details</Text>
                </TouchableOpacity> */}
            </View>

            <View style={styles.projectDetailsContainer}>
                <Text style={styles.projectDetailsTitle}>4. General Details</Text>
            </View>

            <View style={styles.progressContainer}>
                {[1, 2, 3, 4].map((step, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            onPress={() => {
                                if (step === 1)
                                    navigation.navigate("Hazard2", {
                                        selectedDate,
                                        time,
                                        location,
                                        projectName,
                                        description,
                                    });
                                else if (step === 2)
                                    navigation.navigate("Hazard3", {
                                        selectedDate,
                                        time,
                                        location,
                                        projectName,
                                        description,
                                    });
                                else if (step === 3)
                                    navigation.navigate("Hazard4", {
                                        selectedDate,
                                        time,
                                        location,
                                        projectName,
                                        description,
                                        checkedItems,
                                        tasks,
                                    });
                                else if (step === 4)
                                    navigation.navigate("Hazard5", {
                                        selectedDate,
                                        time,
                                        location,
                                        projectName,
                                        description,
                                        checkedItems,
                                        tasks,
                                    });
                            }}>
                            <View
                                style={[
                                    styles.progressCircle,
                                    step <= 4 ? styles.activeCircle : {},
                                ]}>
                                <Text
                                    style={[
                                        styles.progressText,
                                        step <= 4 ? styles.activeText : {},
                                    ]}>
                                    {step}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {index < 3 && (
                            <View
                                style={[
                                    styles.progressLine,
                                    step < 4 ? styles.completedLine : {},
                                ]}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    Have you completed site orientation?
                </Text>
                <TouchableOpacity
    style={[
        styles.checkbox,
        siteOrientationChecked && styles.checkedBox,
    ]}
    onPress={handleSiteOrientationChange}
>
    {siteOrientationChecked && (
        <Ionicons name="checkmark" size={16} color="white" />
    )}
</TouchableOpacity>

            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    Have you completed tool box meeting?
                </Text>
                <TouchableOpacity
                    style={[
                        styles.checkbox,
                        toolBoxMeetingChecked && styles.checkedBox,
                    ]}
                    onPress={handleToolBoxMeetingChange}>
                    {toolBoxMeetingChecked && (
                        <Ionicons name="checkmark" size={16} color="white" />
                    )}
                </TouchableOpacity>
            </View>

            {/* <Text style={styles.sectionTitle}>Add Workers Name and Signature</Text>

            {workers.map((worker, index) => (
                <View key={index} style={styles.workerContainer}>
                    <Text style={styles.workerTitle}>
                        Worker Name {index + 1}
                    </Text>
                    <TextInput
                        style={[styles.input, { borderColor: "#000" }]}
                        placeholder="Input Field"
                        placeholderTextColor="#777"
                        value={worker.name}
                        onChangeText={(text) =>
                            handleWorkerChange(index, "name", text)
                        }
                    />
                    <View
                        style={[
                             styles.input,
                             styles.signatureInput,
                             { borderColor: "#000",   justifyContent: 'center',
                                 alignItems: 'center' },
                         ]}
                        >
                     {worker.signature ? (
                                   <Image
                                       source={{ uri: worker.signature }}
                                       style={{ width: 100, height: 40, resizeMode: 'contain'}}
                                   />
                               ) : (
                                   <TouchableOpacity
                                        style = {{ width: "100%", height: "100%", justifyContent: 'center',
                                          alignItems: 'center' }}
                                         onPress={() => handleWorkerSignatureOpen(index)}
                                     >
                                         <Text  style={{ color: "#777" }}>Sign</Text>
                                    </TouchableOpacity>
                                 )}
                         </View>


                    {index > 0 && (
                        <TouchableOpacity
                            onPress={() => removeWorker(index)}
                            style={styles.deleteWorkerButton}>
                            <Ionicons name="remove-circle" size={24} color="red" />
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <View style={styles.addNewButtonContainer}>
                <TouchableOpacity
                    style={styles.addNewButton}
                    onPress={addNewWorker}>
                    <Ionicons name="add-circle-outline" size={24} color="#486ECD" />
                    <Text style={styles.addNewText}>Add New</Text>
                </TouchableOpacity>
            </View> */}

            {/* <Text style={styles.sectionTitle}>Reviewed by</Text>
            <TextInput
                style={[styles.input, { borderColor: "#000" }]}
                placeholder="Enter"
                placeholderTextColor="#777"
                value={reviewedBy}
                onChangeText={handleReviewedByChange}
            />
             <View
                        style={[
                             styles.input,
                             styles.signatureInput,
                             { borderColor: "#000",   justifyContent: 'center',
                                 alignItems: 'center' },
                         ]}
                        >
                 {reviewSignature ? (
                                     <Image
                                         source={{ uri: reviewSignature }}
                                         style={{ width: 100, height: 40, resizeMode: 'contain'}}
                                     />
                                 ) : (
                                     <TouchableOpacity
                                          style = {{ width: "100%", height: "100%", justifyContent: 'center',
                                            alignItems: 'center' }}
                                          onPress={handleReviewSignatureChange}
                                      >
                                          <Text style={{ color: "#777" }}>Sign</Text>
                                     </TouchableOpacity>
                                  )}
                     </View> */}


            <Text style={styles.sectionTitle}>Date Reviewed</Text>
            <View
                style={[
                    styles.input,
                    styles.dateInputContainer,
                    {
                        borderColor: "#000",
                        borderWidth: 1,
                        borderRadius: 5,
                        flexDirection: "row",
                        alignItems: "center",
                    },
                ]}>
                <TextInput
                    style={{
                        flex: 1,
                        paddingRight: 35,
                        color: dateReviewed ? "#000" : "#777",
                    }}
                    placeholder="Select"
                    placeholderTextColor="#777"
                    value={dateReviewed}
                    editable={false}
                />
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.iconWrapper}>
                    <Ionicons name="calendar-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={dateReviewed ? new Date(dateReviewed) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.previousButton}
                    onPress={() =>
                        navigation.navigate("Hazard4", {
                            selectedDate,
                            time,
                            location,
                            projectName,
                            description,
                            checkedItems,
                            tasks,
                        })
                    }>
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
    style={styles.submitButton}
    onPress={handleGeneratePDF}>
    <Text style={[styles.buttonText, { color: "#fff" }]}>Generate PDF</Text>
</TouchableOpacity>

            </View>
            {/*worker modal*/}
            <Modal
                visible={workerSignatureModalVisible}
                transparent={true}
                animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { flex: 1 }]}>
                        <Text style={styles.signatureText}>Sign above</Text>
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            style={styles.signatureCanvas}
                            strokeColor={"black"}
                        />
                        <View style={styles.buttonContainerModal}>
                            <TouchableOpacity
                                style={styles.previousButtonModal}
                                onPress={() => setWorkerSignatureModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButtonModal}
                                onPress={() => handleOKWorkerSignature(currentWorkerIndex)}>
                                <Text style={[styles.buttonText, { color: "#fff" }]}>
                                    Ok
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/*Reviewer modal*/}
            <Modal
                visible={reviewSignatureModalVisible}
                transparent={true}
                animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { flex: 1 }]}>
                        <Text style={styles.signatureText}>Sign above</Text>
                        <SignatureCanvas
                            ref={sigReviewCanvasRef}
                            style={styles.signatureCanvas}
                            strokeColor={"black"}
                        />
                        <View style={styles.buttonContainerModal}>
                            <TouchableOpacity
                                style={styles.previousButtonModal}
                                onPress={() => setReviewSignatureModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButtonModal}
                                onPress={handleOKReviewerSignature}>
                                <Text style={[styles.buttonText, { color: "#fff" }]}>
                                    Ok
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
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
        borderColor: "#000",
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
    questionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    questionText: {
        fontSize: 16,
        color: "#000",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: "#d3d3d3",
        borderRadius: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    checkedBox: {
        backgroundColor: "#486ECD",
        borderColor: "#486ECD",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 15,
    },
    workerContainer: {
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#d3d3d3",
        position: "relative",
    },
    workerTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
     input: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 15,
        color: "#000",
    },
     signatureInput: {
        height: 60,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#000",
    },
    deleteWorkerButton: {
        position: "absolute",
        top: 15,
        right: 15,
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
        marginBottom: 30,
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
    submitButton: {
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
    dateInputContainer: {
        position: "relative",
    },
    iconWrapper: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        flex: 1,
        width: "90%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    signatureCanvas: {
        flex: 1,
        width: "100%",
        borderColor: "#000",
        borderWidth: 1,
    },
    signatureText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    buttonContainerModal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    previousButtonModal: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#486ECD",
        flex: 1,
        marginRight: 10,
    },
    submitButtonModal: {
        backgroundColor: "#486ECD",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
    },
});
const handleGeneratePDF = async () => {
    try {
        updateFormData("hazard5", { completed: true }); // Mark as completed
        navigation.navigate("PDFScreen"); // Move to PDF screen where signing and email happens
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

export default Hazard5;