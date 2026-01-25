import { Suspense } from "react"
// import { supabase } from "@/lib/supabase"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductGrid } from "@/components/product-grid"
import { ProductDetailWrapper } from "@/components/product-detail-wrapper"
import { KakaoButton } from "@/components/kakao-button"
import { categories as staticCategories, products as staticProducts } from "@/lib/data"

// Force dynamic rendering since we rely on searchParams
export const dynamic = "force-dynamic"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subCategory?: string }>
}) {
  // Await searchParams in Next.js 15+
  const params = await searchParams
  const categoryParam = (params.category || "전체").normalize("NFC")
  const subCategoryParam = params.subCategory?.normalize("NFC")

  // 1. Categories
  const categories = staticCategories

  // 2. Filter Products (Mimic DB Logic)
  let formattedProducts = staticProducts

  if (categoryParam !== "전체") {
    formattedProducts = formattedProducts.filter(p => p.category === categoryParam)
  }

  if (subCategoryParam) {
    formattedProducts = formattedProducts.filter(p => p.subCategory === subCategoryParam)
  }

  return (
    <main className="min-h-screen bg-[#000000]">
      <HeroSection />

      <section className="px-4 py-12 md:px-8 lg:px-16">
        <CategoryNav
          categories={categories}
          selectedCategory={categoryParam}
          selectedSubCategory={subCategoryParam || null}
        />

        {/* Pass data to Client Component wrapper which handles Modal state */}
        <ProductDetailWrapper
          key={`${categoryParam}-${subCategoryParam || 'all'}`}
          products={formattedProducts}
        />
      </section>

      <KakaoButton />
    </main>
  )
}
