/**
 * 모델 파일 상태를 체크하는 유틸리티
 */
class ModelChecker {
    
    /**
     * 모델 파일들의 존재 여부와 접근성을 확인합니다.
     */
    static async checkModelFiles() {
        const modelFiles = [
            'ssd_mobilenetv1_model-weights_manifest.json',
            'ssd_mobilenetv1_model-shard1',
            'ssd_mobilenetv1_model-shard2',
            'face_landmark_68_model-weights_manifest.json',
            'face_landmark_68_model-shard1',
            'face_recognition_model-weights_manifest.json',
            'face_recognition_model-shard1',
            'face_recognition_model-shard2'
        ];

        const results = [];
        
        for (const file of modelFiles) {
            try {
                const response = await fetch(`/models/${file}`);
                const status = response.ok ? 'OK' : `Error: ${response.status}`;
                const size = response.headers.get('content-length');
                
                results.push({
                    file,
                    status,
                    size: size ? `${Math.round(size / 1024)} KB` : 'Unknown'
                });
                
                console.log(`✓ ${file}: ${status} (${size ? Math.round(size / 1024) + ' KB' : 'Unknown size'})`);
            } catch (error) {
                results.push({
                    file,
                    status: `Error: ${error.message}`,
                    size: 'Unknown'
                });
                console.error(`✗ ${file}: ${error.message}`);
            }
        }
        
        return results;
    }

    /**
     * 개발자 콘솔에 모델 파일 상태를 출력합니다.
     */
    static async diagnose() {
        console.log('🔍 Face-API 모델 파일 진단 시작...');
        console.log('=====================================');
        
        const results = await this.checkModelFiles();
        const failedFiles = results.filter(r => !r.status.includes('OK'));
        
        if (failedFiles.length === 0) {
            console.log('✅ 모든 모델 파일이 정상적으로 접근 가능합니다!');
        } else {
            console.error(`❌ ${failedFiles.length}개의 모델 파일에 문제가 있습니다:`);
            failedFiles.forEach(f => {
                console.error(`  - ${f.file}: ${f.status}`);
            });
        }
        
        console.log('=====================================');
        return results;
    }

    /**
     * 브라우저 환경 정보를 출력합니다.
     */
    static logEnvironmentInfo() {
        console.log('🌐 브라우저 환경 정보:');
        console.log(`  - User Agent: ${navigator.userAgent}`);
        console.log(`  - URL: ${window.location.href}`);
        console.log(`  - Protocol: ${window.location.protocol}`);
        console.log(`  - Host: ${window.location.host}`);
        
        // 서비스 워커 상태
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                console.log(`  - Service Workers: ${registrations.length}개 등록됨`);
            });
        }
    }
}

// 전역에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
    window.ModelChecker = ModelChecker;
    
    // 개발 환경에서만 자동 진단 실행
    if (process.env.NODE_ENV === 'development') {
        // 페이지 로드 후 3초 뒤에 진단 실행
        setTimeout(() => {
            ModelChecker.logEnvironmentInfo();
            ModelChecker.diagnose();
        }, 3000);
    }
}

export default ModelChecker;