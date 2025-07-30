<template>
  <div>
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/layouts/components/Navbar.vue'
import Footer from '@/layouts/components/Footer.vue'
</script>

<style>
main {
  padding: 1rem;
}
</style>
