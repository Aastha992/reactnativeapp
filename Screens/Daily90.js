import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Image,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Daily90 = ({ navigation, route }) => {
	// Retrieve dynamic project name and image entries from route parameters
	const projectName = route.params?.projectName || "Default Project Name";
	const imageEntries = route.params?.imageEntries || [
		// Default example entries for testing purposes
		{
			date: "21-October-2024",
			location: "Location A",
			images: [
				{ uri: "https://example.com/image1.jpg" },
				{ uri: "https://example.com/image2.jpg" },
				{ uri: "https://example.com/image3.jpg" },
				{ uri: "https://example.com/image4.jpg" },
			],
		},
		{
			date: "20-October-2024",
			location: "Location B",
			images: [
				{ uri: "https://example.com/image5.jpg" },
				{ uri: "https://example.com/image6.jpg" },
			],
		},
		{
			date: "19-October-2024",
			location: "Location C",
			images: [
				{ uri: "https://example.com/image7.jpg" },
				{ uri: "https://example.com/image8.jpg" },
			],
		},
		{
			date: "18-October-2024",
			location: "Location D",
			images: [
				{ uri: "https://example.com/image9.jpg" },
				{ uri: "https://example.com/image10.jpg" },
			],
		},
	];

	const {
		project,
		client,
		projectManager,
		projectNumber,
		contractNumber,
		date,
		associatedProjectManager,
		contractProjectManager,
		contractSiteSupervisorOnshore,
		contractSiteSupervisorOffshore,
		contractAdministrator,
		supportCA,
		residentSiteInspector,
		timeIn,
		timeOut,
		selectedDay,
		dayDetails,
	} = res.body;

	function handleSubmit() {
		const userData = {
			project,
			client,
			projectManager,
			projectNumber,
			contractNumber,
			date,
			associatedProjectManager,
			contractProjectManager,
			contractSiteSupervisorOnshore,
			contractSiteSupervisorOffshore,
			contractAdministrator,
			supportCA,
			residentSiteInspector,
			timeIn,
			timeOut,
			selectedDay,
			dayDetails,
		};
		axios
			.post("http://10.0.0.221:5001/api/weekly/weekly-entry", userData)
			.then((res) => {
				console.log(res.data);
				if (res.data) {
					Alert.alert("Report submitted successfully.");
					// navigation.navigate("Expenses");
				} else {
					Alert.alert("Error", "Failed to submit expenses.");
				}
			})
			.catch((e) => console.log(e));
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={{ paddingBottom: 80 }}>
			{/* Header */}
			<View style={styles.headerContainer}>
				<TouchableOpacity onPress={() => navigation.navigate("Daily83")}>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text style={styles.headerText}>{projectName} Weekly Entry</Text>
			</View>

			{/* Title */}
			<Text style={styles.title}>Images from Photo Files</Text>

			{/* Dynamic Image Entries */}
			{imageEntries.map((entry, index) => (
				<View key={index} style={styles.entryContainer}>
					<Text style={styles.dateText}>{entry.date}</Text>
					<Text style={styles.locationText}>{entry.location}</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={true}
						style={styles.imagesRow}>
						{entry.images.map((image, idx) => (
							<ImageComponent key={idx} uri={image.uri} />
						))}
					</ScrollView>
				</View>
			))}

			{/* Bottom Navigation Buttons */}
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.previousButton}
					onPress={() => navigation.navigate("Daily84")}>
					<Text style={styles.buttonText}>Previous</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.submitButton}
					onPress={() => handleSubmit()}>
					<Text style={styles.submitButtonText}>Submit</Text>
				</TouchableOpacity>
			</View>

			{/* Save PDF Button */}
			<TouchableOpacity style={styles.savePdfButton}>
				<Text style={styles.savePdfButtonText}>
					Save the Report as Pdf to Device
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

// Custom component to handle loading and fallback for images
const ImageComponent = ({ uri }) => {
	const [loading, setLoading] = useState(true);

	return (
		<View style={styles.imageWrapper}>
			<Image
				source={{ uri: uri || "https://via.placeholder.com/150" }}
				style={styles.image}
				onLoadStart={() => setLoading(true)}
				onLoadEnd={() => setLoading(false)}
			/>
			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="small" color="#0000ff" />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		paddingHorizontal: 16,
		paddingTop: 60,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	headerText: {
		fontSize: 18,
		fontWeight: "bold",
		marginLeft: 8,
		color: "#000",
	},
	title: {
		fontSize: 16,
		color: "#486ECD",
		fontWeight: "500",
		marginBottom: 10,
	},
	entryContainer: {
		marginBottom: 20,
		backgroundColor: "#f2f4f7",
		padding: 10,
		borderRadius: 8,
	},
	dateText: {
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 4,
	},
	locationText: {
		fontSize: 14,
		color: "#6b7280",
		marginBottom: 10,
	},
	imagesRow: {
		flexDirection: "row",
	},
	imageWrapper: {
		width: 150,
		height: 150,
		borderRadius: 8,
		marginRight: 10,
		overflow: "hidden",
		position: "relative",
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(255, 255, 255, 0.6)",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	previousButton: {
		flex: 1,
		marginRight: 8,
		paddingVertical: 12,
		borderColor: "#486ECD",
		borderWidth: 1,
		borderRadius: 8,
		alignItems: "center",
	},
	submitButton: {
		flex: 1,
		marginLeft: 8,
		paddingVertical: 12,
		backgroundColor: "#486ECD",
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 16,
		color: "#486ECD",
		fontWeight: "600",
	},
	submitButtonText: {
		fontSize: 16,
		color: "#ffffff",
		fontWeight: "600",
	},
	savePdfButton: {
		marginTop: 20,
		paddingVertical: 12,
		backgroundColor: "#486ECD",
		borderRadius: 8,
		alignItems: "center",
		alignSelf: "stretch",
	},
	savePdfButtonText: {
		fontSize: 16,
		color: "#ffffff",
		fontWeight: "600",
	},
});

export default Daily90;
