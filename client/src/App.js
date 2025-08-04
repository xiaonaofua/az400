import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import CountdownTimer from './components/CountdownTimer';
import questionsData from './data/questions.json';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateStats = () => {
    const stats = {
      totalQuestions: questionsData.length,
      sources: {},
      languages: {}
    };
    
    questionsData.forEach(question => {
      stats.sources[question.source] = (stats.sources[question.source] || 0) + 1;
      stats.languages[question.originalLanguage] = (stats.languages[question.originalLanguage] || 0) + 1;
    });
    
    return stats;
  };

  useEffect(() => {
    const statsData = calculateStats();
    setStats(statsData);
    setLoading(false);
  }, []);


  return (
    <Router basename="/az400">
      <div className="container">
        <header className="header">
          <h1>🚀 AZ-400 练习题库</h1>
          <p>Azure DevOps Solutions 考试准备</p>
          <CountdownTimer examDate="2025-08-30T12:00:00" />
        </header>

        {loading && <div className="loading">加载中...</div>}

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