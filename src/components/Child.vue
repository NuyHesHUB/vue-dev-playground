<template>
	<div>
	  dd
	</div>
  </template>
<script setup lang="ts">
	import { onMounted, ref, watch, watchEffect } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useTestStore } from '../store/test.pinia';
	import { useDataWatcher } from '../utils/wait.util';

	const props = defineProps<{
		crswrId?: any;
	}>();

	const shouldLoadData = (teacherMembers: any[], props: any) => {
		return teacherMembers.length === 0 || props.crswrId !== undefined;
	};

	const testStore = useTestStore();
	// const { getTeacherMember } = storeToRefs(testStore);

	const { isReady, values } = useDataWatcher([
		{ source: () => testStore.getTeacherMember, type: 'array', name: 'memberData1' },
		{ source: () => testStore.getTeacherMember, type: 'array', name: 'memberData2' },
		{ source: () => props.crswrId, type: 'string', name: 'crswrId' }
	])

	watch(isReady, (ready) => {
		console.log('ready', ready);
		const memberList = values.value[0]
		const crswrId = values.value[2]
		console.log('values', memberList, crswrId);
	})

	/* watchEffect(() => {
		console.log('isReady', values.value);
		
	}) */
	/* onMounted(() => {
		console.log('child mounted 1',isReady.value);
		console.log('child mounted 2',storeData.value);
		console.log('child mounted 3',propsData.value);
	}); */

	/* watchEffect(() => {
		if (isReady.value) {
			console.log('child mounted 1',isReady.value);
			console.log('child mounted 2',storeData.value);
			console.log('child mounted 3',propsData.value);
		}
	}) */

	/* watch(isReady, (newVal) => {
		if (newVal) {
		console.log('데이터 모두 준비됨:', {
			storeData: storeData.value,
			propsData
		});
		console.log('해당 강좌의 교사:');
		}
    }); */

	/* watch(() => props.crswrId, (newVal, oldVal) => {
		console.log('child watch', newVal, oldVal);
	}); */
  
</script>
<style scoped>

</style>
  