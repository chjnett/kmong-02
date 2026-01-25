"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Plus, Trash2, Folder, FolderOpen, Loader2, ArrowUp, ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Database } from "@/lib/database.types"
import { cn } from "@/lib/utils"

type Category = Database['public']['Tables']['categories']['Row'] & {
    sub_categories: Database['public']['Tables']['sub_categories']['Row'][]
}

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [newSubCategoryInput, setNewSubCategoryInput] = useState<{ [key: number]: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const { toast } = useToast()

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*, sub_categories(*)')
                .order('order', { ascending: true })

            if (error) throw error

            // Sort sub_categories by name or id since they don't have order yet
            const sortedData = data?.map(cat => ({
                ...cat,
                sub_categories: cat.sub_categories.sort((a, b) => a.id - b.id)
            })) || []

            setCategories(sortedData)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "로딩 실패",
                description: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleMoveCategory = async (id: number, direction: 'up' | 'down') => {
        const index = categories.findIndex(c => c.id === id)
        if (index === -1) return

        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= categories.length) return

        const currentCategory = categories[index]
        const targetCategory = categories[targetIndex]

        // Swap orders optimistically
        const newCategories = [...categories]
        newCategories[index] = { ...targetCategory, order: currentCategory.order }
        newCategories[targetIndex] = { ...currentCategory, order: targetCategory.order }
        setCategories(newCategories)

        try {
            const { error: error1 } = await supabase
                .from('categories')
                .update({ order: targetCategory.order })
                .eq('id', currentCategory.id)

            const { error: error2 } = await supabase
                .from('categories')
                .update({ order: currentCategory.order })
                .eq('id', targetCategory.id)

            if (error1 || error2) throw error1 || error2

            // Re-fetch to ensure sync (optional)
            // fetchCategories() 
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "순서 변경 실패",
                description: "변경된 순서를 저장하지 못했습니다."
            })
            fetchCategories() // Revert on error
        }
    }

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return

        setIsSubmitting(true)
        try {
            // Get max order
            const { data: maxOrderData } = await supabase
                .from('categories')
                .select('order')
                .order('order', { ascending: false })
                .limit(1)

            const nextOrder = (maxOrderData?.[0]?.order ?? 0) + 1

            const { error } = await supabase
                .from('categories')
                .insert({ name: newCategoryName, order: nextOrder })

            if (error) throw error

            setNewCategoryName("")
            toast({ title: "카테고리 추가 성공" })
            fetchCategories()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "추가 실패",
                description: error.message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("카테고리를 삭제하시겠습니까? 하위 카테고리와 해당 카테고리의 상품들이 영향을 받을 수 있습니다.")) return

        try {
            const { error } = await supabase.from('categories').delete().eq('id', id)
            if (error) throw error
            toast({ title: "카테고리 삭제 성공" })
            fetchCategories()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "삭제 실패",
                description: error.message
            })
        }
    }

    const handleAddSubCategory = async (categoryId: number) => {
        const name = newSubCategoryInput[categoryId]
        if (!name?.trim()) return

        try {
            const { error } = await supabase
                .from('sub_categories')
                .insert({ category_id: categoryId, name: name })

            if (error) throw error

            setNewSubCategoryInput(prev => ({ ...prev, [categoryId]: "" }))
            toast({ title: "하위 카테고리 추가 성공" })
            fetchCategories()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "추가 실패",
                description: error.message
            })
        }
    }

    const handleDeleteSubCategory = async (id: number) => {
        if (!confirm("하위 카테고리를 삭제하시겠습니까?")) return

        try {
            const { error } = await supabase.from('sub_categories').delete().eq('id', id)
            if (error) throw error
            toast({ title: "삭제 성공" })
            fetchCategories()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "삭제 실패",
                description: error.message
            })
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between p-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="text-[#a3a3a3] hover:text-[#f5f5f5]">
                            <Link href="/admin/dashboard">
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-lg font-medium text-[#f5f5f5]">카테고리 관리</h1>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-4 lg:p-8">
                {/* Add New Category */}
                <div className="mb-8 rounded-lg border border-[#262626] bg-[#111111] p-6">
                    <h2 className="mb-4 text-base font-medium text-[#f5f5f5]">새 상위 카테고리 추가</h2>
                    <div className="flex gap-2">
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="카테고리 이름 (예: 신발)"
                            className="bg-[#0a0a0a] text-[#f5f5f5] border-[#262626]"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <Button
                            onClick={handleAddCategory}
                            disabled={isSubmitting || !newCategoryName.trim()}
                            className="bg-[#c9a962] text-black hover:bg-[#c9a962]/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            추가
                        </Button>
                    </div>
                </div>

                {/* Category List */}
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#c9a962]" />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category, index) => (
                            <div key={category.id} className="rounded-lg border border-[#262626] bg-[#111111] overflow-hidden flex flex-col">
                                {/* Category Header */}
                                <div className="flex items-center justify-between border-b border-[#262626] bg-[#1a1a1a] p-3">
                                    <div className="flex items-center gap-2 text-[#f5f5f5] font-medium">
                                        <Folder className="h-4 w-4 text-[#c9a962]" />
                                        {category.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-[#737373] hover:text-[#f5f5f5] hover:bg-[#262626]"
                                            onClick={() => handleMoveCategory(category.id, 'up')}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-[#737373] hover:text-[#f5f5f5] hover:bg-[#262626]"
                                            onClick={() => handleMoveCategory(category.id, 'down')}
                                            disabled={index === categories.length - 1}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-[#737373] hover:text-red-500 hover:bg-transparent"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Sub Categories */}
                                <div className="p-3 flex-1 flex flex-col gap-2">
                                    <ul className="space-y-1">
                                        {category.sub_categories.map((sub) => (
                                            <li key={sub.id} className="group flex items-center justify-between rounded px-2 py-1.5 hover:bg-[#262626]">
                                                <span className="text-sm text-[#a3a3a3]">{sub.name}</span>
                                                <button
                                                    onClick={() => handleDeleteSubCategory(sub.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-[#525252] hover:text-red-500 transition-opacity"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </li>
                                        ))}
                                        {category.sub_categories.length === 0 && (
                                            <li className="py-2 text-center text-xs text-[#525252]">하위 카테고리 없음</li>
                                        )}
                                    </ul>

                                    {/* Add Sub Category Input */}
                                    <div className="mt-auto pt-3 flex gap-2">
                                        <Input
                                            value={newSubCategoryInput[category.id] || ""}
                                            onChange={(e) => setNewSubCategoryInput(prev => ({ ...prev, [category.id]: e.target.value }))}
                                            placeholder="하위 추가..."
                                            className="h-8 text-xs bg-[#0a0a0a] text-[#f5f5f5] border-[#262626]"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory(category.id)}
                                        />
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 shrink-0 bg-[#262626] hover:bg-[#333333]"
                                            onClick={() => handleAddSubCategory(category.id)}
                                            disabled={!newSubCategoryInput[category.id]?.trim()}
                                        >
                                            <Plus className="h-4 w-4 text-[#a3a3a3]" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
