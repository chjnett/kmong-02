# Supabase 환경 변수 수정 가이드 (안전한 방법)

## 🎯 목표
잘못된 Supabase 프로젝트 연결을 올바른 프로젝트로 수정하여 404/401 에러 해결

## ⚠️ 중요 사항
- ✅ **데이터는 절대 삭제되지 않습니다**
- ✅ 기존 상품 데이터는 그대로 유지됩니다
- ✅ 단지 연결 주소만 수정합니다

---

## 📋 Step 1: 현재 상태 백업 (선택사항, 안전을 위해)

### 1-1. 현재 `.env.local` 파일 백업

```bash
# 터미널에서 실행
cp .env.local .env.local.backup
```

또는 수동으로:
1. `.env.local` 파일 열기
2. 내용 전체 복사
3. 메모장에 붙여넣기
4. `env.local.backup.txt`로 저장

---

## 📋 Step 2: Supabase에서 올바른 API 키 가져오기

### 2-1. Supabase 대시보드 접속

1. 브라우저에서 **https://supabase.com/dashboard** 접속
2. 로그인 (이미 로그인되어 있을 수 있음)

### 2-2. 올바른 프로젝트 선택

프로젝트 목록에서 **URL에 `vqlzwgsljcytqoqkznnq`가 포함된 프로젝트** 클릭

> 💡 **확인 방법**: 프로젝트 이름 아래에 작은 글씨로 URL이 표시됩니다

### 2-3. 기존 데이터 확인 (안심용)

1. 왼쪽 사이드바 → **Table Editor** 클릭
2. **products** 테이블 클릭
3. 상품 데이터가 그대로 있는지 확인 ✅
4. **categories**, **sub_categories** 테이블도 확인

> ✅ 데이터가 모두 있으면 정상입니다!

### 2-4. API 키 복사

1. 왼쪽 사이드바 → **Settings** (⚙️ 아이콘) 클릭
2. **API** 메뉴 클릭
3. **Project API keys** 섹션 찾기

**복사할 키 2개:**

#### ① Project URL
```
https://vqlzwgsljcytqoqkznnq.supabase.co
```
- 이미 맞게 수정되어 있음 ✅

#### ② anon public 키
- **`anon`** 또는 **`public`** 라벨이 붙은 키
- 매우 긴 문자열 (보통 `eyJ`로 시작)
- 오른쪽 **복사 아이콘** 클릭하여 복사
- 메모장에 임시 저장

#### ③ service_role secret 키
- **`service_role`** 또는 **`secret`** 라벨이 붙은 키
- 역시 매우 긴 문자열
- **👁️ 아이콘** 클릭하여 키 표시
- 오른쪽 **복사 아이콘** 클릭하여 복사
- 메모장에 임시 저장

---

## 📋 Step 3: 로컬 환경 변수 수정

### 3-1. `.env.local` 파일 열기

VS Code에서:
1. 프로젝트 루트 폴더에서 `.env.local` 파일 찾기
2. 파일 열기

### 3-2. API 키 붙여넣기

**현재 파일 내용:**
```bash
# Supabase Configuration
# Update these with your actual project credentials from Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://vqlzwgsljcytqoqkznnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
```

**수정 방법:**
1. `YOUR_ACTUAL_ANON_KEY_HERE` 부분을 **Step 2-4 ②에서 복사한 anon 키**로 교체
2. `YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE` 부분을 **Step 2-4 ③에서 복사한 service_role 키**로 교체

**수정 후 예시:**
```bash
# Supabase Configuration
# Update these with your actual project credentials from Supabase Dashboard > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://vqlzwgsljcytqoqkznnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NDU2MDAsImV4cCI6MjAxNDMyMTYwMH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbHp3Z3NsamN5dHFvcWt6bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODc0NTYwMCwiZXhwIjoyMDE0MzIxNjAwfQ.YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### 3-3. 파일 저장

- **Ctrl + S** (Windows) 또는 **Cmd + S** (Mac)
- 파일 탭에 흰색 점이 사라지면 저장 완료 ✅

---

## 📋 Step 4: 로컬 개발 서버 재시작

### 4-1. 현재 서버 중지

터미널에서:
- **Ctrl + C** 눌러서 서버 중지
- "Terminate batch job (Y/N)?" 나오면 **Y** 입력

### 4-2. 서버 재시작

```bash
npm run dev
```

### 4-3. 브라우저에서 확인

1. **http://localhost:3000** 접속
2. **Ctrl + Shift + R** (강제 새로고침)
3. 개발자 도구 열기 (**F12**)
4. **Console** 탭 확인

**성공 시:**
- ✅ 404 에러 사라짐
- ✅ 401 에러 사라짐
- ✅ 상품 데이터 정상 표시

**여전히 에러가 있다면:**
- Console에 표시된 에러 메시지 확인
- API 키를 다시 한 번 확인 (공백이나 줄바꿈이 없는지)

---

## 📋 Step 5: Vercel 배포 환경 변수 수정

### 5-1. Vercel 대시보드 접속

1. **https://vercel.com** 접속
2. 로그인
3. 프로젝트 선택 (에테르나 프로젝트)

### 5-2. 환경 변수 페이지 이동

1. 상단 메뉴 → **Settings** 클릭
2. 왼쪽 사이드바 → **Environment Variables** 클릭

### 5-3. 기존 변수 확인

다음 3개 변수가 있는지 확인:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 5-4. 변수 수정

**각 변수마다:**

#### ① NEXT_PUBLIC_SUPABASE_URL 수정

1. 변수 오른쪽 **...** (점 3개) 클릭
2. **Edit** 클릭
3. **Value** 필드에 입력:
   ```
   https://vqlzwgsljcytqoqkznnq.supabase.co
   ```
4. **Environment** 체크:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Save** 클릭

#### ② NEXT_PUBLIC_SUPABASE_ANON_KEY 수정

1. 변수 오른쪽 **...** 클릭
2. **Edit** 클릭
3. **Value** 필드에 **Step 2-4 ②에서 복사한 anon 키** 붙여넣기
4. **Environment** 모두 체크
5. **Save** 클릭

#### ③ SUPABASE_SERVICE_ROLE_KEY 수정

1. 변수 오른쪽 **...** 클릭
2. **Edit** 클릭
3. **Value** 필드에 **Step 2-4 ③에서 복사한 service_role 키** 붙여넣기
4. **Environment** 모두 체크
5. **Save** 클릭

### 5-5. 재배포

**방법 1: Vercel 대시보드에서**
1. 상단 **Deployments** 탭 클릭
2. 가장 최근 배포 찾기
3. 오른쪽 **...** 클릭
4. **Redeploy** 클릭
5. **Redeploy** 버튼 다시 클릭 (확인)

**방법 2: Git push로 (권장)**
```bash
# 터미널에서 실행
git add .env.local
git commit -m "Update Supabase credentials"
git push
```

> ⚠️ **주의**: `.env.local`은 보통 `.gitignore`에 포함되어 있어서 Git에 올라가지 않습니다. 
> 환경 변수는 Vercel 대시보드에서만 수정하면 됩니다.

### 5-6. 배포 완료 대기

1. Vercel 대시보드 → **Deployments** 탭
2. 배포 상태 확인:
   - 🟡 **Building**: 빌드 중
   - 🟢 **Ready**: 배포 완료 ✅
3. 보통 **1-3분** 소요

---

## 📋 Step 6: 배포된 사이트 확인

### 6-1. 배포 URL 접속

1. Vercel 대시보드에서 **Visit** 버튼 클릭
2. 또는 직접 배포 URL 접속 (예: `https://your-project.vercel.app`)

### 6-2. 브라우저 캐시 삭제

1. **Ctrl + Shift + Delete** (Windows) 또는 **Cmd + Shift + Delete** (Mac)
2. **캐시된 이미지 및 파일** 체크
3. **시간 범위**: 전체 기간
4. **데이터 삭제** 클릭

### 6-3. 강제 새로고침

- **Ctrl + Shift + R** (Windows)
- **Cmd + Shift + R** (Mac)

### 6-4. 개발자 도구로 확인

1. **F12** 눌러서 개발자 도구 열기
2. **Console** 탭 확인
3. **Network** 탭 확인

**성공 시:**
- ✅ 404 에러 없음
- ✅ 401 에러 없음
- ✅ 상품 데이터 정상 표시
- ✅ 공지사항 팝업 정상 작동 (있다면)

---

## 🎉 완료 확인

### 체크리스트

- [ ] 로컬 환경에서 404/401 에러 사라짐
- [ ] 로컬 환경에서 상품 데이터 정상 표시
- [ ] Vercel 환경 변수 수정 완료
- [ ] 배포 완료 (Ready 상태)
- [ ] 배포된 사이트에서 404/401 에러 사라짐
- [ ] 배포된 사이트에서 상품 데이터 정상 표시

**모두 체크되면 성공!** 🎊

---

## 🚨 문제 해결

### 여전히 404 에러가 발생하면

1. **API 키 재확인**
   - Supabase 대시보드에서 키를 다시 복사
   - 공백이나 줄바꿈이 없는지 확인

2. **notices 테이블 생성 확인**
   - Supabase → Table Editor → `notices` 테이블 존재 확인
   - 없으면 `TROUBLESHOOTING_NOTICES_404.md` 참고

3. **RLS 정책 확인**
   ```sql
   -- Supabase SQL Editor에서 실행
   SELECT * FROM pg_policies WHERE tablename = 'notices';
   ```

### 여전히 401 에러가 발생하면

1. **API 키 형식 확인**
   - `eyJ`로 시작하는지 확인
   - 매우 긴 문자열인지 확인 (200자 이상)

2. **환경 변수 이름 확인**
   - `NEXT_PUBLIC_SUPABASE_URL` (정확한 철자)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (정확한 철자)
   - `SUPABASE_SERVICE_ROLE_KEY` (정확한 철자)

3. **서버 재시작 확인**
   - 로컬: `npm run dev` 재실행
   - Vercel: Redeploy 완료 확인

---

## 📞 추가 도움

위 모든 단계를 따라했는데도 문제가 해결되지 않으면:

1. 개발자 도구 Console의 **정확한 에러 메시지** 복사
2. Supabase 대시보드 → Table Editor에서 **products 테이블 스크린샷**
3. `.env.local` 파일 내용 (API 키는 마지막 10자만 표시)

이 정보를 제공하면 더 정확한 도움을 드릴 수 있습니다!
