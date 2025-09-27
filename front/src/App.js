import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import NavBar from './global/component/NavBar';
import UnitEvaluation from './features/evaluation/pages/UnitEvaluation';
import UnitEvaluationStart from './features/evaluation/pages/UnitEvaluationStart';
import Dashboard from './features/dashboard/pages/Dashboard';
import TeamStudy from './features/study/pages/TeamStudy';
import StudyStart from './features/study/pages/StudyStart';
import PersonalStudy from './features/study/pages/PersonalStudy';
import CamStudyPage from './features/study/pages/CamStudyPage';
import Login from './features/auth/pages/Login';
import VideoRoom from './features/rtc/pages/VideoRoom';
import RoomFull from './features/rtc/pages/RoomFull';
import BackendTest from './features/devtools/BackendTest';
import Register from './features/auth/pages/Register';
import RoomList from './features/rtc/pages/RoomList';
import Evaluation from './features/evaluation/entry/evaluation';
import Community from './features/community/pages/Community';
import Statistics from './features/statistics/pages/Statistics';
import MyPage from './features/profile/pages/MyPage';
import QuizResult from './features/study/pages/QuizResult';
import UnitEvaluationPlan from './features/evaluation/pages/UnitEvaluationPlan';
import UnitEvaluationFeedback from './features/evaluation/pages/UnitEvaluationFeedback';
import UnitEvaluationSchedule from './features/evaluation/pages/UnitEvaluationSchedule';
import './global/styles/style.css';
import Post from './features/community/pages/Post';
import Notice from './features/community/pages/Notice';
import Chat from './features/community/pages/Chat';
import Friend from './features/community/pages/Friend';
import PostWritePage from './features/community/components/community/PostWritePage';
import PostDetail from './features/community/components/community/PostDetail';
import StudyListPage from './features/community/components/community/StudyListPage';
import StudyDetail from './features/community/components/community/StudyDetail';
import StudyCreatePage from './features/community/components/community/StudyCreatePage';
import UnitEvaluationPlanList from './features/evaluation/pages/UnitEvaluationPlanList';
import PlanMenu from './features/plan/pages/PlanMenu';

// ✅ 새로 추가된 팀 학습 관련 페이지
import QuizRoom from './features/study/pages/QuizRoom';
import FocusRoom from './features/study/pages/FocusRoom';

// 초기 스터디 목록
const initialStudyList = [];

const LayoutWithSidebar = () => (
    <div className="main-layout-container">
        <NavBar />
        <div className="content-area">
            <Outlet />
        </div>
    </div>
);

function App() {
    const [posts, setPosts] = useState([]);
    const [studyList, setStudyList] = useState(initialStudyList);

    const handleAddPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<LayoutWithSidebar />}>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/unit-evaluation" element={<UnitEvaluation />} />
                    <Route path="/unit-evaluation/start" element={<UnitEvaluationStart />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/teamStudy" element={<TeamStudy />} />
                    <Route path="/studyStart" element={<StudyStart />} />
                    <Route path="/personalStudy" element={<PersonalStudy />} />
                    <Route path="/study" element={<StudyListPage studyList={studyList} />} />
                    <Route path="/study/:id" element={<StudyDetail studyList={studyList} />} />
                    <Route path="/study/create" element={<StudyCreatePage setStudyList={setStudyList} />} />
                    <Route path="/camstudy" element={<CamStudyPage />} />
                    <Route path="/video-room/:roomId" element={<VideoRoom />} />
                    <Route path="/room-full" element={<RoomFull />} />
                    <Route path="/backend-test" element={<BackendTest />} />
                    <Route path="/rooms" element={<RoomList />} />
                    <Route path="/evaluation" element={<Evaluation />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/notice" element={<Notice />} />
                    <Route path="/community/post" element={<Post posts={posts} setPosts={setPosts} studyList={studyList} />} />
                    <Route path="/community/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
                    <Route path="/community/chat" element={<Chat />} />
                    <Route path="/community/friend" element={<Friend />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/write" element={<PostWritePage onAddPost={handleAddPost} />} />
                    <Route path="/quiz-result" element={<QuizResult />} />
                    <Route path="/plan/menu" element={<PlanMenu />} />
                    <Route path="/plan/create" element={<UnitEvaluationPlan />} />
                    <Route path="/plan/list" element={<UnitEvaluationPlanList />} />
                    <Route path="/unit-evaluation/plan" element={<UnitEvaluationPlan />} />
                    <Route path="/unit-evaluation/feedback" element={<UnitEvaluationFeedback />} />
                    <Route path="/unit-evaluation/schedule" element={<UnitEvaluationSchedule />} />

                    {/* ✅ 팀 학습 방 진입 URL 통일 */}
                    <Route path="/team-study/quiz/:roomId" element={<QuizRoom />} />
                    <Route path="/team-study/focus/:roomId" element={<FocusRoom />} />

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
