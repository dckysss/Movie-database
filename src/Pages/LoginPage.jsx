import React, { useState } from 'react'
import Login from '../Components/Login/Login'
import Register from '../Components/Login/Register';

const LoginPage = () => {
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
        setCurrentForm(formName);
    }
    return currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
}

export default LoginPage