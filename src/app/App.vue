<script setup lang="ts">
import { RouterView } from 'vue-router'

import { NotificationToaster } from '@/shared/ui'
</script>

<template>
  <RouterView />
  <NotificationToaster />
</template>
