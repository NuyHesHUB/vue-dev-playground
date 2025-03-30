import { computed, ref, watch, type Ref, type ComputedRef } from "vue";

export enum DataType {
    Array = 'array',
    Object = 'object',
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Any = 'any'
}
export interface DataSource<T = any> {
    source: T | Ref<T> | ComputedRef<T> | (() => T);
    type?: DataType;
    name?: string;
}

function getValue<T>(src: DataSource<T>['source']): T {
    if (typeof src === 'function') return (src as () => T)();
    if ('value' in (src as any)) return (src as Ref<T>).value;
    return src as T; 
}

function isValueValid(value: unknown, type: DataType): boolean {
    if (value === undefined || value === null) return false;
    switch(type) {
        case DataType.Array: 
            return Array.isArray(value) && value.length > 0;

        case DataType.Object:
            return typeof value === 'object' &&
            !Array.isArray(value) &&
            !(value instanceof Date) &&
            Object.keys(value).length > 0;

        case DataType.String:
            return typeof value === 'string' && value.trim() !== '';

        case DataType.Number:
            return typeof value === 'number' && !isNaN(value);

        case DataType.Boolean:
            return typeof value === 'boolean';

        case DataType.Any:
        default: 
            return true;
    }
}

function _useDataWatcher(sources: DataSource[]) {
    const sourceValues =  ref<any[]>([]);
    const sourceReady = ref<boolean[]>([]);
    const unwatchFns: (() => void)[] = [];

    const isReady = computed(() => 
        sourceReady.value.length > 0 && sourceReady.value.every(Boolean)
    )

    sources.forEach((source, index) => {
        sourceValues.value[index] = null;
        sourceReady.value[index] = false;

        const update = (newValue: any) => {
            sourceValues.value[index] = newValue;
            const valid = isValueValid(newValue, source.type ?? DataType.Any);
            sourceReady.value[index] = valid;

            const name = source.name || `source_${index}`;
            console.log(`[useDataWatcher] 소스 "${name}" 상태:`, valid, newValue);
            
        };

        const initial = getValue(source.source);
        update(initial);

        const unwatch = watch(
            () => getValue(source.source),
            update,
            { deep: true }
        );

        unwatchFns.push(unwatch);
    });

    const onReady = (callback: (values: any[]) => void): void => {
        if (isReady.value) {
            callback(sourceValues.value);
            return
        }
        const stop = watch(isReady, (ready) => {
            if (ready) {
                stop();
                callback(sourceValues.value)
            }
        })
    }

    const stop = () => {
        unwatchFns.forEach(un => un());
        unwatchFns.length = 0;
    };

    return {
        isReady,
        values: computed(() => sourceValues.value),
        readyStates: computed(() => sourceReady.value),
        stop,
        onReady,
    }
}

export {
    _useDataWatcher as useDataWatcher
}