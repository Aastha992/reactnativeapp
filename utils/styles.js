// utils/styles.js

import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 15,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Roboto',
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    headerRightContainer: {
        alignItems: 'flex-end',
    },
    seeAll: {
        color: '#486ECD',
        fontSize: 16,
        fontFamily: 'Roboto',
    },
     scrollContentContainer: {
     paddingBottom: 100,
 },
    projectDetailsContainer: {
        marginBottom: 8,
    },
    projectDetailsTitle: {
        fontSize: 18,
        fontFamily: 'Roboto',
        color: '#333',
        fontWeight: 'bold',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    progressCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        borderWidth: 2,
        borderColor: '#d3d3d3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCircle: {
        borderColor: '#486ECD',
    },
    completedCircle: {
        borderColor: '#486ECD',
    },
    futureCircle: {
       borderColor: "#e0e0e0",
     },
     darkGreyCircle: {
     borderColor: "#a9a9a9",
     },
    progressText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#000',
    },
    activeText: {
        color: '#486ECD',
    },
    completedText: {
        color: '#486ECD',
    },
     darkGreyText: {
         color: "#a9a9a9",
     },
    progressLine: {
        height: 2,
        flex: 1,
        backgroundColor: '#d3d3d3',
    },
    completedLine: {
        backgroundColor: '#486ECD',
    },
    futureLine: {
       backgroundColor: "#e0e0e0",
     },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Roboto',
        color: '#486ECD',
        marginBottom: 15,
    },
    formGroupOuterBoxWithBorder: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    formGroup: {
        marginBottom: 8,
    },
    reducedSpacing: {
        marginBottom: 5,
    },
    inputRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    formGroupRowAligned: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
   formGroupRowTemp:{
     flexDirection:"row",
     justifyContent:"space-between",
     alignItems:"center"
   },
     formGroupEqualPickerAligned: {
     flex: 1,
     marginHorizontal: 5,
   },
    equalInputSize: {
         flex: 1,
         marginHorizontal: 5,
     },
    label: {
        marginBottom: 4,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#333',
        fontWeight: '500',
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        borderRadius: 8,
        backgroundColor: '#ffffff',
    },
    selectedDropdown: {
        paddingRight: 40,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
        fontFamily: 'Roboto',
    },
    placeholderText: {
        color: 'grey',
        fontFamily: 'Roboto',
    },
    selectedText: {
        color: 'black',
        fontFamily: 'Roboto',
    },
    dropdownIcon: {
        marginLeft: 'auto',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d3d3d3',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        fontFamily: 'Roboto',
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    lightGreyBox: {
     backgroundColor: "#f0f0f0",
     color:"#000000"
     },
    totalHoursInput: {
        textAlign: 'center',
    },
    inputSpacingSmall: {
        marginBottom: 8,
    },
    deleteEquipmentButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
     deleteLabourButton: {
         marginLeft: 10,
         marginTop: 17,
     },
    addButtonContainerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#486ECD',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    addButtonText: {
        marginLeft: 5,
        color: '#486ECD',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
    },
    navigationButtonsContainerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    previousButton: {
        flex: 0.48,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#486ECD',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    nextButton: {
        flex: 0.48,
        backgroundColor: '#486ECD',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
     previousButtonWhiteBlueBorder: {
         flex: 0.48,
         backgroundColor: '#ffffff',
         borderWidth: 1,
         borderColor: '#486ECD',
         paddingVertical: 10,
         borderRadius: 12,
         alignItems: 'center',
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.1,
         shadowRadius: 5,
         elevation: 3,
     },
    navigationButtonText: {
        color: '#486ECD',
        fontSize: 18,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentSmall: {
        width: 250,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
      modalItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
     },
     modalItemText: {
       fontSize: 16,
       fontFamily: 'Roboto',
       textAlign: 'center',
    },
    closeButton: {
       marginTop: 10,
      alignItems: 'center',
    },
    closeButtonText: {
     color: '#486ECD',
        fontSize: 16,
        fontFamily: 'Roboto',
     fontWeight: 'bold',
    },
    blackBorder: {
       borderColor: 'black',
    },
     blackBackground: {
        borderColor: 'black',
     },
  consistentInputSize: {

 },
      roleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    roleInput: {
      flex: 1,
        borderWidth: 1,
       borderColor: "#d3d3d3",
       borderRadius: 8,
       padding: 8,
      fontSize: 14,
       backgroundColor: "#ffffff",
      },
});

export default commonStyles;