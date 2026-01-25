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
  // Storytelling sequence: Logo fades -> Headline descends -> Subtext descends

  // Logo: 0 -> 400 (Fades out)
  const logoOpacity = Math.max(0, 1 - scrollY / 400)
  const logoScale = 1 + scrollY / 2000
  const logoBlur = Math.min(10, scrollY / 40)

  // Headline: "True Luxury is Timeless"
  // Starts appearing at 300, fully visible at 700
  // Slides DOWN from -50px to 0px
  const headlineProgress = Math.min(1, Math.max(0, (scrollY - 300) / 400))
  const headlineOpacity = headlineProgress
  const headlineTranslateY = -50 * (1 - headlineProgress)
  const headlineBlur = 10 * (1 - headlineProgress)

  // Subtext: "시간이 흘러도..."
  // Starts appearing at 600, fully visible at 1000
  // Slides DOWN from -30px to 0px
  const subtextProgress = Math.min(1, Math.max(0, (scrollY - 600) / 400))
  const subtextOpacity = subtextProgress
  const subtextTranslateY = -30 * (1 - subtextProgress)
  const subtextBlur = 10 * (1 - subtextProgress)

  // Scroll Prompt (Start Journey)
  const scrollPromptOpacity = Math.max(0, 1 - scrollY / 100)

  return (
    <section className="relative h-[300vh] bg-[#000000]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4">

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
          <h1 className={`text-5xl font-light tracking-[0.4em] text-[#c9a962] md:text-7xl lg:text-8xl transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            ETERNA
          </h1>
          <div className={`mt-4 flex items-center justify-center gap-4 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <span className="h-px w-12 bg-[#c9a962]/40" />
            <p className="text-xs tracking-[0.3em] text-[#a3a3a3] uppercase md:text-sm">
              Luxury Curation
            </p>
            <span className="h-px w-12 bg-[#c9a962]/40" />
          </div>
        </div>

        {/* Headline Container */}
        <div
          className="absolute z-10 max-w-lg text-center will-change-transform"
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineTranslateY}px)`,
            filter: `blur(${headlineBlur}px)`,
            display: headlineOpacity <= 0.01 && logoOpacity > 0 ? 'none' : 'block' // Show when needed
          }}
        >
          <p className="text-xl font-light leading-relaxed text-[#c9a962] md:text-3xl lg:text-4xl">
            True Luxury is Timeless
          </p>
        </div>

        {/* Subtext Container */}
        <div
          className="absolute z-10 max-w-lg text-center will-change-transform top-[55%] md:top-[55%]" // Slightly offset position
          style={{
            opacity: subtextOpacity,
            transform: `translateY(${subtextTranslateY}px)`,
            filter: `blur(${subtextBlur}px)`
          }}
        >
          <p className="text-sm leading-8 text-[#a3a3a3] md:text-base">
            시간이 흘러도 변치 않는 가치,<br />
            당신만을 위한 큐레이션을 만나보세요.
          </p>
        </div>

        {/* Scroll Prompt */}
        <div
          onClick={scrollToContent}
          className={`absolute bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer transition-opacity duration-500`}
          style={{ opacity: isLoaded ? scrollPromptOpacity : 0 }}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[10px] tracking-[0.2em] text-[#525252] uppercase">
              Start Journey
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  )
}
