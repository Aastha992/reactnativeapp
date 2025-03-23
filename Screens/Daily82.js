import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const Daily82 = ({ route, navigation }) => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);
	const [projectDetails, setProjectDetails] = useState("");

	const {
		project,
		client,
		projectManager,
		projectNumber,
		contractNumber,
		date,
		associatedProjectManager,
		contractProjectManager,
		contractorSiteSupervisorOnshore,
		contractorSiteSupervisorOffshore, 
		contractAdministrator,
		supportCA,
		residentSiteInspector,
		timeIn,
		timeOut,
	} = route.params;

	// Mock API to simulate data fetching
	const fetchMockData = async () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					projectDetails: "Project 2017-5134 Details",
					startDate: "2024-12-01",
					endDate: "2024-12-07",
				});
			}, 1000); // Simulate network delay
		});
	};

	// Fetch mock data when component mounts
	useEffect(() => {
		fetchMockData().then((data) => {
			setProjectDetails(data.projectDetails);
		});
	}, []);

	const onChangeStartDate = (event, selectedDate) => {
		setShowStartDatePicker(false);
		if (selectedDate) {
			setStartDate(selectedDate);
		}
	};

	const onChangeEndDate = (event, selectedDate) => {
		setShowEndDatePicker(false);
		if (selectedDate) {
			setEndDate(selectedDate);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<TouchableOpacity
					style={styles.header}
					onPress={() => navigation.navigate("Daily85")}>
					<Text style={[styles.headerText, { fontWeight: "bold" }]}>
						{projectDetails}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.contentContainer}>
				<Image
					source={require("../Assets/WeeklyReport.png")}
					style={styles.calendarIcon}
				/>

				<Text style={styles.title}>Select the week</Text>
				<View style={styles.rowContainer}>
					<TouchableOpacity
						onPress={() => setShowStartDatePicker(true)}
						style={styles.dateInputContainer}>
						<Text
							style={[
								styles.dateInputText,
								startDate ? { color: "#000" } : { color: "#A9A9A9" },
							]}>
							{startDate ? startDate.toLocaleDateString() : "Start Date"}
						</Text>
					</TouchableOpacity>

					{showStartDatePicker && (
						<View style={{ position: "absolute", top: 60, left: 0 }}>
							<DateTimePicker
								testID="startDatePicker"
								value={startDate || new Date()}
								mode={"date"}
								display="default"
								onChange={onChangeStartDate}
							/>
						</View>
					)}

					<TouchableOpacity
						onPress={() => setShowEndDatePicker(true)}
						style={styles.dateInputContainer}>
						<Text
							style={[
								styles.dateInputText,
								endDate ? { color: "#000" } : { color: "#A9A9A9" },
							]}>
							{endDate ? endDate.toLocaleDateString() : "End Date"}
						</Text>
					</TouchableOpacity>
					{showEndDatePicker && (
						<View style={{ position: "absolute", top: 60, right: 0 }}>
							<DateTimePicker
								testID="endDatePicker"
								value={endDate || new Date()}
								mode={"date"}
								display="default"
								onChange={onChangeEndDate}
							/>
						</View>
					)}
				</View>
			</View>

			<View style={styles.buttonContainerBottom}>
				<TouchableOpacity
					style={styles.previousButton}
					onPress={() => navigation.navigate("Daily85")}>
					<Text style={styles.buttonText}>Previous</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.nextButton}
					onPress={() =>
						navigation.navigate("Daily83", {
							project,
							client,
							projectManager,
							projectNumber,
							contractNumber,
							date,
							associatedProjectManager,
							contractProjectManager,
							contractorSiteSupervisorOnshore,
							contractorSiteSupervisorOffshore,
							contractAdministrator,
							supportCA,
							residentSiteInspector,
							timeIn,
							timeOut,
							startDate,
							endDate,
						})
					}>
					<Text style={styles.nextButtonText}>Next</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: "#486ECD",
	},
	headerContainer: {
		paddingTop: 60,
		paddingBottom: 16,
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
	contentContainer: {
		flex: 1,
		justifyContent: "center",
		marginTop: -200,
	},
	calendarIcon: {
		alignSelf: "center",
		marginBottom: 10,
		width: 300,
		height: 300,
		resizeMode: "contain",
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginTop: 80,
		color: "#486ECD",
		textAlign: "left",
		marginLeft: 20,
	},
	rowContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	dateInputContainer: {
		justifyContent: "center", // Centers the text vertically and horizontally
		alignItems: "center", // Ensures proper alignment inside the box
		height: 50,
		borderColor: "#000",
		borderWidth: 1,
		borderRadius: 8,
		backgroundColor: "#fff",
		width: "45%",
		marginHorizontal: 5,
	},
	dateInputText: {
		fontSize: 16,
		color: "#000",
		textAlign: "center", // Centers the text horizontally
		width: "100%", // Ensures text spans the width of the container
	},

	buttonContainerBottom: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		bottom: 20,
		left: 16,
		right: 16,
	},
	previousButton: {
		backgroundColor: "#fff",
		borderColor: "#486ECD",
		borderWidth: 1,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
		width: "48%",
	},
	nextButton: {
		backgroundColor: "#486ECD",
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
		width: "48%",
	},
	buttonText: {
		color: "#486ECD",
		fontSize: 16,
		fontWeight: "600",
	},
	nextButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});

export default Daily82;
