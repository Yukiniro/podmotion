'use client'

import { useEffect, useState } from 'react'
import { Maximize2, Minimize2, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface YouTubePlayerProps {
  videoId: string
  title?: string
  defaultExpanded?: boolean
  customThumbnail?: string

  className?: string
  containerClassName?: string
  expandedClassName?: string

  thumbnailClassName?: string
  thumbnailImageClassName?: string

  playButtonClassName?: string
  playIconClassName?: string

  titleClassName?: string

  controlsClassName?: string
  expandButtonClassName?: string

  backdropClassName?: string

  playerClassName?: string
}

export function YouTubePlayer({
  videoId,
  title,
  defaultExpanded = false,
  customThumbnail,

  className,
  containerClassName,
  expandedClassName,
  thumbnailClassName,
  thumbnailImageClassName,
  playButtonClassName,
  playIconClassName,
  titleClassName,
  controlsClassName,
  expandButtonClassName,
  backdropClassName,
  playerClassName,
}: YouTubePlayerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [playing, setPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const extractVideoId = (id: string) => {
    if (id.includes('youtube.com') || id.includes('youtu.be')) {
      try {
        const url = new URL(id)
        if (id.includes('youtube.com')) {
          return url.searchParams.get('v') || ''
        } else {
          return url.pathname.substring(1)
        }
      } catch (error) {
        console.error('[YouTubePlayer] Invalid YouTube URL:', error)
        return id
      }
    }
    return id
  }

  const actualVideoId = extractVideoId(videoId)

  const handlePlay = () => {
    setPlaying(true)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded) {
        setExpanded(false)
      }
    }
    if (expanded) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded])

  const getThumbnailUrl = () => {
    if (customThumbnail) return customThumbnail
    return actualVideoId ? `https://i.ytimg.com/vi/${actualVideoId}/hqdefault.jpg` : ''
  }

  return (
    <>
      <motion.div
        className={cn('relative w-full', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layoutId={`youtube-player-${actualVideoId}`}
      >
        <div
          className={cn(
            'relative aspect-video w-full overflow-hidden rounded-lg bg-black',
            containerClassName
          )}
        >
          {!playing && (
            <>
              <div className={cn('absolute inset-0', thumbnailClassName)}>
                {getThumbnailUrl() && (
                  <img
                    src={getThumbnailUrl()}
                    alt={title || 'YouTube video thumbnail'}
                    className={cn('h-full w-full object-cover', thumbnailImageClassName)}
                  />
                )}
              </div>

              <button
                onClick={handlePlay}
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30',
                  playButtonClassName
                )}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform hover:scale-110">
                  <Play className={cn('ml-1 h-7 w-7 fill-white text-white', playIconClassName)} />
                </div>
              </button>

              {title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
                  <h3 className={cn('text-sm font-medium text-white', titleClassName)}>{title}</h3>
                </div>
              )}
            </>
          )}

          {playing && (
            <iframe
              src={`https://www.youtube.com/embed/${actualVideoId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={cn('absolute inset-0 h-full w-full', playerClassName)}
              title={title || 'YouTube video player'}
            />
          )}

          <YouTubePlayerControls
            videoId={actualVideoId}
            expanded={expanded}
            playing={playing}
            isHovered={isHovered}
            onToggleExpand={toggleExpand}
            controlsClassName={controlsClassName}
            expandButtonClassName={expandButtonClassName}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm', backdropClassName)}
              onClick={toggleExpand}
            />

            <motion.div
              layoutId={`youtube-player-${actualVideoId}`}
              className={cn(
                'fixed inset-4 z-50 flex items-center justify-center md:inset-8 lg:inset-16',
                expandedClassName
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-black shadow-2xl">
                {!playing && (
                  <>
                    <div className={cn('absolute inset-0', thumbnailClassName)}>
                      {getThumbnailUrl() && (
                        <img
                          src={getThumbnailUrl()}
                          alt={title || 'YouTube video thumbnail'}
                          className={cn('h-full w-full object-cover', thumbnailImageClassName)}
                        />
                      )}
                    </div>

                    <button
                      onClick={handlePlay}
                      className={cn(
                        'absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30',
                        playButtonClassName
                      )}
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform hover:scale-110">
                        <Play
                          className={cn('ml-1 h-9 w-9 fill-white text-white', playIconClassName)}
                        />
                      </div>
                    </button>

                    {title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                        <h3 className={cn('text-lg font-medium text-white', titleClassName)}>
                          {title}
                        </h3>
                      </div>
                    )}
                  </>
                )}

                {playing && (
                  <iframe
                    src={`https://www.youtube.com/embed/${actualVideoId}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={cn('absolute inset-0 h-full w-full', playerClassName)}
                    title={title || 'YouTube video player'}
                  />
                )}

                <YouTubePlayerControls
                  videoId={actualVideoId}
                  expanded={expanded}
                  playing={playing}
                  isHovered={isHovered}
                  onToggleExpand={toggleExpand}
                  controlsClassName={controlsClassName}
                  expandButtonClassName={expandButtonClassName}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface YouTubePlayerControlsProps {
  videoId: string
  expanded: boolean
  playing: boolean
  isHovered: boolean
  onToggleExpand: () => void
  controlsClassName?: string
  expandButtonClassName?: string
}

function YouTubePlayerControls({
  videoId: _videoId,
  expanded,
  playing,
  isHovered,
  onToggleExpand,
  controlsClassName,
  expandButtonClassName,
}: YouTubePlayerControlsProps) {
  const shouldShow = !playing || isHovered || expanded

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn('absolute right-2 top-2 z-10', controlsClassName)}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
            className={cn(
              'h-8 w-8 rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 hover:text-white',
              expandButtonClassName
            )}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { YouTubePlayerControls }
