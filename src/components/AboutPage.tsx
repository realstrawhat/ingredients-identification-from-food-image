import React from 'react';
import { Container, Typography, Grid, Paper, Avatar, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(6),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const TeamMemberCard = styled(StyledPaper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const FeatureCard = styled(StyledPaper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
  background: theme.palette.primary.main,
}));

const FeatureIcon = styled('div')(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: theme.spacing(4),
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedSection = styled('div')({
  animation: 'fadeInUp 0.6s ease-out forwards',
  opacity: 0,
});

const AnimatedCard = styled('div')({
  animation: 'fadeInUp 0.6s ease-out forwards',
  opacity: 0,
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
});

const teamMembers = [
  {
    name: "Alex",
    role: "Frontend Developer",
    bio: "Passionate about creating beautiful and intuitive user interfaces.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Manilikth",
    role: "Backend Developer",
    bio: "Expert in API development and database management.",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Arvind",
    role: "UI/UX Designer",
    bio: "Focused on creating seamless user experiences with attention to detail.",
    image: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

const AboutPage = () => {
  const theme = useTheme();

  return (
    <StyledContainer maxWidth="lg">
      <AnimatedSection>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontFamily: 'Playfair Display, serif' }}>
          About Fresh Recipe
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Discover the future of recipe generation with AI-powered image analysis
        </Typography>
      </AnimatedSection>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <AnimatedCard>
            <FeatureCard>
              <FeatureIcon>
                <RestaurantIcon />
              </FeatureIcon>
              <Typography variant="h6" gutterBottom>
                AI-Powered Analysis
              </Typography>
              <Typography variant="body1" align="center">
                Our advanced AI technology analyzes your food images to identify ingredients and suggest perfect recipes.
              </Typography>
            </FeatureCard>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <AnimatedCard>
            <FeatureCard>
              <FeatureIcon>
                <MenuBookIcon />
              </FeatureIcon>
              <Typography variant="h6" gutterBottom>
                Detailed Recipes
              </Typography>
              <Typography variant="body1" align="center">
                Get comprehensive recipes with step-by-step instructions, ingredient lists, and cooking tips.
              </Typography>
            </FeatureCard>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <AnimatedCard>
            <FeatureCard>
              <FeatureIcon>
                <AutoAwesomeIcon />
              </FeatureIcon>
              <Typography variant="h6" gutterBottom>
                Customization
              </Typography>
              <Typography variant="body1" align="center">
                Customize recipes based on your dietary preferences and available ingredients.
              </Typography>
            </FeatureCard>
          </AnimatedCard>
        </Grid>
      </Grid>

      <AnimatedSection>
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontFamily: 'Playfair Display, serif', mt: 8 }}>
          Our Team
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Meet the talented developers from CMRTC college behind Fresh Recipe
        </Typography>
      </AnimatedSection>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} md={4} key={index}>
            <AnimatedCard>
              <TeamMemberCard>
                <StyledAvatar src={member.image} alt={member.name} />
                <Typography variant="h5" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2">
                  {member.bio}
                </Typography>
              </TeamMemberCard>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default AboutPage; 