"use client"

import { ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/data"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#525252]">해당 카테고리에 상품이 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
      {products.map((product, index) => (
        <AnimatedProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          index={index}
        />
      ))}
    </div>
  )
}

function AnimatedProductCard({
  product,
  onClick,
  index
}: {
  product: Product;
  onClick: (p: Product) => void;
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }} // Stagger consistency
    >
      <button
        onClick={() => onClick(product)}
        className="group relative text-left w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
      >
        {/* Product Image with 4:5 aspect ratio */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#050505] border border-[#111111] transition-all duration-500 group-hover:border-[#c9a962]/30 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          {/* Hover overlay - Subtle darken */}
          <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/40" />

          {/* External Link Button */}
          <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-[#a3a3a3] backdrop-blur-md transition-colors hover:bg-[#c9a962] hover:text-[#000000] border border-white/5 hover:border-[#c9a962]"
              title="구매 페이지로 이동"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="sr-only">외부 링크</span>
            </a>
          </div>
        </div>

        {/* Product Title */}
        <div className="mt-4 space-y-1.5 px-1">
          <h3 className="line-clamp-2 text-xs font-light leading-relaxed text-[#d4d4d4] transition-colors duration-500 group-hover:text-[#c9a962] md:text-sm">
            {product.title}
          </h3>
          <p className="text-[9px] tracking-[0.15em] text-[#404040] uppercase md:text-[10px]">
            {product.subCategory}
          </p>
        </div>
      </button>
    </div>
  )
}
