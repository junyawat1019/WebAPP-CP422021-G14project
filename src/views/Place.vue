<template>
  <DefaultLayout>
    <div class="place-detail-page">
      <div class="place-header">
        <h1>สถานที่รอบมหาวิทยาลัยขอนแก่น</h1>
        <button class="add-place-btn" @click="goToAddPlace">เพิ่มสถานที่ใหม่</button>
      </div>

      <!-- Filter Panel -->
      <div class="filter-bar">
        <select v-model="activeCategory">
          <option value="">ทุกหมวดหมู่</option>
          <option value="restaurant">ร้านอาหาร</option>
          <option value="cafe">คาเฟ่ & เครื่องดื่ม</option>
          <option value="apartment">หอพัก / อพาร์ตเมนต์</option>
          <option value="hotel">โรงแรม / ที่พัก</option>
          <option value="shopping">แหล่งช็อปปิ้ง</option>
          <option value="tourist">สถานที่ท่องเที่ยว</option>
          <option value="sports">สถานที่ออกกำลังกาย</option>
          <option value="services">บริการต่าง ๆ</option>
          <option value="entertainment">บันเทิง & ไลฟ์สไตล์</option>
        </select>

        <select v-model="ratingFilter">
          <option value="">ทุกคะแนน</option>
          <option value="5">5 ดาวขึ้นไป</option>
          <option value="4">4 ดาวขึ้นไป</option>
          <option value="3">3 ดาวขึ้นไป</option>
        </select>

        <select v-model="sortByDate">
          <option value="">เรียงตามวันที่</option>
          <option value="newest">ใหม่ล่าสุด</option>
          <option value="oldest">เก่าสุด</option>
        </select>
      </div>

      <!-- Place List -->
      <div class="place-list">
        <PlaceCard v-for="place in filteredPlaces" :key="place.id" :place="place" />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import PlaceCard from "@/components/PlaceCard.vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const router = useRouter();
const route = useRoute();

const places = ref([]);
const activeCategory = ref("");
const ratingFilter = ref("");
const sortByDate = ref("");
const searchText = ref("");

const fetchPlaces = async () => {
  const snapshot = await getDocs(collection(db, "places"));
  places.value = snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      averageRating: data.averageRating || 0
    };
  });
};

// อ่าน category จาก query parameter
onMounted(async () => {
  activeCategory.value = route.query.category || "";
  await fetchPlaces();
});

const filteredPlaces = computed(() => {
  return places.value
    .filter(p => !activeCategory.value || p.type === activeCategory.value)
    .filter(p => !ratingFilter.value || p.averageRating >= Number(ratingFilter.value))
    .filter(p => !searchText.value || p.name.toLowerCase().includes(searchText.value.toLowerCase()))
    .sort((a, b) => {
      if (sortByDate.value === "newest") return b.createdAt - a.createdAt;
      if (sortByDate.value === "oldest") return a.createdAt - b.createdAt;
      return 0;
    });
});

const goToAddPlace = () => router.push("/add-place");
</script>

<style scoped>
.place-detail-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.place-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-place-btn {
  background: #00aeef;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.add-place-btn:hover { background: #008ecf; }

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-bar select, .filter-bar input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.place-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
</style>
