"use client"

import { MessageCircle } from "lucide-react"

export function KakaoButton() {
  const handleClick = () => {
    // Replace with actual KakaoTalk channel URL
    window.open("https://pf.kakao.com/_example", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="group fixed right-4 bottom-6 z-50 flex items-center gap-2 overflow-hidden rounded-full border border-[#c9a962]/30 bg-[#0a0a0a]/90 px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#c9a962] hover:bg-[#0a0a0a] hover:shadow-[0_0_20px_rgba(201,169,98,0.15)] md:right-6 md:bottom-8"
      aria-label="카카오톡 문의하기"
    >
      {/* KakaoTalk Icon */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEE500]">
        <MessageCircle className="h-3.5 w-3.5 text-[#3A1D1D]" fill="#3A1D1D" />
      </div>
      
      {/* Text - hidden on mobile, visible on hover for desktop */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-light tracking-[0.1em] text-[#c9a962] transition-all duration-300 group-hover:max-w-[100px] md:max-w-[100px]">
        문의하기
      </span>
    </button>
  )
}
