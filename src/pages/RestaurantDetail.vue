<template>
  <DefaultLayout>
    <div v-if="restaurant" class="p-4">
      <img :src="restaurant.image" class="w-full h-64 object-cover rounded-xl mb-4" />
      <h1 class="text-3xl font-bold">{{ restaurant.name }}</h1>
      <p class="text-gray-600">{{ restaurant.type }} - {{ restaurant.location }}</p>
      <p class="mt-2 text-yellow-500">⭐ {{ restaurant.rating }}</p>
      <p class="mt-4">{{ restaurant.description }}</p>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { restaurants } from '@/data/restaurants.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const restaurant = restaurants.find(r => r.id === parseInt(route.params.id))
</script>
