'use client'

import { useState } from 'react'
import { 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Container,
  Alert 
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithGoogle, user } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={4}
      >
        <Box textAlign="center">
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            Virality Analyzer
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            Predict and optimize your content for social media success
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Welcome Back
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Sign in to analyze your content across multiple social media platforms
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 3 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Paper>

        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            🚀 Features
          </Typography>
          <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center">
            <Typography variant="body2" color="textSecondary">
              ✨ AI-Powered Analysis
            </Typography>
            <Typography variant="body2" color="textSecondary">
              📊 Multi-Platform Insights
            </Typography>
            <Typography variant="body2" color="textSecondary">
              🎯 Audience Targeting
            </Typography>
            <Typography variant="body2" color="textSecondary">
              📈 Virality Prediction
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
} 