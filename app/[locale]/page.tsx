'use client'

import type { AppPage } from '@/lib/store'

import { useState } from 'react'

import { HomePage } from '@/components/home-page'
import { PreviewPage } from '@/components/preview-page'
import { WorkspacePage } from '@/components/workspace'

export default function Page() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home')
  const [videoUrl, setVideoUrl] = useState('')

  const handleHomeNavigate = (url: string) => {
    setVideoUrl(url)
    setCurrentPage('preview')
  }

  switch (currentPage) {
    case 'home':
      return <HomePage onNavigate={handleHomeNavigate} />
    case 'preview':
      return (
        <PreviewPage
          videoUrl={videoUrl}
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
