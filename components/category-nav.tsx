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
    <nav className="mb-10 space-y-6">
      {/* Main Categories - Tabs */}
      <div className="flex flex-wrap justify-center gap-1 border-b border-[#1a1a1a] pb-4 md:gap-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={cn(
              "relative px-4 py-2 text-xs font-light tracking-[0.2em] uppercase transition-all duration-300 md:px-6 md:text-sm",
              selectedCategory === category.name
                ? "text-[#c9a962]"
                : "text-[#737373] hover:text-[#a3a3a3]"
            )}
          >
            {category.name}
            {selectedCategory === category.name && (
              <span className="absolute right-0 bottom-0 left-0 h-px bg-[#c9a962]" />
            )}
          </button>
        ))}
      </div>

      {/* Sub Categories - Pills */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button
            onClick={() => handleSubCategoryClick(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[10px] font-light tracking-[0.15em] uppercase transition-all duration-300 md:px-5 md:py-2 md:text-xs",
              selectedSubCategory === null
                ? "border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]"
                : "border-[#262626] bg-transparent text-[#737373] hover:border-[#404040] hover:text-[#a3a3a3]"
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
                  ? "border-[#c9a962] bg-[#c9a962]/10 text-[#c9a962]"
                  : "border-[#262626] bg-transparent text-[#737373] hover:border-[#404040] hover:text-[#a3a3a3]"
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
