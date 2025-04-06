import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AnimatedMeshGradientProps {
  children: React.ReactNode;
}

const MeshContainer = styled(Box)({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'transparent',
});

const MeshOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-50%',
    background: 'radial-gradient(circle at 50% 50%, rgba(46, 49, 146, 0.8), rgba(27, 255, 255, 0.8), rgba(212, 20, 90, 0.8), rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8), rgba(46, 49, 146, 0.8))',
    backgroundSize: '200% 200%',
    filter: 'blur(80px) saturate(150%)',
    animation: 'meshMove 30s ease infinite',
    transform: 'rotate(0deg)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%)',
    mixBlendMode: 'multiply',
  },
  '@keyframes meshMove': {
    '0%': {
      backgroundPosition: '0% 0%',
    },
    '25%': {
      backgroundPosition: '100% 0%',
    },
    '50%': {
      backgroundPosition: '100% 100%',
    },
    '75%': {
      backgroundPosition: '0% 100%',
    },
    '100%': {
      backgroundPosition: '0% 0%',
    },
  },
});

const BlobContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  overflow: 'hidden',
  opacity: 0.7,
  '& > div': {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(40px)',
    mixBlendMode: 'screen',
    animation: 'blobFloat 20s ease-in-out infinite',
  },
  '& > div:nth-of-type(1)': {
    width: '40%',
    height: '40%',
    background: 'rgba(46, 49, 146, 0.8)',
    top: '10%',
    left: '10%',
    animationDelay: '0s',
  },
  '& > div:nth-of-type(2)': {
    width: '30%',
    height: '30%',
    background: 'rgba(27, 255, 255, 0.8)',
    top: '60%',
    left: '60%',
    animationDelay: '-5s',
  },
  '& > div:nth-of-type(3)': {
    width: '35%',
    height: '35%',
    background: 'rgba(212, 20, 90, 0.8)',
    top: '30%',
    left: '70%',
    animationDelay: '-10s',
  },
  '& > div:nth-of-type(4)': {
    width: '25%',
    height: '25%',
    background: 'rgba(255, 107, 107, 0.8)',
    top: '70%',
    left: '20%',
    animationDelay: '-15s',
  },
  '@keyframes blobFloat': {
    '0%': {
      transform: 'translate(0, 0) scale(1)',
    },
    '33%': {
      transform: 'translate(10%, 10%) scale(1.1)',
    },
    '66%': {
      transform: 'translate(-5%, 15%) scale(0.9)',
    },
    '100%': {
      transform: 'translate(0, 0) scale(1)',
    },
  },
});

const ContentContainer = styled(Box)({
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '2rem 0',
  overflow: 'auto',
  width: '100%',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(26, 35, 126, 0.5)',
    borderRadius: '4px',
    '&:hover': {
      background: 'rgba(26, 35, 126, 0.7)',
    },
  },
});

export const AnimatedMeshGradient: React.FC<AnimatedMeshGradientProps> = ({ children }) => {
  return (
    <MeshContainer>
      <MeshOverlay />
      <BlobContainer>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </BlobContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </MeshContainer>
  );
}; 