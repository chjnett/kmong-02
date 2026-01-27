# Notices 테이블 404 에러 진단 및 해결 가이드

## 🔍 문제 증상
```
Failed to load resource: the server responded with a status of 404
vqlzwgsljcytqoqkznnq.supabase.co/rest/v1/notices
```

---

## 📋 진단 체크리스트

### 1단계: 테이블 존재 확인

**Supabase SQL Editor에서 실행:**
```sql
-- 테이블 존재 여부 확인
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'notices';
```

**예상 결과:**
- `table_schema`: `public`
- `table_name`: `notices`

**❌ 결과가 없으면:** 테이블이 없음 → [해결법 A](#해결법-a-테이블-생성)로 이동
**✅ 결과가 있으면:** 2단계로 진행

---

### 2단계: 스키마 확인

**확인 사항:**
테이블이 `public` 스키마에 있는지 확인

**❌ `public`이 아니면:** [해결법 B](#해결법-b-스키마-이동)로 이동
**✅ `public`이면:** 3단계로 진행

---

### 3단계: API 노출 설정 확인

**Supabase 대시보드:**
1. **Settings** → **API**
2. **PostgREST Settings** 섹션 찾기
3. **Exposed schemas** 확인

**❌ `public`이 없으면:** [해결법 C](#해결법-c-스키마-노출)로 이동
**✅ `public`이 있으면:** 4단계로 진행

---

### 4단계: 권한 확인

**Supabase SQL Editor에서 실행:**
```sql
-- anon 역할의 테이블 권한 확인
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'notices' AND grantee = 'anon';
```

**예상 결과:**
- `grantee`: `anon`
- `privilege_type`: `SELECT` (최소한)

**❌ 결과가 없으면:** [해결법 D](#해결법-d-권한-부여)로 이동
**✅ 권한이 있으면:** 5단계로 진행

---

### 5단계: RLS 정책 확인

**Supabase SQL Editor에서 실행:**
```sql
-- RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'notices';
```

**예상 결과:**
최소 1개 이상의 SELECT 정책이 `anon` 또는 `public` 역할에 적용되어 있어야 함

**❌ 정책이 없거나 부족하면:** [해결법 E](#해결법-e-rls-정책-설정)로 이동
**✅ 정책이 있으면:** 6단계로 진행

---

### 6단계: API 캐시 확인

**PostgREST 스키마 캐시 새로고침:**
```sql
NOTIFY pgrst, 'reload schema';
```

실행 후 **5분 대기** → 웹사이트 새로고침

**❌ 여전히 404:** [해결법 F](#해결법-f-완전-재설정)로 이동

---

## 🔧 해결법

### 해결법 A: 테이블 생성

```sql
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

실행 후 → [해결법 D](#해결법-d-권한-부여)로 이동

---

### 해결법 B: 스키마 이동

```sql
-- 다른 스키마에 있는 테이블을 public으로 이동
ALTER TABLE [현재스키마].notices SET SCHEMA public;
```

실행 후 → [해결법 D](#해결법-d-권한-부여)로 이동

---

### 해결법 C: 스키마 노출

**Supabase 대시보드에서:**
1. **Settings** → **API**
2. **PostgREST Settings**
3. **Exposed schemas**에 `public` 추가
4. **Save** 클릭
5. 5분 대기 후 웹사이트 새로고침

---

### 해결법 D: 권한 부여

```sql
-- public 스키마 사용 권한
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 테이블 읽기 권한
GRANT SELECT ON public.notices TO anon, authenticated;

-- 관리자 전체 권한
GRANT ALL ON public.notices TO authenticated;

-- 시퀀스 권한 (있다면)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

실행 후 → [해결법 E](#해결법-e-rls-정책-설정)로 이동

---

### 해결법 E: RLS 정책 설정

```sql
-- RLS 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.notices;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.notices;

-- 공개 읽기 정책 (모든 사용자)
CREATE POLICY "Enable read access for all users"
  ON public.notices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 관리자 전체 권한 정책
CREATE POLICY "Enable all access for authenticated users"
  ON public.notices
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

실행 후 → [6단계](#6단계-api-캐시-확인)로 이동

---

### 해결법 F: 완전 재설정

**⚠️ 주의: 기존 데이터가 삭제됩니다!**

```sql
-- 1. 테이블 완전 삭제
DROP TABLE IF EXISTS public.notices CASCADE;

-- 2. 테이블 재생성
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

-- 3. 권한 설정
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.notices TO anon, authenticated;
GRANT ALL ON public.notices TO authenticated;

-- 4. RLS 설정
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON public.notices FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable all access for authenticated users"
  ON public.notices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. API 새로고침
NOTIFY pgrst, 'reload schema';

-- 7. 테스트 데이터 삽입
INSERT INTO public.notices (title, content, is_active, end_date)
VALUES ('테스트 공지', '시스템이 정상 작동합니다.', true, NOW() + INTERVAL '7 days');
```

실행 후:
1. **5분 대기**
2. 브라우저 캐시 삭제 (Ctrl + Shift + Delete)
3. 웹사이트 새로고침

---

## 🧪 테스트 방법

### 1. SQL에서 직접 조회 테스트

```sql
-- anon 역할로 조회 시뮬레이션
SET ROLE anon;
SELECT * FROM notices;
RESET ROLE;
```

**성공하면:** SQL은 정상, API 문제
**실패하면:** 권한 또는 RLS 문제

### 2. API 직접 호출 테스트

브라우저 개발자 도구 Console에서:

```javascript
fetch('https://vqlzwgsljcytqoqkznnq.supabase.co/rest/v1/notices', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**200 응답:** 정상
**404 응답:** API 인식 문제 → [해결법 F](#해결법-f-완전-재설정)

---

## 🚨 긴급 임시 해결법

공지사항 기능을 일시적으로 비활성화:

**`components/notice-popup.tsx` 수정:**
```tsx
export function NoticePopup() {
  // 임시로 항상 null 반환
  return null
  
  // 나머지 코드는 주석 처리...
}
```

이렇게 하면 404 에러는 사라지고, 나중에 문제 해결 후 다시 활성화할 수 있습니다.

---

## 📞 추가 도움이 필요하면

위 모든 방법을 시도해도 해결되지 않으면:

1. Supabase 대시보드 → **Settings** → **API**
2. **Project URL**과 **anon key** 재확인
3. Vercel 환경 변수 재확인
4. Supabase 프로젝트 재시작 (Settings → General → Restart project)
