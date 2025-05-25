<template>
    <div>
        
    </div>
</template>
<script lang="ts" setup>
    import { computed, onMounted } from 'vue';
    import { createButtonStrategy } from '../composables/button/button.strategy';

    const props = defineProps<{
        params: any;
        moveToLink: (params: any, type: string) => void;
        getUserType: () => string;
        teacherAndClass: boolean;
    }>();

    const context: any = {
        moveToLink: props.moveToLink,
        getUserType: props.getUserType,
        teacherAndClass: props.teacherAndClass,
    };

    const buttons = computed(() => {
        const strategy = createButtonStrategy('doc', 'test', context)
        return strategy.getButtons();
    })

    onMounted(() => {
        console.log('buttons',buttons)
    })
</script>