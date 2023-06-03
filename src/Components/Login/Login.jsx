import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Sling as Hamburger } from 'hamburger-react';
import './Login.css';
import '../../App.css';
import '../../navbar.css';
import Background from '../../Assets/bg.jpg';

export const Login = (props) => {
    const [name, setName] = useState("");
    const [pass, setPass] = useState("");
    const [nameError, setNameError] = useState("");
    const [passError, setPassError] = useState("");
    const [nameValidation, setNameValidation] = useState(false);
    const [passValidation, setPassValidation] = useState(false);
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

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            setNameError("Please type your username");
            setNameValidation(false);
        } else {
            setNameError("");
            setNameValidation(true);
        };

        if (!pass) {
            setPassError("Please type your password")
            setPassValidation(false);
        } else {
            setPassError("")
            setPassValidation(true);
        };
    }

    useEffect(() => {
        if (nameValidation && passValidation) {
          alert("Login successful!");
          navigate('/');
        }
    }, [nameValidation, passValidation, navigate]);

    useEffect(() => {
        if (name) {
          setNameError("");
        }
    
        if (pass) {
          setPassError("");
        }
    }, [name, pass]);

    return (
        <div style={{backgroundImage: `url(${Background})`}} className="App">
        <header className="App-header">
          <NavBar />
        </header>
            <div className="form-container">
            <h1>Login Here</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input 
                            className={`input ${!name && nameError ? 'error' : ''} ${name && !nameError ? 'success' : ''}`} 
                            value={name} 
                            onChange={(e) => {const value = e.target.value.replace(/\s/g, ''); setName(value);}} 
                            type="text" 
                            placeholder="Username" 
                            id="name" 
                            name="name" 
                        />
                        <span className="error-text">{nameError}</span>
                    </div>
                    <div className="input-container">
                        <input 
                            className={`input ${!pass && passError ? 'error' : ''} ${pass && !passError ? 'success' : ''}`} 
                            value={pass} onChange={(e) => setPass(e.target.value)} 
                            type="password" 
                            placeholder="Password" 
                            id="password" 
                            name="password" 
                        />
                        <span className="error-text">{passError}</span>
                    </div>
                    <button type="submit" className="login">Sign In</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register</button>
            </div>
        </div>
    )
}

export default Login;