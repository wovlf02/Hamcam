# 프로젝트 CSS 디자인 및 스타일 개선 방향성

## 1. 개요 (Overview)

본 문서는 Hamcam 프로젝트의 프론트엔드 CSS 디자인 및 스타일을 전반적으로 개선하기 위한 구체적인 방향성을 제시합니다. 최신 Google SaaS 스타일, 클레이모피즘(Claymorphism), 그리고 Zoom 플랫폼의 UI/UX 요소를 참고하여, 사용자에게 더욱 현대적이고 직관적이며 매력적인 학습 경험을 제공하는 것을 목표로 합니다. 기존 기능은 유지하되, 시각적 완성도와 사용자 인터랙션의 질을 향상시키는 데 중점을 둡니다.

## 2. 디자인 철학 및 핵심 원칙 (Design Philosophy & Core Principles)

세 가지 주요 레퍼런스(Google SaaS, Claymorphism, Zoom)의 장점을 융합하여 다음과 같은 디자인 철학을 수립합니다.

*   **기능적 우아함 (Functional Elegance - Google SaaS):**
    *   **명확성:** 정보의 위계질서를 명확히 하고, 사용자가 필요한 정보를 쉽게 찾을 수 있도록 합니다.
    *   **간결함:** 불필요한 장식 요소를 최소화하고, 충분한 여백을 활용하여 시각적 피로도를 줄입니다.
    *   **일관성:** 전반적인 UI 요소(버튼, 입력 필드, 카드 등)의 스타일을 통일하여 학습 부담을 줄이고 예측 가능한 경험을 제공합니다.
    *   **반응성:** 다양한 디바이스와 화면 크기에서 최적화된 레이아웃과 인터랙션을 제공합니다.

*   **친근한 입체감 (Friendly Tactility - Claymorphism):**
    *   **부드러운 형태:** 둥근 모서리와 유기적인 형태를 사용하여 친근하고 포근한 느낌을 줍니다.
    *   **깊이감:** 부드러운 내부 그림자와 외부 그림자를 활용하여 요소에 은은한 입체감을 부여하고, 중요한 요소에 시각적 강조를 더합니다.
    *   **즐거움:** 학습이라는 다소 딱딱할 수 있는 주제에 재미있고 매력적인 시각적 요소를 더하여 사용자 참여를 유도합니다.

*   **집중과 소통 (Focus & Connection - Zoom Platform):**
    *   **핵심 기능 강조:** 학습 및 소통의 핵심 요소(비디오 피드, 채팅, 공유 콘텐츠)를 명확하게 부각시킵니다.
    *   **직관적인 제어:** 미디어 제어(마이크, 카메라, 화면 공유) 및 참여자 관리 기능을 쉽고 빠르게 접근할 수 있도록 디자인합니다.
    *   **방해 요소 최소화:** 학습 및 협업 중 불필요한 시각적 방해 요소를 줄이고, 콘텐츠에 집중할 수 있는 환경을 조성합니다.

## 3. 디자인 시스템 요소 (Design System Elements)

### 3.1. 색상 팔레트 (Color Palette)

기존 `teamstudy_style.md`에서 제안된 색상을 기반으로 확장하고, Google SaaS 및 Claymorphism의 특징을 반영합니다.

*   **Primary Colors:**
    *   `--primary-blue-500`: `#4A85F6` (메인 액션, 강조)
    *   `--primary-blue-700`: `#3B6ACF` (호버, 활성 상태)
    *   `--primary-blue-100`: `#D9E5FC` (배경, 보조 요소)
*   **Accent Colors:**
    *   `--accent-green-500`: `#34A853` (성공, 긍정적 액션)
    *   `--accent-yellow-500`: `#FBBC04` (경고, 대기)
    *   `--accent-red-500`: `#EA4335` (에러, 부정적 액션)
*   **Neutral Colors (Google SaaS 기반):**
    *   `--gray-900`: `#202124` (본문 텍스트, 가장 어두운 색)
    *   `--gray-700`: `#5F6368` (보조 텍스트, 아이콘)
    *   `--gray-500`: `#9AA0A6` (비활성 텍스트, 구분선)
    *   `--gray-300`: `#DADBDE` (테두리, 구분선)
    *   `--gray-100`: `#F0F2F5` (주요 배경색)
    *   `--white`: `#FFFFFF` (카드 배경, 모달 배경)
*   **Shadows (Claymorphism 기반):**
    *   `--clay-shadow-inner`: `inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.7)`
    *   `--clay-shadow-outer`: `5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.7)`
    *   `--clay-shadow-hover`: `8px 8px 15px rgba(0, 0, 0, 0.15), -8px -8px 15px rgba(255, 255, 255, 0.8)` (호버 시 더 깊은 그림자)

### 3.2. 타이포그래피 (Typography)

가독성과 정보 위계에 중점을 둡니다.

*   **Font Family:** `'Pretendard', 'Noto Sans KR', 'Roboto', sans-serif` (한글/영문 모두 고려)
*   **Headings (H1-H6):**
    *   `H1`: 2.5rem (40px), `font-weight: 700`
    *   `H2`: 2rem (32px), `font-weight: 700`
    *   `H3`: 1.75rem (28px), `font-weight: 600`
    *   `H4`: 1.5rem (24px), `font-weight: 600`
    *   `H5`: 1.25rem (20px), `font-weight: 500`
    *   `H6`: 1rem (16px), `font-weight: 500`
*   **Body Text:**
    *   `--font-size-body-large`: 1.125rem (18px), `line-height: 1.6`
    *   `--font-size-body-medium`: 1rem (16px), `line-height: 1.5`
    *   `--font-size-body-small`: 0.875rem (14px), `line-height: 1.4`
*   **Caption/Label:** 0.75rem (12px), `font-weight: 400`, `--gray-700`

### 3.3. 간격 및 여백 (Spacing & Layout)

8pt 그리드 시스템을 기반으로 일관된 간격을 유지합니다.

*   **Spacing Scale:** `4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px` 등 4의 배수 또는 8의 배수 사용.
*   **Container Max Width:** `1200px` 또는 `1440px` (콘텐츠 밀도에 따라 조절)
*   **Gutter:** `24px` 또는 `32px` (컬럼 간 간격)

### 3.4. 컴포넌트 스타일링 가이드라인 (Component Styling Guidelines)

#### 3.4.1. 버튼 (Buttons)

*   **기본 스타일:** 둥근 모서리 (`border-radius: 12px` 또는 `16px`), `--primary-blue-500` 배경, `--white` 텍스트.
*   **Claymorphism 효과:** `--clay-shadow-outer` 적용.
*   **호버/활성:** 배경색 `--primary-blue-700`으로 변경, `--clay-shadow-hover` 적용 (살짝 떠오르는 느낌).
*   **보조 버튼:** `--gray-100` 배경, `--gray-700` 텍스트, `--clay-shadow-outer` 적용. 호버 시 배경색 `--gray-300`으로 변경.
*   **아이콘 버튼:** Zoom 스타일을 참고하여 간결하고 명확한 아이콘 사용.

#### 3.4.2. 카드 (Cards)

*   **기본 스타일:** `--white` 배경, 둥근 모서리 (`border-radius: 16px` 또는 `20px`).
*   **Claymorphism 효과:** `--clay-shadow-outer` 적용하여 부드러운 입체감 부여.
*   **콘텐츠 배치:** 충분한 `padding`과 `margin`을 사용하여 콘텐츠 간의 시각적 분리 및 가독성 확보.
*   **인터랙티브 카드 (예: 스터디방 카드):** 호버 시 `--clay-shadow-hover` 적용 및 `transform: translateY(-3px)`와 같은 미묘한 상승 효과 추가.

#### 3.4.3. 입력 필드 (Input Fields)

*   **기본 스타일:** `--white` 배경, `--gray-300` 테두리, 둥근 모서리 (`border-radius: 8px` 또는 `12px`).
*   **포커스 상태:** `--primary-blue-500` 테두리 강조, `--clay-shadow-inner` 적용하여 살짝 눌린 듯한 느낌.
*   **플레이스홀더:** `--gray-500` 색상으로 명확하게 표시.

#### 3.4.4. 모달 (Modals)

*   **배경:** `rgba(0, 0, 0, 0.5)` 또는 `rgba(0, 0, 0, 0.7)`와 같은 어두운 오버레이로 콘텐츠에 집중.
*   **모달 창:** `--white` 배경, 둥근 모서리 (`border-radius: 20px`), `--clay-shadow-outer` 적용.
*   **헤더/푸터:** 명확한 구분선과 액션 버튼 배치.

#### 3.4.5. 내비게이션 (Navigation - `NavBar.js`)

*   **Google SaaS 스타일:** 좌측 고정 내비게이션 바는 간결하고 기능적인 디자인을 유지.
*   **아이콘:** `react-icons`를 활용하여 통일된 스타일의 아이콘 사용.
*   **활성 상태:** `--primary-blue-100` 배경색과 `--primary-blue-500` 텍스트/아이콘 색상으로 현재 페이지를 명확히 표시.

### 3.5. 인터랙션 및 애니메이션 (Interaction & Animation)

*   **Transition:** 모든 `hover`, `focus`, `active` 상태 변화에 `transition: all 0.2s ease-in-out;`와 같은 부드러운 전환 효과 적용.
*   **Micro-interactions:** 버튼 클릭, 입력 필드 포커스 등 사용자 행동에 대한 미묘한 시각적 피드백 제공.
*   **로딩 스피너/스켈레톤 UI:** 데이터 로딩 시 사용자 경험을 개선하기 위한 시각적 요소 도입.

## 4. 주요 영역별 적용 방안 (Application to Key Areas)

### 4.1. 대시보드 (`Dashboard.js`)

*   **위젯/카드:** 각 위젯(캘린더, 할 일, D-Day, 통계 등)을 Claymorphism 스타일의 카드로 구성.
*   **데이터 시각화:** `recharts`를 활용한 통계 차트는 Google SaaS 스타일의 깔끔하고 정보 전달력 높은 디자인을 지향.
*   **할 일 목록:** 체크박스, 텍스트, 액션 버튼 등 각 요소에 Claymorphism의 부드러운 형태와 그림자 적용.

### 4.2. 커뮤니티 (`Community.js`, `Post.js`, `Chat.js`)

*   **게시글/댓글 카드:** Claymorphism 스타일의 카드로 구성하여 콘텐츠의 가독성 및 시각적 매력도 향상.
*   **채팅 UI:** Zoom 플랫폼의 채팅 UI를 참고하여 메시지 버블, 사용자 아바타, 시간 표시 등을 명확하고 간결하게 디자인.
*   **친구 목록:** 온라인/오프라인 상태를 명확히 표시하고, 프로필 이미지에 둥근 형태 적용.

### 4.3. 팀 스터디 (`TeamStudy.js`, `FocusRoom.js`, `QuizRoom.js`)

*   **스터디방 목록 (`TeamStudy.js`):** `teamstudy_style.md`에서 제안된 카드 기반 레이아웃을 Claymorphism 스타일로 구현. 필터 및 검색 UI는 Google SaaS 스타일의 간결함을 따름.
*   **실시간 학습방 (`FocusRoom.js`, `QuizRoom.js`):**
    *   **비디오 그리드:** Zoom의 참여자 그리드 레이아웃을 참고하여 각 참여자의 비디오 피드를 명확하게 표시.
    *   **제어 바:** 마이크, 카메라, 화면 공유 등 핵심 제어 버튼은 Zoom과 유사하게 하단에 배치하고, 아이콘과 텍스트를 명확하게 제공.
    *   **채팅/참여자 목록:** 사이드바 형태로 배치하여 메인 콘텐츠(비디오)를 방해하지 않도록 디자인.
    *   **퀴즈/포커스 요소:** 퀴즈 문제, 타이머, 랭킹 등 학습 관련 요소는 Claymorphism 스타일을 적용하여 시각적 흥미 유발.

## 5. 구현 전략 (Implementation Strategy)

1.  **글로벌 스타일 정의:** `front/src/index.css` 또는 `front/src/global/styles/style.css`에 위에서 정의된 색상 변수, 폰트 스택, 기본 타이포그래피, 공통 그림자 효과 등을 CSS 변수(`--`)로 정의하여 전역적으로 사용 가능하게 합니다.
2.  **컴포넌트별 스타일 적용:** 각 기능(`features` 폴더 내)의 `styles` 디렉터리에 있는 CSS 파일들을 수정하여, 해당 컴포넌트에 맞는 디자인 시스템 요소를 적용합니다.
3.  **`styled-components` 활용 (선택 사항):** 현재 프로젝트에 `styled-components` 의존성이 있으므로, 복잡하거나 재사용성이 높은 컴포넌트의 경우 `styled-components`를 활용하여 CSS-in-JS 방식으로 스타일을 관리하는 것을 고려할 수 있습니다. 이는 기존 CSS 파일과의 조화를 고려하여 점진적으로 도입합니다.
4.  **반응형 디자인:** `@media` 쿼리를 사용하여 모바일, 태블릿, 데스크톱 등 다양한 화면 크기에 대응하는 반응형 디자인을 구현합니다.
5.  **테스트 및 피드백:** 각 컴포넌트 및 페이지별로 디자인 변경 사항을 테스트하고, 사용자 피드백을 통해 지속적으로 개선합니다.

이 개선 방향성을 통해 Hamcam 프로젝트는 사용자에게 더욱 매력적이고 효율적인 학습 환경을 제공할 수 있을 것입니다.
