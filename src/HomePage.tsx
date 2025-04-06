import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleBackground from './components/ui/SimpleBackground';

const StyledPaper = styled(Paper)<{ theme?: Theme }>(({ theme }) => ({
  padding: theme?.spacing(4),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '0px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(65, 105, 225, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)',
  },
}));

const UploadArea = styled(Box)<{ isDragging: boolean }>(({ isDragging }) => ({
  border: `2px dashed ${isDragging ? '#4169E1' : 'rgba(65, 105, 225, 0.2)'}`,
  borderRadius: '0px',
  padding: '40px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isDragging ? 'rgba(65, 105, 225, 0.05)' : 'transparent',
  '&:hover': {
    borderColor: '#4169E1',
    background: 'rgba(65, 105, 225, 0.05)',
  },
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px',
  borderRadius: '0px',
  border: '1px solid rgba(65, 105, 225, 0.2)',
  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
});

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
        setSelectedImage(null);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select an image file');
        setSelectedImage(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // Store the image in localStorage for the results page
      localStorage.setItem('image', selectedImage);
      
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please check your environment variables.');
      }

      // Make API call to analyze the image
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Fresh Recipe'
        },
        body: JSON.stringify({
          model: 'google/gemini-pro-vision',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this food image and provide a recipe in the following JSON format: { "foodName": "name of the dish", "ingredients": ["ingredient1", "ingredient2", ...], "recipe": ["step1", "step2", ...], "cookingTime": "estimated time", "difficulty": "easy/medium/hard", "cuisine": "type of cuisine" }'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: selectedImage
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API error: ${errorData.error?.message || 'Failed to analyze image'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Extract the recipe from the API response
      const recipeText = data.choices[0].message.content;
      let recipe;
      
      try {
        // Try to parse the JSON from the response
        recipe = JSON.parse(recipeText);
      } catch (e) {
        // If parsing fails, try to extract JSON using regex
        const jsonMatch = recipeText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recipe = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract recipe data from response');
        }
      }

      // Validate the recipe data
      if (!recipe.foodName || !recipe.ingredients || !recipe.recipe) {
        throw new Error('Invalid recipe data received');
      }

      // Store the recipe in localStorage
      localStorage.setItem('recipe', JSON.stringify(recipe));
      
      // Navigate to results page
      navigate('/results');
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleBackground>
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 8,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          alignItems: 'center',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(65, 105, 225, 0.5)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(65, 105, 225, 0.7)',
            },
          },
        }}
      >
        <Box sx={{ py: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: '#4169E1', 
              fontWeight: 600,
              textAlign: 'center',
              mb: 4,
            }}
          >
            Fresh Recipe
          </Typography>

          <Grid container spacing={4} sx={{ flex: 1, justifyContent: 'center' }}>
            <Grid item xs={12}>
              <StyledPaper>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      color: '#4169E1', 
                      fontWeight: 500,
                      textAlign: 'center',
                      mb: 4,
                    }}
                  >
                    Upload a food image to get started
                  </Typography>

                  <UploadArea
                    isDragging={isDragging}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#4169E1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#4169E1', mb: 1 }}>
                      Drag and drop your image here
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(65, 105, 225, 0.7)' }}>
                      or click to browse
                    </Typography>
                  </UploadArea>

                  {selectedImage && (
                    <Box sx={{ mt: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <PreviewImage src={selectedImage} alt="Preview" />
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={handleRemoveImage}
                        sx={{ 
                          mt: 2,
                          color: '#4169E1',
                          '&:hover': {
                            backgroundColor: 'rgba(65, 105, 225, 0.1)',
                          },
                        }}
                      >
                        Remove Image
                      </Button>
                    </Box>
                  )}

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mt: 2, 
                        width: '100%',
                        borderRadius: '0px',
                        border: '1px solid rgba(65, 105, 225, 0.2)',
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={!selectedImage || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    sx={{ 
                      mt: 4,
                      backgroundColor: '#4169E1',
                      '&:hover': {
                        backgroundColor: '#3154B3',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(65, 105, 225, 0.3)',
                      },
                      borderRadius: '0px',
                    }}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </SimpleBackground>
  );
};

export default HomePage; 