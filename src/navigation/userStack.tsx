import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/Header';
import HomeScreen from '../screens/Home/Home';
import ProductData from '../screens/CreateProduct/ProductData';
import ProductDetails from '../screens/ProductDetail/ProductDetails';
import SelectMapPosition from '../screens/CreateProduct/SelectMapPosition';
import UserProfile from '../screens/UserProfile/UserProfile';

const Stack = createStackNavigator();

const { Navigator, Screen } = createStackNavigator();
// const { Navigator, Screen } = createBottomTabNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen name="Home" component={HomeScreen}
          options={{
            animationEnabled: false,
            headerShown: false,
          }}
        />
        <Screen name="ProductData" component={ProductData}
          options={{
            headerShown: true,
            header: () => <Header title="Cadastro" />,
          }}
        />
        <Screen name="ProductDetails" component={ProductDetails}
          options={{
            headerShown: true,
            header: () => <Header title="Informações" />,
          }}
        />
        <Screen name="SelectMapPosition" component={SelectMapPosition}
          options={{
            headerShown: true,
            header: () => <Header title="Localização" />,
          }}
        />
        <Screen name="UserProfile" component={UserProfile}
          options={{
            headerShown: true,
            header: () => <Header title="Perfil" />,
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
}
