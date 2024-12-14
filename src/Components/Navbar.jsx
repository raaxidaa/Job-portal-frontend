import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "@/AuthContext.jsx";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useContext(AuthContext); // AuthContext'den istifadəçini əldə et
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.nav') === null) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='nav'>
            <div className="left">
                <NavLink to="/"> <img src="/Logo.png" alt="Logo" /></NavLink>
                <div className={`links desktop-links ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/investor" activeclassname="active">İnvestor üçün</NavLink>
                    <NavLink to="/startups" activeclassname="active">Startaplar üçün</NavLink>
                    <NavLink to="/jobs" activeclassname="active">İş tapın</NavLink>
                    <NavLink to="/browsestartups" activeclassname="active">Startapları araşdır</NavLink>
                    <NavLink to="/seekfunding" activeclassname="active">Maliyyə axtarın</NavLink>
                    <NavLink to="/companies" activeclassname="active">Şirkət</NavLink>
                </div>
            </div>
            <div className={`menu-icon ${isMenuOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
                <span>☰</span>
            </div>
            <div className={`mobile-links ${isMenuOpen ? 'open' : ''}`}>
                <NavLink to="/investor" activeclassname="active">İnvestor üçün</NavLink>
                <NavLink to="/startups" activeclassname="active">Startaplar üçün</NavLink>
                <NavLink to="/jobs" activeclassname="active">İş tapın</NavLink>
                <NavLink to="/browsestartups" activeclassname="active">Startapları araşdır</NavLink>
                <NavLink to="/seekfunding" activeclassname="active">Maliyyə axtarın</NavLink>
                <NavLink to="/company" activeclassname="active">Şirkət</NavLink>
            </div>
            <div className="right">
                {user && user.token ? (
                    <button onClick={() =>
                        navigate(user.role === 'company' ? '/company/dashboard' : '/admin/dashboard')}>
                        Nəzarət Paneli
                    </button>
                ) : (
                    <>
                        <button onClick={() => navigate('/login')}>Daxil ol</button>
                        <button onClick={() => navigate('/register')}>Qeydiyyatdan keç</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
