"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ExternalLink, Share2, Heart, ChevronLeft, ChevronRight, ArrowLeft, MessageCircle } from "lucide-react"
import type { Product } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProductDetailClient({ product }: { product: Product }) {
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]

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
                    url: product.externalUrl || window.location.href,
                })
            } catch {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(window.location.href)
        }
    }


    return (
        <div className="flex min-h-screen flex-col bg-[#000000] lg:flex-row">

            {/* Back Button (Floating on Mobile, Fixed on Desktop) */}
            <button
                onClick={() => router.back()}
                className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-[#c9a962] hover:text-black border border-white/10"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>

            {/* 1. Image Section (Top on mobile, Left on desktop) */}
            <div className="relative h-[50vh] w-full shrink-0 bg-[#050505] lg:h-screen lg:w-[60%] lg:sticky lg:top-0">
                <div className="relative h-full w-full">
                    <Image
                        src={gallery[currentImageIndex] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover object-center"
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
            </div>

            {/* 2. Content Section (Bottom on mobile, Right on desktop) */}
            <div className="flex flex-1 flex-col bg-[#000000] px-6 py-10 lg:min-h-screen lg:justify-center lg:px-16 lg:py-0">
                <div className="mx-auto w-full max-w-xl space-y-10">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium tracking-[0.2em] text-[#c9a962] uppercase">
                                {product.category} · {product.subCategory}
                            </p>
                            <div className="flex gap-4">
                                <button onClick={handleShare} className="text-[#737373] hover:text-[#c9a962] transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                                <button onClick={() => setIsWishlisted(!isWishlisted)} className={isWishlisted ? "text-[#c9a962]" : "text-[#737373] hover:text-[#c9a962] transition-colors"}>
                                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                                </button>
                            </div>
                        </div>
                        <h1 className="text-3xl font-light text-[#f5f5f5] lg:text-5xl text-balance leading-tight">
                            {product.title}
                        </h1>
                    </div>

                    {/* Price Display */}
                    {product.price && (
                        <div className="flex items-center gap-3 py-2">
                            <Badge variant="outline" className="px-4 py-1 text-sm font-light tracking-widest text-[#c9a962] border-[#c9a962]/50">
                                PRICE
                            </Badge>
                            <span className="text-xl font-medium text-[#f5f5f5] md:text-2xl">
                                {product.price}
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-[#f5f5f5] uppercase tracking-wider">Description</h3>
                        <p className="text-sm leading-8 text-[#a3a3a3] whitespace-pre-wrap">
                            {product.description}
                        </p>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-6">
                        <Button
                            asChild
                            className="w-full h-16 bg-[#CCB700] hover:bg-[#CCB700]/90 text-[#000000] text-lg font-bold tracking-tight shadow-lg hover:scale-[1.01] transition-all border-none relative overflow-hidden group"
                        >
                            <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                                <MessageCircle className="h-5 w-5 fill-black" />
                                <span>카카오톡 1:1 문의하기</span>
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
