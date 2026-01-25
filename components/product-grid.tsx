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
        className="group relative text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
      >
        {/* Product Image with 4:5 aspect ratio */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a] border border-[#ffffff]/5 transition-all duration-300 group-hover:border-[#c9a962]/50 group-hover:shadow-[0_0_20px_rgba(201,169,98,0.15)]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          {/* Hover overlay - Darkens slightly less now that we have a border */}
          <div className="absolute inset-0 bg-[#000000]/0 transition-all duration-300 group-hover:bg-[#000000]/20" />

          {/* View indicator on hover - REMOVED */}

          {/* External Link Button */}
          <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <a
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#000000]/60 text-[#f5f5f5] backdrop-blur-sm transition-colors hover:bg-[#c9a962] hover:text-[#000000] border border-[#ffffff]/10 hover:border-[#c9a962] shadow-md"
              title="구매 페이지로 이동"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">외부 링크</span>
            </a>
          </div>
        </div>

        {/* Product Title */}
        <div className="mt-3 space-y-1">
          <h3 className="line-clamp-2 text-xs font-light leading-relaxed text-[#e5e5e5] transition-colors duration-300 group-hover:text-[#c9a962] md:text-sm">
            {product.title}
          </h3>
          <p className="text-[10px] tracking-[0.1em] text-[#525252] uppercase md:text-xs">
            {product.subCategory}
          </p>
        </div>
      </button>
    </div>
  )
}
