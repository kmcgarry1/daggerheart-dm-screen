<template>
    <footer class="floating-footer">
        <slot />
    </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.floating-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #222;
    color: #fff;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
    z-index: 100;
}
</style>