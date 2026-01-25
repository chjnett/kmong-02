"use client"

import type { Category } from "@/lib/data"
import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string
  selectedSubCategory: string | null
}

export function CategoryNav({
  categories,
  selectedCategory,
  selectedSubCategory,
}: CategoryNavProps) {
  const router = useRouter()

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to new category, clear subcategory
    router.push(`/?category=${encodeURIComponent(categoryName)}`, { scroll: false })
  }

  const handleSubCategoryClick = (subCategoryName: string | null) => {
    // Keep current category, set subcategory
    if (subCategoryName) {
      router.push(`/?category=${encodeURIComponent(selectedCategory)}&subCategory=${encodeURIComponent(subCategoryName)}`, { scroll: false })
    } else {
      router.push(`/?category=${encodeURIComponent(selectedCategory)}`, { scroll: false })
    }
  }

  const currentCategory = categories.find((c) => c.name === selectedCategory)
  const subCategories = currentCategory?.subCategories || []

  return (
    <nav className="mb-14 space-y-8">
      {/* Main Categories - Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-[#111111] pb-6 md:gap-8">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={cn(
              "relative px-4 py-2 text-xs font-light tracking-[0.3em] uppercase transition-all duration-500 md:text-sm",
              selectedCategory === category.name
                ? "text-[#ffffff] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                : "text-[#404040] hover:text-[#737373]"
            )}
          >
            {category.name}
            {selectedCategory === category.name && (
              <span className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#ffffff] to-transparent opacity-80" />
            )}
          </button>
        ))}
      </div>

      {/* Sub Categories - Pills */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 transition-opacity duration-500 ease-in-out">
          <button
            onClick={() => handleSubCategoryClick(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[10px] font-light tracking-[0.15em] uppercase transition-all duration-300 md:px-5 md:py-2 md:text-xs",
              selectedSubCategory === null
                ? "border-[#ffffff]/20 bg-[#ffffff]/5 text-[#ffffff]"
                : "border-[#1a1a1a] bg-[#050505] text-[#525252] hover:border-[#333] hover:text-[#a3a3a3]"
            )}
          >
            전체보기
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => handleSubCategoryClick(sub)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[10px] font-light tracking-[0.15em] uppercase transition-all duration-300 md:px-5 md:py-2 md:text-xs",
                selectedSubCategory === sub
                  ? "border-[#ffffff]/20 bg-[#ffffff]/5 text-[#ffffff]"
                  : "border-[#1a1a1a] bg-[#050505] text-[#525252] hover:border-[#333] hover:text-[#a3a3a3]"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
