import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import '../styles/DashboardGrowth.css'; // Import the new CSS file

const DashboardGrowth = () => {
  const [growthList, setGrowthList] = useState([]);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const res = await api.post('/dashboard/stats/weekly'); // ✅ 실제 연동 API
        const subjectGrowth = res.data?.subjectGrowth || []; // ✅ 서버 응답 구조에 맞춰 파싱
        setGrowthList(subjectGrowth);
      } catch (err) {
        console.error('주간 성장률 조회 실패:', err);
      }
    };

    fetchGrowthData();
  }, []);

  return (
      <div className="dashboard-card dashboard-growth-card">
        <div className="dashboard-growth-header"><h3>주간 성장률</h3></div>
        {growthList.length === 0 ? (
            <div className="no-growth-data">이번 주 학습 데이터가 없습니다.</div>
        ) : (
            growthList.map((g, i) => (
                <div key={i} className="growth-item">
                  <div className="growth-item-header">
                    <span className="growth-subject">{g.subject}</span>
                    <span className="growth-rate">+{g.rate}%</span>
                  </div>
                  <div className="dashboard-growth-bar-bg">
                    <div className="dashboard-growth-bar" style={{ width: `${g.rate * 2}%` }} />
                  </div>
                </div>
            ))
        )}
      </div>
  );
};

export default DashboardGrowth;
