"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Share2, Heart, X, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/components/ui/use-mobile"
// import { ScrollArea } from "@/components/ui/scroll-area" // Removed as we use native scroll
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/data"

interface ProductDetailProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
}

function ProductDetailContent({
  product,
  onClose,
  isAdmin = false
}: {
  product: Product
  onClose: () => void
  isAdmin?: boolean
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const gallery = product.gallery || [product.image] || []

  // Safe navigation
  const nextImage = () => {
    if (gallery.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
  }

  const prevImage = () => {
    if (gallery.length <= 1) return
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `ETERNA - ${product.title}`,
          url: product.externalUrl,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(product.externalUrl)
    }
  }

  const specs = [
    { label: "모델 번호", value: product.specs.modelNo },
    { label: "소재", value: product.specs.material },
    { label: "사이즈", value: product.specs.size },
    { label: "컬러", value: product.specs.color },
  ]

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-[#0a0a0a] md:flex-row md:overflow-hidden md:h-[600px] lg:h-[700px]">
      {/* 1. Image Section */}
      <div className="relative w-full shrink-0 bg-[#000000] md:h-full md:w-1/2 lg:w-[55%]">
        {/* Mobile: 4:5 Aspect Ratio. Desktop: Fill height */}
        <div className="relative aspect-[4/5] w-full md:h-full md:aspect-auto">
          <Image
            src={gallery[currentImageIndex] || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffffff]/20 bg-[#000000]/30 text-white backdrop-blur-md transition-all hover:bg-[#000000]/60 hover:border-[#c9a962]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffffff]/20 bg-[#000000]/30 text-white backdrop-blur-md transition-all hover:bg-[#000000]/60 hover:border-[#c9a962]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                    ? "w-8 bg-[#c9a962]"
                    : "w-2 bg-[#ffffff]/40 hover:bg-[#ffffff]/80"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Controls (Close / Admin) */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ffffff]/10 bg-[#000000]/50 text-[#ffffff] backdrop-blur-md transition-colors hover:bg-[#c9a962] hover:text-[#000000] hover:border-transparent"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">닫기</span>
          </button>
        </div>
        {isAdmin && (
          <div className="absolute top-4 left-4 z-20">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c9a962]/50 bg-[#000000]/50 text-[#c9a962] backdrop-blur-md hover:bg-[#c9a962] hover:text-[#000000]">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col bg-[#0a0a0a] md:h-full md:flex-1 md:overflow-y-auto md:border-l md:border-[#1a1a1a]">
        <div className="flex-1 px-6 py-8 md:px-8 md:py-10">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-[0.2em] text-[#c9a962] uppercase">
                {product.category} · {product.subCategory}
              </p>
              <div className="flex gap-2">
                <button onClick={handleShare} className="text-[#737373] hover:text-[#c9a962] transition-colors"><Share2 className="h-5 w-5" /></button>
                <button onClick={() => setIsWishlisted(!isWishlisted)} className={isWishlisted ? "text-[#c9a962]" : "text-[#737373] hover:text-[#c9a962] transition-colors"}><Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} /></button>
              </div>
            </div>
            <h2 className="text-2xl font-light text-[#f5f5f5] md:text-3xl lg:text-4xl text-balance leading-tight">
              {product.title}
            </h2>
          </div>

          {/* Specs Grid */}
          <div className="mb-8 rounded-xl border border-[#1a1a1a] bg-[#111111]/50 p-5">
            <dl className="grid grid-cols-1 gap-y-4 text-sm">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between border-b last:border-0 border-[#262626] pb-3 last:pb-0">
                  <dt className="text-[#737373]">{spec.label}</dt>
                  <dd className="font-medium text-[#d4d4d4] text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#f5f5f5]">상품 소개</h3>
            <p className="text-sm leading-7 text-[#a3a3a3] whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        </div>

        {/* Action Footer - Sticky at bottom for mobile */}
        <div className="sticky bottom-0 z-10 shrink-0 border-t border-[#1a1a1a] bg-[#0a0a0a]/95 p-6 backdrop-blur-sm md:static md:p-8 md:bg-[#0a0a0a]">
          <Button
            asChild
            className="w-full h-14 bg-[#c9a962] text-base font-medium tracking-[0.05em] text-[#000000] hover:bg-[#d4b870] hover:scale-[1.01] transition-all"
          >
            <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <span>공식 홈페이지에서 구매하기</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductDetail({ product, isOpen, onClose, isAdmin = false }: ProductDetailProps) {
  const isMobile = useIsMobile()

  if (!product) return null

  // Mobile: Full Screen Dialog (behaves like a page)
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-[100dvh] w-screen max-w-none rounded-none border-none bg-[#0a0a0a] p-0 outline-none overflow-hidden block">
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
          <ProductDetailContent product={product} onClose={onClose} isAdmin={isAdmin} />
        </DialogContent>
      </Dialog>
    )
  }

  // Desktop: Modal (Dialog)
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-hidden border-[#1a1a1a] bg-[#0a0a0a] p-0 lg:max-w-3xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <ProductDetailContent product={product} onClose={onClose} isAdmin={isAdmin} />
      </DialogContent>
    </Dialog>
  )
}
