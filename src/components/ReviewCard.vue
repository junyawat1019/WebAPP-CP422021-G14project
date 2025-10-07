<template>
  <div class="review-card">
    <p><strong>{{ review.username }}</strong> ⭐ {{ review.rating }}</p>
    <p>{{ review.comment }}</p>
    <img v-if="review.imageUrl" :src="review.imageUrl" alt="review image" class="review-img" />
  </div>
</template>

<script setup>
defineProps({ review: Object });
</script>

<style scoped>
.review-card {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.review-img {
  margin-top: 10px;
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
