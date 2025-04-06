import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Paper,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate, Routes, Route } from 'react-router-dom';
import SimpleBackground from './components/ui/SimpleBackground';
import './styles/animations.css';
import { AnimatedMeshGradient } from './components/ui/AnimatedMeshGradient';
import AboutPage from './AboutPage';
import HomePage from './HomePage';
import ResultsPage from './ResultsPage';

// OpenRouter API key
const OPENROUTER_API_KEY = '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';

// API configuration
const API_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  model: 'google/gemini-pro-vision',
  maxTokens: 1000,
  temperature: 0.7,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Fresh Recipe AI',
  }
};

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '40px',
  background: 'var(--card-bg)',
  backdropFilter: 'var(--card-blur)',
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'var(--primary-text)',
  transition: 'all var(--transition-speed) var(--transition-timing)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const UploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(255, 255, 255, 0.2)',
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

const NavButton = styled(Button)(({ theme }) => ({
  color: 'var(--primary-text)',
  margin: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: 'var(--border-radius)',
  transition: 'all var(--transition-speed) var(--transition-timing)',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid var(--card-border)',
  color: 'var(--primary-text)',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 3),
  '@media (min-width: 600px)': {
    padding: theme.spacing(1, 4),
  },
}));

function App() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      // Test localStorage
      localStorage.setItem('test-app', 'test-value-app');
      const testValue = localStorage.getItem('test-app');
      console.log('EnhancedApp: Test localStorage value:', testValue);
      
      // Clear any existing recipe data
      localStorage.removeItem('recipe');
      localStorage.removeItem('image');
      console.log('EnhancedApp: Cleared existing localStorage data');

      console.log('Sending image to OpenRouter API for analysis...');
      const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'First, determine if this image contains food. If it does not contain food, respond with: {"isFood": false, "message": "This image does not appear to contain food. Please upload an image of food."}. If it does contain food, analyze it and provide a detailed response in this exact JSON format: {"isFood": true, "foodName": "name of the dish", "ingredients": ["ingredient1", "ingredient2", ...], "recipe": ["step 1", "step 2", ...], "cookingTime": "estimated cooking time", "difficulty": "easy/medium/hard", "cuisine": "type of cuisine"}. Make sure to wrap the response in ```json``` code blocks.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: selectedImage
                  }
                }
              ]
            }
          ],
          max_tokens: API_CONFIG.maxTokens,
          temperature: API_CONFIG.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenRouter API response:', data);
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response format');
      }

      const content = data.choices[0].message.content;
      console.log('API content:', content);
      
      // Save raw API response to localStorage for debugging
      localStorage.setItem('raw-api-response', content);
      console.log('Saved raw API response to localStorage for debugging');
      
      try {
        // First try to extract JSON from code blocks
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                         content.match(/```\s*([\s\S]*?)\s*```/);
        
        if (!jsonMatch) {
          console.error('No JSON code blocks found in response');
          throw new Error('No JSON found in response');
        }

        const jsonContent = jsonMatch[1].trim();
        console.log('Extracted JSON:', jsonContent);

        const parsedContent = JSON.parse(jsonContent);
        console.log('Parsed content:', parsedContent);
        
        // Check if the image contains food
        if (!parsedContent.isFood) {
          setError(parsedContent.message || 'This image does not appear to contain food. Please upload an image of food.');
          setIsAnalyzing(false);
          return;
        }
        
        // Validate the parsed content has all required fields
        if (!parsedContent.foodName || !parsedContent.ingredients || !parsedContent.recipe) {
          console.error('Missing required fields in parsed content:', parsedContent);
          throw new Error('Invalid response format: missing required fields');
        }

        // Save data to localStorage
        console.log('Saving recipe data to localStorage:', parsedContent);
        console.log('Saving image data to localStorage:', selectedImage ? 'Image data exists' : 'No image data');
        localStorage.setItem('recipe', JSON.stringify(parsedContent));
        localStorage.setItem('image', selectedImage);
        
        // Verify data was saved correctly
        const savedRecipe = localStorage.getItem('recipe');
        const savedImage = localStorage.getItem('image');
        console.log('Verified saved recipe data:', savedRecipe);
        console.log('Verified saved image data:', savedImage ? 'Image data exists' : 'No image data');
        
        // Navigate to results page
        console.log('Navigating to results page...');
        navigate('/results');
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', content);

        // Fallback: Try to extract information using regex
        const isFoodMatch = content.match(/"isFood"\s*:\s*(true|false)/);
        const messageMatch = content.match(/"message"\s*:\s*"([^"]+)"/);
        
        if (isFoodMatch && messageMatch && isFoodMatch[1] === 'false') {
          setError(messageMatch[1]);
          setIsAnalyzing(false);
          return;
        }
        
        const foodNameMatch = content.match(/"foodName"\s*:\s*"([^"]+)"/);
        const ingredientsMatch = content.match(/"ingredients"\s*:\s*\[(.*?)\]/s);
        const recipeMatch = content.match(/"recipe"\s*:\s*\[(.*?)\]/s);
        const cookingTimeMatch = content.match(/"cookingTime"\s*:\s*"([^"]+)"/);
        const difficultyMatch = content.match(/"difficulty"\s*:\s*"([^"]+)"/);
        const cuisineMatch = content.match(/"cuisine"\s*:\s*"([^"]+)"/);
        
        if (!foodNameMatch || !ingredientsMatch) {
          throw new Error('Could not extract required recipe information');
        }
        
        // Parse ingredients
        const ingredientsText = ingredientsMatch[1];
        const ingredients = ingredientsText
          .split(',')
          .map((item: string) => item.trim().replace(/^"|"$/g, ''))
          .filter((item: string) => item);
        
        // Parse recipe steps
        let recipeSteps = [];
        if (recipeMatch) {
          const recipeText = recipeMatch[1];
          recipeSteps = recipeText
            .split(',')
            .map((item: string) => item.trim().replace(/^"|"$/g, ''))
            .filter((item: string) => item);
        } else {
          // If recipe is not an array, try to get it as a string
          const recipeStringMatch = content.match(/"recipe"\s*:\s*"([^"]+)"/);
          if (recipeStringMatch) {
            recipeSteps = [recipeStringMatch[1]];
          }
        }
        
        // Create recipe object
        const parsedContent = {
          isFood: true,
          foodName: foodNameMatch[1],
          ingredients: ingredients,
          recipe: recipeSteps,
          cookingTime: cookingTimeMatch ? cookingTimeMatch[1] : 'Not specified',
          difficulty: difficultyMatch ? difficultyMatch[1] : 'Not specified',
          cuisine: cuisineMatch ? cuisineMatch[1] : 'Not specified'
        };
        
        // Save fallback recipe data to localStorage
        console.log('Saving fallback recipe data to localStorage:', parsedContent);
        localStorage.setItem('recipe', JSON.stringify(parsedContent));
        localStorage.setItem('image', selectedImage);
        
        console.log('Navigating to results page...');
        navigate('/results');
      }
    } catch (err) {
      console.error('Error in analyzeImage:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image');
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

  const handleNavigation = (page: 'home' | 'about') => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (currentPage === 'about') {
      return <AboutPage />;
    }

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
              <UploadFileIcon
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
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 700,
            color: 'var(--primary-text)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <RestaurantIcon sx={{ color: 'var(--action-color)' }} />
            Fresh Recipe
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Home
            </StyledButton>
            <StyledButton 
              startIcon={<InfoIcon />}
              onClick={() => navigate('/about')}
            >
              About
            </StyledButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      <Box component="main" sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        padding: { xs: 2, sm: 3, md: 4 }
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App; 