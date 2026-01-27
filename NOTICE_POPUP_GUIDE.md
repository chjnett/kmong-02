# 공지사항 팝업 기능 구현 가이드

## 📋 개요
관리자 페이지에서 공지사항을 작성하고 관리하여, 사용자가 홈페이지 접속 시 팝업으로 표시되는 기능을 구현합니다.

---

## 🗄️ 1. 데이터베이스 테이블 생성

### Supabase SQL Editor에서 실행

```sql
-- 공지사항 테이블 생성
CREATE TABLE notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 설정
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 (공개)
CREATE POLICY "Anyone can view active notices"
  ON notices FOR SELECT
  USING (is_active = true);

-- 인증된 사용자만 수정 가능 (관리자)
CREATE POLICY "Authenticated users can manage notices"
  ON notices FOR ALL
  USING (auth.role() = 'authenticated');

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔧 2. TypeScript 타입 정의

### `lib/database.types.ts` 업데이트

```typescript
export interface Notice {
  id: string
  title: string
  content: string
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}
```

---

## 🎨 3. 팝업 컴포넌트 생성

### `components/notice-popup.tsx`

```tsx
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
```

---

## 📱 4. 홈페이지에 팝업 추가

### `app/page.tsx` 수정

```tsx
import { NoticePopup } from "@/components/notice-popup"

export default async function HomePage({ searchParams }: { ... }) {
  // ... 기존 코드 ...

  return (
    <main className="min-h-screen bg-[#000000]">
      <HeroSection />
      
      <section id="main-content" className="px-4 py-6 md:px-8 lg:px-16">
        <ProductSectionClient ... />
      </section>

      {/* 공지사항 팝업 추가 */}
      <NoticePopup />
    </main>
  )
}
```

---

## 🛠️ 5. 관리자 페이지 - 공지사항 목록

### `app/admin/dashboard/notices/page.tsx`

```tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface Notice {
  id: string
  title: string
  content: string
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        variant: "destructive",
        title: "로딩 실패",
        description: error.message,
      })
    } else {
      setNotices(data || [])
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: error.message,
      })
    } else {
      toast({
        title: "삭제 성공",
        description: "공지사항이 삭제되었습니다.",
      })
      fetchNotices()
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('notices')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      toast({
        variant: "destructive",
        title: "업데이트 실패",
        description: error.message,
      })
    } else {
      toast({
        title: "업데이트 성공",
        description: `공지사항이 ${!currentStatus ? '활성화' : '비활성화'}되었습니다.`,
      })
      fetchNotices()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-light text-[#f5f5f5]">공지사항 관리</h1>
            <p className="text-[#737373]">팝업 공지사항을 등록하고 관리하세요.</p>
          </div>
          <Button asChild className="bg-[#c9a962] text-[#000000] hover:bg-[#d4b870]">
            <Link href="/admin/dashboard/notices/new">
              <Plus className="mr-2 h-4 w-4" />
              공지사항 등록
            </Link>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#c9a962]" />
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-lg border border-[#262626] bg-[#111111] p-6 transition-all hover:border-[#c9a962]/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-[#f5f5f5]">
                        {notice.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          notice.is_active
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {notice.is_active ? '활성' : '비활성'}
                      </span>
                    </div>
                    <p className="text-sm text-[#737373] line-clamp-2 mb-3">
                      {notice.content}
                    </p>
                    <p className="text-xs text-[#525252]">
                      등록일: {new Date(notice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(notice.id, notice.is_active)}
                      className="text-[#a3a3a3] hover:text-[#f5f5f5]"
                    >
                      {notice.is_active ? '비활성화' : '활성화'}
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-[#a3a3a3] hover:text-[#f5f5f5]"
                    >
                      <Link href={`/admin/dashboard/notices/${notice.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(notice.id)}
                      className="text-[#a3a3a3] hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && notices.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#262626] text-[#737373]">
            <p className="mb-4">등록된 공지사항이 없습니다.</p>
            <Button asChild variant="outline" className="border-[#262626]">
              <Link href="/admin/dashboard/notices/new">첫 공지사항 등록하기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## ✏️ 6. 관리자 페이지 - 공지사항 작성/수정

### `app/admin/dashboard/notices/[id]/page.tsx`

```tsx
"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function NoticeEditPage({ params }: PageProps) {
  const { id } = use(params)
  const isNew = id === "new"
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_active: true,
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    if (!isNew) {
      fetchNotice()
    }
  }, [id, isNew])

  const fetchNotice = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      toast({
        variant: "destructive",
        title: "로딩 실패",
        description: error.message,
      })
      router.push("/admin/dashboard/notices")
      return
    }

    setFormData({
      title: data.title,
      content: data.content,
      is_active: data.is_active,
      start_date: data.start_date ? data.start_date.split('T')[0] : "",
      end_date: data.end_date ? data.end_date.split('T')[0] : "",
    })
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
      })
      return
    }

    setIsSaving(true)

    const payload = {
      title: formData.title,
      content: formData.content,
      is_active: formData.is_active,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    }

    try {
      if (isNew) {
        const { error } = await supabase.from('notices').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('notices')
          .update(payload)
          .eq('id', id)
        if (error) throw error
      }

      toast({
        title: isNew ? "등록 성공" : "수정 성공",
        description: "공지사항이 저장되었습니다.",
      })
      router.push("/admin/dashboard/notices")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c9a962]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="text-[#a3a3a3] hover:text-[#f5f5f5]">
              <Link href="/admin/dashboard/notices">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium text-[#f5f5f5]">
              {isNew ? "새 공지사항 등록" : "공지사항 수정"}
            </h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-[#c9a962] text-[#000000] hover:bg-[#d4b870]"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </header>

      {/* Form Content */}
      <main className="mx-auto max-w-5xl p-4 lg:p-8">
        <div className="space-y-8">
          <div className="space-y-4 rounded-lg border border-[#262626] bg-[#111111] p-6">
            <h2 className="text-lg font-medium text-[#f5f5f5]">기본 정보</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#a3a3a3]">제목</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="border-[#262626] bg-[#0a0a0a] text-[#f5f5f5]"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#a3a3a3]">내용</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[200px] border-[#262626] bg-[#0a0a0a] text-[#f5f5f5]"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#a3a3a3]">시작일 (선택)</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="border-[#262626] bg-[#0a0a0a] text-[#f5f5f5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#a3a3a3]">종료일 (선택)</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="border-[#262626] bg-[#0a0a0a] text-[#f5f5f5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#262626] p-4">
                <div>
                  <Label className="text-[#f5f5f5]">활성화</Label>
                  <p className="text-xs text-[#737373]">
                    활성화하면 사용자에게 팝업으로 표시됩니다
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## 🔗 7. 관리자 대시보드 메뉴 추가

### `app/admin/dashboard/page.tsx` 수정

기존 대시보드 헤더에 "공지사항 관리" 버튼 추가:

```tsx
<div className="flex gap-2">
  <Button asChild variant="outline" className="border-[#262626] bg-transparent text-[#a3a3a3] hover:bg-[#262626] hover:text-[#f5f5f5]">
    <Link href="/admin/dashboard/notices">
      <Bell className="mr-2 h-4 w-4" />
      공지사항 관리
    </Link>
  </Button>
  <Button asChild variant="outline" className="border-[#262626] bg-transparent text-[#a3a3a3] hover:bg-[#262626] hover:text-[#f5f5f5]">
    <Link href="/admin/dashboard/categories">
      <FolderOpen className="mr-2 h-4 w-4" />
      카테고리 관리
    </Link>
  </Button>
  {/* ... 기존 버튼들 ... */}
</div>
```

---

## ✅ 8. 구현 체크리스트

- [ ] Supabase에서 `notices` 테이블 생성
- [ ] `components/notice-popup.tsx` 컴포넌트 생성
- [ ] `app/page.tsx`에 `<NoticePopup />` 추가
- [ ] `app/admin/dashboard/notices/page.tsx` 목록 페이지 생성
- [ ] `app/admin/dashboard/notices/[id]/page.tsx` 작성/수정 페이지 생성
- [ ] 관리자 대시보드에 공지사항 관리 버튼 추가
- [ ] 테스트: 공지사항 등록 → 홈페이지에서 팝업 확인

---

## 🎯 주요 기능

1. **관리자 기능**
   - 공지사항 등록/수정/삭제
   - 활성화/비활성화 토글
   - 게시 기간 설정 (시작일/종료일)

2. **사용자 기능**
   - 홈페이지 접속 시 자동 팝업
   - "오늘 하루 보지 않기" 기능 (localStorage)
   - 반응형 디자인

3. **자동화**
   - 종료일이 지난 공지는 자동으로 표시 안 됨
   - 가장 최근 공지사항만 표시

---

이 가이드를 따라 구현하면 완전한 공지사항 팝업 시스템이 완성됩니다! 🎉
