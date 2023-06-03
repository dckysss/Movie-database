import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Sling as Hamburger } from 'hamburger-react';
import './Login.css';
import '../../App.css';
import '../../navbar.css';
import Background from '../../Assets/bg.jpg';

export const Register = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [conPass, setConPass] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");
    const [conPassError, setConPassError] = useState("");
    const [nameValidation, setNameValidation] = useState(false);
    const [emailValidation, setEmailValidation] = useState(false);
    const [passValidation, setPassValidation] = useState(false);
    const [conPassValidation, setConPassValidation] = useState(false);
    const navigate = useNavigate()

    const NavBar = () => {
        const [menuOpen, setMenuOpen] = useState(false);
        const [hamburgerSize, setHamburgerSize] = useState(24);
        const [prevScrollPos, setPrevScrollPos] = useState(0);
        const [visible, setVisible] = useState(true);

        const updateHamburgerSize = () => {
        if (window.innerWidth <= 480) {
            setHamburgerSize(18);
        } else {
            setHamburgerSize(24);
        }
        };

        const refresh = () => {
        window.location.reload();
        }

        useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const visible = prevScrollPos > currentScrollPos || menuOpen;
        
            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        };

        updateHamburgerSize();
        window.addEventListener('resize', updateHamburgerSize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', updateHamburgerSize);
            window.removeEventListener('scroll', handleScroll);
        }
        }, [prevScrollPos, menuOpen]);

        return (
        <nav className={`navbar ${visible ? '' : 'hidden'}`}>
        <button onClick={() => navigate('/')} className="logo">Movie Search</button>

            <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                <li><button onClick={() => navigate('/')}>Movies</button></li>
                <li><button onClick={() => navigate('/tv')}>TV</button></li>
                <li><button onClick={() => navigate('/trending')}>Trending</button></li>
                <li><button onClick={refresh}>Login</button></li>
            </ul>

            <div className="hamburger">
            <Hamburger
                rounded
                size={hamburgerSize}
                duration={0.8} 
                toggled={menuOpen}
                toggle={setMenuOpen}
            />
            </div>
        </nav>
        )
    }

    const validateEmail = (email) => {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        var emailValue = email.trim();

        setNameError(!name ? "Username cannot be empty" : "");
        setNameValidation(!!name);

        setEmailError(emailValue === "" ? "Email cannot be empty" : !validateEmail(emailValue) ? "Looks like not an email, example@email.com" : "");
        setEmailValidation(validateEmail(emailValue));

        setPassError(!pass ? "Password cannot be empty" : pass.length < 5 ? "Password too weak" : "");
        setPassValidation(!!pass && pass.length >= 5);

        setConPassError(!conPass ? "Confirm password cannot be empty" : conPass !== pass ? "Password not match" : "");
        setConPassValidation(!!conPass && conPass === pass);

        if (nameValidation && emailValidation && passValidation && conPassValidation) {
            alert("Account registered successfully!");
            props.onFormSwitch("login");
        }
    }

    useEffect(() => {
        if (name) {
            setNameError("");
            setNameValidation(true);
        } else {
            setNameValidation(false);
        }

        if (validateEmail(email.trim())) {
            setEmailError("");
            setEmailValidation(true);
        } else {
            setEmailValidation(false);
        };

        if (pass && pass.length >= 5) {
            setPassError("");
            setPassValidation(true);
        } else {
            setPassValidation(false);
        };

        if (conPass && conPass === pass) {
            setConPassError("");
            setConPassValidation(true);
        } else {
            setConPassValidation(false);
        };
    }, [name, pass, email, conPass]);

    return (
        <div style={{backgroundImage: `url(${Background})`}} className="App">
        <header className="App-header">
          <NavBar />
        </header>
            <div className="form-container">
            <h1>Register</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input 
                            className={`input ${!name && nameError ? 'error' : ''} ${name.trim() && !nameError ? 'success' : ''}`}  
                            value={name} 
                            onChange={(e) => { const value = e.target.value.replace(/\s/g, ''); setName(value); }} 
                            type="text" 
                            placeholder="Username" id="name" name="name" 
                        />
                        <span className="error-text">{nameError}</span>
                    </div>
                    <div className="input-container">
                        <input 
                            className={`input ${!email && emailError ? 'error' : ''} ${email && emailValidation ? 'success' : ''} ${emailError ? 'error' : ''}`} 
                            value={email} onChange={(e) => { const value = e.target.value.replace(/\s/g, ''); setEmail(value) }} 
                            type="text" 
                            placeholder="Email" 
                            id="email" 
                            name="email" 
                        />
                        <span className="error-text">{emailError}</span>
                    </div>
                    <div className="input-container">
                        <input 
                            className={`input ${!pass && passError ? 'error' : ''} ${pass && passValidation ? 'success' : ''} ${passError ? 'error' : ''}`} 
                            value={pass} 
                            onChange={(e) => setPass(e.target.value)} 
                            type="password" 
                            placeholder="Password" 
                            id="password" 
                            name="password" 
                        />
                        <span className="error-text">{passError}</span>
                    </div>
                    <div className="input-container">
                        <input 
                        className={`input ${!conPass && conPassError ? 'error' : ''} ${conPass && conPassValidation ? 'success' : ''} ${conPassError ? 'error' : ''}`} 
                            value={conPass} 
                            onChange={(e) => setConPass(e.target.value)} 
                            type="password" 
                            placeholder="Confirm Password" 
                            id="confirmPW" 
                            name="confirmPW" 
                        />
                        <span className="error-text">{conPassError}</span>
                    </div>
                    <button type="submit" className="login">Sign Up</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Sign in</button>
            </div>
        </div>
    )
}

export default Register;