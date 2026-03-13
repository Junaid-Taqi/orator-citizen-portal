import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faSignOutAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import { useTranslation} from '../Services/Localization/Localization';

const DisplayNav = ({user}) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const {t, lang, setLanguage} = useTranslation();

    const handleLangChange = (e) => {
        setLanguage(e.target.value);
    };

    // Click outside to close menu logic
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    const handleLogout = () => {
        setUserMenuOpen(false);
        window.location.href = '/c/portal/logout';
    };

    return (
        <nav className="displays-dashboard__nav flex-wrap">
            <div className="header-left">
                <h5 className="header-title m-0 text-primary">{user?.groups?.[0]?.name || "Municipality"}</h5>
                <p className="header-subtitle fs-12 text-white m-0">{t('monitorSignage')}</p>
            </div>

            <div className="displays-dashboard__nav-user-wrap d-flex gap-5" ref={userMenuRef}>

                {/* Language Selector */}
                <div className="header-lang">
                    <select
                        id="lang-select"
                        value={lang}
                        onChange={handleLangChange}
                        className="form-select form-select-sm"
                    >
                        <option value="hr">Croatian</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="displays-dashboard__nav-user"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                >
                    <i className="pi pi-user nav-user-icon" />

                    <div className="nav-user-info">
                        <span className="nav-user-name">{user?.fullName || "User Name"}</span>
                        <span className="nav-user-email">{user?.email || "user@email.com"}</span>
                    </div>

                    <div className="nav-user-chevron-box">
                        <FontAwesomeIcon
                            icon={userMenuOpen ? faChevronUp : faChevronDown}
                            className="nav-user-chevron"
                        />
                    </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                    <div className="displays-dashboard__nav-user-menu" role="menu">
                        <button type="button" className="displays-dashboard__nav-user-menu-item" role="menuitem">
                            <FontAwesomeIcon icon={faUser} style={{marginRight: '10px'}}/>
                            Profile
                        </button>

                        <button
                            type="button"
                            className="displays-dashboard__nav-user-menu-item displays-dashboard__nav-user-menu-item--logout"
                            role="menuitem"
                            onClick={handleLogout}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                            Logout
                        </button>

                    </div>
                )}
            </div>
        </nav>
    );
};

export default DisplayNav;