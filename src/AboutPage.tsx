import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useNavigate } from 'react-router-dom';
import SimpleBackground from './components/ui/SimpleBackground';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(27, 255, 255, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(27, 255, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(27, 255, 255, 0); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(27, 255, 255, 0.5), 0 0 10px rgba(27, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(27, 255, 255, 0.8), 0 0 30px rgba(27, 255, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(27, 255, 255, 0.5), 0 0 10px rgba(27, 255, 255, 0.3); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  color: theme.palette.common.white,
  background: alpha(theme.palette.primary.main, 0.2),
  backdropFilter: 'blur(10px)',
  borderRadius: '50px',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.4),
    transform: 'translateX(-5px)',
  },
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.3),
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.5s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: `0 15px 40px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
    '& .card-glow': {
      opacity: 1,
    },
  },
}));

const CardGlow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
  opacity: 0,
  transition: 'opacity 0.5s ease',
  pointerEvents: 'none',
}));

const TeamAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
  animation: `${pulse} 3s infinite`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  background: alpha(theme.palette.primary.main, 0.2),
  backdropFilter: 'blur(5px)',
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.4),
    transform: 'translateY(-5px)',
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.2),
  color: theme.palette.common.white,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  backdropFilter: 'blur(5px)',
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.4),
    transform: 'translateY(-3px)',
  },
}));

const RotatingIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -20,
  right: -20,
  width: 100,
  height: 100,
  opacity: 0.1,
  animation: `${rotate} 20s linear infinite`,
  '& svg': {
    width: '100%',
    height: '100%',
    color: theme.palette.primary.main,
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 100,
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: 3,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -5,
    left: 0,
    width: 50,
    height: 2,
    background: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

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

const FeatureBox = styled(Box)({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '0px',
  border: '1px solid rgba(65, 105, 225, 0.2)',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
});

export default function AboutPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const teamMembers = [
    {
      id: 1,
      name: 'KODI ALEX',
      role: 'AIML Student',
      avatar: 'KA',
    },
    {
      id: 2,
      name: 'K.Manilikith Gound',
      role: 'AIML Student',
      avatar: 'KG',
    },
    {
      id: 3,
      name: 'Voggu Arvind Kumar',
      role: 'AIML Student',
      avatar: 'VA',
    },
  ];

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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    About Fresh Recipe
                  </Typography>

                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#4169E1',
                      textAlign: 'center',
                      mb: 4,
                      maxWidth: '800px',
                    }}
                  >
                    Fresh Recipe is an AI-powered application that helps you discover recipes based on the ingredients you have. Simply upload a photo of your ingredients, and our advanced AI will analyze it and provide you with a personalized recipe.
                  </Typography>

                  <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                      <FeatureBox>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <CameraAltIcon sx={{ fontSize: 40, color: '#4169E1', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#4169E1', mb: 2 }}>
                            Easy Photo Upload
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(65, 105, 225, 0.7)' }}>
                            Simply take a photo of your ingredients or upload an existing image
                          </Typography>
                        </Box>
                      </FeatureBox>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FeatureBox>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <AutoAwesomeIcon sx={{ fontSize: 40, color: '#4169E1', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#4169E1', mb: 2 }}>
                            AI-Powered Analysis
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(65, 105, 225, 0.7)' }}>
                            Our advanced AI identifies ingredients and suggests the best recipes
                          </Typography>
                        </Box>
                      </FeatureBox>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FeatureBox>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <RestaurantIcon sx={{ fontSize: 40, color: '#4169E1', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#4169E1', mb: 2 }}>
                            Detailed Recipes
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(65, 105, 225, 0.7)' }}>
                            Get step-by-step instructions and ingredient lists for your recipe
                          </Typography>
                        </Box>
                      </FeatureBox>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#4169E1', 
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      How It Works
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(65, 105, 225, 0.7)',
                        maxWidth: '800px',
                      }}
                    >
                      1. Upload a photo of your ingredients
                      <br />
                      2. Our AI analyzes the image and identifies ingredients
                      <br />
                      3. Get a personalized recipe with detailed instructions
                      <br />
                      4. Cook and enjoy your delicious meal!
                    </Typography>
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </SimpleBackground>
  );
} 