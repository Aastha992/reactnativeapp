import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Animated,
	Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import BottomToolbar from "./BottomToolbar";

const Daily72 = ({ navigation }) => {
	const cloudAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(cloudAnimation, {
				toValue: 1,
				duration: 10000,
				useNativeDriver: false,
			})
		).start();
	}, [cloudAnimation]);

	const cloudInterpolation = cloudAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: ["-20%", "120%"],
	});

	return (
		<View style={styles.container}>
			<ScrollView>
				<Text style={styles.headerLeftBlue}>Reports</Text>
				<View style={styles.iconContainer}>
					{/* Moving Clouds */}
					<Animated.View style={[styles.cloud, { left: cloudInterpolation }]}>
						<FontAwesome name="cloud" size={50} color="#d3d3d3" />
					</Animated.View>
					<Animated.View style={[styles.cloud, { right: cloudInterpolation }]}>
						<FontAwesome name="cloud" size={40} color="#d3d3d3" />
					</Animated.View>
					{/* Main Image */}
					<Image
						source={require("../Assets/Reports.png")}
						style={styles.reportImage}
					/>
				</View>
				{/* <Text style={styles.description}>
          Make your daily entries using the button below and can view all the entries using weekly entries button.
        </Text> */}

				{/* Add a Daily Entry Button */}
				<TouchableOpacity
					style={styles.entryButtonModifiedLarge}
					onPress={() => navigation.navigate("DailyProjectList")}
          >
					<Text style={styles.entryButtonTextModified}>Add a Daily Entry</Text>
					<FontAwesome name="arrow-right" size={16} color="#000000" />
				</TouchableOpacity>

				{/* View Weekly Entries Button */}
				<TouchableOpacity
					style={styles.entryButtonModifiedLarge}
					onPress={() => navigation.navigate("Daily84")}>
					<Text style={styles.entryButtonTextModified}>
						View Weekly Entries
					</Text>
					<FontAwesome name="arrow-right" size={16} color="#000000" />
				</TouchableOpacity>

				{/* Daily Diary Button */}
				<TouchableOpacity
					style={styles.entryButtonModifiedLarge}
					onPress={() => navigation.navigate("DiaryProjectList")}>
					<Text style={styles.entryButtonTextModified}>Daily Diary</Text>
					<FontAwesome name="arrow-right" size={16} color="#000000" />
				</TouchableOpacity>
			</ScrollView>
			<BottomToolbar/>
			{/* Replace bottom toolbar with BottomToolbar component */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	headerLeftBlue: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "left",
		marginBottom: 20,
		paddingLeft: 20,
		paddingTop: 80,
		color: "#486ECD",
	},
	iconContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	cloud: {
		position: "absolute",
		top: 10,
	},
	reportImage: {
		width: 300,
		height: 300,
		resizeMode: "contain",
	},
	description: {
		fontSize: 16,
		color: "#7f8c8d",
		textAlign: "center",
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	entryButtonModifiedLarge: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#ffffff",
		paddingVertical: 20,
		paddingHorizontal: 25,
		borderRadius: 10,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#486ECD",
		marginHorizontal: 20,
	},
	entryButtonTextModified: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000000",
	},
});

export default Daily72;