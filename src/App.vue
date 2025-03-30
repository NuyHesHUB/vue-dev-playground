<template>
  <div>
    <Child :crswr-id="crswrId" :user-id="userId"/>
  </div>
</template>
<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { useTestStore } from './store/test.pinia';
	import { storeToRefs } from 'pinia';

	import Child from './components/Child.vue';

	const testStore = useTestStore();
	const { getTeacherMember } = storeToRefs(testStore);
	const crswrId = ref('');
	const userId = ref('');

	onMounted(() => {
		// console.log('mounted', testStore.getTeacherMember);
		setTimeout(() => {
			crswrId.value = '123';
		}, 2000);
		setTimeout(() => {
			userId.value = 'abc'
		}, 5000)
	});

</script>
<style scoped>

</style>
