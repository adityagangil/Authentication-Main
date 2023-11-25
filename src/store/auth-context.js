import React, { useState, useEffect } from 'react';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { },
});

export const AuthContextProvider = (props) => {
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);
    const [logoutTimer, setLogoutTimer] = useState(null);

    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
        setLogoutTimer(setTimeout(logoutHandler, 300000)); // 5 minutes in milliseconds
    };

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    useEffect(() => {
        // Check if there is a token and set a timer for auto-logout
        if (userIsLoggedIn) {
            const remainingTime = localStorage.getItem('expirationTime');
            const remainingTimeInMilliseconds = remainingTime
                ? Math.max(0, new Date(remainingTime) - new Date())
                : null;

            if (remainingTimeInMilliseconds) {
                setLogoutTimer(setTimeout(logoutHandler, remainingTimeInMilliseconds));
            }
        }
    }, [userIsLoggedIn]);

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
