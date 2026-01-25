"use client"

import { useEffect, useState } from "react"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 md:min-h-[60vh]">
      {/* Subtle gold glow effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a962]/5 blur-[100px] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Logo */}
      <div className="relative z-10 text-center">
        <h1
          className={`text-5xl font-light tracking-[0.4em] text-[#c9a962] md:text-7xl lg:text-8xl transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          ETERNA
        </h1>
        <div
          className={`mt-4 flex items-center justify-center gap-4 transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <span className="h-px w-12 bg-[#c9a962]/40" />
          <p className="text-xs tracking-[0.3em] text-[#a3a3a3] uppercase md:text-sm">
            Luxury Curation
          </p>
          <span className="h-px w-12 bg-[#c9a962]/40" />
        </div>
      </div>

      {/* Tagline */}
      <p
        className={`relative z-10 mt-8 max-w-md text-center text-sm leading-relaxed text-[#737373] md:text-base transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >
        시대를 초월한 가치를 지닌
        <br />
        엄선된 럭셔리 아이템을 소개합니다
      </p>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce transition-opacity duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] text-[#525252] uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
