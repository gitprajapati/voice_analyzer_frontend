<script setup>
  import { onBeforeUnmount } from "vue";
  import { RouterView } from "vue-router";

  // Use onBeforeUnmount lifecycle hook for clearing local storage
  onBeforeUnmount(() => {
    localStorage.clear(); // Clears all items when the app is unmounted
  });
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
  /* Your styles here */
</style>
