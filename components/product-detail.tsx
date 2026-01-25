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
import { ScrollArea } from "@/components/ui/scroll-area"
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
  
  const gallery = product.gallery || [product.image]
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
  }
  
  const prevImage = () => {
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
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
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
    <div className="flex h-full flex-col">
      {/* Close Button - Fixed position */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#262626] bg-[#0a0a0a]/90 text-[#a3a3a3] backdrop-blur-sm transition-colors hover:border-[#c9a962] hover:text-[#c9a962]"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">닫기</span>
      </button>

      {/* Admin Edit Button */}
      {isAdmin && (
        <button
          className="absolute top-4 left-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a962]/40 bg-[#0a0a0a]/90 text-[#c9a962] backdrop-blur-sm transition-colors hover:border-[#c9a962] hover:bg-[#c9a962]/10"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">편집</span>
        </button>
      )}

      <ScrollArea className="flex-1">
        <div className="pb-6">
          {/* Image Gallery */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#000000]">
            <Image
              src={gallery[currentImageIndex] || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
            
            {/* Gallery Navigation */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#262626] bg-[#0a0a0a]/70 text-[#f5f5f5] backdrop-blur-sm transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#262626] bg-[#0a0a0a]/70 text-[#f5f5f5] backdrop-blur-sm transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            
            {/* Image Gallery Indicator */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? "w-6 bg-[#c9a962]" 
                        : "w-1.5 bg-[#f5f5f5]/50 hover:bg-[#f5f5f5]/80"
                    }`}
                  >
                    <span className="sr-only">이미지 {idx + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 px-5 pt-6 md:px-8">
            {/* Title & Category */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-light tracking-wide text-[#f5f5f5] md:text-2xl text-balance">
                  {product.title}
                </h2>
                
                {/* Action Icons */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#262626] text-[#a3a3a3] transition-colors hover:border-[#c9a962] hover:text-[#c9a962]"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">공유하기</span>
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                      isWishlisted 
                        ? "border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]" 
                        : "border-[#262626] text-[#a3a3a3] hover:border-[#c9a962] hover:text-[#c9a962]"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                    <span className="sr-only">찜하기</span>
                  </button>
                </div>
              </div>
              <p className="text-xs tracking-[0.15em] text-[#737373] uppercase">
                {product.category} · {product.subCategory}
              </p>
            </div>

            {/* Specs Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-[0.2em] text-[#c9a962] uppercase">
                상품 상세 정보
              </h3>
              <div className="rounded-lg border border-[#1a1a1a] bg-[#0a0a0a]/50 p-4">
                <dl className="space-y-3">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4">
                      <dt className="shrink-0 text-xs tracking-wide text-[#737373]">
                        {spec.label}
                      </dt>
                      <dd className="text-right text-xs text-[#d4d4d4]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-[0.2em] text-[#c9a962] uppercase">
                제품 소개
              </h3>
              <p className="text-sm leading-relaxed text-[#a3a3a3]">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Bottom CTA */}
      <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] px-5 py-4 md:px-8">
        <Button
          asChild
          className="w-full bg-[#c9a962] py-6 text-sm font-medium tracking-[0.1em] text-[#000000] transition-all hover:bg-[#d4b870]"
        >
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2"
          >
            <span>구매하러 가기</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}

export function ProductDetail({ product, isOpen, onClose, isAdmin = false }: ProductDetailProps) {
  const isMobile = useIsMobile()

  if (!product) return null

  // Mobile: Drawer (slide-up)
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh] border-[#1a1a1a] bg-[#0a0a0a]">
          <DrawerTitle className="sr-only">{product.title}</DrawerTitle>
          <ProductDetailContent product={product} onClose={onClose} isAdmin={isAdmin} />
        </DrawerContent>
      </Drawer>
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
