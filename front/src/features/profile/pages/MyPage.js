import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import '../styles/MyPage.css';

const DEFAULT_PROFILE_IMG = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingGrade, setIsEditingGrade] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(1);

    useEffect(() => {
        api.get('/users/me')
            .then(res => {
                const userData = res.data?.data;
                if (!userData) throw new Error('세션 만료');
                setUser(userData);
                setSelectedGrade(userData.grade || 1);
                console.log('👤 사용자 정보:', userData); // ✅ 실제 구조 확인
            })
            .catch(err => {
                console.error('유저 정보 조회 실패:', err);
                alert('로그인 정보가 만료되었습니다. 다시 로그인 해주세요.');
                window.location.href = '/login';
            })
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        api.post('/auth/logout').finally(() => {
            window.location.href = '/login';
        });
    };

    const handleGradeEdit = () => {
        setIsEditingGrade(true);
        setSelectedGrade(user.grade || 1);
    };

    const handleGradeSave = async () => {
        try {
            await api.put('/users/grade', { grade: selectedGrade });
            
            // 사용자 정보 업데이트
            setUser(prev => ({ ...prev, grade: selectedGrade }));
            setIsEditingGrade(false);
            
            alert('등급이 성공적으로 수정되었습니다!');
        } catch (error) {
            console.error('등급 수정 실패:', error);
            alert('등급 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleGradeCancel = () => {
        setIsEditingGrade(false);
        setSelectedGrade(user.grade || 1);
    };

    const getGradeDescription = (grade) => {
        if (!grade) return '등급 미설정 (5등급으로 설정됨)';
        switch (grade) {
            case 1: return '1등급';
            case 2: return '2등급'; 
            case 3: return '3등급';
            case 4: return '4등급';
            case 5: return '5등급 이하';
            default: return `${grade}등급`;
        }
    };

    if (loading || !user) return <div className="mypage-container">불러오는 중...</div>;

    const profileImgSrc = (() => {
        if (!user.profile_image_url) return DEFAULT_PROFILE_IMG;
        if (user.profile_image_url.startsWith('http')) return user.profile_image_url;
        return `${BASE_URL}${user.profile_image_url}`;
    })();

    return (
        <div className="mypage-container">
            <h2 className="mypage-title">마이페이지</h2>
            <div className="mypage-info-card">
                <div className="mypage-profile-img-row">
                    <img src={profileImgSrc} alt="프로필" className="mypage-profile-img" />
                </div>
                <div className="mypage-row"><span className="mypage-label">이름</span><span>{user.name}</span></div>
                <div className="mypage-row"><span className="mypage-label">아이디</span><span>{user.username}</span></div>
                <div className="mypage-row"><span className="mypage-label">이메일</span><span>{user.email}</span></div>
                {user.nickname && <div className="mypage-row"><span className="mypage-label">닉네임</span><span>{user.nickname}</span></div>}
                {user.phone && <div className="mypage-row"><span className="mypage-label">전화번호</span><span>{user.phone}</span></div>}
                <div className="mypage-row">
                    <span className="mypage-label">등급</span>
                    {!isEditingGrade ? (
                        <div className="mypage-grade-display">
                            <span>{getGradeDescription(user.grade || 5)}</span>
                            <button 
                                className="mypage-grade-edit-btn" 
                                onClick={handleGradeEdit}
                            >
                                수정
                            </button>
                        </div>
                    ) : (
                            <div className="mypage-grade-edit">
                                <select 
                                    value={selectedGrade} 
                                    onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                                    className="mypage-grade-select"
                                >
                                    {[1, 2, 3, 4, 5].map(grade => (
                                        <option key={grade} value={grade}>
                                            {getGradeDescription(grade)}
                                        </option>
                                    ))}
                                </select>
                                <div className="mypage-grade-buttons">
                                    <button 
                                        className="mypage-grade-save-btn" 
                                        onClick={handleGradeSave}
                                    >
                                        저장
                                    </button>
                                    <button 
                                        className="mypage-grade-cancel-btn" 
                                        onClick={handleGradeCancel}
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                {user.study_habit && <div className="mypage-row"><span className="mypage-label">공부 습관</span><span>{user.study_habit}</span></div>}
                {user.created_at && <div className="mypage-row"><span className="mypage-label">가입일</span><span>{user.created_at.slice(0, 10)}</span></div>}
            </div>
            <div className="mypage-btn-row">
                <button className="mypage-btn logout" onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
    );
};

export default MyPage;
