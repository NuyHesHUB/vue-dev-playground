import { computed } from 'vue';

function _useAsyncDataLoader<T, P>(
	store: T,
	storeKey: keyof T,
	props: P | (() => P),
	propKey?: keyof P
) {
	const storeData = store[storeKey];
	const storeValue = computed(() => {
		return typeof storeData === 'function' 
			? (storeData as () => any)() 
			: storeData;
	})
	
	const propsValue = computed(() => {
		if (typeof props === 'function') {
			return (props as () => P)();
		} else if (propKey) {
			return (props as any)?.[propKey];
		} else {
			return props;
		}
	});

	const isStoreReady = computed(() => isDataReady(storeValue.value));
	const isPropsReady = computed(() => isDataReady(propsValue.value));
	const isReady = computed(() => isStoreReady.value && isPropsReady.value);

	return {
		isReady,
		storeData: storeValue,
		propsData: propsValue,
		isStoreReady,
		isPropsReady
	};
}

function isDataReady(val: any): boolean {
	if (val === null || val === undefined) return false;
	if (Array.isArray(val)) return val.length > 0;
	if (typeof val === 'object') return Object.keys(val).length > 0;
	if (typeof val === 'string') return val.trim().length > 0;
	return true;
}

export { 
	_useAsyncDataLoader as useAsyncDataLoader,
 };
