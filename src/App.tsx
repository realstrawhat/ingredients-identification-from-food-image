import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

// OpenRouter API key
const OPENROUTER_API_KEY = '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';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [foodName, setFoodName] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Starting image analysis...');
      
      // Convert image to base64
      const base64Image = imagePreview.split(',')[1];
      
      // Create a detailed prompt
      const prompt = `Analyze this food image and provide the following information:
1. The name of the dish
2. A list of ingredients that appear to be in the dish
3. A recipe for making this dish

Please format your response exactly as follows:
Name: [dish name]
Ingredients:
- [ingredient 1]
- [ingredient 2]
...
Recipe:
1. [step 1]
2. [step 2]
...`;

      // Call OpenRouter API with the image
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Fresh Recipe AI'
        },
        body: JSON.stringify({
          model: "google/gemini-pro-vision",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${selectedImage.type};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API error:', errorData);
        throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenRouter Response:', data);
      
      const text = data.choices[0].message.content;
      console.log('AI Response text:', text);
      
      // Parse the response
      const nameMatch = text.match(/Name:(.*?)(?=Ingredients:|$)/s);
      const ingredientsMatch = text.match(/Ingredients:(.*?)(?=Recipe:|$)/s);
      const recipeMatch = text.match(/Recipe:(.*?)$/s);

      console.log('Parsing results:', { nameMatch, ingredientsMatch, recipeMatch });

      if (nameMatch) {
        setFoodName(nameMatch[1].trim());
      } else {
        console.log('No food name found in response');
        setError('Could not identify the food name');
        return;
      }

      if (ingredientsMatch) {
        const ingredientsList = ingredientsMatch[1]
          .split('\n')
          .filter(item => item.trim())
          .map(item => item.trim().replace(/^-\s*/, '')); // Remove bullet points if present
        console.log('Ingredients found:', ingredientsList);
        setIngredients(ingredientsList);
      } else {
        console.log('No ingredients found in response');
        setError('Could not identify the ingredients');
        return;
      }

      if (recipeMatch) {
        setRecipe(recipeMatch[1].trim());
      } else {
        console.log('No recipe found in response');
        setError('Could not generate the recipe');
        return;
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error in image analysis:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #4CAF50 0%, #2196F3 50%, #FF4081 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}
    >
      <Typography 
        variant="h6" 
        component="h1" 
        sx={{ 
          color: 'white',
          marginBottom: '20px'
        }}
      >
        A12 Major Project
      </Typography>

      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '400px',
          width: '100%',
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '20px' }}>
          Upload Image
        </Typography>

        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '40px 20px',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: '#2196F3'
            }
          }}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                objectFit: 'contain' 
              }} 
            />
          ) : (
            <Typography color="textSecondary">
              click to upload image
            </Typography>
          )}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageUpload}
          />
        </Box>

        <Button
          variant="contained"
          onClick={analyzeImage}
          disabled={!selectedImage || loading}
          sx={{
            width: '100%',
            backgroundColor: '#2196F3',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1976D2'
            },
            textTransform: 'none',
            borderRadius: '8px',
            padding: '10px'
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Identify Ingredients'}
        </Button>
      </Box>

      {showResults && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            margin: '20px auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <Typography variant="h5" gutterBottom>
            {foodName}
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Ingredients:
          </Typography>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <Typography variant="body1">{ingredient}</Typography>
              </li>
            ))}
          </ul>
          
          <Typography variant="h6" gutterBottom>
            Recipe:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {recipe}
          </Typography>
        </Box>
      )}

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App; 