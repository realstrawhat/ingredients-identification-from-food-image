import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 'var(--border-radius)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid var(--card-border)',
  transition: 'all var(--transition-speed) var(--transition-timing)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, var(--highlight-1), var(--highlight-2), var(--highlight-3))',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const UploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(63, 81, 181, 0.3)',
  borderRadius: 'var(--border-radius)',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all var(--transition-speed) var(--transition-timing)',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    borderColor: 'var(--highlight-1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'var(--primary-text)',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: 'var(--border-radius)',
  transition: 'all var(--transition-speed) var(--transition-timing)',
  '&:hover': {
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

function HomePage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store test data in localStorage
      const testRecipe = {
        foodName: "Test Recipe",
        ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
        recipe: ["Step 1", "Step 2", "Step 3"],
        cookingTime: "30 minutes",
        difficulty: "Medium",
        cuisine: "International"
      };
      
      localStorage.setItem('recipe', JSON.stringify(testRecipe));
      localStorage.setItem('image', selectedImage);
      
      navigate('/results');
    } catch (err) {
      setError('An error occurred while analyzing the image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '2rem',
      }}
    >
      <StyledPaper
        sx={{
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onClick={selectedImage ? resetApp : triggerFileInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: 'Playfair Display, serif',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            color: 'var(--primary-text)',
            marginBottom: '2rem',
          }}
        >
          Fresh Recipe
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            color: 'var(--primary-text)',
            marginBottom: '2rem',
            lineHeight: 1.8,
          }}
        >
          Upload a photo of your ingredients or a dish you'd like to recreate,
          and let our AI generate a detailed recipe for you.
        </Typography>

        {selectedImage ? (
          <Box sx={{ position: 'relative', marginBottom: '2rem' }}>
            <img
              src={selectedImage}
              alt="Selected"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius)',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: 'var(--border-radius)',
              }}
            >
              Click to change image
            </Typography>
          </Box>
        ) : (
          <UploadArea
            sx={{
              marginBottom: '2rem',
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: '4rem',
                color: 'var(--highlight-1)',
                marginBottom: '1rem',
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: 'var(--primary-text)',
                marginBottom: '1rem',
              }}
            >
              Drop your delicious image 🍕
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Browse Files
            </StyledButton>
          </UploadArea>
        )}

        <StyledButton
          variant="contained"
          color="primary"
          onClick={analyzeImage}
          disabled={!selectedImage || isAnalyzing}
          sx={{
            minWidth: '200px',
            background: 'var(--action-color)',
            '&:hover': {
              background: 'var(--highlight-3)',
            },
          }}
        >
          {isAnalyzing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Analyze Image'
          )}
        </StyledButton>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
      </StyledPaper>

      {error && (
        <Alert
          severity="error"
          sx={{
            marginTop: '2rem',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default HomePage; 