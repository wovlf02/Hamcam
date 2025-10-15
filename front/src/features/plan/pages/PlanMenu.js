import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PlanMenu.css';

function PlanMenu() {
  const navigate = useNavigate();
  return (
    <div className="plan-menu-container">
      <div className="plan-menu-card">
        <h2 className="plan-menu-title">
          학습 계획
        </h2>
        <div className="plan-menu-buttons">
          <button
            className="plan-menu-btn-primary"
            onClick={() => navigate('/plan/create')}
          >
            📝 AI로 학습 계획 생성하기
          </button>
          <button
            className="plan-menu-btn-secondary"
            onClick={() => navigate('/plan/list')}
          >
            📚 내 학습 계획 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanMenu;
