import { computed, ref, watch } from "vue";

type DataType = 'array' | 'object' | 'string' | 'number' | 'boolean' | 'any';

interface DataSource<T = any> {
    // 데이터 소스 (값, ref, computed, 또는 함수)
    source: T | (() => T);

    // 데이터 타입 (검증에 사용)
    type?: DataType;

    // 소스이름 (디버깅용, 옵션)
    name?: string;
}

function _useDataWatcher(sources: DataSource[]) {
    const sourceValues =  ref<any[]>([]);
    const sourceReady = ref<boolean[]>([]);

    // 감시 중지 함수들 저장
    const unwatchFunctions: (() => void)[] = [];

    const isReady = computed(() => 
        sourceReady.value.length > 0 && sourceReady.value.every(ready => ready)
    )

    sources.forEach((source, index) => {
        // 초기값 설정
        sourceValues.value[index] = null;
        sourceReady.value[index] = false;

        const retrieveSourceValue = () => {
            const src = source.source;
            return typeof src === 'function' ? src() : src;
        }

        const isValueValid = (value: any): boolean => {
            if (value === undefined || value === null) return false;
            const type = source.type || 'any';
            switch (type) {
                case 'array':
                    return Array.isArray(value) && value.length > 0;
                case 'object':
                    return typeof value === 'object' &&
                        !Array.isArray(value) &&
                        !(value instanceof Date) &&
                        Object.keys(value).length > 0;
                case 'string':
                    return typeof value === 'string' && value.trim() !== '';
                case 'number':
                    return typeof value === 'number' && !isNaN(value);
                case 'boolean':
                    return typeof value === 'boolean';
                case 'any':
                default:
                    return true; 
            }
        };

        const updateSourceState = (newValue: any) => {
            sourceValues.value[index] = newValue;
            const valid = isValueValid(newValue);
            sourceReady.value[index] = valid;

            const name = source.name || `source_${index}`;
            console.log(`[useDataWatcher] 소스 "${name}" 상태:`, valid, newValue);
            
        };

        const initialValue = retrieveSourceValue();
        updateSourceState(initialValue);

        const unwatch = watch(
            retrieveSourceValue,
            updateSourceState,
            { deep: true }
        );

        unwatchFunctions.push(unwatch);

    });

    const stopAllWatchers = () => {
        unwatchFunctions.forEach(unwatch => unwatch);
        unwatchFunctions.length = 0;
    };

    return {
        isReady,
        values: computed(() => sourceValues.value),
        readyStates: computed(() => sourceReady.value),
        stop: stopAllWatchers
    }
}

export {
    _useDataWatcher as useDataWatcher
}