import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"
import { Sling as Hamburger } from 'hamburger-react';
import './Login.css';
import '../../App.css';
import '../../navbar.css';
import Background from '../../Assets/bg.jpg';
import Swal from 'sweetalert2';

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
                <li><Link to="/">Movies</Link></li>
                <li><Link to="/tv">TV</Link></li>
                <li><Link to="/trending">Trending</Link></li>
                <li><Link to="/login" onClick={refresh}>Login</Link></li>
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

    document.title = "Movie Search | Login";

    async function handleSubmit (e) {
        e.preventDefault()

        try {
            await axios.post("http://localhost:8000/login", {
                name,pass
            })
            .then(res => {
                if (!name) {
                    setNameError("Please type your username");
                    setNameValidation(false);
                } else if (res.data === "notexist") {
                    setNameError("Username unavailable");
                    setNameValidation(false);
                } else {
                    setNameError("");
                    setNameValidation(true);
                }

                if (!pass) {
                    setPassError("Please type your password")
                    setPassValidation(false);
                } else if (res.data === "invalid") {
                    setPassError("Wrong password");
                    setPassValidation(false);
                } else if(res.data === "success") {
                    setPassError("")
                    setPassValidation(true);
                };
            })
        } catch(e) {
            console.log(e);
            alert("wrong details");
        }

    }

    useEffect(() => {
        if (nameValidation && passValidation) {
          let timerInterval
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            timer: 1000,
            timerProgressBar: true,
            background: "#2b2f38",
            color: "#fff",
            didOpen: () => {
              Swal.showLoading()
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            navigate('/');
          }
          })
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
                <form className="login-form" onSubmit={handleSubmit} action="POST">
                    <div className="input-container">
                        <input 
                            className={`input ${!name && nameError ? 'error' : ''} ${name && !nameError ? 'success' : ''} ${nameError ? 'error' : ''}`} 
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
                            className={`input ${!pass && passError ? 'error' : ''} ${pass && !passError ? 'success' : ''} ${passError ? 'error' : ''}`} 
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