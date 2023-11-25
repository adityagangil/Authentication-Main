import { useState, useRef, useContext } from 'react';
import classes from './AuthForm.module.css';

export const AuthForm = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const authCtx = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // optional: Add validation
        setIsLoading(true);

        if (isLogin) {
            // Login
            fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCWSXbWnYhv5bm3JkBFljJMzOzvTWM1xdA',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: enteredEmail,
                        password: enteredPassword,
                        returnSecureToken: true
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res) => {
                setIsLoading(false);
                if (res.ok) {
                    return res.json().then((data) => {
                        console.log('ID Token:', data.idToken);
                        // You can save the token in local storage or manage the user session.
                    });
                } else {
                    return res.json().then((data) => {
                        let errorMessage = 'Authentication Failed!';
                        if (data && data.error && data.error.message) {
                            errorMessage = data.error.message;
                        }
                        alert(errorMessage);
                    });
                }
            });
        } else {
            // Signup
            fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCWSXbWnYhv5bm3JkBFljJMzOzvTWM1xdA',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: enteredEmail,
                        password: enteredPassword,
                        returnSecureToken: true
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res) => {
                setIsLoading(false);
                if (res.ok) {
                    // Handle successful signup
                } else {
                    return res.json().then((data) => {
                        let errorMessage = 'Authentication Failed!';
                        if (data && data.error && data.error.message) {
                            errorMessage = data.error.message;
                        }
                        alert(errorMessage);
                    });
                }
            });
        }
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailInputRef} />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input
                        type='password'
                        id='password'
                        required
                        ref={passwordInputRef}
                    />
                </div>
                <div className={classes.actions}>
                    {!isLoading && (
                        <button>{isLogin ? 'Login' : 'Create Account'}</button>
                    )}
                    {isLoading && <p>Sending Request...</p>}
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin
                            ? 'Create new account'
                            : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;
