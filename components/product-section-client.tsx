"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { CategoryNav } from "@/components/category-nav"
import { ProductGrid } from "@/components/product-grid"
import type { Category, Product } from "@/lib/data"

interface ProductSectionClientProps {
    categories: Category[]
    products: Product[]
    selectedCategory: string
    selectedSubCategory: string | null
}

export function ProductSectionClient({
    categories,
    products,
    selectedCategory,
    selectedSubCategory,
}: ProductSectionClientProps) {
    const [searchQuery, setSearchQuery] = useState("")

    // Filter by search query
    const filteredProducts = products.filter((product) => {
        if (!searchQuery) return true

        const query = searchQuery.toLowerCase()
        return (
            product.title.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.specs?.modelNo?.toLowerCase().includes(query)
        )
    })

    return (
        <>
            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#525252]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="상품명, 설명, 모델번호로 검색..."
                        className="w-full rounded-full border border-[#1a1a1a] bg-[#050505] py-3 pl-11 pr-11 text-sm text-[#ffffff] placeholder:text-[#525252] focus:border-[#333] focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#a3a3a3] transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Navigation */}
            <CategoryNav
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
            />

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} />
        </>
    )
}
