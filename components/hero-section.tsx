"use client"

import { useEffect, useState } from "react"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToContent = () => {
    const content = document.getElementById('main-content')
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Animation Checkpoints
  // Storytelling sequence optimized for medium-short scroll (70vh)

  // Logo: 0 -> 100 
  const logoOpacity = Math.max(0, 1 - scrollY / 100)
  const logoScale = 1 + scrollY / 1200
  const logoBlur = Math.min(6, scrollY / 15)

  // Headline: "True Luxury is Timeless"
  // Starts appearing at 80, fully visible at 180
  const headlineProgress = Math.min(1, Math.max(0, (scrollY - 80) / 100))
  const headlineOpacity = headlineProgress
  const headlineTranslateY = -30 * (1 - headlineProgress)
  const headlineBlur = 6 * (1 - headlineProgress)

  // Subtext: "시간이 흘러도..."
  // Starts appearing at 160, fully visible at 260
  const subtextProgress = Math.min(1, Math.max(0, (scrollY - 160) / 100))
  const subtextOpacity = subtextProgress
  const subtextTranslateY = -20 * (1 - subtextProgress)
  const subtextBlur = 6 * (1 - subtextProgress)

  // Scroll Prompt
  const scrollPromptOpacity = Math.max(0, 1 - scrollY / 50)

  return (
    <section className="relative h-[70vh] bg-[#000000]">
      <div className="sticky top-0 h-[70vh] w-full overflow-hidden flex flex-col items-center justify-center px-4">

        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a962]/5 blur-[100px] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ opacity: isLoaded ? 0.3 + (logoOpacity * 0.7) : 0 }}
          />
        </div>

        {/* Logo Container */}
        <div
          className="relative z-10 text-center will-change-transform"
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            filter: `blur(${logoBlur}px)`,
            display: logoOpacity <= 0.01 ? 'none' : 'block'
          }}
        >
          <h1 className={`text-3xl font-light tracking-[0.4em] text-[#c9a962] md:text-5xl lg:text-6xl transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            ETERNA
          </h1>
          <div className={`mt-3 flex items-center justify-center gap-3 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <span className="h-px w-8 bg-[#c9a962]/40" />
            <p className="text-[10px] tracking-[0.3em] text-[#a3a3a3] uppercase md:text-xs">
              에테르나.com
            </p>
            <span className="h-px w-8 bg-[#c9a962]/40" />
          </div>
        </div>

        {/* Headline Container */}
        <div
          className="absolute z-10 max-w-lg text-center will-change-transform"
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineTranslateY}px)`,
            filter: `blur(${headlineBlur}px)`,
            display: headlineOpacity <= 0.01 && logoOpacity > 0 ? 'none' : 'block'
          }}
        >
          <p className="text-lg font-light leading-relaxed text-[#c9a962] md:text-2xl lg:text-3xl">
            True Luxury is Timeless
          </p>
        </div>

        {/* Subtext Container */}
        <div
          className="absolute z-10 max-w-lg text-center will-change-transform top-[60%]"
          style={{
            opacity: subtextOpacity,
            transform: `translateY(${subtextTranslateY}px)`,
            filter: `blur(${subtextBlur}px)`
          }}
        >
          <p className="text-xs leading-6 text-[#a3a3a3] md:text-sm">
            시간이 흘러도 변치 않는 가치,<br />
            당신만을 위한 큐레이션을 만나보세요.
          </p>
        </div>

        {/* Scroll Prompt */}
        <div
          onClick={scrollToContent}
          className={`absolute bottom-4 left-1/2 z-20 -translate-x-1/2 cursor-pointer transition-opacity duration-500`}
          style={{ opacity: isLoaded ? scrollPromptOpacity : 0 }}
        >
          <div className="flex flex-col items-center gap-1 animate-bounce">
            <span className="text-[8px] tracking-[0.2em] text-[#525252] uppercase">
              Start
            </span>
            <div className="h-6 w-px bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  )
}
