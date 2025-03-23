// import React, { useEffect, useState, useRef } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     Alert,
//     Modal,
//     Image
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useForm } from "../FormContext";
// import SignatureCanvas from "react-native-signature-canvas";
// import RNFS from "react-native-fs";
// import Share from "react-native-share";
// import jsPDF from "jspdf";

// const PDFScreen = ({ navigation }) => {
//     const { formData } = useForm();
//     const [pdfUri, setPdfUri] = useState(null);
//     const [signature, setSignature] = useState(null);
//     const [showSignatureModal, setShowSignatureModal] = useState(false);
//     const signatureRef = useRef(null);

//     useEffect(() => {
//         generatePDF();
//     }, []);

//     //Function to Generate PDF
//     const generatePDF = async () => {
//         try {
//             const doc = new jsPDF();
//             doc.setFontSize(16);
//             doc.text("Job Hazard Analysis Report", 10, 10);

//             //Add Project Details
//             doc.setFontSize(12);
//             doc.text(`Project Name: ${formData.hazard1?.projectName || "N/A"}`, 10, 20);
//             doc.text(`Location: ${formData.hazard2?.location || "N/A"}`, 10, 30);
//             doc.text(`Date: ${formData.hazard2?.selectedDate || "N/A"}`, 10, 40);

//             //List Hazards
//             doc.text("Identified Hazards:", 10, 50);
//             formData.hazard3?.checkedItems?.forEach((hazard, index) => {
//                 doc.text(`- ${hazard}`, 10, 60 + index * 10);
//             });

//             //Add Tasks from Hazard4
//             doc.text("Tasks and Control Plans:", 10, 80);
//             formData.hazard4?.tasks?.forEach((task, index) => {
//                 doc.text(`${index + 1}. ${task.task} - Severity: ${task.severity}`, 10, 90 + index * 10);
//                 doc.text(`   Control Plan: ${task.controlPlan}`, 10, 100 + index * 10);
//             });

//             //Add Signature Placeholder
//             doc.text("Signed By:", 10, 140);
//             if (signature) {
//                 doc.addImage(signature, "PNG", 10, 150, 50, 20);
//             } else {
//                 doc.text("Awaiting signature...", 10, 150);
//             }

//             //Save PDF to Temporary Storage
//             const pdfPath = `${RNFS.DocumentDirectoryPath}/Job_Hazard_Analysis.pdf`;
//             await RNFS.writeFile(pdfPath, doc.output("datauristring").split(",")[1], "base64");
//             setPdfUri(`file://${pdfPath}`);
//         } catch (error) {
//             console.error("PDF Generation Error:", error);
//             Alert.alert("Error", "Failed to generate PDF");
//         }
//     };

//     //Function to Share the PDF via Email
//     const sendPDF = async () => {
//         if (!pdfUri) {
//             Alert.alert("Error", "PDF is not ready yet");
//             return;
//         }
//         try {
//             await Share.open({
//                 title: "Send Job Hazard Analysis Report",
//                 message: "Please find the attached Job Hazard Analysis report.",
//                 url: pdfUri,
//                 type: "application/pdf",
//             });
//         } catch (error) {
//             console.error("Error sending PDF:", error);
//         }
//     };

//     //Function to Save Signature
//     const handleSignatureOK = () => {
//         if (signatureRef.current) {
//             signatureRef.current.readSignature().then((signatureData) => {
//                 setSignature(signatureData);
//                 setShowSignatureModal(false);
//                 generatePDF(); // Regenerate PDF with the signature
//             });
//         }
//     };

//     return (
//         <ScrollView style={styles.container}>
//             <View style={styles.headerContainer}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="black" />
//                     <Text style={styles.headerTitle}>Review & Submit</Text>
//                 </TouchableOpacity>
//             </View>

//             <Text style={styles.sectionTitle}>Review Job Hazard Analysis</Text>

//             <TouchableOpacity style={styles.button} onPress={generatePDF}>
//                 <Ionicons name="document-outline" size={20} color="white" />
//                 <Text style={styles.buttonText}>Generate PDF</Text>
//             </TouchableOpacity>

//             {pdfUri && (
//                 <>
//                     <TouchableOpacity style={styles.button} onPress={sendPDF}>
//                         <Ionicons name="mail-outline" size={20} color="white" />
//                         <Text style={styles.buttonText}>Send via Email</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.signatureButton} onPress={() => setShowSignatureModal(true)}>
//                         <Ionicons name="create-outline" size={20} color="black" />
//                         <Text style={styles.signatureButtonText}>
//                             {signature ? "Edit Signature" : "Sign Here"}
//                         </Text>
//                     </TouchableOpacity>
//                 </>
//             )}

//             <Modal visible={showSignatureModal} transparent={true} animationType="slide">
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <Text style={styles.signatureText}>Sign Here:</Text>
//                         <SignatureCanvas ref={signatureRef} strokeColor="black" />
//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSignatureModal(false)}>
//                                 <Text style={styles.buttonText}>Cancel</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.submitButton} onPress={handleSignatureOK}>
//                                 <Text style={[styles.buttonText, { color: "white" }]}>OK</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//     headerContainer: { flexDirection: "row", alignItems: "center", marginTop: 50, marginBottom: 20 },
//     backButton: { flexDirection: "row", alignItems: "center" },
//     headerTitle: { fontSize: 18, marginLeft: 10, fontWeight: "bold" },
//     sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
//     button: { backgroundColor: "#486ECD", padding: 15, borderRadius: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", marginBottom: 10 },
//     buttonText: { color: "#fff", fontSize: 16, marginLeft: 10 },
//     signatureButton: { borderWidth: 1, borderColor: "#486ECD", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
//     signatureButtonText: { color: "#486ECD", fontSize: 16 },
//     modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
//     modalContent: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
//     signatureText: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
//     buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
//     cancelButton: { padding: 10 },
//     submitButton: { backgroundColor: "#486ECD", padding: 10, borderRadius: 5 },
// });

// export default PDFScreen;
