import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const fetchQuestionAndList = async () => {
      try {
        setLoading(true);
        
        // 获取当前题目
        const questionResponse = await axios.get(`/api/questions/${id}`);
        setQuestion(questionResponse.data);
        
        // 获取所有题目列表用于导航
        const allQuestionsResponse = await axios.get('/api/questions?limit=1000');
        setAllQuestions(allQuestionsResponse.data.questions);
        
        // 找到当前题目在列表中的索引
        const index = allQuestionsResponse.data.questions.findIndex(q => q.id === id);
        setCurrentIndex(index);
        
        setError(null);
      } catch (err) {
        setError('无法加载题目详情');
        console.error('获取题目详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndList();
  }, [id]);

  const handleAnswerSelect = (choiceIndex) => {
    if (selectedAnswers.includes(choiceIndex)) {
      setSelectedAnswers(selectedAnswers.filter(index => index !== choiceIndex));
    } else {
      setSelectedAnswers([...selectedAnswers, choiceIndex]);
    }
  };

  const handleShowAnswers = () => {
    setShowAnswers(true);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setShowAnswers(false);
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      const prevQuestion = allQuestions[currentIndex - 1];
      navigate(`/question/${prevQuestion.id}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < allQuestions.length - 1) {
      const nextQuestion = allQuestions[currentIndex + 1];
      navigate(`/question/${nextQuestion.id}`);
    }
  };

  if (loading) {
    return <div className="loading">正在加载题目详情...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button className="refresh-button" onClick={() => navigate('/')}>
          返回题目列表
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="error">
        题目未找到
        <button className="refresh-button" onClick={() => navigate('/')}>
          返回题目列表
        </button>
      </div>
    );
  }

  const correctAnswers = question.choicesChinese 
    ? question.choicesChinese.map((choice, index) => choice.isCorrect ? index : -1).filter(index => index !== -1)
    : [];

  return (
    <div className="question-detail">
      <div className="question-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 返回题目列表
        </button>
        
        <div className="question-info">
          <h1>{question.titleChinese || question.title}</h1>
          <div className="question-badges">
            <span className="source-badge">{question.source}</span>
            <span className="language-badge">
              {question.originalLanguage === 'en' ? '英文原版' : 
               question.originalLanguage === 'ja' ? '日文原版' : '中文原版'}
            </span>
          </div>
        </div>
      </div>

      <div className="question-content">
        <div className="language-toggle">
          <button 
            className={!showOriginal ? 'active' : ''}
            onClick={() => setShowOriginal(false)}
          >
            中文版本
          </button>
          <button 
            className={showOriginal ? 'active' : ''}
            onClick={() => setShowOriginal(true)}
          >
            原文版本
          </button>
        </div>

        <div className="question-text">
          <h2>题目</h2>
          <p>{showOriginal ? question.question : (question.questionChinese || question.question)}</p>
        </div>

        {(question.choicesChinese || question.choices) && (
          <div className="question-choices">
            <h3>选项</h3>
            {(showOriginal ? question.choices : question.choicesChinese || question.choices).map((choice, index) => {
              const isSelected = selectedAnswers.includes(index);
              const isCorrect = correctAnswers.includes(index);
              const showResult = showAnswers;
              
              let choiceClass = 'choice-item';
              if (showResult) {
                if (isCorrect) {
                  choiceClass += ' correct';
                } else if (isSelected && !isCorrect) {
                  choiceClass += ' incorrect';
                }
              } else if (isSelected) {
                choiceClass += ' selected';
              }

              return (
                <div
                  key={index}
                  className={choiceClass}
                  onClick={() => !showAnswers && handleAnswerSelect(index)}
                >
                  <span className="choice-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="choice-text">
                    {showOriginal ? choice.text : (choice.textChinese || choice.text)}
                  </span>
                  {showResult && isCorrect && (
                    <span className="correct-indicator">✓ 正确</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="question-actions">
          {!showAnswers ? (
            <button className="show-answers-btn" onClick={handleShowAnswers}>
              显示答案
            </button>
          ) : (
            <button className="reset-btn" onClick={handleReset}>
              重新作答
            </button>
          )}
        </div>

        {showAnswers && correctAnswers.length > 0 && (
          <div className="answer-explanation">
            <h3>正确答案</h3>
            <p>
              正确选项: {correctAnswers.map(index => String.fromCharCode(65 + index)).join(', ')}
            </p>
            {question.explanation && (
              <div className="explanation">
                <h4>解释</h4>
                <p>{showOriginal ? question.explanation : (question.explanationChinese || question.explanation)}</p>
              </div>
            )}
          </div>
        )}

        <div className="source-info">
          <h3>题目来源</h3>
          <p>
            <strong>来源网站:</strong> {question.source}
            <br />
            <strong>原始链接:</strong> 
            <a href={question.sourceUrl} target="_blank" rel="noopener noreferrer">
              {question.sourceUrl}
            </a>
            <br />
            <strong>题目ID:</strong> {question.id}
          </p>
        </div>

        <div className="navigation-controls">
          <div className="nav-buttons">
            <button 
              className="nav-button prev-button" 
              onClick={handlePreviousQuestion}
              disabled={currentIndex <= 0}
            >
              ← 上一题
            </button>
            
            <span className="question-counter">
              第 {currentIndex + 1} / {allQuestions.length} 题
            </span>
            
            <button 
              className="nav-button next-button" 
              onClick={handleNextQuestion}
              disabled={currentIndex >= allQuestions.length - 1}
            >
              下一题 →
            </button>
          </div>
          
          <button className="back-to-list-button" onClick={() => navigate('/')}>
            📋 返回题目列表
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;