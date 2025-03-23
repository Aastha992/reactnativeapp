import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Daily83 = ({ route, navigation }) => {
	const [selectedDay, setSelectedDay] = useState("");
	const [weekDays, setWeekDays] = useState([]);

	// Date Picker State
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);

	// State to Store API Data
	const [dailyEntries, setDailyEntries] = useState([]);
	const [dailyDiaries, setDailyDiaries] = useState([]);
	const [dailyDescriptions, setDailyDescriptions] = useState(""); // ✅ Stores fetched descriptions
	const [loading, setLoading] = useState(false);

	const {
		projectId = "",
		userId,
		projectName = "",
		projectNumber = "",
		contractNumber = "",
		owner = "",
		cityProjectManager = "",
		consultantProjectManager = "",
		contractProjectManager = "",
		contractorSiteSupervisorOnshore = "",
		contractorSiteSupervisorOffshore = "",
		contractAdministrator = "",
		supportCA = "",
		siteInspector = "",
	} = route.params || {}; 
	

	// API Call to Fetch Weekly Data
	const fetchWeeklyData = async () => {
		console.log("Checking userId before API call:", userId || "NO USER ID RECEIVED"); // ✅ Debugging log
	
		if (!startDate || !endDate || !projectId || !userId) {
			Alert.alert("Error", "Project ID, User ID, and date range are required.");
			return;
		}
	
		const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
		const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
	
		console.log("Sending API Request:", { 
			projectId, 
			userId,  
			startDate: formattedStartDate, 
			endDate: formattedEndDate 
		});
	
		setLoading(true);
		try {
			const response = await axios.post("http://10.0.0.221:5001/api/weekly/weekly-entry", {
				projectId,
				userId,
				startDate: formattedStartDate,
				endDate: formattedEndDate,
			}, { headers: { "Content-Type": "application/json" } });
	
			console.log("API Response:", response.data);
			setDailyEntries(response.data.data.linkedDailyEntries);
			setDailyDiaries(response.data.data.linkedDailyDiaries);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching weekly data:", error.response?.data || error.message);
			Alert.alert("Error", error.response?.data?.message || "Failed to fetch data.");
			setLoading(false);
		}
	};
	
	

	// Handle Start Date Selection
	const onChangeStartDate = (event, selectedDate) => {
		setShowStartDatePicker(false);
		if (selectedDate) {
			setStartDate(selectedDate);
			generateWeekDays(selectedDate, endDate);
		}
	};

	// Handle End Date Selection
	const onChangeEndDate = (event, selectedDate) => {
		setShowEndDatePicker(false);
		if (selectedDate) {
			setEndDate(selectedDate);
			generateWeekDays(startDate, selectedDate);
		}
	};

	// Generate Week Days Based on Selected Dates
	const generateWeekDays = (start, end) => {
		if (!start || !end) return;
		const days = [];
		const currentDate = new Date(start);
		while (currentDate <= end) {
			days.push({
				day: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
				date: currentDate.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" }),
			});
			currentDate.setDate(currentDate.getDate() + 1);
		}
		setWeekDays(days);
		setSelectedDay(days[0]?.date || "");
	};

	// Call API when Start and End Dates are Selected
	useEffect(() => {
		if (startDate && endDate) {
			fetchWeeklyData();
		}
	}, [startDate, endDate, userId, projectId]);


	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 16 }}
			showsVerticalScrollIndicator={true}>
			{/* Header Section */}
			<View style={styles.headerContainer}>
				<TouchableOpacity
					style={styles.header}
					onPress={() => navigation.navigate("Daily84")}>
					<Ionicons name="arrow-back" size={24} color="black" />
					<Text
						style={[styles.headerText, { fontWeight: "bold", marginLeft: 5 }]}>
						Project {projectNumber} - {projectName}
					</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.sectionTitle}>Selected week</Text>

			{/* Date Range Pickers with Calendar Icon */}
			<View style={styles.rowContainer}>
				<View style={styles.halfInputContainer}>
					<Text style={styles.label}>Start Date</Text>
					<TouchableOpacity
						onPress={() => setShowStartDatePicker(true)}
						style={styles.dateInputContainer}>
						<Text
							style={{
								...styles.dateInputText,
								color: startDate ? "#000" : "#aaa",
							}}>
							{startDate ? startDate.toLocaleDateString() : "Select"}
						</Text>
						<Ionicons
							name="calendar"
							size={24}
							color="black"
							style={styles.icon}
						/>
					</TouchableOpacity>
					{showStartDatePicker && (
						<DateTimePicker
							testID="startDatePicker"
							value={startDate || new Date()}
							mode="date"
							display="default"
							onChange={onChangeStartDate}
						/>
					)}
				</View>
				<View style={styles.halfInputContainer}>
					<Text style={styles.label}>End Date</Text>
					<TouchableOpacity
						onPress={() => setShowEndDatePicker(true)}
						style={styles.dateInputContainer}>
						<Text
							style={{
								...styles.dateInputText,
								color: endDate ? "#000" : "#aaa",
							}}>
							{endDate ? endDate.toLocaleDateString() : "Select"}
						</Text>
						<Ionicons
							name="calendar"
							size={24}
							color="black"
							style={styles.icon}
						/>
					</TouchableOpacity>
					{showEndDatePicker && (
						<DateTimePicker
							testID="endDatePicker"
							value={endDate || new Date()}
							mode="date"
							display="default"
							onChange={onChangeEndDate}
						/>
					)}
				</View>
			</View>

			{/* Horizontal Scroll for Days */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.dateScroll}>
				{weekDays.map((day, index) => (
					<TouchableOpacity
						key={index}
						style={styles.nameContainer}
						onPress={() => setSelectedDay(day.date)}>
						<Text
							style={[
								styles.nameText,
								selectedDay === day.date && styles.activeNameText,
							]}>
							{day.day}-{day.date}
						</Text>
						<View
							style={[
								styles.underline,
								selectedDay === day.date && styles.activeUnderline,
							]}
						/>
					</TouchableOpacity>
				))}
			</ScrollView>

			{/* Activity Section - Now Populated with Data from API */}
			<View style={styles.activityContainer}>
				<Text style={styles.activityTitle}>Activities for Selected Dates:</Text>
				{loading ? <ActivityIndicator size="large" color="#486ECD" /> : <Text style={styles.activityDescription}>{dailyDescriptions}</Text>}
			</View>

			{/* Details Buttons */}
			<View style={styles.detailsContainer}>
				<TouchableOpacity
					style={styles.detailsButton}
					onPress={() => navigation.navigate("Daily86")}>
					<Text>View Labour Details</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.detailsButton}
					onPress={() => navigation.navigate("Daily89")}>
					<Text>View Equipment Details</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.detailsButton}
					onPress={() => navigation.navigate("Dailyabc")}>
					<Text>View Visitor Details</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.detailsButton}
					onPress={() => navigation.navigate("Daily99")}>
					<Text>View Project Description</Text>
				</TouchableOpacity>
			</View>

			{/* Bottom Navigation Buttons */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.previousButton}
					onPress={() => navigation.navigate("Daily85")}>
					<Text style={styles.buttonText}>Previous</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.previewButton}
					onPress={() =>
						navigation.navigate("Daily90", {
							projectId,
							userId,
								projectName,
								projectNumber,
								contractNumber,
								owner,
								cityProjectManager,
								consultantProjectManager,
								contractProjectManager,
								contractorSiteSupervisorOnshore,
								contractorSiteSupervisorOffshore,
								contractAdministrator,
								supportCA,
								siteInspector,
						})
					}>
					<Text style={styles.previewButtonText}>Next</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	headerContainer: {
		paddingTop: 45,
		paddingBottom: 10,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerText: {
		fontSize: 18,
		marginLeft: 5,
		fontWeight: "500",
	},
	sectionTitle: {
		fontSize: 18,
		color: "#486ECD",
		fontWeight: "bold",
		marginBottom: 20,
		marginHorizontal: 16,
	},
	rowContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
		marginHorizontal: 16,
	},
	halfInputContainer: {
		width: "48%",
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "#000",
		marginBottom: 4,
	},
	dateInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 45,
		borderColor: "#000",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
	},
	dateInputText: {
		flex: 1,
		fontSize: 16,
	},
	icon: {
		marginLeft: 8,
	},
	dateScroll: {
		paddingHorizontal: 16,
		marginBottom: 10,
	},
	nameContainer: {
		alignItems: "center",
		marginRight: 15,
	},
	nameText: {
		fontSize: 16,
		color: "#333",
	},
	activeNameText: {
		color: "#486ECD",
		fontWeight: "bold",
	},
	underline: {
		height: 2,
		width: "100%",
		backgroundColor: "#D3D3D3",
		marginTop: 5,
	},
	activeUnderline: {
		backgroundColor: "#486ECD",
	},
	activityContainer: {
		paddingHorizontal: 16,
		marginBottom: 300,
	},
	activityTitle: {
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 8,
		color: "#000",
	},
	activityDescription: {
		fontSize: 16,
		lineHeight: 20,
		color: "#333",
	},
	detailsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 16,
		paddingHorizontal: 16,
	},
	detailsButton: {
		backgroundColor: "#d9e7ff",
		padding: 12,
		borderRadius: 8,
		width: "48%",
		alignItems: "center",
		marginBottom: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	previousButton: {
		flex: 1,
		marginRight: 8,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#486ECD",
		borderRadius: 8,
		alignItems: "center",
	},
	previewButton: {
		flex: 1,
		marginLeft: 8,
		paddingVertical: 12,
		backgroundColor: "#486ECD",
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#486ECD",
	},
	previewButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#fff",
	},
});

export default Daily83;