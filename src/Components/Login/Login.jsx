import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Sling as Hamburger } from 'hamburger-react';
import './Login.css';
import '../../App.css';
import '../../navbar.css';
import Background from '../../Assets/bg.jpg';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
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
        console.log(email)
    }

    return (
        <div style={{backgroundImage: `url(${Background})`}} className="App">
        <header className="App-header">
          <NavBar />
        </header>
        <div className="form-container">
        <h1>Login Here</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Username</label>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" />
                <label htmlFor="password">Password</label>
                <input className="input" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                <button type="submit" className="login">Sign In</button>
            </form>
            <button className="link-btn">Don't have an account? Register</button>
        </div>
        </div>
    )
}

export default Login;