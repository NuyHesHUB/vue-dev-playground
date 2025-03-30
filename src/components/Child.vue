<template>
	<div>
	  dd
	</div>
  </template>
<script setup lang="ts">
	import { onMounted, ref, watch, watchEffect } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useTestStore } from '../store/test.pinia';
	import { DataType, useDataWatcher } from '../utils/wait.util';

	const props = defineProps<{
		crswrId?: any;
		userId?: any;
	}>();

	const shouldLoadData = (teacherMembers: any[], props: any) => {
		return teacherMembers.length === 0 || props.crswrId !== undefined;
	};

	const testStore = useTestStore();
	// const { getTeacherMember } = storeToRefs(testStore);

	const { isReady, values, onReady } = useDataWatcher([
		{ source: testStore.getTeacherMember, type: DataType.Array, name: 'memberData1' },
		{ source: () => testStore.getTeacherMember, type: DataType.Array, name: 'memberData2' },
		{ source: () => props.crswrId, type: DataType.String, name: 'crswrId' },
		{ source: () => props.userId, type: DataType.String, name: 'userId' }
	])

	onReady((vals) => {
		console.log('준비완료', vals);
		
	})
  
</script>
<style scoped>

</style>
  