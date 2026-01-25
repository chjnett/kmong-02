"use client"

import { ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/data"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

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
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductClick(product)}
          className="group relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
        >
          {/* Product Image with 4:5 aspect ratio */}
          <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#000000]/0 transition-all duration-300 group-hover:bg-[#000000]/40" />

            {/* View indicator on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-full border border-[#c9a962]/60 bg-[#000000]/60 px-4 py-2 text-[10px] font-light tracking-[0.2em] text-[#c9a962] uppercase backdrop-blur-sm">
                자세히 보기
              </span>
            </div>

            {/* External Link Button */}
            <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <a
                href={product.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#000000]/60 text-[#f5f5f5] backdrop-blur-sm transition-colors hover:bg-[#c9a962] hover:text-[#000000] border border-[#ffffff]/10 hover:border-[#c9a962]"
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
      ))}
    </div>
  )
}
