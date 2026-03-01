import { create } from 'zustand'

export interface OnboardingState {
  // Step 1: Skill Selection
  skill: string

  // Step 2: Experience Level
  currentLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | ''

  // Step 3: Time Commitment
  durationWeeks: number
  hoursPerWeek: number
  daysPerWeek: number

  // Step 4: Goals
  goals: string[]

  // Step 5: Review (no additional state)

  // Step 6: Generation (loading state)
  isGenerating: boolean
  generatedPath: any | null
  error: string | null

  // Current step
  currentStep: number

  // Actions
  setSkill: (skill: string) => void
  setCurrentLevel: (level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => void
  setTimeCommitment: (weeks: number, hoursPerWeek: number, daysPerWeek: number) => void
  setGoals: (goals: string[]) => void
  setCurrentStep: (step: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  setGeneratedPath: (path: any) => void
  setError: (error: string | null) => void
  resetOnboarding: () => void
}

const initialState = {
  skill: '',
  currentLevel: '' as const,
  durationWeeks: 4,
  hoursPerWeek: 10,
  daysPerWeek: 5,
  goals: [],
  isGenerating: false,
  generatedPath: null,
  error: null,
  currentStep: 1,
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setSkill: (skill) => set({ skill }),

  setCurrentLevel: (level) => set({ currentLevel: level }),

  setTimeCommitment: (weeks, hoursPerWeek, daysPerWeek) =>
    set({
      durationWeeks: weeks,
      hoursPerWeek,
      daysPerWeek,
    }),

  setGoals: (goals) => set({ goals }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setGeneratedPath: (path) => set({ generatedPath: path, isGenerating: false }),

  setError: (error) => set({ error, isGenerating: false }),

  resetOnboarding: () => set(initialState),
}))
