import { computed, ref, watch, watchEffect, toRef } from "vue";

/**
 * 스토어 데이터와 특정 props가 모두 준비될 때까지 기다린 후 결과를 제공하는 유틸리티
 * @param store 스토어 인스턴스
 * @param storeDataKey 스토어에서 가져올 데이터 키
 * @param props 감시할 props 객체 또는 값
 * @param propKey props가 객체인 경우 감시할 특정 키 (선택 사항)
 * @return isReady, storeData, propsData 등 상태와 데이터를 포함한 객체
 */
function _useAsyncDataLoader<T>(
    store: any,
    storeDataKey: string,
    props: any,
    propKey?: string
) {
    // 반응형 상태 및 데이터
    const storeData = computed(() => store[storeDataKey]);
    const isStoreDataReady = ref(false);
    const isPropsReady = ref(false);
    const isReady = ref(false);
    
    // props 값을 가져오는 방법 결정
    let propsValue;
    
    if (typeof props === 'function') {
        // 함수인 경우 computed로 변환
        propsValue = computed(props);
    } else if (propKey && typeof props === 'object') {
        // props 객체와 특정 키가 제공된 경우 (예: props, 'crswrId')
        // toRef를 사용하여 특정 속성에 대한 반응성 참조 생성
        propsValue = toRef(props, propKey);
    } else {
        // 그 외의 경우 (직접 값 전달 또는 객체 전체 전달)
        propsValue = ref(props);
        
        // props가 객체이고 propKey가 없으면 전체 객체를 감시
        if (typeof props === 'object' && props !== null && !propKey) {
            watch(() => props, () => {
                checkProps();
            }, { deep: true });
        }
    }
    
    // 두 데이터 소스의 준비 상태 종합
    const updateReadyState = () => {
        isReady.value = isStoreDataReady.value && isPropsReady.value;
        if (isReady.value) {
            console.log('모든 데이터 준비 완료:', storeDataKey, storeData.value, propsValue.value);
        }
    };
    
    // 스토어 데이터 준비 상태 검증 함수
    const checkStoreDataReady = (data: any): boolean => {
        if (data === undefined || data === null) return false;

        if (Array.isArray(data)) {
            return data.length > 0;
        } else if (typeof data === 'object' && !(data instanceof Date)) {
            return Object.keys(data).length > 0;
        } else if (typeof data === 'string') {
            return data.length > 0;
        } else if (typeof data === 'number' || typeof data === 'boolean') {
            return true;
        }

        return false;
    };

    // props 준비 상태 검증 함수
    const checkPropsReady = (data: any): boolean => {
        if (data === undefined || data === null) return false;

        if (Array.isArray(data)) {
            return data.length > 0;
        } else if (typeof data === 'object' && !(data instanceof Date)) {
            return Object.keys(data).length > 0;
        } else if (typeof data === 'string') {
            return data.length > 0;
        } else if (typeof data === 'number' || typeof data === 'boolean') {
            return true;
        }

        return false;
    };

    // 스토어 데이터 변경 감시
    watch(storeData, (newVal) => {
        const ready = checkStoreDataReady(newVal);
        console.log(`스토어 데이터(${storeDataKey}) 준비 상태:`, ready, newVal);
        isStoreDataReady.value = ready;
        updateReadyState();
    }, { immediate: true });
    
    // props 준비 상태 확인 및 업데이트
    const checkProps = () => {
        const currentPropsValue = propsValue.value;
        const ready = checkPropsReady(currentPropsValue);
        console.log('Props 준비 상태:', ready, currentPropsValue);
        isPropsReady.value = ready;
        updateReadyState();
    };
    
    // props 변화 감시
    watch(propsValue, () => {
        console.log('Props 변경 감지:', propsValue.value);
        checkProps();
    }, { immediate: true, deep: true });

    return {
        // 상태값
        isReady,
        isStoreDataReady,
        isPropsReady,
        
        // 데이터값
        storeData,
        propsData: propsValue
    };
}

export {
    _useAsyncDataLoader as useAsyncDataLoader,
}