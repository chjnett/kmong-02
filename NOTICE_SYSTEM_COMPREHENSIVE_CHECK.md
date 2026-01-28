# 공지사항 시스템 종합 체크 가이드

## 🎯 목표
공지사항 시스템이 정상 작동하는지 여러 방면에서 체크하고 문제를 진단

---

## ✅ 체크리스트 1: Supabase 데이터베이스 확인

### 1-1. 테이블 존재 확인

**Supabase SQL Editor에서 실행:**
```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'notices';
```

**예상 결과:**
```
table_name
----------
notices
```

**✅ 통과**: 테이블이 표시됨
**❌ 실패**: 아무것도 표시 안 됨 → [해결법 A](#해결법-a-테이블-생성)

---

### 1-2. 테이블 구조 확인

**Supabase SQL Editor에서 실행:**
```sql
-- 컬럼 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'notices'
ORDER BY ordinal_position;
```

**예상 결과:**
```
column_name    | data_type                   | is_nullable
---------------|-----------------------------|-----------
id             | uuid                        | NO
title          | text                        | NO
content        | text                        | NO
is_active      | boolean                     | YES
start_date     | timestamp with time zone    | YES
end_date       | timestamp with time zone    | YES
created_at     | timestamp with time zone    | YES
updated_at     | timestamp with time zone    | YES
```

**✅ 통과**: 8개 컬럼 모두 존재
**❌ 실패**: 컬럼이 부족하거나 다름 → [해결법 B](#해결법-b-테이블-재생성)

---

### 1-3. 권한 확인

**Supabase SQL Editor에서 실행:**
```sql
-- anon 역할의 권한 확인
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE table_name = 'notices' AND grantee IN ('anon', 'authenticated');
```

**예상 결과:**
```
grantee        | privilege_type | table_name
---------------|----------------|------------
anon           | SELECT         | notices
authenticated  | SELECT         | notices
authenticated  | INSERT         | notices
authenticated  | UPDATE         | notices
authenticated  | DELETE         | notices
```

**✅ 통과**: anon에 SELECT 권한 있음
**❌ 실패**: 권한 없음 → [해결법 C](#해결법-c-권한-부여)

---

### 1-4. RLS 정책 확인

**Supabase SQL Editor에서 실행:**
```sql
-- RLS 정책 목록 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'notices';
```

**예상 결과:**
```
policyname                              | roles                    | cmd
----------------------------------------|--------------------------|--------
Enable read access for all users        | {anon,authenticated}     | SELECT
Enable all access for authenticated...  | {authenticated}          | ALL
```

**✅ 통과**: SELECT 정책이 anon 역할에 적용됨
**❌ 실패**: 정책 없음 또는 anon 없음 → [해결법 D](#해결법-d-rls-정책-설정)

---

### 1-5. 테스트 데이터 확인

**Supabase SQL Editor에서 실행:**
```sql
-- 데이터 조회
SELECT id, title, is_active, end_date, created_at
FROM public.notices
ORDER BY created_at DESC;
```

**예상 결과:**
- 최소 1개 이상의 공지사항 표시
- `is_active = true`
- `end_date`가 미래 날짜

**✅ 통과**: 데이터 있음
**❌ 실패**: 데이터 없음 → [해결법 E](#해결법-e-테스트-데이터-삽입)

---

## ✅ 체크리스트 2: API 접근 테스트

### 2-1. anon 역할로 조회 테스트

**Supabase SQL Editor에서 실행:**
```sql
-- anon 역할로 전환하여 조회
SET ROLE anon;
SELECT * FROM notices WHERE is_active = true;
RESET ROLE;
```

**✅ 통과**: 데이터 조회됨
**❌ 실패**: 권한 에러 → [해결법 C](#해결법-c-권한-부여) 또는 [해결법 D](#해결법-d-rls-정책-설정)

---

### 2-2. REST API 직접 호출 테스트

**브라우저 개발자 도구 Console에서 실행:**

```javascript
// Supabase anon 키를 여기에 입력
const ANON_KEY = 'YOUR_ANON_KEY_HERE';

fetch('https://vqlzwgsljcytqoqkznnq.supabase.co/rest/v1/notices?select=*', {
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Data:', data))
.catch(err => console.error('Error:', err));
```

**예상 결과:**
```
Status: 200
Data: [{id: "...", title: "테스트 공지", ...}]
```

**✅ 통과**: 200 응답, 데이터 반환
**❌ 실패 (404)**: 테이블 인식 안 됨 → [해결법 F](#해결법-f-api-캐시-새로고침)
**❌ 실패 (401)**: API 키 문제 → [해결법 G](#해결법-g-api-키-확인)

---

## ✅ 체크리스트 3: 환경 변수 확인

### 3-1. 로컬 환경 변수 확인

**`.env.local` 파일 확인:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vqlzwgsljcytqoqkznnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**체크 사항:**
- ✅ URL이 `vqlzwgsljcytqoqkznnq.supabase.co`인지 확인
- ✅ ANON_KEY가 `eyJ`로 시작하는지 확인
- ✅ 공백이나 줄바꿈이 없는지 확인

**❌ 실패**: 잘못된 값 → [해결법 G](#해결법-g-api-키-확인)

---

### 3-2. Vercel 환경 변수 확인

**Vercel 대시보드:**
1. 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 변수 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**체크 사항:**
- ✅ 3개 변수 모두 존재
- ✅ Production, Preview, Development 모두 체크됨
- ✅ 값이 로컬과 동일

**❌ 실패**: 변수 없거나 다름 → [해결법 H](#해결법-h-vercel-환경-변수-설정)

---

## ✅ 체크리스트 4: 프론트엔드 코드 확인

### 4-1. NoticePopup 컴포넌트 확인

**`components/notice-popup.tsx` 파일 확인:**

```tsx
export function NoticePopup() {
    // ❌ 이 줄이 있으면 안 됨!
    // return null
    
    const [notice, setNotice] = useState<Notice | null>(null)
    // ...
}
```

**✅ 통과**: `return null` 없음
**❌ 실패**: `return null` 있음 → 삭제 필요

---

### 4-2. 에러 처리 확인

**`components/notice-popup.tsx`에서 `fetchActiveNotice` 함수 확인:**

```tsx
const fetchActiveNotice = async () => {
    try {
        const { data, error } = await supabase
            .from('notices')
            // ...
    } catch (error) {
        console.log('Notice fetch failed:', error)
    }
}
```

**✅ 통과**: try-catch 있음
**❌ 실패**: try-catch 없음 → 추가 권장

---

### 4-3. 페이지에 컴포넌트 추가 확인

**`app/page.tsx` 파일 확인:**

```tsx
import { NoticePopup } from "@/components/notice-popup"

export default function Home() {
  return (
    <main>
      <NoticePopup />
      {/* ... */}
    </main>
  )
}
```

**✅ 통과**: NoticePopup 컴포넌트 추가됨
**❌ 실패**: 컴포넌트 없음 → 추가 필요

---

## ✅ 체크리스트 5: 배포 상태 확인

### 5-1. Vercel 배포 상태 확인

**Vercel 대시보드:**
1. **Deployments** 탭
2. 최근 배포 확인

**체크 사항:**
- ✅ 상태가 **Ready** (녹색)
- ✅ 최근 커밋이 배포됨
- ✅ 빌드 에러 없음

**❌ 실패**: 빌드 에러 → 로그 확인 및 수정

---

### 5-2. 배포된 사이트 확인

**브라우저에서:**
1. 배포 URL 접속
2. **F12** (개발자 도구)
3. **Console** 탭 확인

**체크 사항:**
- ✅ 404 에러 없음
- ✅ 401 에러 없음
- ✅ "Notice fetch failed" 로그 없음 (또는 있어도 사이트 정상)

**❌ 실패**: 에러 있음 → 에러 메시지 확인

---

## ✅ 체크리스트 6: 브라우저 캐시 확인

### 6-1. 캐시 삭제

**브라우저에서:**
1. **Ctrl + Shift + Delete** (Windows) 또는 **Cmd + Shift + Delete** (Mac)
2. **캐시된 이미지 및 파일** 체크
3. **시간 범위**: 전체 기간
4. **데이터 삭제**

### 6-2. 강제 새로고침

**브라우저에서:**
- **Ctrl + Shift + R** (Windows)
- **Cmd + Shift + R** (Mac)

---

## 🔧 해결법

### 해결법 A: 테이블 생성

```sql
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 해결법 B: 테이블 재생성

```sql
-- ⚠️ 주의: 기존 데이터 삭제됨!
DROP TABLE IF EXISTS public.notices CASCADE;

-- 테이블 재생성
CREATE TABLE public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 해결법 C: 권한 부여

```sql
-- 스키마 사용 권한
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 테이블 읽기 권한
GRANT SELECT ON public.notices TO anon, authenticated;

-- 관리자 전체 권한
GRANT ALL ON public.notices TO authenticated;
```

---

### 해결법 D: RLS 정책 설정

```sql
-- RLS 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.notices;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.notices;

-- 공개 읽기 정책
CREATE POLICY "Enable read access for all users"
  ON public.notices FOR SELECT
  TO anon, authenticated
  USING (true);

-- 관리자 전체 권한 정책
CREATE POLICY "Enable all access for authenticated users"
  ON public.notices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

---

### 해결법 E: 테스트 데이터 삽입

```sql
-- 테스트 공지 삽입
INSERT INTO public.notices (title, content, is_active, end_date)
VALUES 
  ('테스트 공지', '시스템이 정상 작동합니다.', true, NOW() + INTERVAL '30 days'),
  ('환영 공지', '에테르나에 오신 것을 환영합니다!', true, NOW() + INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- 확인
SELECT * FROM public.notices;
```

---

### 해결법 F: API 캐시 새로고침

```sql
-- PostgREST 스키마 캐시 새로고침
NOTIFY pgrst, 'reload schema';
```

실행 후 **5분 대기**

---

### 해결법 G: API 키 확인

**Supabase 대시보드:**
1. **Settings** → **API**
2. **Project API keys** 섹션
3. **anon public** 키 복사
4. `.env.local` 및 Vercel 환경 변수 업데이트

---

### 해결법 H: Vercel 환경 변수 설정

**Vercel 대시보드:**
1. **Settings** → **Environment Variables**
2. **Add New** 클릭
3. 3개 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. 각 변수마다 **Production, Preview, Development** 모두 체크
5. **Redeploy**

---

## 📊 종합 진단 플로우차트

```
시작
  ↓
[1] Supabase 테이블 존재? 
  ├─ NO → 해결법 A
  └─ YES
      ↓
[2] 테이블 구조 정상?
  ├─ NO → 해결법 B
  └─ YES
      ↓
[3] anon 권한 있음?
  ├─ NO → 해결법 C
  └─ YES
      ↓
[4] RLS 정책 있음?
  ├─ NO → 해결법 D
  └─ YES
      ↓
[5] 테스트 데이터 있음?
  ├─ NO → 해결법 E
  └─ YES
      ↓
[6] REST API 200 응답?
  ├─ NO (404) → 해결법 F
  ├─ NO (401) → 해결법 G
  └─ YES
      ↓
[7] 환경 변수 정상?
  ├─ NO → 해결법 G, H
  └─ YES
      ↓
[8] 배포 상태 Ready?
  ├─ NO → Redeploy
  └─ YES
      ↓
[9] 브라우저 캐시 삭제?
  ├─ NO → 캐시 삭제 후 새로고침
  └─ YES
      ↓
✅ 정상 작동!
```

---

## 🎯 빠른 체크 스크립트

**모든 체크를 한 번에 실행 (Supabase SQL Editor):**

```sql
-- ===== 종합 진단 스크립트 =====

-- 1. 테이블 존재 확인
SELECT '1. 테이블 존재 확인' AS check_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notices') 
            THEN '✅ 통과' ELSE '❌ 실패' END AS result;

-- 2. 컬럼 개수 확인
SELECT '2. 컬럼 개수 확인' AS check_name,
       CASE WHEN COUNT(*) = 8 THEN '✅ 통과' ELSE '❌ 실패' END AS result
FROM information_schema.columns WHERE table_name = 'notices';

-- 3. anon 권한 확인
SELECT '3. anon 권한 확인' AS check_name,
       CASE WHEN EXISTS (
         SELECT 1 FROM information_schema.role_table_grants 
         WHERE table_name = 'notices' AND grantee = 'anon' AND privilege_type = 'SELECT'
       ) THEN '✅ 통과' ELSE '❌ 실패' END AS result;

-- 4. RLS 정책 확인
SELECT '4. RLS 정책 확인' AS check_name,
       CASE WHEN COUNT(*) >= 1 THEN '✅ 통과' ELSE '❌ 실패' END AS result
FROM pg_policies WHERE tablename = 'notices' AND 'anon' = ANY(roles);

-- 5. 테스트 데이터 확인
SELECT '5. 테스트 데이터 확인' AS check_name,
       CASE WHEN COUNT(*) > 0 THEN '✅ 통과' ELSE '❌ 실패' END AS result
FROM public.notices;

-- 6. 활성 공지 확인
SELECT '6. 활성 공지 확인' AS check_name,
       CASE WHEN COUNT(*) > 0 THEN '✅ 통과' ELSE '❌ 실패' END AS result
FROM public.notices WHERE is_active = true;
```

**예상 결과:**
```
check_name              | result
------------------------|--------
1. 테이블 존재 확인      | ✅ 통과
2. 컬럼 개수 확인        | ✅ 통과
3. anon 권한 확인        | ✅ 통과
4. RLS 정책 확인         | ✅ 통과
5. 테스트 데이터 확인    | ✅ 통과
6. 활성 공지 확인        | ✅ 통과
```

**모두 ✅ 통과하면 시스템이 정상입니다!**

---

## 📞 추가 도움

위 모든 체크를 통과했는데도 문제가 있다면:

1. **브라우저 개발자 도구** Console의 정확한 에러 메시지
2. **Vercel 배포 로그** 스크린샷
3. **Supabase SQL Editor**에서 종합 진단 스크립트 실행 결과

이 정보를 제공하면 더 정확한 도움을 드릴 수 있습니다!
