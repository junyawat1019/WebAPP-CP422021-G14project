<template>
  <header class="w-full shadow bg-white px-4 py-2 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <img src="@/assets/images/logos/konnai_logo.png" alt="Konnai Logo" class="h-10" />
    </div>

    <div class="flex items-center gap-4">
      <div class="w-64">
        <input
          type="text"
          placeholder="ค้นหาร้านอาหาร คาเฟ่ ฯลฯ"
          class="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-orange-300"
        />
      </div>

      <button class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full">
        เข้าสู่ระบบ
      </button>
    </div>
  </header>
</template>

<script setup>
</script>
