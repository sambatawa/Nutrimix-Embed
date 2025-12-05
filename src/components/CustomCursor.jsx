'use client';
import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower || typeof window === 'undefined' || window.innerWidth <= 768) return;

    let rafId;

    const setTargetPosition = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const updateCursor = () => {
      cursor.style.transform = `translate(${pos.current.x - 10}px, ${pos.current.y - 10}px)`;

      const dx = pos.current.x - followerPos.current.x;
      const dy = pos.current.y - followerPos.current.y;

      const easeFactor = 0.15;

      followerPos.current.x += dx * easeFactor;
      followerPos.current.y += dy * easeFactor;

      follower.style.transform = `translate(${followerPos.current.x - 20}px, ${followerPos.current.y - 20}px)`;

      rafId = requestAnimationFrame(updateCursor);
    };

    document.addEventListener('mousemove', setTargetPosition);
    updateCursor();

    return () => {
      document.removeEventListener('mousemove', setTargetPosition);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-5 h-5 bg-white rounded-full pointer-events-none z-[99999] mix-blend-difference"
        style={{ transform: 'translate(-100vw, -100vh)' }}
      ></div>
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-white rounded-full pointer-events-none z-[99999]"
        style={{ transform: 'translate(-100vw, -100vh)' }} 
      ></div>
    </>
  );
};

export default CustomCursor;