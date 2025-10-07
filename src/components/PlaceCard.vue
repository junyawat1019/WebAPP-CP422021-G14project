<template>
  <div class="place-card" @click="goToDetail">
    <img :src="place.imageUrl" alt="place" class="place-img" />
    <div class="place-info">
      <h2>{{ place.name }}</h2>
      <p>{{ place.typeName }} - {{ place.location }}</p>
      <p class="rating">⭐ {{ (place.averageRating ?? 0).toFixed(1) }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const props = defineProps({ place: Object });
const router = useRouter();
const goToDetail = () => router.push(`/place/${props.place.id}`);
</script>

<style scoped>
.place-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 340px;
  display: flex;
  flex-direction: column;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
}

.place-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.place-info {
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.place-info h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.place-info p {
  font-size: 14px;
  color: #666;
  margin: 2px 0;
}

.rating {
  color: #f59e0b;
  font-weight: bold;
  font-size: 15px;
  margin-top: 6px;
}
</style>
