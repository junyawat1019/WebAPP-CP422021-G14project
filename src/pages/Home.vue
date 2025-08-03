<template>
  <DefaultLayout>
    <!-- ปุ่มไปหน้าอื่น -->
    <div class="flex justify-end p-4">
      <router-link to="/restaurant" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow">
        ร้านอาหาร
      </router-link>
    </div>

    <div class="flex justify-end p-4">
      <router-link to="/restaurant" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow">
        คาเฟ่
      </router-link>
    </div>

    <div class="flex justify-end p-4">
      <router-link to="/restaurant" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow">
        บาร์
      </router-link>
    </div>

    <div class="flex justify-end p-4">
      <router-link to="/restaurant" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow">
        หอพัก
      </router-link>
    </div>

    <div class="flex justify-end p-4">
      <router-link to="/restaurant" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow">
        ที่ท่องเที่ยว
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div v-for="r in restaurants" :key="r.id" class="border rounded-xl shadow-md overflow-hidden">
        <img :src="r.image" alt="" class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-bold">{{ r.name }}</h2>
          <p>{{ r.type }} - {{ r.location }}</p>
          <p class="text-yellow-500">⭐ {{ r.rating }}</p>
          <router-link :to="`/restaurant/${r.id}`" class="text-blue-500 mt-2 inline-block">
            ดูเพิ่มเติม
          </router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { restaurants } from "@/data/restaurants.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
</script>
