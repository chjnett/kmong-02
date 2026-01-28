# 공지사항이 메인 화면에 표시되지 않는 문제 해결 가이드

## 🔍 문제 진단

**증상**: Admin에서 공지 등록은 되는데 메인 화면에 표시 안 됨

**원인**: `NoticePopup` 컴포넌트의 조회 조건이 너무 엄격함

---

## 🐛 문제가 되는 코드

**`components/notice-popup.tsx` 28번 줄:**
```tsx
.gte('end_date', new Date().toISOString())
```

**문제점:**
- `end_date`가 **미래 날짜**인 공지만 표시
- `end_date`가 **null**이거나 **과거 날짜**면 표시 안 됨

---

## ✅ 해결 방법 (2가지)

### 방법 1: 코드 수정 (권장)

**`end_date` 조건을 더 유연하게 변경:**

```tsx
const fetchActiveNotice = async () => {
    try {
        const { data, error } = await supabase
            .from('notices')
            .select('*')
            .eq('is_active', true)
            // end_date가 null이거나 미래 날짜인 공지만 표시
            .or('end_date.is.null,end_date.gte.' + new Date().toISOString())
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
    } catch (error) {
        console.log('Notice fetch failed:', error)
    }
}
```

---

### 방법 2: Admin에서 end_date 설정 (임시)

**Admin 페이지에서 공지 수정:**
1. `/admin/dashboard/notices` 접속
2. 등록한 공지 찾기
3. **수정** 버튼 클릭
4. **종료일** 설정:
   - 예: 2026-12-31 (올해 말)
   - 또는 원하는 미래 날짜
5. **저장**

---

## 🔧 즉시 적용 (방법 1 권장)

### Step 1: notice-popup.tsx 파일 수정

**파일 위치:**
```
c:\웹_크몽\02-에테르나\luxury-curation-app\components\notice-popup.tsx
```

**28번 줄을 다음과 같이 수정:**

**수정 전:**
```tsx
.gte('end_date', new Date().toISOString())
```

**수정 후:**
```tsx
.or('end_date.is.null,end_date.gte.' + new Date().toISOString())
```

### Step 2: 저장 및 테스트

1. 파일 저장 (Ctrl + S)
2. 브라우저 새로고침 (Ctrl + Shift + R)
3. 공지사항 팝업 표시 확인 ✅

---

## 📊 조회 조건 비교

### 기존 조건 (문제 있음)
```sql
SELECT * FROM notices
WHERE is_active = true
  AND end_date >= NOW()  -- ❌ end_date가 null이면 제외됨
ORDER BY created_at DESC
LIMIT 1;
```

### 수정된 조건 (올바름)
```sql
SELECT * FROM notices
WHERE is_active = true
  AND (end_date IS NULL OR end_date >= NOW())  -- ✅ end_date가 null이어도 포함
ORDER BY created_at DESC
LIMIT 1;
```

---

## 🎯 테스트 방법

### 1. Supabase에서 데이터 확인

**SQL Editor에서 실행:**
```sql
-- 현재 조회되는 공지 확인
SELECT id, title, is_active, end_date, created_at
FROM public.notices
WHERE is_active = true
  AND (end_date IS NULL OR end_date >= NOW())
ORDER BY created_at DESC;
```

**예상 결과:**
- 활성화된 공지가 표시됨
- `end_date`가 null이거나 미래 날짜인 공지

### 2. 브라우저에서 확인

**개발자 도구 Console에서:**
```javascript
// 공지 조회 테스트
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://vqlzwgsljcytqoqkznnq.supabase.co',
  'YOUR_ANON_KEY'
);

const { data, error } = await supabase
  .from('notices')
  .select('*')
  .eq('is_active', true)
  .or('end_date.is.null,end_date.gte.' + new Date().toISOString())
  .order('created_at', { ascending: false })
  .limit(1)
  .single();

console.log('Notice:', data);
console.log('Error:', error);
```

---

## ✅ 체크리스트

### 공지 데이터 확인
- [ ] Admin에서 공지가 등록되어 있음
- [ ] `is_active`가 `true`로 설정됨
- [ ] `end_date`가 null이거나 미래 날짜

### 코드 수정 확인
- [ ] `notice-popup.tsx` 28번 줄 수정됨
- [ ] `.or('end_date.is.null,end_date.gte.' + ...)` 사용
- [ ] 파일 저장됨

### 테스트 확인
- [ ] 브라우저 새로고침
- [ ] 공지사항 팝업 표시됨
- [ ] "오늘 하루 보지 않기" 버튼 작동

---

## 🚨 여전히 표시 안 되면

### 추가 체크 사항:

1. **localStorage 확인**
   - F12 → Application → Local Storage
   - `closed_notice_id` 삭제
   - `closed_notice_date` 삭제
   - 새로고침

2. **Console 에러 확인**
   - F12 → Console
   - "Notice fetch failed" 메시지 확인
   - 에러 내용 확인

3. **Supabase 데이터 확인**
   - Table Editor → notices
   - 데이터가 실제로 있는지 확인
   - `is_active = true`인지 확인

---

## 📞 추가 도움

위 방법을 시도해도 표시되지 않으면:

1. Supabase Table Editor 스크린샷 (notices 테이블)
2. 브라우저 Console 에러 메시지
3. Admin에서 등록한 공지의 상세 정보

이 정보를 제공하면 더 정확한 도움을 드릴 수 있습니다!
