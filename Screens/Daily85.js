// Daily85.js
import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView, KeyboardAvoidingView, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { ProjectContext } from '../utils/ProjectContext'; // Import ProjectContext

const Daily85 = ({ navigation }) => {
	const { projectData, setProjectData } = useContext(ProjectContext); // Access ProjectContext
    const { projectId, projectName, projectNumber, owner, userId } = projectData;

	

	const [loading, setLoading] = useState(false);
	const [projectDetails, setProjectDetails] = useState({});
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [timeIn, setTimeIn] = useState(new Date());
	const [showTimeInPicker, setShowTimeInPicker] = useState(false);
	const [timeOut, setTimeOut] = useState(new Date());
	const [showTimeOutPicker, setShowTimeOutPicker] = useState(false);
	const [projectNameState, setProjectName] = useState(projectName || "");
	const [projectNumberState, setProjectNumber] = useState(projectNumber || "");
	const [ownerState, setOwner] = useState(owner || "");

	const [consultantProjectManager, setConsultantProjectManager] = useState("");
	const [contractNumber, setContractNumber] = useState("");
	const [contractProjectManager, setContractProjectManager] = useState("");
	const [cityProjectManager, setCityProjectManager] = useState("");
	const [contractorSiteSupervisorOnshore, setContractorSiteSupervisorOnshore] =
		useState("");
	const [contractorSiteSupervisorOffshore, setContractorSiteSupervisorOffshore] =
		useState("");
	const [contractAdministrator, setContractAdministrator] = useState("");
	const [supportCA, setSupportCA] = useState("");
	const [siteInspector, setSiteInspectors] = useState([""]);
	
  useEffect(() => {
    // Update local state whenever projectData changes
    setProjectName(projectName || "");
    setProjectNumber(projectNumber || "");
    setOwner(owner || "");
  }, [projectName, projectNumber, owner]);
	const addInspector = () => {
		setSiteInspectors([...siteInspector, ""]);
	};

	const updateInspector = (text, index) => {
		const updatedInspectors = [...siteInspector];
		updatedInspectors[index] = text;
		setSiteInspectors(updatedInspectors);
	};

	const removeInspector = (index) => {
		const updatedInspectors = siteInspector.filter((_, i) => i !== index);
		setSiteInspectors(updatedInspectors);
	};


	// Mock API URL (replace with a real API endpoint if available)
	const mockApiUrl = "https://jsonplaceholder.typicode.com/users/1";
	const onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShowDatePicker(false);
		setDate(currentDate);
	};

	const onChangeTimeIn = (event, selectedTime) => {
		const currentTime = selectedTime || timeIn;
		setShowTimeInPicker(false);
		setTimeIn(currentTime);
	};

	const onChangeTimeOut = (event, selectedTime) => {
		const currentTime = selectedTime || timeOut;
		setShowTimeOutPicker(false);
		setTimeOut(currentTime);
	};

	return (
		<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<ScrollView style={styles.container}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					style={styles.header}
					onPress={() => navigation.navigate("Daily84")}>
					<Ionicons name="arrow-back" size={24} color="black" />
					<Text style={[styles.headerText, { fontWeight: "bold" }]}>
						Project 2017-5134 Details
					</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.title}>Enter Project Details</Text>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>Project Name</Text>
				<TextInput
					style={[styles.input, { color: "black" }]}
					placeholder="Enter Project Name"
					value={projectNameState}
					onChangeText={setProjectName}
				/>
				<Text style={styles.label}>Owner</Text>
				<TextInput
					style={[styles.input, { color: "black" }]}
					placeholder="Enter Owner Name"
					value={ownerState}
					onChangeText={setOwner}
				/>
				<Text style={styles.label}>Consultant Project Manager</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={consultantProjectManager}
					onChangeText={setConsultantProjectManager}
				/>
				<Text style={styles.label}>Project Number</Text>
				<TextInput
					style={[styles.input, { color: "black" }]}
					placeholder="Enter Project Number"
					value={projectNumberState}
					onChangeText={setProjectNumber}
				/>

				<Text style={styles.label}>Contract Number</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={contractNumber}
					onChangeText={setContractNumber}
				/>
				<Text style={styles.label}>Date</Text>
				<TouchableOpacity
    onPress={() => setShowDatePicker(true)}
    style={styles.dateInputContainer}>
    <Text style={styles.dateInputText}>
        {date.toLocaleDateString("en-CA", { // Use en-CA for yyyy-mm-dd
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })}
    </Text>
    <Ionicons
        name="calendar"
        size={24}
        color="black"
        style={styles.icon}
    />
</TouchableOpacity>
				{showDatePicker && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode={"date"}
						display="default"
						onChange={onChangeDate}
					/>
				)}
				<Text style={styles.label}>City Project Manager</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={cityProjectManager}
					onChangeText={setCityProjectManager}
				/>
				<Text style={styles.label}>Contract Project Manager</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={contractProjectManager}
					onChangeText={setContractProjectManager}
				/>
				<Text style={styles.label}>Contractor Site Supervisor Onshore</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={contractorSiteSupervisorOnshore}
					onChangeText={setContractorSiteSupervisorOnshore}
				/>
				<Text style={styles.label}>Contractor Site Supervisor Offshore</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={contractorSiteSupervisorOffshore}
					onChangeText={setContractorSiteSupervisorOffshore}
				/>
				<Text style={styles.label}>Contract Administrator</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={contractAdministrator}
					onChangeText={setContractAdministrator}
				/>
				<Text style={styles.label}>Support CA</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter"
					value={supportCA}
					onChangeText={setSupportCA}
				/>
				<Text style={styles.label}>Site Inspector</Text>
			{siteInspector.map((inspector, index) => (
				<View key={index} style={styles.inspectorRow}>
    <TextInput
        style={[styles.input, styles.inspectorInput]}
        placeholder={`Inspector ${index + 1}`}
        value={inspector}
        onChangeText={(text) => updateInspector(text, index)}
    />
    <TouchableOpacity onPress={addInspector} style={styles.addInspectorButton}>
        {index === siteInspector.length - 1 && (
            <Ionicons name="add-circle-outline" size={24} color="blue" />
        )}
    </TouchableOpacity>
    <View style={styles.iconContainer}>
        {index > 0 && (
            <TouchableOpacity onPress={() => removeInspector(index)} style={styles.iconButton}>
                <Ionicons name="remove-circle" size={24} color="red" />
            </TouchableOpacity>
        )}
    </View>
</View>
			))}
				<View style={styles.rowContainer}>
					<View style={styles.halfInputContainer}>
						<Text style={styles.label}>Inspector Time In</Text>
						<TouchableOpacity
							onPress={() => setShowTimeInPicker(true)}
							style={styles.dateInputContainer}>
							<Text style={styles.dateInputText}>
								{timeIn.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</Text>
							<Ionicons
								name="time"
								size={24}
								color="black"
								style={styles.icon}
							/>
						</TouchableOpacity>
						{showTimeInPicker && (
							<DateTimePicker
								testID="timeInPicker"
								value={timeIn}
								mode={"time"}
								display="default"
								onChange={onChangeTimeIn}
							/>
						)}
					</View>
					<View style={styles.halfInputContainer}>
						<Text style={styles.label}>Inspector Time Out</Text>
						<TouchableOpacity
							onPress={() => setShowTimeOutPicker(true)}
							style={styles.dateInputContainer}>
							<Text style={styles.dateInputText}>
								{timeOut.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</Text>
							<Ionicons
								name="time"
								size={24}
								color="black"
								style={styles.icon}
							/>
						</TouchableOpacity>
						{showTimeOutPicker && (
							<DateTimePicker
								testID="timeOutPicker"
								value={timeOut}
								mode={"time"}
								display="default"
								onChange={onChangeTimeOut}
							/>
						)}
					</View>
				</View>
			</View>
								<TouchableOpacity
						style={styles.nextButton}
						onPress={() =>
							navigation.navigate("Daily83", {
								projectId: projectData.projectId,
								userId: projectData.userId,
								projectName: projectNameState,
								projectNumber: projectNumberState,
								contractNumber,
								owner: ownerState,
								cityProjectManager,
								consultantProjectManager,
								contractProjectManager,
								contractorSiteSupervisorOnshore,
								contractorSiteSupervisorOffshore,
								contractAdministrator,
								supportCA,
								siteInspector,
							})
						}
					>
						<Text style={styles.nextButtonText}>Next</Text>
					</TouchableOpacity>

		</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 16,
	},
	headerContainer: {
		paddingTop: 60,
		paddingBottom: 16,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		fontSize: 18,
		marginLeft: 8,
		fontWeight: "500",
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 16,
		color: "#486ECD",
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "#000",
		marginBottom: 4,
	},
	input: {
		height: 45,
		borderColor: "#000",
		borderWidth: 1,
		borderRadius: 8,
		fontSize: 16,
		paddingHorizontal: 8,
		marginBottom: 12,
		backgroundColor: "#fff",
		color: "black",
	},
	dateInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 45,
		borderColor: "#000",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 8,
		marginBottom: 12,
		backgroundColor: "#fff",
	},
	dateInputText: {
		flex: 1,
		fontSize: 16,
	},
	icon: {
		marginLeft: 8,
	},
	rowContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	halfInputContainer: {
		width: "48%",
	},
	nextButton: {
		backgroundColor: "#486ECD",
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	nextButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
inspectorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
},
inspectorInput: {
    flex: 1,
    marginRight: 8,
},
iconContainer: {
    flexDirection: "row",
    alignItems: "center",
},
iconButton: {
    marginLeft: 8,
    padding: 6,
},
addInspectorButton: {
    padding: 6,
},
});

export default Daily85;