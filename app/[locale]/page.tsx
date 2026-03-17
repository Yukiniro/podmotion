'use client'

import type { AppPage, InputMode } from '@/lib/store'

import { useState } from 'react'

import { HomePage } from '@/components/home-page'
import { PreviewPage } from '@/components/preview-page'
import { WorkspacePage } from '@/components/workspace'

export default function Page() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home')
  const [userInput, setUserInput] = useState('')
  const [inputMode, setInputMode] = useState<InputMode>('youtube')

  const handleHomeNavigate = (input: string, mode: InputMode) => {
    setUserInput(input)
    setInputMode(mode)
    setCurrentPage('preview')
  }

  switch (currentPage) {
    case 'home':
      return <HomePage onNavigate={handleHomeNavigate} />
    case 'preview':
      return (
        <PreviewPage
          input={userInput}
          inputMode={inputMode}
          onBack={() => setCurrentPage('home')}
          onGenerate={() => setCurrentPage('workspace')}
        />
      )
    case 'workspace':
      return <WorkspacePage onBack={() => setCurrentPage('preview')} />
    default:
      return <HomePage onNavigate={handleHomeNavigate} />
  }
}
