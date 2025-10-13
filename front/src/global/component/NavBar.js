import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import api from '../../api/api';
import base_profile from '../../assets/icons/base_profile.png';
import { API_BASE_URL_8080 } from '../../api/apiUrl';
import hamcamLogo from '../../assets/icons/logo.png';
import {
    FiHome, FiPlayCircle, FiFileText, FiBarChart2, FiMessageSquare, FiUser
} from 'react-icons/fi';

const SideMenu = ({ menuItems, handleNavigation, selectedTab, user }) => {
    return (
        <div className="side-menu">
            <div className="side-menu-logo">
                <img src={hamcamLogo} alt="Hamcam Logo" />
            </div>

            <div className="nav-main">
                <ul className="side-menu-list">
                    {menuItems.map((item) => (
                        <li key={item.name} className="side-menu-list-item">
                            <button
                                onClick={() => handleNavigation(item.name, item.path)}
                                className={`side-menu-button${selectedTab === item.name ? ' active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="nav-bottom">
                {user && (
                    <div className="side-user-profile">
                        <img
                            src={user.profile_image_url ? `${API_BASE_URL_8080}${user.profile_image_url}` : base_profile}
                            alt="프로필"
                            className="side-user-image"
                        />
                        <div className="side-user-info">
                            <div className="side-user-nickname">{user.nickname}</div>
                            <div className="side-user-level">Lv. 5</div>
                        </div>
                    </div>
                )}

                <div className="side-menu-bottom">
                    <button
                        className={`side-menu-button${selectedTab === '마이페이지' ? ' active' : ''}`}
                        onClick={() => handleNavigation('마이페이지', '/mypage')}
                    >
                        <FiUser className="side-menu-icon" />
                        <span>마이페이지</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState('');
    const [user, setUser] = useState(null);

    const hideSidebarPaths = ['/unit-evaluation/start'];

    const menuItems = [
        { name: '대시보드', path: '/dashboard', icon: <FiHome className="side-menu-icon" /> },
        { name: '공부 시작', path: '/StudyStart', icon: <FiPlayCircle className="side-menu-icon" /> },
        { name: '단원 평가', path: '/evaluation', icon: <FiFileText className="side-menu-icon" /> },
        { name: '통계', path: '/statistics', icon: <FiBarChart2 className="side-menu-icon" /> },
        {
            name: '커뮤니티',
            path: '/community',
            icon: <FiMessageSquare className="side-menu-icon" />,
        },
    ];

    useEffect(() => {
        const path = location.pathname;
        const mainItem = menuItems.find((item) => path.startsWith(item.path));
        setSelectedTab(mainItem ? mainItem.name : '');
    }, [location.pathname]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await api.get('/users/me');
                setUser(res.data.data);
            } catch (error) {
                console.error('프로필 조회 실패:', error);
            }
        };
        fetchUserInfo();
    }, []);


    if (hideSidebarPaths.includes(location.pathname)) return null;

    const handleNavigation = (name, path) => {
        setSelectedTab(name);
        navigate(path);
    };

    return (
        <SideMenu
            menuItems={menuItems}
            handleNavigation={handleNavigation}
            selectedTab={selectedTab}
            user={user}
        />
    );
};

export default NavBar;
