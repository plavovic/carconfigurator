import React from 'react';
import { useState, useEffect, useRef } from "react";


function Counter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [start, setStart] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStart(true),
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [start, target, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

export default Counter;
