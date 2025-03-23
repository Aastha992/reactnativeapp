import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a new context
export const DailyEntryContext = createContext();

// Create a provider component
export const DailyEntryProvider = ({ children }) => {
    // State to hold the daily entry data
    const [dailyEntryData, setDailyEntryData] = useState({
        userId: "",  // Add userId
        projectId: "", // Add projectId
        selectedDate: "",
        location: "",
        onShore: "",
        tempHigh: "",
        tempLow: "",
        weather: "",
        workingDay: "",
        reportNumber: "",
        projectNumber: "",
        project: "",
        owner: "",
        contractNumber: "",
        contractor: "",
        siteInspector: "",
        timeIn: "",
        timeOut: "",
        ownerContact: "",
        ownerProjectManager: "",
        component: "",
        equipments: [],
        labours: [],
        visitors: [],
        description: "",
    });

    // Load userId & projectId from AsyncStorage on app start
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem("userId");
                const storedProjectId = await AsyncStorage.getItem("projectId");

                setDailyEntryData(prevData => ({
                    ...prevData,
                    userId: storedUserId || "",
                    projectId: storedProjectId || "",
                }));
            } catch (error) {
                console.error("Error loading user/project ID:", error);
            }
        };

        loadUserData();
    }, []);

    return (
        <DailyEntryContext.Provider value={{ dailyEntryData, setDailyEntryData }}>
            {children}
        </DailyEntryContext.Provider>
    );
};
