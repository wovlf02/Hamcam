# Face-API 모델 로드 실패 해결 방법

## 문제 상황
- **오류 메시지**: `모델 로드 실패: TypeError: Load failed`
- **발생 위치**: CamStudyPage.js, FocusRoom.js의 face-api.js 모델 로딩 시

## 가능한 원인들

### 1. 네트워크/서버 문제
- **원인**: 개발 서버에서 정적 파일 서빙이 제대로 되지 않음
- **해결**: 
  ```bash
  # React 개발 서버 재시작
  npm start
  # 또는
  yarn start
  ```

### 2. 브라우저 캐시 문제
- **원인**: 이전 버전의 모델 파일이 캐시되어 있음
- **해결**:
  - Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)로 강력 새로고침
  - 개발자 도구(F12) → Network 탭 → "Disable cache" 체크

### 3. CORS 정책 문제
- **원인**: 브라우저의 CORS 정책으로 모델 파일 접근 차단
- **해결**:
  - 개발자 도구 Console에서 CORS 관련 오류 확인
  - 개발 서버 설정 확인

### 4. 모델 파일 경로 문제
- **원인**: public/models 폴더의 파일들이 제대로 서빙되지 않음
- **해결**:
  - 브라우저에서 직접 접근 테스트: `http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json`
  - 404 오류가 나면 파일 경로나 서버 설정 문제

### 5. 모델 파일 손상
- **원인**: 다운로드 과정에서 파일이 손상됨
- **해결**:
  - 모델 파일들을 다시 다운로드
  - 공식 face-api.js 저장소에서 최신 모델 파일 받기

## 진단 방법

### 개발자 콘솔에서 실행:
```javascript
// 1. 모델 파일 상태 확인
ModelChecker.diagnose()

// 2. 환경 정보 확인
ModelChecker.logEnvironmentInfo()

// 3. 수동으로 모델 파일 접근 테스트
fetch('/models/ssd_mobilenetv1_model-weights_manifest.json')
  .then(r => console.log('Status:', r.status, r.ok))
  .catch(e => console.error('Error:', e))
```

## 임시 해결책

### 모델 로딩을 건너뛰는 옵션 추가:
```javascript
// 개발 중에만 사용
const SKIP_FACE_DETECTION = true; // 개발용

useEffect(() => {
  if (SKIP_FACE_DETECTION) {
    console.log('Face detection 건너뜀 (개발 모드)');
    setModelsLoaded(true);
    return;
  }
  
  ModelLoader.loadModels().then(...);
}, []);
```

## 완전한 해결책

### 1. 모델 파일 재설치:
```bash
# public/models 폴더 삭제 후 재생성
rm -rf public/models
mkdir public/models

# face-api.js 모델 파일 다운로드
# (공식 GitHub 저장소에서)
```

### 2. 대체 CDN 사용:
```javascript
// ModelLoader.js에서 CDN 경로 추가
const modelPaths = [
  '/models',
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
];
```

## 확인 사항
- [ ] 개발 서버가 제대로 실행 중인가?
- [ ] public/models 폴더에 8개 파일이 모두 있는가?
- [ ] 브라우저 콘솔에 다른 오류가 있는가?
- [ ] 네트워크 탭에서 모델 파일 요청 상태는?