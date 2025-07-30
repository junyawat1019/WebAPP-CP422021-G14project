<template>
  <header class="w-full shadow bg-white px-4 py-2 flex justify-between items-center">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <img src="@/assets/images/logos/konnai_logo.png" alt="Konnai Logo" class="h-10" />
      <span class="text-xl font-bold text-orange-700">Konnai KKU</span>
    </div>

    <!-- Search -->
    <div class="flex-1 mx-4">
      <input
        type="text"
        placeholder="ค้นหาร้านอาหาร คาเฟ่ ฯลฯ"
        class="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-orange-300"
      />
    </div>

    <!-- Profile/Login -->
    <div>
      <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full">
        เข้าสู่ระบบ
      </button>
    </div>
  </header>
</template>

<script setup>
// สามารถเพิ่ม logic Firebase Auth / props / emits ได้ในอนาคต
</script>

<style scoped>
/* เพิ่ม style เพิ่มเติมได้ถ้าต้องการ */
</style>
