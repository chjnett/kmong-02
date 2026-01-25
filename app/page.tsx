"use client"

import { useState, useMemo } from "react"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductGrid } from "@/components/product-grid"
import { ProductDetail } from "@/components/product-detail"
import { KakaoButton } from "@/components/kakao-button"
import { products, categories, type Product } from "@/lib/data"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory === "전체") return true
      if (product.category !== selectedCategory) return false
      if (selectedSubCategory && product.subCategory !== selectedSubCategory) return false
      return true
    })
  }, [selectedCategory, selectedSubCategory])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubCategory(null)
  }

  return (
    <main className="min-h-screen bg-[#000000]">
      <HeroSection />
      
      <section className="px-4 py-12 md:px-8 lg:px-16">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          onCategoryChange={handleCategoryChange}
          onSubCategoryChange={setSelectedSubCategory}
        />
        
        <ProductGrid
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      </section>

      <ProductDetail
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={false}
      />

      <KakaoButton />
    </main>
  )
}
