import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ examDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const examTime = new Date(examDate).getTime();
    const difference = examTime - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [examDate]);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="countdown-timer">
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.days)}</span>
        <span className="countdown-label">天</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.hours)}</span>
        <span className="countdown-label">时</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.minutes)}</span>
        <span className="countdown-label">分</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.seconds)}</span>
        <span className="countdown-label">秒</span>
      </div>
    </div>
  );
};

export default CountdownTimer;