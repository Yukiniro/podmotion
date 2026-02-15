"use client"

import { useState } from "react"
import { HomePage } from "@/components/home-page"
import { PreviewPage, type PreviewConfig } from "@/components/preview-page"
import { WorkspacePage } from "@/components/workspace-page"
import { ExportPage } from "@/components/export-page"
import type { AppPage } from "@/lib/store"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home")
  const [videoUrl, setVideoUrl] = useState("")
  const [_config, setConfig] = useState<PreviewConfig | null>(null)

  const handleHomeNavigate = (url: string) => {
    setVideoUrl(url)
    setCurrentPage("preview")
  }

  const handlePreviewGenerate = (config: PreviewConfig) => {
    setConfig(config)
    setCurrentPage("workspace")
  }

  switch (currentPage) {
    case "home":
      return <HomePage onNavigate={handleHomeNavigate} />
    case "preview":
      return (
        <PreviewPage
          videoUrl={videoUrl}
          onBack={() => setCurrentPage("home")}
          onGenerate={handlePreviewGenerate}
        />
      )
    case "workspace":
      return (
        <WorkspacePage
          onBack={() => setCurrentPage("preview")}
          onExport={() => setCurrentPage("export")}
        />
      )
    case "export":
      return <ExportPage onBack={() => setCurrentPage("workspace")} />
    default:
      return <HomePage onNavigate={handleHomeNavigate} />
  }
}
