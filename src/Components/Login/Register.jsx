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
        <button onClick={() => navigate('/')} className="logo">Movie Database</button>

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
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const confirmPWInput = document.getElementById("confirmPW")
        
        var nameValue = name.trim();
        var emailValue = email.trim();

        var nameValidation = false;
        var emailValidation = false;
        var pwValidation = false;
        var cpwValidation = false;

        if (nameValue === "") {
            addErrorTo(nameInput, "Name cannot be empty");
        } else {
            success(nameInput);
            nameValidation = true;
        }

        function validateEmail(email) {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        }
        

        if (emailValue === "") {
            addErrorTo(emailInput, "Email cannot be empty");
        } else if (!validateEmail(emailValue)) {
            addErrorTo(emailInput, "Looks like not an email, example@email.com");
        } else {
            success(emailInput);
            emailValidation = true;
        };

        if (pass === "") {
            addErrorTo(passwordInput, "Password cannot be empty");
        } else if (pass.length < 5) {
            addErrorTo(passwordInput, "Password too weak");
        } else {
            success(passwordInput);
            pwValidation = true;
        };

        if (conPass === "") {
            addErrorTo(confirmPWInput, "Confirm password cannot be empty");
        } else if (conPass !== pass) {
            addErrorTo(confirmPWInput, "Password not match");
        } else {
            success(confirmPWInput);
            cpwValidation = true;
        };

        if (nameValidation === true && emailValidation === true && pwValidation === true && cpwValidation === true) {
            alert("account registered successfully!");
            props.onFormSwitch('login')
        };

        function addErrorTo(req, message) {
            const formControl = req.parentElement;
            const span = formControl.querySelector("span");
            req.classList.add("error");
            span.innerText = message;
            span.classList.add("error-text");
            req.classList.remove("success");
        };

        function success(req) {
            req.classList.remove("error");
            req.classList.add("success");
            const span = req.parentElement.querySelector("span");
            span.innerText = "";
            span.classList.remove("error-text");
        };
    }

    return (
        <div style={{backgroundImage: `url(${Background})`}} className="App">
        <header className="App-header">
          <NavBar />
        </header>
            <div className="form-container">
            <h1>Register</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input className="input" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" id="name" name="name" />
                        <span></span>
                    </div>
                    <div className="input-container">
                        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" id="email" name="email" />
                        <span></span>
                    </div>
                    <div className="input-container">
                        <input className="input" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                        <span></span>
                    </div>
                    <div className="input-container">
                        <input className="input" value={conPass} onChange={(e) => setConPass(e.target.value)} type="password" placeholder="Confirm Password" id="confirmPW" name="confirmPW" />
                        <span></span>
                    </div>
                    <button type="submit" className="login">Sign Up</button>
                </form>
                <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Sign in</button>
            </div>
        </div>
    )
}

export default Register;