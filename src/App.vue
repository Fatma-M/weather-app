<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <TheNavigation />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import TheNavigation from "@/components/TheNavigation";

export default {
  components: { TheNavigation },
};
</script>

<style>
.page-enter-active {
  transition: 600ms ease all;
}

.page-enter-from {
  opacity: 0;
}
</style>
