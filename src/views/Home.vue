<template>
  <DefaultLayout>
    <div class="page-container">
      <!-- Slider -->
      <div class="slider-container" @mouseenter="pauseSlider" @mouseleave="resumeSlider">
        <div v-for="(img, index) in sliderImages" :key="index" class="slide"
          :class="{ active: index === currentSlide }">
          <img :src="img.url" :alt="img.alt" />
        </div>

        <button class="slider-btn prev" @click="prevSlide">&#10094;</button>
        <button class="slider-btn next" @click="nextSlide">&#10095;</button>

        <div class="dots">
          <span v-for="(img, index) in sliderImages" :key="index" class="dot"
            :class="{ active: index === currentSlide }" @click="goToSlide(index)"></span>
        </div>
      </div>

      <!-- Category Bar -->
      <div class="category-bar">
        <div v-for="cat in typeOptions" :key="cat.value" class="category-item"
          :class="{ active: activeCategory === cat.value }" @click="selectCategory(cat.value)">
          <img :src="cat.icon" class="category-icon" alt="" />
          <span>{{ cat.label }}</span>
        </div>
      </div>

      <!-- Tab Bar -->
      <p class="section-title">แนะนำสำหรับคุณ</p>
      <div class="tab-bar">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]">
          {{ tab.label }}
        </button>
      </div>

      <!-- Place List -->
      <div v-if="loadingPlaces" class="loading">กำลังโหลด...</div>
      <div v-else class="place-list">
        <PlaceCard v-for="place in displayedPlaces" :key="place.id" :place="place" />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import PlaceCard from "@/components/PlaceCard.vue";
import { useRouter } from "vue-router";

// Slider
const sliderImages = [
  { url: "https://www.lemon8-app.com/seo/image?item_id=7398129850919272961&index=0", alt: "Scenic view 1" },
  { url: "https://www.lemon8-app.com/seo/image?item_id=7398129850919272961&index=2", alt: "Scenic view 2" },
  { url: "https://www.lemon8-app.com/seo/image?item_id=7339824759103848961&index=2", alt: "Scenic view 3" },
];

const currentSlide = ref(0);
let timer = null;
const nextSlide = () => (currentSlide.value = (currentSlide.value + 1) % sliderImages.length);
const prevSlide = () => (currentSlide.value = (currentSlide.value - 1 + sliderImages.length) % sliderImages.length);
const goToSlide = (index) => (currentSlide.value = index);
const pauseSlider = () => clearInterval(timer);
const resumeSlider = () => (timer = setInterval(nextSlide, 5000));

// Category
const typeOptions = [
  { value: "restaurant", label: "ร้านอาหาร", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/f72e4d7c3e184914b9d0363145342b91.jpg" },
  { value: "apartment", label: "อพาร์ตเมนต์", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/85539409bd964df8b5b9b3d0d42e0655.jpg" },
  { value: "hotel", label: "โรงแรม", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/85539409bd964df8b5b9b3d0d42e0655.jpg" },
  { value: "tourist", label: "ที่เที่ยว", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/2c5274011a82414ebdd9cc3f737fb9ed.jpg" },
  { value: "cafe", label: "คาเฟ่", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/c32a2d8a041345e18b62d94762545c9f.jpg" },
  { value: "entertainment", label: "บาร์/ผับ", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/f72e4d7c3e184914b9d0363145342b91.jpg" },
  { value: "services", label: "เพิ่มเติม", icon: "https://img.wongnai.com/p/1920x0/2022/03/17/d76a55790ee8451e985657e727cd687c.jpg" },
];

const places = ref([]);
const loadingPlaces = ref(true);
const activeCategory = ref("");
const activeTab = ref("popular");
const tabs = [
  { id: "popular", label: "ยอดนิยม" },
  { id: "trending", label: "ใหม่มาแรง" },
];

const router = useRouter();

const selectCategory = (id) => {
  activeCategory.value = id;
  router.push({ name: "Place", query: { category: id } });
};

// Fetch Places
const fetchPlaces = async () => {
  const snapshot = await getDocs(collection(db, "places"));
  places.value = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      type: data.type,
      location: data.location,
      averageRating: data.averageRating || 0,
      reviewCount: data.reviewCount || 0,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    };
  });
  loadingPlaces.value = false;
};

// Computed
const filteredPlaces = computed(() =>
  activeCategory.value ? places.value.filter((p) => p.type === activeCategory.value) : places.value
);

const popularPlaces = computed(() =>
  filteredPlaces.value.slice().sort((a, b) => b.averageRating - a.averageRating).slice(0, 6)
);

const trendingPlaces = computed(() =>
  filteredPlaces.value.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 6)
);

const displayedPlaces = computed(() => {
  if (activeTab.value === "popular") return popularPlaces.value;
  if (activeTab.value === "trending") return trendingPlaces.value;
  return filteredPlaces.value;
});

// Mounted
onMounted(async () => {
  await fetchPlaces();
  timer = setInterval(nextSlide, 5000);
});
</script>

<style scoped>
.page-container {
  max-width: 1920px;
  margin: auto;
  padding-bottom: 40px;
  font-family: "Segoe UI", sans-serif;
}

/* Slider */
.slider-container {
  position: relative;
  width: 100%;
  height: clamp(250px, 45vh, 600px);
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 20px;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slide.active {
  opacity: 1;
  z-index: 1;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-btn {
  position: absolute;
  top: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.slider-container:hover .slider-btn {
  opacity: 1;
  visibility: visible;
}

.slider-btn.prev {
  left: 16px;
}

.slider-btn.next {
  right: 16px;
}

.dots {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #bbb;
}

.dot.active {
  background: #fff;
}

/* Category Bar */
.category-bar {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 25px 0 35px;
  flex-wrap: wrap;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #444;
  transition: all 0.3s;
}

.category-item.active span {
  color: #00aeef;
  font-weight: bold;
}

.category-item:hover {
  transform: scale(1.1);
}

.category-icon {
  background: #f8f8f8;
  border-radius: 16px;
  width: 32px;
  height: 32px;
  padding: 12px;
  margin-bottom: 6px;
}

/* Tab Bar */
.tab-bar {
  display: flex;
  justify-content: flex-start;
  border-bottom: 2px solid #eee;
  padding: 0 20px;
  gap: 20px;
  margin-bottom: 30px;
  /* เพิ่มระยะห่างกับ place list */
}

.tab-btn {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: 500;
  color: #777;
  padding-bottom: 10px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-btn.active {
  color: #000;
  font-weight: 600;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 3px;
  background-color: #00aeef;
  border-radius: 2px;
}

/* Place List */
.place-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.loading {
  text-align: center;
  color: #777;
  padding: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin: 20px 20px 10px;
}
</style>
