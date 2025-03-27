<template>
  <div>
    <Child :crswr-id="crswrId"/>
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

	onMounted(() => {
		// console.log('mounted', testStore.getTeacherMember);
		setTimeout(() => {
			crswrId.value = '123';
		}, 200);
	});

</script>
<style scoped>

</style>
