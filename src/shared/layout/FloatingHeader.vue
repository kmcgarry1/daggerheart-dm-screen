<template>
    <header class="floating-header">
        <slot />
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.floating-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background: linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 1rem 2rem;
    transition: box-shadow 0.2s;
    border-bottom: 4px solid gold;
}
</style>