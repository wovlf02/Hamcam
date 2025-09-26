import * as faceapi from 'face-api.js';
import ModelChecker from './ModelChecker';

/**
 * Face API 모델 로딩 유틸리티
 * 다양한 경로를 시도하여 모델을 로드합니다.
 */
class ModelLoader {
    static isLoaded = false;
    static loadPromise = null;

    /**
     * 모델들을 로드합니다. 한 번만 로드되도록 보장합니다.
     */
    static async loadModels() {
        if (this.isLoaded) {
            return true;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this._doLoadModels();
        return this.loadPromise;
    }

    static async _doLoadModels() {
        const modelPaths = [
            '/models',           // 기본 경로
            './models',          // 상대 경로
            `${process.env.PUBLIC_URL}/models`, // 환경변수 기반 경로
            '/public/models'     // public 포함 경로
        ];

        // 개발 환경에서는 모델 파일 상태 체크
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 개발 모드: 모델 파일 체크 실행');
            await ModelChecker.diagnose();
        }

        for (let i = 0; i < modelPaths.length; i++) {
            const modelPath = modelPaths[i];
            console.log(`모델 경로 시도 중: ${modelPath}`);

            try {
                await this._loadFromPath(modelPath);
                console.log(`모델 로드 성공! 경로: ${modelPath}`);
                this.isLoaded = true;
                return true;
            } catch (error) {
                console.warn(`경로 ${modelPath}에서 로드 실패:`, error.message);
                
                // 마지막 경로에서도 실패한 경우
                if (i === modelPaths.length - 1) {
                    console.error('모든 경로에서 모델 로드 실패');
                    
                    // 추가 진단 정보 제공
                    console.log('🔧 추가 진단을 위해 ModelChecker.diagnose()를 실행하세요.');
                    
                    throw new Error(`모든 모델 경로에서 로드 실패. 마지막 오류: ${error.message}`);
                }
            }
        }
    }

    static async _loadFromPath(modelPath) {
        // 각 모델을 순차적으로 로드
        console.log(`  SSD MobileNet v1 로딩 중... (${modelPath})`);
        await faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath);
        
        console.log(`  Face Landmark 68 로딩 중... (${modelPath})`);
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
        
        console.log(`  Face Recognition Net 로딩 중... (${modelPath})`);
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
        
        console.log(`  모든 모델 로드 완료! (${modelPath})`);
    }

    /**
     * 모델이 로드되었는지 확인
     */
    static isModelsLoaded() {
        return this.isLoaded && 
               faceapi.nets.ssdMobilenetv1.isLoaded &&
               faceapi.nets.faceLandmark68Net.isLoaded &&
               faceapi.nets.faceRecognitionNet.isLoaded;
    }

    /**
     * 모델 로드 상태 리셋 (테스트용)
     */
    static reset() {
        this.isLoaded = false;
        this.loadPromise = null;
    }
}

export default ModelLoader;