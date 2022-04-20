import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/Header';

import SignInScreen from '../screens/SignInScreen';
import SignOutScreen from '../screens/SignUpScreen';
import ForgotPassword from '../screens/ForgotPassword';

const { Navigator, Screen } = createStackNavigator();

export default function AuthStack() {

  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#f2f3f5" },
        }}
      >
        <Screen name="SignIn" component={SignInScreen}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} hideArrowLeft={true} title="Acesso" />,
          }}
        />
        <Screen name="SignUp" component={SignOutScreen}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} title="Cadastro" />,
          }}
        />

        <Screen name="ForgotPassword" component={ForgotPassword}
          options={{
            headerShown: true,
            header: () => <Header showCancel={false} title="Recuperar senha" />,
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
