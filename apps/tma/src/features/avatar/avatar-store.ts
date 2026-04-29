import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModelType } from '@cloth-ai/contracts'

interface AvatarState {
  modelType: ModelType | null
  setModelType: (modelType: ModelType) => void
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      modelType: null,
      setModelType: (modelType) => set({ modelType }),
    }),
    { name: 'clothai:modelType-v1' },
  ),
)

