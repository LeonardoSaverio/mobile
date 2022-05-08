import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

import { AuthenticatedUserContext } from './AuthenticatedUserProvider';
import AuthStack from './authStack';
import HomeStack from './userStack';
import { getAuth } from 'firebase/auth';
import api from '../services/api';

const auth = getAuth();

export default function RootNavigator() {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuth = auth.onAuthStateChanged(async authenticatedUser => {
            try {  // useEffect(()=>{

                // },[])
                if (authenticatedUser && authenticatedUser.emailVerified) {
                    const token = await authenticatedUser?.getIdToken();
                    api.defaults.headers["Authorization"] = `Bearer ${token}`;
                    setUser(authenticatedUser)
                } else {
                    api.defaults.headers["Authorization"] = null;
                    setUser(null)
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        });

        // unsubscribe auth listener on unmount
        return unsubscribeAuth;
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return user ? <HomeStack /> : <AuthStack />;
}
