import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const BackgroundContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#ffffff',
  zIndex: 0,
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
  minHeight: '100vh',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '2rem 1rem',
  backgroundColor: 'transparent',
  color: '#000000',
});

const Blob = styled('div')({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(40px)',
  opacity: 0.15,
  background: 'radial-gradient(circle, rgba(0, 122, 255, 0.3) 0%, rgba(0, 122, 255, 0) 70%)',
  animation: 'float 20s ease-in-out infinite',
  '@keyframes float': {
    '0%': {
      transform: 'translate(0, 0)',
    },
    '50%': {
      transform: 'translate(100px, 100px)',
    },
    '100%': {
      transform: 'translate(0, 0)',
    },
  },
});

interface GradientBackgroundProps {
  children: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create 3 blobs
    for (let i = 0; i < 3; i++) {
      const blob = document.createElement('div');
      blob.style.width = `${Math.random() * 300 + 200}px`;
      blob.style.height = blob.style.width;
      blob.style.left = `${Math.random() * 100}%`;
      blob.style.top = `${Math.random() * 100}%`;
      blob.style.animationDelay = `${Math.random() * 10}s`;
      blob.className = Blob.toString();
      containerRef.current.appendChild(blob);
    }
    
    return () => {
      if (containerRef.current) {
        const blobs = containerRef.current.querySelectorAll(`.${Blob.toString()}`);
        blobs.forEach(blob => blob.remove());
      }
    };
  }, []);

  return (
    <BackgroundContainer ref={containerRef}>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </BackgroundContainer>
  );
};

export default GradientBackground; 