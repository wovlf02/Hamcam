# Git 컨벤션

**관련 문서**: [개발 환경 설정](./setup.md) | [코딩 컨벤션](./coding-conventions.md)

---

## 1. 브랜치 전략

### 1.1 메인 브랜치

| 브랜치 | 용도 |
|--------|------|
| `main` | 프로덕션 릴리스 |
| `develop` | 개발 통합 브랜치 |

### 1.2 보조 브랜치

| 브랜치 패턴 | 용도 | 예시 |
|-------------|------|------|
| `feature/*` | 새 기능 개발 | `feature/login` |
| `fix/*` | 버그 수정 | `fix/session-timeout` |
| `hotfix/*` | 긴급 수정 | `hotfix/security-patch` |
| `docs/*` | 문서 작업 | `docs/api-documentation` |
| `refactor/*` | 리팩토링 | `refactor/auth-service` |

### 1.3 브랜치 생성

```bash
# develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/login

# 작업 완료 후 push
git push origin feature/login
```

---

## 2. 커밋 메시지

### 2.1 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 타입 (Type)

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat(auth): 로그인 기능 구현` |
| `fix` | 버그 수정 | `fix(dashboard): Todo 날짜 오류 수정` |
| `docs` | 문서 변경 | `docs: README 업데이트` |
| `style` | 코드 포맷팅 (기능 변경 없음) | `style: 코드 들여쓰기 정리` |
| `refactor` | 리팩토링 | `refactor(service): 중복 코드 제거` |
| `test` | 테스트 추가/수정 | `test(auth): 로그인 테스트 추가` |
| `chore` | 빌드/설정 변경 | `chore: Gradle 의존성 업데이트` |
| `perf` | 성능 개선 | `perf: API 응답 속도 개선` |

### 2.3 범위 (Scope)

| 범위 | 설명 |
|------|------|
| `auth` | 인증 관련 |
| `dashboard` | 대시보드 |
| `study` | 학습 기능 |
| `community` | 커뮤니티 |
| `evaluation` | 평가 시스템 |
| `rtc` | 실시간 통신 |
| `api` | API 관련 |
| `db` | 데이터베이스 |
| `config` | 설정 |

### 2.4 제목 (Subject)

- 50자 이내
- 명령형 현재 시제 사용 ("추가한다" X → "추가" O)
- 첫 글자 대문자 사용하지 않음
- 마침표 사용하지 않음

### 2.5 본문 (Body)

- 72자마다 줄 바꿈
- "무엇을" "왜" 변경했는지 설명
- 제목과 빈 줄로 구분

### 2.6 꼬리말 (Footer)

- 이슈 참조: `Closes #123`, `Fixes #456`
- Breaking Changes: `BREAKING CHANGE: ...`

### 2.7 예시

```
feat(auth): 세션 기반 로그인 구현

- HttpSession을 사용한 인증 구현
- Redis 세션 저장소 연동
- withCredentials 설정 추가
- LocalStorage에 사용자 정보 캐싱

Closes #42
```

```
fix(dashboard): Todo 완료 상태 토글 오류 수정

userId 파라미터가 누락되어 발생한 오류 수정

Fixes #78
```

```
docs(api): 대시보드 API 문서 추가

- Todo CRUD API 명세 작성
- 시험 일정 API 명세 작성
- 학습 통계 API 명세 작성
```

---

## 3. Pull Request

### 3.1 PR 제목

```
[타입] 간단한 설명
```

예시:
- `[feat] 로그인 기능 구현`
- `[fix] Todo 날짜 오류 수정`
- `[docs] API 문서 추가`

### 3.2 PR 템플릿

```markdown
## 📝 변경 사항

- 변경 내용 1
- 변경 내용 2

## ✅ 체크리스트

- [ ] 코드가 정상 동작함
- [ ] 코딩 컨벤션 준수
- [ ] 테스트 통과
- [ ] 문서 업데이트 (필요시)

## 🔗 관련 이슈

Closes #123

## 📸 스크린샷 (선택)

해당되는 경우 스크린샷 첨부
```

### 3.3 PR 규칙

1. **작은 단위로 PR 생성**: 하나의 기능/수정 당 하나의 PR
2. **Self-review 먼저**: 본인이 먼저 코드 검토
3. **CI 통과 확인**: 테스트/빌드 통과 후 리뷰 요청
4. **충돌 해결**: 머지 전 충돌 해결

---

## 4. 머지 전략

### 4.1 Squash and Merge (권장)

- feature → develop
- 여러 커밋을 하나로 합침
- 깔끔한 히스토리 유지

### 4.2 Merge Commit

- develop → main
- 전체 히스토리 보존

### 4.3 Rebase and Merge

- 선형적인 히스토리 필요 시

---

## 5. 워크플로우

### 5.1 새 기능 개발

```bash
# 1. develop 최신화
git checkout develop
git pull origin develop

# 2. feature 브랜치 생성
git checkout -b feature/new-feature

# 3. 개발 및 커밋
git add .
git commit -m "feat(scope): 기능 설명"

# 4. push
git push origin feature/new-feature

# 5. PR 생성 (GitHub에서)
# feature/new-feature → develop

# 6. 리뷰 후 머지

# 7. 로컬 브랜치 정리
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

### 5.2 버그 수정

```bash
# 1. develop에서 fix 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b fix/bug-description

# 2. 수정 및 커밋
git add .
git commit -m "fix(scope): 버그 수정 설명"

# 3. PR 생성 및 머지
```

### 5.3 긴급 수정 (Hotfix)

```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. 수정 및 커밋
git add .
git commit -m "fix(scope): 긴급 수정"

# 3. main에 PR 생성 및 머지

# 4. develop에도 머지
git checkout develop
git merge hotfix/critical-fix
git push origin develop
```

---

## 6. 유용한 Git 명령어

### 6.1 로그 확인

```bash
# 이쁘게 로그 보기
git log --oneline --graph --decorate

# 특정 파일 히스토리
git log --follow -p -- path/to/file
```

### 6.2 변경 사항 확인

```bash
# 스테이징 전 변경 사항
git diff

# 스테이징 후 변경 사항
git diff --staged
```

### 6.3 커밋 수정

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "새 메시지"

# 마지막 커밋에 파일 추가
git add forgotten-file.js
git commit --amend --no-edit
```

### 6.4 작업 임시 저장

```bash
# 스태시 저장
git stash

# 스태시 목록
git stash list

# 스태시 적용 (유지)
git stash apply

# 스태시 적용 (삭제)
git stash pop
```

### 6.5 브랜치 정리

```bash
# 머지된 로컬 브랜치 삭제
git branch -d branch-name

# 강제 삭제
git branch -D branch-name

# 원격 브랜치 삭제
git push origin --delete branch-name
```

---

## 7. .gitignore

```gitignore
# Java
*.class
*.jar
*.war
build/
.gradle/

# Node.js
node_modules/
npm-debug.log

# IDE
.idea/
.vscode/
*.iml

# OS
.DS_Store
Thumbs.db

# Environment
*.env
*.local

# Logs
*.log
logs/

# Build
dist/
out/

# Test
coverage/
```
