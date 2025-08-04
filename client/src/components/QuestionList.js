import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  const fetchQuestions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/questions?page=${page}&limit=12`);
      setQuestions(response.data.questions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalQuestions: response.data.totalQuestions,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage
      });
      setError(null);
    } catch (err) {
      setError('无法加载题目列表');
      console.error('获取题目失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return <div className="loading">正在加载题目...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button className="refresh-button" onClick={() => fetchQuestions(currentPage)}>
          重新加载
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="error">
        <h3>暂无题目</h3>
        <p>请点击"更新题库"按钮开始收集题目。</p>
        <p>首次运行可能需要几分钟时间。</p>
      </div>
    );
  }

  return (
    <div>
      <div className="question-grid">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="question-card"
            onClick={() => handleQuestionClick(question.id)}
          >
            <div className="question-number">
              第 {((currentPage - 1) * 12) + index + 1} 题
            </div>
            
            <div className="question-preview">
              {question.questionChinese || question.question}
            </div>

            {question.choicesChinese && question.choicesChinese.length > 0 && (
              <div className="choices-preview">
                <small style={{ color: '#666' }}>
                  {question.choicesChinese.length} 个选项
                </small>
              </div>
            )}

            <div className="question-meta">
              <span className="source-badge">{question.source}</span>
              <span className="language-badge">
                {question.originalLanguage === 'en' ? '英文' : 
                 question.originalLanguage === 'ja' ? '日文' : '中文'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            上一页
          </button>

          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={currentPage === pageNum ? 'current-page' : ''}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            下一页
          </button>
        </div>
      )}

      {pagination && (
        <div style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>
          第 {pagination.currentPage} 页，共 {pagination.totalPages} 页 | 
          总计 {pagination.totalQuestions} 道题目
        </div>
      )}
    </div>
  );
};

export default QuestionList;