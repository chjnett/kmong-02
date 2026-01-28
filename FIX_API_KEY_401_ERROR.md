# Supabase API 키 긴급 수정 가이드

## 🚨 문제 진단 완료

**401 Unauthorized 에러 원인:**
1. ❌ 잘못된 Supabase URL: `wwspuuqainspkvwtvoua.supabase.co`
2. ❌ 잘못된 API 키 형식: `sb_publishable_...` (올바른 형식: `eyJ...`)

**올바른 값:**
- ✅ URL: `https://vqlzwgsljcytqoqkznnq.supabase.co`
- ✅ API 키: `eyJ`로 시작하는 긴 문자열

---

## 🔧 즉시 수정 방법

### Step 1: Supabase에서 올바른 API 키 가져오기

1. **https://supabase.com/dashboard** 접속
2. **vqlzwgsljcytqoqkznnq** 프로젝트 선택 (중요!)
3. 왼쪽 사이드바 → **Settings** (⚙️) → **API** 클릭

### Step 2: API 키 복사

**Configuration 섹션에서:**

#### Project URL
```
https://vqlzwgsljcytqoqkznnq.supabase.co
```
복사 버튼 클릭

#### Project API keys 섹션에서:

**anon public 키** (첫 번째 키)
- 라벨: `anon` 또는 `public`
- 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...` (매우 긴 문자열)
- 오른쪽 복사 아이콘 클릭

**service_role secret 키** (두 번째 키)
- 라벨: `service_role` 또는 `secret`
- 👁️ 아이콘 클릭하여 키 표시
- 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...` (매우 긴 문자열)
- 오른쪽 복사 아이콘 클릭

---

### Step 3: `.env.local` 파일 수정

**현재 파일 위치:**
```
c:\웹_크몽\02-에테르나\luxury-curation-app\.env.local
```

**현재 내용 (잘못됨):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://wwspuuqainspkvwtvoua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_usy7xjWs-0WdH3K_a9xI1g_9XR5nfxX
SUPABASE_SERVICE_ROLE_KEY=sb_secret_mrNUtGRv4_RrptMTItnKlw_UNEquqAR
```

**수정 후 (올바름):**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vqlzwgsljcytqoqkznnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ.YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

**⚠️ 주의:**
- 위의 `XXXXXX`와 `YYYYYY` 부분을 **Supabase에서 복사한 실제 키**로 교체하세요!
- 공백이나 줄바꿈이 없도록 주의하세요!

---

### Step 4: 로컬 개발 서버 재시작

```bash
# 현재 서버 중지 (Ctrl + C)
# 재시작
npm run dev
```

---

### Step 5: Vercel 환경 변수 수정

**Vercel 대시보드:**
1. **https://vercel.com** 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**

**각 변수 수정:**

#### NEXT_PUBLIC_SUPABASE_URL
1. 변수 오른쪽 **...** 클릭 → **Edit**
2. Value: `https://vqlzwgsljcytqoqkznnq.supabase.co`
3. Environment: Production, Preview, Development 모두 체크
4. **Save**

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
1. 변수 오른쪽 **...** 클릭 → **Edit**
2. Value: Supabase에서 복사한 `anon` 키 붙여넣기
3. Environment: 모두 체크
4. **Save**

#### SUPABASE_SERVICE_ROLE_KEY
1. 변수 오른쪽 **...** 클릭 → **Edit**
2. Value: Supabase에서 복사한 `service_role` 키 붙여넣기
3. Environment: 모두 체크
4. **Save**

---

### Step 6: Vercel 재배포

**방법 1: Git Push**
```bash
git add .env.local
git commit -m "Fix Supabase API keys"
git push
```

**⚠️ 주의:** `.env.local`은 보통 `.gitignore`에 포함되어 있어서 Git에 올라가지 않습니다.
따라서 **Vercel 환경 변수만 수정**하고 재배포하세요.

**방법 2: Vercel 대시보드에서 수동 재배포**
1. **Deployments** 탭
2. 최근 배포 → **...** → **Redeploy**

---

### Step 7: 테스트

**로컬에서 테스트:**
1. `http://localhost:3000` 접속
2. F12 → Console 확인
3. 401 에러가 사라졌는지 확인

**배포된 사이트에서 테스트:**
1. 배포 완료 후 사이트 접속
2. F12 → Console 확인
3. 401 에러가 사라졌는지 확인

---

## ✅ 확인 체크리스트

### 로컬 환경
- [ ] `.env.local` 파일의 URL이 `vqlzwgsljcytqoqkznnq.supabase.co`
- [ ] ANON_KEY가 `eyJ`로 시작
- [ ] SERVICE_ROLE_KEY가 `eyJ`로 시작
- [ ] 공백이나 줄바꿈 없음
- [ ] 개발 서버 재시작 완료
- [ ] 로컬에서 401 에러 사라짐

### Vercel 환경
- [ ] 3개 환경 변수 모두 수정됨
- [ ] 각 변수가 Production, Preview, Development 모두 체크됨
- [ ] 재배포 완료 (Ready 상태)
- [ ] 배포된 사이트에서 401 에러 사라짐

---

## 🎯 API 키 형식 확인

**올바른 형식:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.XXXXXXXXXXXXXXXXXXXXXXXXX
```

**특징:**
- ✅ `eyJ`로 시작
- ✅ 점(`.`)으로 3부분 구분
- ✅ 매우 긴 문자열 (200자 이상)
- ✅ Base64 인코딩된 JWT 토큰

**잘못된 형식:**
```
sb_publishable_usy7xjWs-0WdH3K_a9xI1g_9XR5nfxX
sb_secret_mrNUtGRv4_RrptMTItnKlw_UNEquqAR
```

**특징:**
- ❌ `sb_`로 시작
- ❌ 짧은 문자열
- ❌ 이것은 Supabase의 **구버전** 또는 **다른 서비스**의 키 형식

---

## 🔍 문제 해결

### 여전히 401 에러가 발생하면

1. **API 키 재확인**
   - Supabase 대시보드에서 키를 다시 복사
   - 복사할 때 공백이 포함되지 않았는지 확인

2. **프로젝트 확인**
   - Supabase에서 **vqlzwgsljcytqoqkznnq** 프로젝트가 맞는지 확인
   - 다른 프로젝트의 키를 사용하고 있지 않은지 확인

3. **환경 변수 이름 확인**
   - `NEXT_PUBLIC_SUPABASE_URL` (정확한 철자)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (정확한 철자)
   - `SUPABASE_SERVICE_ROLE_KEY` (정확한 철자)

4. **서버 재시작 확인**
   - 로컬: `npm run dev` 재실행
   - Vercel: Redeploy 완료 확인

5. **브라우저 캐시 삭제**
   - Ctrl + Shift + Delete
   - 캐시 삭제 후 강제 새로고침

---

## 📞 추가 도움

이 가이드를 따라했는데도 401 에러가 계속 발생하면:

1. Supabase 대시보드 스크린샷 (API 키는 가리고)
2. `.env.local` 파일 내용 (API 키 마지막 10자만 표시)
3. 브라우저 Console의 정확한 에러 메시지

이 정보를 제공하면 더 정확한 도움을 드릴 수 있습니다!
