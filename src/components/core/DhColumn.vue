<template>
    <div class="dh-column">
        <slot />
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    width?: string | number
}>()
</script>

<style scoped>
.dh-column {
    display: flex;
    flex-direction: column;
    width: v-bind(width, 'auto');
}
</style>