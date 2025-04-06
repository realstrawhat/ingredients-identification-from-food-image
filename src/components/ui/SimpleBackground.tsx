import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';

const BackgroundWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: 'linear-gradient(135deg, var(--background-start) 0%, var(--background-end) 100%)',
  perspective: '1000px',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 30%, rgba(0, 245, 212, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(255, 217, 61, 0.2) 0%, transparent 50%)
    `,
    opacity: 0.8,
    animation: 'pulse 15s infinite ease-in-out',
    transform: 'translateZ(-100px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23FF6B6B' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")
    `,
    opacity: 0.7,
    animation: 'float 20s infinite ease-in-out',
    transform: 'translateZ(-50px)',
  }
});

const FloatingElements = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  '& > div': {
    position: 'absolute',
    width: '100px',
    height: '100px',
    background: 'rgba(0, 245, 212, 0.1)',
    borderRadius: '50%',
    filter: 'blur(20px)',
    animation: 'float 15s infinite ease-in-out',
    '&:nth-of-type(1)': {
      top: '20%',
      left: '10%',
      animationDelay: '0s',
      transform: 'translateZ(-30px)',
    },
    '&:nth-of-type(2)': {
      top: '60%',
      right: '15%',
      animationDelay: '-5s',
      transform: 'translateZ(-20px)',
    },
    '&:nth-of-type(3)': {
      bottom: '20%',
      left: '20%',
      animationDelay: '-10s',
      transform: 'translateZ(-40px)',
    }
  }
});

const ContentWrapper = styled('div')({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  zIndex: 1,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'transparent',
  transition: 'all var(--transition-speed) var(--transition-timing)',
  transform: 'translateZ(0)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    animation: 'pulse 10s infinite ease-in-out',
    pointerEvents: 'none',
  }
});

interface SimpleBackgroundProps {
  children: React.ReactNode;
}

const SimpleBackground: React.FC<SimpleBackgroundProps> = ({ children }) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = backgroundRef.current.getBoundingClientRect();
      
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      
      backgroundRef.current.style.transform = `
        perspective(1000px)
        rotateX(${-y}deg)
        rotateY(${x}deg)
        translateZ(0)
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <BackgroundWrapper ref={backgroundRef}>
        <FloatingElements>
          <div />
          <div />
          <div />
        </FloatingElements>
      </BackgroundWrapper>
      <ContentWrapper className="fade-in">
        {children}
      </ContentWrapper>
    </>
  );
};

export default SimpleBackground; 