# Vercel Redeploy 시 Supabase 환경 변수 추가 가이드

## 🎯 목표
Vercel에서 재배포할 때 Supabase 환경 변수를 올바르게 설정하여 배포된 사이트가 정상 작동하도록 함

---

## 📋 방법 1: Vercel 대시보드에서 환경 변수 추가 (권장)

### Step 1: Vercel 대시보드 접속

1. **https://vercel.com** 접속
2. 로그인
3. 프로젝트 선택 (에테르나 프로젝트)

### Step 2: Settings 페이지 이동

1. 프로젝트 상단 메뉴에서 **Settings** 클릭
2. 왼쪽 사이드바에서 **Environment Variables** 클릭

### Step 3: 환경 변수 추가

#### 변수 1: NEXT_PUBLIC_SUPABASE_URL

1. **Add New** 버튼 클릭 (또는 **+ Add Variable**)
2. 입력 필드 작성:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://vqlzwgsljcytqoqkznnq.supabase.co`
3. **Environment** 선택:
   - ✅ **Production** (체크)
   - ✅ **Preview** (체크)
   - ✅ **Development** (체크)
4. **Save** 버튼 클릭

#### 변수 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

1. **Add New** 버튼 클릭
2. 입력 필드 작성:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `[Supabase에서 복사한 anon 키]`
     ```
     예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NDU2MDAsImV4cCI6MjAxNDMyMTYwMH0.XXXXXXXXX
     ```
3. **Environment** 선택:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
4. **Save** 버튼 클릭

#### 변수 3: SUPABASE_SERVICE_ROLE_KEY

1. **Add New** 버튼 클릭
2. 입력 필드 작성:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: `[Supabase에서 복사한 service_role 키]`
     ```
     예: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODc0NTYwMCwiZXhwIjoyMDE0MzIxNjAwfQ.YYYYYYYYY
     ```
3. **Environment** 선택:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
4. **Save** 버튼 클릭

### Step 4: 환경 변수 확인

**Environment Variables** 페이지에서 다음 3개 변수가 표시되는지 확인:

```
NEXT_PUBLIC_SUPABASE_URL          Production, Preview, Development
NEXT_PUBLIC_SUPABASE_ANON_KEY     Production, Preview, Development
SUPABASE_SERVICE_ROLE_KEY         Production, Preview, Development
```

### Step 5: Redeploy

환경 변수를 추가한 후 **반드시 재배포**해야 적용됩니다!

#### 방법 A: 자동 재배포 (Git Push)

```bash
# 터미널에서 실행
git add .
git commit -m "Update environment variables"
git push
```

Git push 시 Vercel이 자동으로 재배포를 시작합니다.

#### 방법 B: 수동 재배포 (Vercel 대시보드)

1. 상단 메뉴 → **Deployments** 클릭
2. 가장 최근 배포 찾기
3. 오른쪽 **...** (점 3개) 클릭
4. **Redeploy** 선택
5. 확인 팝업에서 **Redeploy** 버튼 클릭

### Step 6: 배포 완료 대기

1. **Deployments** 탭에서 배포 상태 확인
2. 상태 변화:
   - 🟡 **Queued**: 대기 중
   - 🟡 **Building**: 빌드 중 (1-2분)
   - 🟡 **Deploying**: 배포 중
   - 🟢 **Ready**: 배포 완료 ✅

### Step 7: 배포된 사이트 확인

1. **Visit** 버튼 클릭 또는 배포 URL 접속
2. **Ctrl + Shift + R** (강제 새로고침)
3. 개발자 도구 (F12) → Console 확인
4. 404/401 에러가 사라졌는지 확인 ✅

---

## 📋 방법 2: Vercel CLI로 환경 변수 추가

### Step 1: Vercel CLI 설치 (처음 한 번만)

```bash
npm install -g vercel
```

### Step 2: Vercel 로그인

```bash
vercel login
```

이메일 또는 GitHub 계정으로 로그인

### Step 3: 프로젝트 연결

```bash
cd c:\웹_크몽\02-에테르나\luxury-curation-app
vercel link
```

프로젝트를 선택하라는 메시지가 나오면 에테르나 프로젝트 선택

### Step 4: 환경 변수 추가

```bash
# Production 환경에 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 값 입력: https://vqlzwgsljcytqoqkznnq.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 값 입력: [Supabase anon 키]

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 값 입력: [Supabase service_role 키]
```

**Preview와 Development 환경에도 추가:**

```bash
# Preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview

# Development
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

### Step 5: 환경 변수 확인

```bash
vercel env ls
```

추가한 변수들이 표시되는지 확인

### Step 6: Redeploy

```bash
vercel --prod
```

또는

```bash
git push
```

---

## 📋 방법 3: .env 파일 직접 업로드 (비추천)

⚠️ **보안상 권장하지 않음** - API 키가 Git에 노출될 수 있음

대신 **방법 1** 또는 **방법 2**를 사용하세요.

---

## 🔍 Supabase API 키 찾는 방법 (복습)

### Step 1: Supabase 대시보드 접속

1. **https://supabase.com/dashboard** 접속
2. **vqlzwgsljcytqoqkznnq** 프로젝트 선택

### Step 2: API 키 페이지 이동

1. 왼쪽 사이드바 → **Settings** (⚙️)
2. **API** 클릭

### Step 3: API 키 복사

**Project API keys** 섹션에서:

#### Project URL
```
https://vqlzwgsljcytqoqkznnq.supabase.co
```

#### anon public 키
- **`anon`** 또는 **`public`** 라벨
- 오른쪽 복사 아이콘 클릭
- 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### service_role secret 키
- **`service_role`** 또는 **`secret`** 라벨
- 👁️ 아이콘 클릭하여 키 표시
- 오른쪽 복사 아이콘 클릭
- 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## ✅ 환경 변수 설정 확인 체크리스트

### Vercel 대시보드에서 확인

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 추가됨
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가됨
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 추가됨
- [ ] 각 변수가 **Production, Preview, Development** 모두 체크됨
- [ ] 값이 올바르게 입력됨 (공백 없음, 줄바꿈 없음)

### 재배포 확인

- [ ] Redeploy 실행됨
- [ ] 배포 상태가 **Ready** (녹색)
- [ ] 배포된 사이트 접속 가능
- [ ] 404/401 에러 사라짐
- [ ] 상품 데이터 정상 표시

---

## 🚨 자주 발생하는 실수

### 1. 환경 변수 이름 오타

❌ **잘못된 예:**
```
NEXT_PUBLIC_SUPABASE_URl  (L이 소문자)
NEXT_PUBLC_SUPABASE_ANON_KEY  (I 빠짐)
SUPABASE_SERVICEROLE_KEY  (언더스코어 빠짐)
```

✅ **올바른 예:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### 2. API 키에 공백 포함

❌ **잘못된 예:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. eyJpc3M...
(중간에 공백)
```

✅ **올바른 예:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
(공백 없음)
```

### 3. Environment 선택 안 함

❌ **잘못된 예:**
- Production만 체크
- 또는 아무것도 체크 안 함

✅ **올바른 예:**
- ✅ Production
- ✅ Preview
- ✅ Development
- **모두 체크!**

### 4. Redeploy 안 함

환경 변수를 추가/수정한 후 **반드시 재배포**해야 적용됩니다!

❌ 환경 변수만 추가하고 재배포 안 함
✅ 환경 변수 추가 → **Redeploy** 실행

---

## 🎯 빠른 요약

### 가장 쉬운 방법 (추천)

1. **Vercel 대시보드** → **Settings** → **Environment Variables**
2. **Add New** 클릭하여 3개 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. 각 변수마다 **Production, Preview, Development** 모두 체크
4. **Deployments** → **Redeploy** 실행
5. 배포 완료 후 사이트 확인 ✅

---

## 📞 추가 도움

환경 변수를 추가했는데도 여전히 404/401 에러가 발생하면:

1. **API 키 재확인**
   - Supabase에서 키를 다시 복사
   - 공백이나 특수문자 확인

2. **Environment 선택 확인**
   - Production, Preview, Development 모두 체크되었는지

3. **Redeploy 확인**
   - 배포가 완료되었는지 (Ready 상태)
   - 최신 배포인지 확인

4. **브라우저 캐시 삭제**
   - Ctrl + Shift + Delete
   - 캐시 삭제 후 강제 새로고침

그래도 안 되면 `SUPABASE_CREDENTIALS_UPDATE_GUIDE.md` 참고!
