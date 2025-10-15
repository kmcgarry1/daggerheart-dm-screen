<template>
    <div class="dh-column" :style="{ width: width ?? 'auto' }">
        <slot />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    width?: string | number
}>()
const width = props.width ?? 'auto';
</script>

<style scoped>
.dh-column {
    display: flex;
    flex-direction: column;
    /* width is now handled via :style binding in template */
}
</style>