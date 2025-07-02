'use client'

import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip
} from '@mui/material'
import {
  Analytics,
  TrendingUp,
  Add,
  AccountCircle,
  ExitToApp
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useAnalyses, useUserCredits } from '@/hooks/useAnalysis'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { data: analyses, isLoading: analysesLoading } = useAnalyses()
  const { data: credits } = useUserCredits()
  const router = useRouter()

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LinearProgress sx={{ width: 200 }} />
      </Box>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back, {user.user_metadata?.full_name || user.email}!
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Chip 
            icon={<AccountCircle />}
            label={`${credits?.credits_remaining || 0} credits`}
            color="primary"
          />
          <Button
            variant="outlined"
            startIcon={<ExitToApp />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Analytics color="primary" />
                <Box>
                  <Typography variant="h4">
                    {analyses?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Analyses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="success" />
                <Box>
                  <Typography variant="h4">
                    {analyses?.filter(a => a.status === 'completed').length || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Analytics color="info" />
                <Box>
                  <Typography variant="h4">
                    {Math.round(
                      (analyses?.reduce((sum, a) => sum + (a.overall_virality_score || 0), 0) || 0) /
                      Math.max(analyses?.filter(a => a.overall_virality_score).length || 1, 1)
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountCircle color="secondary" />
                <Box>
                  <Typography variant="h4">
                    {credits?.credits_remaining || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Credits Left
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => router.push('/wizard')}
          >
            New Analysis
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/dashboard/history')}
          >
            View History
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/dashboard/settings')}
          >
            Settings
          </Button>
        </Box>
      </Paper>

      {/* Recent Analyses */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recent Analyses
        </Typography>
        
        {analysesLoading ? (
          <LinearProgress />
        ) : analyses && analyses.length > 0 ? (
          <Grid container spacing={2}>
            {analyses.slice(0, 6).map((analysis) => (
              <Grid item xs={12} sm={6} md={4} key={analysis.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {analysis.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'Unknown date'}
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      {analysis.platforms.map((platform) => (
                        <Chip key={platform} label={platform} size="small" />
                      ))}
                    </Box>
                    {analysis.overall_virality_score && (
                      <Typography variant="h6" color="primary">
                        Score: {analysis.overall_virality_score}/100
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => router.push(`/analysis/${analysis.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No analyses yet. Create your first analysis to get started!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/wizard')}
              sx={{ mt: 2 }}
            >
              Create Analysis
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  )
} 