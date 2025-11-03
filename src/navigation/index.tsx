import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/theme';

// Auth Screens
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';

// Main Screens
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { VehiclesScreen } from '../screens/main/VehiclesScreen';
import { WarningLightsScreen } from '../screens/main/WarningLightsScreen';
import { GuidesScreen } from '../screens/main/GuidesScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

// Vehicle Screens
import { VehicleSetupScreen } from '../screens/vehicle/VehicleSetupScreen';

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopColor: Colors.borderLight,
          elevation: 0,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🏠</span>,
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{
          tabBarLabel: 'Vehicles',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>🚗</span>,
        }}
      />
      <Tab.Screen
        name="WarningLights"
        component={WarningLightsScreen}
        options={{
          tabBarLabel: 'Lights',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>⚠️</span>,
        }}
      />
      <Tab.Screen
        name="Guides"
        component={GuidesScreen}
        options={{
          tabBarLabel: 'Guides',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>📖</span>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <span style={{ fontSize: 24 }}>👤</span>,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="VehicleSetup"
        component={VehicleSetupScreen}
        options={{
          title: 'Add Vehicle',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
        }}
      />
    </MainStack.Navigator>
  );
};

export const Navigation = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Could add a loading screen here
  }

  return (
    <NavigationContainer>
      {session ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
