'use client'

import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
  Alert,
  AlertTitle
} from '@mui/material'
import {
  TrendingUp,
  Analytics,
  Share,
  Psychology,
  Timeline,
  Groups,
  Warning,
  Code,
  Settings
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const features = [
  {
    icon: <Psychology />,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI algorithms analyze your content for maximum viral potential across platforms.'
  },
  {
    icon: <Analytics />,
    title: 'Multi-Platform Insights',
    description: 'Get specific recommendations for Twitter, Instagram, TikTok, YouTube, and LinkedIn.'
  },
  {
    icon: <Groups />,
    title: 'Audience Targeting',
    description: 'Understand your audience and optimize content for maximum engagement.'
  },
  {
    icon: <Timeline />,
    title: 'Performance Prediction',
    description: 'Predict likes, shares, and comments before you post your content.'
  },
  {
    icon: <TrendingUp />,
    title: 'Trend Alignment',
    description: 'Stay ahead of trends with real-time social media trend analysis.'
  },
  {
    icon: <Share />,
    title: 'Optimization Tips',
    description: 'Get actionable recommendations to improve your content performance.'
  }
]

// Check if environment variables are properly configured
const isConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'
  )
}

function SetupInstructions() {
  const theme = useTheme()
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Warning sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Welcome to Virality Analyzer! 🚀
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Let&apos;s get you set up in just a few minutes
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <AlertTitle>Setup Required</AlertTitle>
        Your app is running, but we need to configure a few things to get started.
      </Alert>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Code sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                1. Create .env.local
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Create a file called <code>.env.local</code> in your project root with your environment variables.
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100', textAlign: 'left' }}>
                <Typography variant="body2" fontFamily="monospace">
                  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key<br />
                  OPENAI_API_KEY=your-openai-key
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Settings sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                2. Setup Supabase
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Create a free Supabase project and get your credentials.
              </Typography>
              <Button
                variant="outlined"
                href="https://supabase.com"
            target="_blank"
                sx={{ mb: 2 }}
              >
                Go to Supabase
              </Button>
              <Typography variant="body2" color="textSecondary">
                Then go to Settings → API to get your keys
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                3. Start Analyzing!
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Once configured, restart your dev server and start analyzing content!
              </Typography>
              <Typography variant="body2" fontFamily="monospace" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                npm run dev
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={6}>
        <Typography variant="h6" gutterBottom>
          Need detailed instructions?
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Check out the <code>SETUP_GUIDE.md</code> file in your project root for step-by-step instructions.
        </Typography>
      </Box>
    </Container>
  )
}

export default function HomePage() {
  const router = useRouter()
  const theme = useTheme()
  
  // Always call hooks at the top level
  const { user } = useAuth()

  // If environment is not configured, show setup instructions
  if (!isConfigured()) {
    return <SetupInstructions />
  }

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Predict Your Content&apos;s Viral Potential
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            AI-powered social media analysis that helps you create content that goes viral
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Watch Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            Why Choose Virality Analyzer?
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Everything you need to create viral content across all major social platforms
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.light,
                      color: 'white',
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                500K+
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Content Pieces Analyzed
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                85%
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Accuracy Rate
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                50K+
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Happy Users
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" gutterBottom>
                5
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Social Platforms
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Simple 3-step process to analyze your content
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                1
              </Box>
              <Typography variant="h6" gutterBottom>
                Upload Your Content
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Add your text, images, or video content that you want to analyze.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: theme.palette.secondary.main,
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                2
              </Box>
              <Typography variant="h6" gutterBottom>
                Select Platforms
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Choose which social media platforms you want to analyze for.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                3
              </Box>
              <Typography variant="h6" gutterBottom>
                Get Insights
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Receive detailed analysis and recommendations to optimize your content.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Go Viral?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of creators and marketers who trust Virality Analyzer
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Start Analyzing Now
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
