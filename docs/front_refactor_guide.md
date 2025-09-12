
# Front-end Refactoring Guide (File Structure Only)

## 1. 개요 (Overview)

본 문서는 코드 로직 변경 없이 **파일 및 폴더 이동만으로** 프로젝트 구조를 개선하는 리팩토링 가이드를 제공합니다. 목표는 현재 분산된 파일들을 기능(도메인) 중심으로 그룹화하여 코드의 직관성과 유지보수성을 높이는 것입니다.

## 2. 핵심 원칙: 기능 중심 폴더링 (Feature-based Colocation)

> **"관련된 파일은 한 곳에 모은다."**

`pages`, `components`, `css` 등 역할별로 분산된 구조 대신, **`features`** 라는 최상위 폴더를 만들고 그 안에 각 기능(예: `community`, `dashboard`)에 관련된 모든 파일(페이지, 컴포넌트, 스타일, 훅 등)을 함께 배치합니다.

## 3. 제안 구조 (TO-BE)

```
src/
├── api/                     # (유지) API 요청 함수
├── assets/                  # (변경) icons, images 등 모든 정적 에셋 통합
├── components/              # (변경) 여러 기능이 함께 쓰는 `공용` 컴포넌트만 위치 (예: NavBar)
├── features/                # ✨ (신설) 기능별 도메인 폴더
│   ├── auth/                # --- 인증 기능 --- 
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── styles/          # Login.css, Register.css
│   │
│   ├── community/           # --- 커뮤니티 기능 ---
│   │   ├── Community.js
│   │   ├── Post.js
│   │   ├── Friend.js
│   │   ├── Chat.js
│   │   ├── components/      # (Community 기능 안에서만 쓰이는 컴포넌트)
│   │   │   ├── PostList.js
│   │   │   └── FriendCard.js
│   │   └── styles/          # (Community 기능 관련 CSS)
│   │       ├── Community.css
│   │       ├── Post.css
│   │       └── Chat.css
│   │
│   ├── dashboard/           # --- 대시보드 기능 ---
│   │   ├── Dashboard.js
│   │   ├── components/      # (Dashboard 기능 안에서만 쓰이는 컴포넌트)
│   │   │   ├── DashboardCalendar.js
│   │   │   └── DashboardTodo.js
│   │   └── styles/
│   │       ├── Dashboard.css
│   │       └── DashboardCalendar.css
│   │
│   └── ... (study, evaluation 등 나머지 기능들도 동일한 구조로 그룹화)
│
├── hooks/                   # (유지) 여러 기능이 함께 쓰는 `공용` 훅
├── styles/                  # (변경) 전역 스타일 파일만 위치 (예: index.css)
└── utils/                   # (유지) 공용 유틸리티 함수
```

---

## 4. 단계별 파일 이동 계획 (Migration Plan)

**주의: 파일 이동 후에는 반드시 `import` 경로를 수정해야 합니다.**

### 1단계: 기본 폴더 생성

`src` 폴더 아래에 다음 폴더들을 생성합니다.

- `features`
- `assets`
- `styles` (기존 `css` 폴더와 다름)

### 2단계: 기능별 파일 이동

#### **`auth` (인증) 기능**
- `features/auth` 폴더를 생성합니다.
- `pages/Login.js` → `features/auth/Login.js`
- `pages/Register.js` → `features/auth/Register.js`
- `css/Login.css`, `css/Register.css` → `features/auth/styles/`

#### **`dashboard` (대시보드) 기능**
- `features/dashboard` 폴더를 생성합니다.
- `pages/Dashboard.js` → `features/dashboard/Dashboard.js`
- `components/dashboard/*` → `features/dashboard/components/`
- `css/Dashboard.css`, `styles/DashboardTodo.css` 등 관련 CSS → `features/dashboard/styles/`

#### **`community` (커뮤니티) 기능**
- `features/community` 폴더를 생성합니다.
- `pages/Community/*` (하위 폴더 포함) → `features/community/` 아래에 페이지와 컴포넌트로 재분류합니다.
  - 예: `pages/Community/Community.js` → `features/community/Community.js`
  - 예: `pages/Community/components/PostList.js` → `features/community/components/PostList.js`
- `components/chat/*`, `components/friend/*` → `features/community/components/`
- `css/Community.css`, `css/Chat.css`, `css/Friend.css`, `css/Post.css` 등 관련 CSS → `features/community/styles/`

#### **`study` (학습) 및 `evaluation` (평가) 기능**
- 위와 동일한 방식으로 `features/study`, `features/evaluation` 폴더를 생성하고 관련 파일들을 이동시킵니다.
- `pages/StudyStart.js`, `pages/TeamStudy.js`, `pages/QuizRoom.js` → `features/study/`
- `pages/UnitEvaluation.js`, `pages/UnitEvaluationStart.js` → `features/evaluation/`
- 관련된 `components` 및 `css` 파일들도 각 `features` 폴더 하위로 이동합니다.

### 3단계: 공용 파일 및 스타일 정리

- **공용 컴포넌트**: `NavBar.js` 와 같이 여러 기능에서 공통으로 사용되는 컴포넌트는 `src/components/` 에 그대로 둡니다.
- **전역 스타일**: `index.css`, `style.css` 등 모든 페이지에 영향을 주는 스타일은 `src/styles/` 로 이동합니다.
- **에셋**: `src/icons` 폴더를 `src/assets/icons` 로 이동합니다.

### 4단계: Import 경로 수정

파일 이동이 완료된 후, 에디터의 전체 검색 기능을 사용하여 기존 경로(`../pages`, `../css` 등)를 새로운 `features` 기반 경로로 모두 수정합니다.

## 5. 기대 효과

- **직관성 향상**: 특정 기능을 수정할 때 `features/해당기능` 폴더만 탐색하면 되므로 코드 파악이 빨라집니다.
- **응집도 증가**: 기능과 관련된 파일들이 물리적으로 가까워져 코드의 응집도가 높아집니다.
- **확장성 개선**: 신규 기능 추가 시 `features` 폴더 아래에 새로운 기능 폴더를 만드는 규칙이 생겨 일관성을 유지하기 용이합니다.
