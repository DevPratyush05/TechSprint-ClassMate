import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import NoticeDetailScreen from "./src/screens/NoticeDetailScreen";
import CommunityScreen from "./src/screens/CommunityScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import StudyScreen from "./src/screens/StudyScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Main App Tabs ---
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopColor: "#f1f5f9",
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Study") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Study" component={StudyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* The Main App (Tabs) */}
        <Stack.Screen name="MainApp" component={MainAppTabs} />

        {/* Detail Screens */}
        <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
