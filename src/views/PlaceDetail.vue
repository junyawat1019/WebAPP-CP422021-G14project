<template>
  <DefaultLayout>
    <div v-if="place" class="place-detail-page">
      <div class="place-image-wrapper">
        <img :src="place.imageUrl || placeholder" alt="Place Image" class="place-image" />
      </div>
      <div class="place-info-card">
        <h1 class="place-name">{{ place.name }}</h1>
        <p class="place-type-location">{{ place.typeName }} - {{ place.location }}</p>
        <p class="place-rating">⭐ {{ averageRating.toFixed(1) }}</p>
        <p class="place-description">{{ place.description }}</p>
      </div>

      <div class="reviews-section">
        <h2>รีวิว</h2>
        <div v-if="reviews.length" class="reviews-list">
          <ReviewCard v-for="r in reviews" :key="r.id" :review="r" />
        </div>
        <div v-else><p>ยังไม่มีรีวิว</p></div>
      </div>

      <AddReview :placeId="placeId" @reviewAdded="fetchReviews" />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ReviewCard from "@/components/ReviewCard.vue";
import AddReview from "@/components/AddReview.vue";
import { db } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const route = useRoute();
const placeId = route.params.id;
const place = ref(null);
const reviews = ref([]);
const categories = ref([]);
const placeholder = "https://via.placeholder.com/800x400?text=No+Image";

const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  categories.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

const fetchPlace = async () => {
  const docRef = doc(db, "places", placeId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const placeData = docSnap.data();
    const categoryDoc = categories.value.find(c => c.id === placeData.type);
    place.value = { id: docSnap.id, typeName: categoryDoc?.name || placeData.type, ...placeData };
  }
};

const fetchReviews = async () => {
  const q = query(collection(db, "reviews"), where("placeId", "==", placeId));
  const snapshot = await getDocs(q);
  reviews.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

onMounted(async () => {
  await fetchCategories();
  await fetchPlace();
  await fetchReviews();
});

const averageRating = computed(() => {
  if (!reviews.value.length) return place.value?.averageRating || 0;
  const sum = reviews.value.reduce((a, r) => a + r.rating, 0);
  return sum / reviews.value.length;
});
</script>

<style scoped>
.place-detail-page {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  background-color: #f7f9fc;
}
.place-image-wrapper {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.place-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.place-info-card {
  background: white;
  padding: 20px;
  margin-top: -50px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.place-name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}
.place-type-location {
  color: #666;
  font-size: 14px;
}
.place-rating {
  font-size: 16px;
  color: #f59e0b;
  margin-top: 5px;
}
.place-description {
  margin-top: 15px;
  line-height: 1.6;
  color: #444;
}
.reviews-section {
  margin-top: 30px;
}
.reviews-section h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
