import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Analysis = Database['public']['Tables']['analyses']['Row']
type PlatformInsight = Database['public']['Tables']['platform_insights']['Row']

export interface AnalysisWithInsights extends Analysis {
  platform_insights: PlatformInsight[]
}

export function useAnalyses() {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['analyses'],
    queryFn: async (): Promise<AnalysisWithInsights[]> => {
      const { data, error } = await supabase
        .from('analyses')
        .select(`
          *,
          platform_insights (*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as AnalysisWithInsights[]
    },
  })
}

export function useAnalysis(id: string) {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: async (): Promise<AnalysisWithInsights> => {
      const { data, error } = await supabase
        .from('analyses')
        .select(`
          *,
          platform_insights (*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as AnalysisWithInsights
    },
    enabled: !!id,
  })
}

export interface CreateAnalysisData {
  content: string
  contentType: 'text' | 'image' | 'video' | 'mixed'
  platforms: string[]
  targetAudience: {
    ageRange: string
    interests: string[]
    demographics: string[]
  }
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (analysisData: CreateAnalysisData) => {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create analysis')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
    },
  })
}

export interface UpdateAnalysisData {
  id: string
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  overall_virality_score?: number
}

export function useUpdateAnalysis() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateAnalysisData) => {
      const { data, error } = await supabase
        .from('analyses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
      queryClient.invalidateQueries({ queryKey: ['analysis', data.id] })
    },
  })
}

export function useUserCredits() {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits_remaining, subscription_tier')
        .single()
      
      if (error) throw error
      return data
    },
  })
} 