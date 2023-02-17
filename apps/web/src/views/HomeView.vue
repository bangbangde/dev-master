<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue";
import * as Api from "@/api";

Api.ping(new Request());
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
