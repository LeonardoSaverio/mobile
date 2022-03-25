import React from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        signOut(auth).then((e) => setUser(undefined)) 

      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user
  };
}
