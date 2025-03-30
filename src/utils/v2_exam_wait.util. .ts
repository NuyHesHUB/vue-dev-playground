import { ref, computed, watch } from 'vue';

// 지원하는 데이터 타입
type DataType = 'array' | 'object' | 'string' | 'number' | 'boolean' | 'any';

// 데이터 소스 정의
interface DataSource<T = any> {
  // 데이터 소스 (값, ref, computed, 또는 함수)
  source: T | (() => T);
  
  // 데이터 타입 (검증에 사용)
  type?: DataType;
  
  // 소스의 이름 (디버깅용, 옵션)
  name?: string;
}

/**
 * 여러 데이터 소스를 감시하고 모두 준비되었을 때 알려주는 컴포저블
 * @param sources 감시할 데이터 소스들
 * @returns 준비 상태 및 소스 값들
 */
export function useDataWatcher(sources: DataSource[]) {
  // 각 소스의 값과 준비 상태
  const sourceValues = ref<any[]>([]);
  const sourceReady = ref<boolean[]>([]);
  
  // 전체 준비 상태
  const isReady = computed(() => 
    sourceReady.value.length > 0 && sourceReady.value.every(ready => ready)
  );
  
  // 각 소스별로 감시 설정
  sources.forEach((source, index) => {
    // 초기값 설정
    sourceValues.value[index] = null;
    sourceReady.value[index] = false;
    
    // 소스 접근 함수
    const getSourceValue = () => {
      const src = source.source;
      return typeof src === 'function' ? src() : src;
    };
    
    // 값 검증 함수 (타입에 따라)
    const validateValue = (value: any): boolean => {
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
    
    // 소스 값 감시 (watchEffect 사용)
    const stopWatch = watch(() => getSourceValue(), (newValue) => {
      // 값 업데이트
      sourceValues.value[index] = newValue;
      
      // 값 검증
      const isValid = validateValue(newValue);
      sourceReady.value[index] = isValid;
      
      const name = source.name || `source_${index}`;
      console.log(`[useDataWatcher] 소스 "${name}" 상태:`, isValid, newValue);
    }, { immediate: true, deep: true });
  });
  
  return {
    // 전체 준비 상태
    isReady,
    
    // 모든 소스 값
    values: computed(() => sourceValues.value),
    
    // 각 소스별 준비 상태
    readyStates: computed(() => sourceReady.value)
  };
}

/**
 * 두 데이터 소스를 감시하는 간편 함수 (기존 API 호환용)
 */
export function useAsyncDataLoader(
  sourceA: any, 
  typeA: DataType = 'any',
  sourceB: any, 
  typeB: DataType = 'any'
) {
  const { isReady, values } = useDataWatcher([
    { source: sourceA, type: typeA, name: 'sourceA' },
    { source: sourceB, type: typeB, name: 'sourceB' }
  ]);
  
  return {
    isReady,
    sourceA: computed(() => values.value[0]),
    sourceB: computed(() => values.value[1])
  };
}