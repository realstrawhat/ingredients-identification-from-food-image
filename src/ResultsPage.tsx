import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Divider, Container, Chip, Grid, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SimpleBackground from './components/ui/SimpleBackground';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimerIcon from '@mui/icons-material/Timer';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import styled from '@emotion/styled';
import { Theme } from '@mui/material/styles';

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

const StyledChip = styled(Chip)<{ theme?: Theme }>(({ theme }) => ({
  background: 'rgba(65, 105, 225, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(65, 105, 225, 0.2)',
  color: '#4169E1',
  '& .MuiChip-icon': {
    color: '#4169E1',
  },
}));

const StyledListItem = styled(ListItem)<{ theme?: Theme }>(({ theme }) => ({
  padding: theme?.spacing(1.5, 0),
  borderBottom: '1px solid rgba(65, 105, 225, 0.1)',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const ContentBox = styled(Box)({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '0px',
  border: '1px solid rgba(65, 105, 225, 0.2)',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
});

const ResultsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [rawApiResponse, setRawApiResponse] = useState<string | null>(null);

  useEffect(() => {
    console.log('ResultsPage: Component mounted');
    console.log('ResultsPage: Loading data from localStorage');

    // Test localStorage
    try {
      localStorage.setItem('test-key', 'test-value');
      const testValue = localStorage.getItem('test-key');
      console.log('ResultsPage: Test localStorage value:', testValue);
      
      // Check all localStorage keys
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allKeys.push(key);
        console.log(`ResultsPage: localStorage key: ${key}`);
      }
      console.log('ResultsPage: All localStorage keys:', allKeys);
      
      // Add debug info
      setDebugInfo(`LocalStorage keys: ${allKeys.join(', ')}`);
      
      // Get raw API response if available
      const rawResponse = localStorage.getItem('raw-api-response');
      if (rawResponse) {
        console.log('ResultsPage: Raw API response found');
        setRawApiResponse(rawResponse);
      }
      
      // If no recipe data is found, set some test data
      if (!localStorage.getItem('recipe')) {
        console.log('ResultsPage: Setting test recipe data');
        const testRecipe = {
          isFood: true,
          foodName: "Test Recipe",
          ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
          recipe: ["Step 1", "Step 2", "Step 3"],
          cookingTime: "30 minutes",
          difficulty: "medium",
          cuisine: "Test cuisine"
        };
        localStorage.setItem('recipe', JSON.stringify(testRecipe));
        setRecipe(testRecipe);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('ResultsPage: Error testing localStorage:', error);
      setDebugInfo(`LocalStorage error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Get recipe data from localStorage
    const recipeData = localStorage.getItem('recipe');
    console.log('ResultsPage: Recipe data from localStorage:', recipeData);
    
    // Get image data from localStorage
    const imageData = localStorage.getItem('image');
    console.log('ResultsPage: Image data from localStorage:', imageData ? 'Image data exists' : 'No image data');

    if (!recipeData || !imageData) {
      console.error('ResultsPage: Missing data in localStorage');
      setError('No recipe or image data found. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const parsedRecipe = JSON.parse(recipeData);
      console.log('ResultsPage: Parsed recipe data:', parsedRecipe);
      
      // Check if the parsed recipe has the expected structure
      if (!parsedRecipe.foodName || !parsedRecipe.ingredients || !parsedRecipe.recipe) {
        console.error('ResultsPage: Parsed recipe missing required fields:', parsedRecipe);
        setError('Recipe data is incomplete. Please try again.');
        setLoading(false);
        return;
      }
      
      setRecipe(parsedRecipe);
      setImage(imageData);
      setLoading(false);
    } catch (error) {
      console.error('ResultsPage: Error parsing recipe data:', error);
      setError('Invalid recipe data. Please try again.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <SimpleBackground>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#1a237e' }} />
          </Box>
        </Container>
      </SimpleBackground>
    );
  }

  if (error) {
    return (
      <SimpleBackground>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{ 
                mt: 2,
                backgroundColor: '#1a237e',
                '&:hover': {
                  backgroundColor: '#283593',
                },
              }}
            >
              Go Back
            </Button>
          </Box>
        </Container>
      </SimpleBackground>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Recipe: ${recipe?.foodName}`,
        text: `Check out this recipe for ${recipe?.foodName}!`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Sharing is not supported on this browser');
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mb: 4,
              color: '#4169E1',
              '&:hover': {
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
              },
            }}
          >
            Back to Home
          </Button>

          <Grid container spacing={4} sx={{ flex: 1, justifyContent: 'center' }}>
            <Grid item xs={12}>
              <StyledPaper>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                  <RestaurantIcon sx={{ fontSize: 40, mr: 2, color: '#4169E1' }} />
                  <Typography variant="h4" component="h1" sx={{ color: '#4169E1', fontWeight: 600 }}>
                    {recipe?.foodName}
                  </Typography>
                </Box>

                {image && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <img 
                      src={image} 
                      alt="Recipe" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        borderRadius: '0px',
                        border: '1px solid rgba(65, 105, 225, 0.2)',
                        boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)'
                      }} 
                    />
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <StyledChip
                    icon={<TimerIcon />}
                    label={`Cooking Time: ${recipe?.cookingTime}`}
                  />
                  <StyledChip
                    icon={<LocalDiningIcon />}
                    label={`Difficulty: ${recipe?.difficulty}`}
                  />
                  <StyledChip
                    icon={<RestaurantMenuIcon />}
                    label={recipe?.cuisine}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
                  <IconButton 
                    onClick={handlePrint} 
                    sx={{ 
                      color: '#4169E1',
                      '&:hover': {
                        backgroundColor: 'rgba(65, 105, 225, 0.1)',
                      },
                    }}
                  >
                    <PrintIcon />
                  </IconButton>
                  <IconButton 
                    onClick={handleShare}
                    sx={{ 
                      color: '#4169E1',
                      '&:hover': {
                        backgroundColor: 'rgba(65, 105, 225, 0.1)',
                      },
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>

                <ContentBox>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4169E1', fontWeight: 600, textAlign: 'center' }}>
                    Ingredients
                  </Typography>
                  <List>
                    {recipe?.ingredients.map((ingredient: string, index: number) => (
                      <StyledListItem key={index}>
                        <ListItemText 
                          primary={ingredient} 
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              color: '#4169E1',
                            }
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </ContentBox>

                <Divider sx={{ my: 3, borderColor: 'rgba(65, 105, 225, 0.2)' }} />

                <ContentBox>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4169E1', fontWeight: 600, textAlign: 'center' }}>
                    Instructions
                  </Typography>
                  <List>
                    {recipe?.recipe.map((step: string, index: number) => (
                      <StyledListItem key={index}>
                        <ListItemText 
                          primary={`${index + 1}. ${step}`} 
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              color: '#4169E1',
                            }
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </ContentBox>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </SimpleBackground>
  );
};

export default ResultsPage; 