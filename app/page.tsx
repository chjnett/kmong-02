import { Suspense } from "react"
import { supabase } from "@/lib/supabase" // Direct import works for public reading
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductGrid } from "@/components/product-grid"
import { KakaoButton } from "@/components/kakao-button"
import type { Category, Product } from "@/lib/data"

// Force dynamic rendering since we rely on searchParams and DB
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subCategory?: string }>
}) {
  const params = await searchParams
  const categoryParam = (params.category || "전체").normalize("NFC")
  const subCategoryParam = params.subCategory?.normalize("NFC")

  // 1. Fetch Categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*, sub_categories(name, id)') // Select sub_categories
    .order('order', { ascending: true })

  // Map to UI Category Interface
  const mappedCategories: Category[] = [
    { name: "전체", subCategories: [] },
    ...(categoriesData?.map(c => ({
      name: c.name,
      subCategories: c.sub_categories?.map((s: any) => s.name) || []
    })) || [])
  ]

  // 2. Fetch Products
  // We fetch all products for now as the dataset is small. For scale, filtering should move to DB query.
  const { data: productsData } = await supabase
    .from('products')
    .select(`
        *,
        sub_categories (
            name,
            categories (
                name
            )
        )
    `)
    .order('created_at', { ascending: false })

  // Map to UI Product Interface
  const mappedProducts: Product[] = productsData?.map((p: any) => ({
    id: p.id,
    title: p.name,
    category: p.sub_categories?.categories?.name || "Uncategorized",
    subCategory: p.sub_categories?.name || "Uncategorized",
    image: p.img_urls?.[0] || "",
    gallery: p.img_urls || [],
    externalUrl: p.external_url || "",
    price: (() => {
      const priceVal = p.specs?.price;
      if (!priceVal) return "";
      // Remove commas if string
      const num = Number(String(priceVal).replace(/,/g, ''));
      if (isNaN(num)) return priceVal; // Return original string if not number (e.g. "문의")

      // Heuristic: If price is less than 10000, assume it's in thousands unit
      // This handles "1250" -> 1,250,000
      const finalPrice = num < 10000 ? num * 1000 : num;
      return `${finalPrice.toLocaleString()}원`;
    })(),
    specs: {
      modelNo: p.specs?.modelNo || "",
      material: p.specs?.material || "",
      size: p.specs?.size || "",
      color: p.specs?.color || ""
    },
    description: p.description || ""
  })) || []

  // 3. Filter Logic (Same as before)
  let formattedProducts = mappedProducts

  if (categoryParam !== "전체") {
    formattedProducts = formattedProducts.filter(p => p.category === categoryParam)
  }

  if (subCategoryParam) {
    formattedProducts = formattedProducts.filter(p => p.subCategory === subCategoryParam)
  }

  return (
    <main className="min-h-screen bg-[#000000]">
      <HeroSection />

      <section id="main-content" className="px-4 py-12 md:px-8 lg:px-16">
        <CategoryNav
          categories={mappedCategories}
          selectedCategory={categoryParam}
          selectedSubCategory={subCategoryParam || null}
        />

        <ProductGrid
          products={formattedProducts}
        />
      </section>

      <KakaoButton />
    </main>
  )
}
