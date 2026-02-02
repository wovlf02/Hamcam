# Face API 학습 측정

**관련 문서**: [대시보드 기능](./dashboard.md) | [AI 기능](./ai-features.md)

---

## 1. 개요

Face API(face-api.js)를 활용하여 사용자의 얼굴을 실시간으로 감지하고, 실제 학습 시간을 자동으로 측정합니다.

### 1.1 핵심 기능

- **실시간 얼굴 감지**: 카메라 스트림에서 얼굴 감지
- **자동 타이머 제어**: 얼굴 감지 상태에 따라 타이머 시작/정지
- **학습 시간 기록**: 측정된 시간을 백엔드 API로 저장
- **집중도 측정**: 실제 모니터 앞에서 공부한 시간만 기록

### 1.2 사용 페이지

- **CamStudyPage**: 개인 학습 시간 측정
- **FocusRoom**: 팀 스터디 집중 경쟁방

---

## 2. 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| face-api.js | ^0.22.2 | 브라우저 기반 얼굴 인식 |
| TensorFlow.js | (내장) | ML 모델 실행 |
| getUserMedia API | - | 카메라 스트림 획득 |

---

## 3. 모델 파일

### 3.1 모델 위치

```
front/public/models/
├── face_landmark_68_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── ssd_mobilenetv1_model-shard1
├── ssd_mobilenetv1_model-shard2
├── ssd_mobilenetv1_model-weights_manifest.json
├── tiny_face_detector_model-shard1
└── tiny_face_detector_model-weights_manifest.json
```

### 3.2 사용 모델

| 모델 | 용도 |
|------|------|
| **TinyFaceDetector** | 빠른 얼굴 감지 (권장) |
| **SSD Mobilenet V1** | 정확한 얼굴 감지 |
| **Face Landmark 68** | 얼굴 특징점 (선택) |

---

## 4. 구현

### 4.1 모델 로드

```javascript
import * as faceapi from 'face-api.js';

const loadModels = async () => {
    const MODEL_URL = '/models';
    
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    
    console.log('Face API 모델 로드 완료');
};
```

### 4.2 카메라 스트림 획득

```javascript
const startVideo = async (videoRef) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        videoRef.current.srcObject = stream;
        return stream;
    } catch (error) {
        console.error('카메라 접근 실패:', error);
        throw error;
    }
};
```

### 4.3 실시간 얼굴 감지

```javascript
const detectFace = async (videoRef) => {
    const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5
    });
    
    const detections = await faceapi.detectAllFaces(
        videoRef.current,
        options
    );
    
    return detections.length > 0;
};
```

### 4.4 감지 루프

```javascript
const [isStudying, setIsStudying] = useState(false);
const [studySeconds, setStudySeconds] = useState(0);
const intervalRef = useRef(null);

const startDetectionLoop = (videoRef) => {
    intervalRef.current = setInterval(async () => {
        const faceDetected = await detectFace(videoRef);
        
        if (faceDetected) {
            if (!isStudying) {
                setIsStudying(true);
                console.log('학습 시작');
            }
            setStudySeconds(prev => prev + 1);
        } else {
            if (isStudying) {
                setIsStudying(false);
                console.log('학습 일시정지');
            }
        }
    }, 1000); // 1초마다 감지
};

const stopDetectionLoop = () => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
};
```

### 4.5 학습 시간 저장

```javascript
import api from '../../api/api';

const saveStudyTime = async (studySeconds, subject) => {
    try {
        await api.put('/dashboard/study-time', {
            studyDate: new Date().toISOString().split('T')[0],
            subject: subject,
            durationMinutes: Math.floor(studySeconds / 60)
        });
        console.log('학습 시간 저장 완료');
    } catch (error) {
        console.error('학습 시간 저장 실패:', error);
    }
};
```

---

## 5. CamStudyPage 구현

### 5.1 컴포넌트 구조

```javascript
import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const CamStudyPage = () => {
    const videoRef = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isStudying, setIsStudying] = useState(false);
    const [studySeconds, setStudySeconds] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [targetMinutes, setTargetMinutes] = useState(60);
    
    useEffect(() => {
        loadModels().then(() => setIsModelLoaded(true));
    }, []);
    
    const handleStart = async () => {
        await startVideo(videoRef);
        startDetectionLoop(videoRef);
    };
    
    const handleStop = async () => {
        stopDetectionLoop();
        stopVideo(videoRef);
        await saveStudyTime(studySeconds, selectedSubject);
    };
    
    return (
        <div className="cam-study-page">
            {/* 설정 영역 */}
            <div className="settings">
                <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="">과목 선택</option>
                    <option value="수학">수학</option>
                    <option value="영어">영어</option>
                </select>
                
                <input 
                    type="number"
                    value={targetMinutes}
                    onChange={(e) => setTargetMinutes(e.target.value)}
                    placeholder="목표 시간 (분)"
                />
            </div>
            
            {/* 비디오 영역 */}
            <div className="video-container">
                <video ref={videoRef} autoPlay muted />
                
                <div className="status">
                    {isStudying ? '🟢 학습 중' : '🔴 일시정지'}
                </div>
            </div>
            
            {/* 타이머 */}
            <div className="timer">
                {formatTime(studySeconds)}
            </div>
            
            {/* 진행률 */}
            <div className="progress">
                <div 
                    className="progress-bar"
                    style={{ 
                        width: `${Math.min(100, (studySeconds / 60 / targetMinutes) * 100)}%` 
                    }}
                />
            </div>
            
            {/* 버튼 */}
            <div className="controls">
                <button onClick={handleStart}>시작</button>
                <button onClick={handleStop}>종료</button>
            </div>
        </div>
    );
};
```

### 5.2 시간 포맷팅

```javascript
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

---

## 6. FocusRoom 연동

### 6.1 집중 시간 브로드캐스트

```javascript
// 집중 시간 업데이트 시 서버에 전송
useEffect(() => {
    if (studySeconds > 0 && studySeconds % 5 === 0) {
        socket.emit('focus-time-update', {
            userId: user.id,
            time: studySeconds
        });
    }
}, [studySeconds]);
```

### 6.2 다른 참여자 시간 수신

```javascript
socket.on('focus-time-update', ({ userId, time }) => {
    setParticipants(prev => prev.map(p => 
        p.userId === userId ? { ...p, focusedSeconds: time } : p
    ));
});
```

---

## 7. 성능 최적화

### 7.1 감지 간격 조정

```javascript
// 기본: 1초 (1000ms)
// 성능 이슈 시: 2초 (2000ms)
const DETECTION_INTERVAL = 1000;

setInterval(detectFace, DETECTION_INTERVAL);
```

### 7.2 TinyFaceDetector 옵션

```javascript
const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 224,    // 128, 160, 224, 320, 416, 512, 608
    scoreThreshold: 0.5 // 0.0 ~ 1.0
});
```

- **inputSize**: 작을수록 빠름, 클수록 정확
- **scoreThreshold**: 높을수록 정확한 감지만 인정

### 7.3 비디오 해상도 제한

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
    video: {
        width: { max: 640 },
        height: { max: 480 }
    }
});
```

---

## 8. 에러 처리

### 8.1 카메라 권한 거부

```javascript
const startVideo = async (videoRef) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            alert('카메라 접근 권한이 필요합니다. 브라우저 설정에서 허용해주세요.');
        } else if (error.name === 'NotFoundError') {
            alert('카메라를 찾을 수 없습니다.');
        } else {
            alert('카메라 접근 중 오류가 발생했습니다.');
        }
        throw error;
    }
};
```

### 8.2 모델 로드 실패

```javascript
const loadModels = async () => {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    } catch (error) {
        console.error('Face API 모델 로드 실패:', error);
        alert('얼굴 인식 모델을 로드할 수 없습니다. 페이지를 새로고침해주세요.');
        throw error;
    }
};
```

---

## 9. UI/UX 고려사항

### 9.1 상태 표시

| 상태 | 표시 |
|------|------|
| 모델 로딩 중 | "얼굴 인식 준비 중..." |
| 카메라 대기 중 | "카메라 연결 대기 중..." |
| 얼굴 감지됨 | 🟢 + "학습 중" |
| 얼굴 미감지 | 🔴 + "일시정지" |
| 학습 완료 | 결과 요약 표시 |

### 9.2 피드백

- 타이머 실시간 업데이트
- 진행률 바 표시
- 목표 달성 시 알림
- 세션 종료 시 요약 정보

### 9.3 접근성

- 스크린 리더 지원
- 키보드 네비게이션
- 고대비 모드 지원
