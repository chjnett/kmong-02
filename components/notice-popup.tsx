"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

interface Notice {
    id: string
    title: string
    content: string
}

export function NoticePopup() {
    const [notice, setNotice] = useState<Notice | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        fetchActiveNotice()
    }, [])

    const fetchActiveNotice = async () => {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .eq('is_active', true)
            .gte('end_date', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (data && !error) {
            // 오늘 이미 본 공지인지 확인
            const closedNoticeId = localStorage.getItem('closed_notice_id')
            const closedDate = localStorage.getItem('closed_notice_date')
            const today = new Date().toDateString()

            if (closedNoticeId !== data.id || closedDate !== today) {
                setNotice(data)
                setIsOpen(true)
            }
        }
    }

    const handleClose = () => {
        if (notice) {
            localStorage.setItem('closed_notice_id', notice.id)
            localStorage.setItem('closed_notice_date', new Date().toDateString())
        }
        setIsOpen(false)
    }

    if (!isOpen || !notice) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-lg border border-[#c9a962]/30 bg-[#0a0a0a] p-6 shadow-2xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-[#737373] hover:text-[#f5f5f5] transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* 제목 */}
                <h2 className="text-xl font-medium text-[#c9a962] mb-4">
                    {notice.title}
                </h2>

                {/* 내용 */}
                <div className="text-sm text-[#a3a3a3] leading-relaxed whitespace-pre-wrap mb-6">
                    {notice.content}
                </div>

                {/* 오늘 하루 보지 않기 버튼 */}
                <Button
                    onClick={handleClose}
                    className="w-full bg-[#c9a962] text-[#000000] hover:bg-[#d4b870]"
                >
                    오늘 하루 보지 않기
                </Button>
            </div>
        </div>
    )
}
