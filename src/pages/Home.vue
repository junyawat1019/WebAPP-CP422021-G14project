<template>
  <DefaultLayout>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div v-for="r in restaurants" :key="r.id" class="border rounded-xl shadow-md overflow-hidden">
        <img :src="r.image" alt="" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-bold">{{ r.name }}</h2>
          <p>{{ r.type }} - {{ r.location }}</p>
          <p class="text-yellow-500">⭐ {{ r.rating }}</p>
          <router-link :to="`/restaurant/${r.id}`" class="text-blue-500 mt-2 inline-block">ดูเพิ่มเติม</router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { restaurants } from '@/data/restaurants.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
