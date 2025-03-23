import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FormProvider } from './FormContext';
import { DailyEntryProvider } from './utils/DailyEntryContext';

import CustomStatusBar from './utils/CustomStatusBar'; 
import { ProjectProvider } from './utils/ProjectContext';




import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import MileageHistoryScreen from './Screens/MileageHistoryScreen';
import MileageStartScreen from './Screens/MileageStartScreen';
import MileageCancelScreen from './Screens/MileageCancelScreen';
import ValidationPopupMileage from './Screens/ValidationPopupMileage';
import SuccessPopupMileage from './Screens/SuccessPopupMileage';
import ReportDaily1 from './Screens/ReportDaily1';
import ForgotPassword from './Screens/ForgotPassword';
import EnterVerificationCode1 from './Screens/EnterVerificationCode1';
import EnterVerificationCode2 from './Screens/EnterVerificationCode2';
import ResetPassword from './Screens/ResetPassword';
import Daily72 from './Screens/Daily72';
import Daily73 from './Screens/Daily73';
import Daily74 from './Screens/Daily74';
import Daily75 from './Screens/Daily75';
import Daily76 from './Screens/Daily76';
import Daily78 from './Screens/Daily78';
import ValidationPopupDR from './Screens/ValidationPopupDR';
import SuccessPopupDR from './Screens/SuccessPopupDR';
import Daily84 from './Screens/Daily84';
import Daily85 from './Screens/Daily85';
import Daily82 from './Screens/Daily82';
import Daily83 from './Screens/Daily83';
import Expenses from './Screens/Expenses';
import Daily64 from './Screens/Daily64';
import Daily65 from './Screens/Daily65';
import ValidationPopupExpense from './Screens/ValidationPopupExpense';
import SuccessPopupExpense from './Screens/SuccessPopupExpense';
import Daily70 from './Screens/Daily70';
import Daily71 from './Screens/Daily71';
import Invoicing from './Screens/Invoicing';
import Daily104 from './Screens/Daily104';
import Daily108 from './Screens/Daily108';
import Daily109 from './Screens/Daily109';
import SuccessPopupInvoicing from './Screens/SuccessPopupInvoicing';
import Daily86 from './Screens/Daily86';
import Daily89 from './Screens/Daily89';
import Daily99 from './Screens/Daily99';
import Dailyabc from './Screens/Dailyabc';
import Daily90 from './Screens/Daily90';
import BaselineSchedules from './Screens/BaselineSchedules';
import Hazard1 from './Screens/Hazard1';
import Hazard2 from './Screens/Hazard2';
import Hazard3 from './Screens/Hazard3';
import Hazard4 from './Screens/Hazard4';
import Hazard5 from './Screens/Hazard5';
import ValidationPopupH from './Screens/ValidationPopupH';
import SuccessPopupH from './Screens/SuccessPopupH';
import PhotosF from './Screens/PhotosF';
import DailyEntry1 from './Screens/DailyEntry1';
import DailyEntry3 from './Screens/DailyEntry3';
import ValidationPopupDE from './Screens/ValidationPopupDE';
import SuccessPopupDE from './Screens/SuccessPopupDE';
import BottomToolbar from './Screens/BottomToolbar';
import Registration from './Screens/Registration';
import ProjectDetailsScreen from './Screens/ProjectDetailsScreen';
import UploadSchedule from './Screens/UploadSchedule';
import DailyEntryPreview from './Screens/DailyEntryPreview';
import DailyDiaryPreview from './Screens/DailyDiaryPreview';
// import PDFScreen from './Screens/PDFScreen';
import PDFViewer from './Screens/PDFViewer';
import DailyProjectList from './Screens/DailyProjectList';
import DiaryProjectList from './Screens/DiaryProjectList';

const Stack = createStackNavigator();

const App = () => {
  const [currentRoute, setCurrentRoute] = useState('');
  const toolbarScreens = [
    'HomeScreen',
    'MileageHistoryScreen',
    'Expenses',
    'Daily72',
    'Invoicing',
  ];
  return (
    // <commonStyles>
    <DailyEntryProvider>
    <ProjectProvider> 
    <FormProvider>
          <NavigationContainer
              onStateChange={(state) => {
                  // Update the current route name on navigation state changes
                  const route = state?.routes[state.index];
                  setCurrentRoute(route?.name || '');
              }}
            >
      <View style={{ flex: 1 }}>
        {/* Main Stack Navigator */}
        <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="MileageHistoryScreen"
          component={MileageHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MileageStartScreen"
          component={MileageStartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MileageCancelScreen"
          component={MileageCancelScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValidationPopupMileage"
          component={ValidationPopupMileage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessPopupMileage"
          component={SuccessPopupMileage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportDaily1"
          component={ReportDaily1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnterVerificationCode1"
          component={EnterVerificationCode1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnterVerificationCode2"
          component={EnterVerificationCode2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily72"
          component={Daily72}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily73"
          component={Daily73}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily74"
          component={Daily74}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily75"
          component={Daily75}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily76"
          component={Daily76}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily78"
          component={Daily78}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValidationPopupDR"
          component={ValidationPopupDR}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessPopupDR"
          component={SuccessPopupDR}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily84"
          component={Daily84}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily85"
          component={Daily85}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily82"
          component={Daily82}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily83"
          component={Daily83}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Expenses"
          component={Expenses}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily64"
          component={Daily64}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily65"
          component={Daily65}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValidationPopupExpense"
          component={ValidationPopupExpense}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessPopupExpense"
          component={SuccessPopupExpense}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily70"
          component={Daily70}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily71"
          component={Daily71}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Invoicing"
          component={Invoicing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily104"
          component={Daily104}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily108"
          component={Daily108}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily109"
          component={Daily109}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessPopupInvoicing"
          component={SuccessPopupInvoicing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily86"
          component={Daily86}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily89"
          component={Daily89}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily99"
          component={Daily99}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dailyabc"
          component={Dailyabc}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Daily90"
          component={Daily90}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BaselineSchedules"
          component={BaselineSchedules}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hazard1"
          component={Hazard1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hazard2"
          component={Hazard2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hazard3"
          component={Hazard3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hazard4"
          component={Hazard4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hazard5"
          component={Hazard5}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ValidationPopupH"
          component={ValidationPopupH}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessPopupH"
          component={SuccessPopupH}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PhotosF"
          component={PhotosF}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyEntry1"
          component={DailyEntry1}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="DailyEntry3"
          component={DailyEntry3}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="ValidationPopupDE"
          component={ValidationPopupDE}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessPopupDE"
          component={SuccessPopupDE}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProjectDetailsScreen"
          component={ProjectDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadSchedule"
          component={UploadSchedule}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyEntryPreview"
          component={DailyEntryPreview}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyDiaryPreview"
          component={DailyDiaryPreview}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="PDFScreen"
          component={PDFScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="PDFViewer"
          component={PDFViewer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyProjectList"
          component={DailyProjectList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DiaryProjectList"
          component={DiaryProjectList}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

     
      {toolbarScreens.includes(currentRoute) && (
                <BottomToolbar
                  currentRoute={currentRoute} // Pass the current route explicitly
                />
              )}
            </View>
          </NavigationContainer>
        </FormProvider>
      </ProjectProvider>  
    </DailyEntryProvider>
  );
};

export default App;