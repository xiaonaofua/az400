import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import CountdownTimer from './components/CountdownTimer';
import axios from 'axios';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('无法加载统计信息');
      console.error('获取统计信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>🚀 AZ-400 练习题库</h1>
          <p>Azure DevOps Solutions 考试准备</p>
          <CountdownTimer examDate="2025-08-30T12:00:00" />
        </header>

        {loading && <div className="loading">加载中...</div>}
        
        {error && (
          <div className="error">
            {error}
            <button className="refresh-button" onClick={fetchStats}>
              重新加载
            </button>
          </div>
        )}

        {stats && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{stats.totalQuestions}</span>
              <span className="stat-label">总题目数</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(stats.sources).length}</span>
              <span className="stat-label">数据源</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(stats.languages).length}</span>
              <span className="stat-label">语言版本</span>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<QuestionList />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;