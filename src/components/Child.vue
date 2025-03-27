<template>
	<div>
	  dd
	</div>
  </template>
<script setup lang="ts">
	import { onMounted, ref, watch } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useTestStore } from '../store/test.pinia';
	import { useAsyncDataLoader } from '../utils/wait.util';

	const props = defineProps<{
		crswrId?: any;
	}>();

	const shouldLoadData = (teacherMembers: any[], props: any) => {
		return teacherMembers.length === 0 || props.crswrId !== undefined;
	};

	const testStore = useTestStore();
	// const { getTeacherMember } = storeToRefs(testStore);
	const { isReady, storeData, propsData } = useAsyncDataLoader(
		testStore, 'getTeacherMember',
		props, 'crswrId'
	);

	/* onMounted(() => {
		console.log('child mounted 1',isReady.value);
		console.log('child mounted 2',storeData.value);
		console.log('child mounted 3',propsData.value);
		
	}); */

	watch(isReady, (newVal) => {
    if (newVal) {
      console.log('데이터 모두 준비됨:', {
        storeData: storeData.value,
        propsData
      });
      
      // 이제 storeData와 propsData(crswrId)를 사용한 로직 실행 가능
      // 예: 특정 crswrId에 맞는 교사 정보 필터링
      /* const teacherForCourse = storeData.value.find(
		  (teacher: { courses: string | any[]; }) => teacher.courses?.includes(propsData.value)
      ); */
      
      console.log('해당 강좌의 교사:');
    }
  });

	/* watch(() => props.crswrId, (newVal, oldVal) => {
		console.log('child watch', newVal, oldVal);
	}); */
  
</script>
<style scoped>

</style>
  