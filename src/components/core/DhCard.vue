<template>
    <div class="bg-[#2c1e1b] border-2 border-[#c9a86a] rounded-xl shadow-md overflow-hidden max-w-[400px] mx-auto font-cinzel text-[#f5e6c8]">
        <div v-if="$slots.image" class="w-full h-[180px] bg-[#3a2722] flex items-center justify-center overflow-hidden">
            <slot name="image" />
        </div>
        <div class="p-4">
            <div v-if="$slots.title" class="text-[1.5rem] font-bold mb-2 text-[#c9a86a] [text-shadow:1px_1px_0_#3a2722]">
                <slot name="title" />
            </div>
            <div class="text-base leading-[1.5]">
                <slot name="body" />
            </div>
        </div>
        <div v-if="$slots.footer" class="bg-[#3a2722] px-4 py-3 border-t border-[#c9a86a] text-right text-[0.95rem]">
            <slot name="footer" />
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>


<style>
.font-cinzel {
    font-family: 'Cinzel', serif;
}
</style>
