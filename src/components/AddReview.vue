<template>
  <div class="add-review">
    <h3>เขียนรีวิว</h3>
    <form @submit.prevent="submitReview">
      <textarea v-model="comment" placeholder="รีวิวของคุณ" required></textarea>
      <div class="review-actions">
        <select v-model.number="rating" required>
          <option disabled value="">ให้คะแนน</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
        <div class="image-upload">
          <button type="button" @click="triggerFileInput">เพิ่มรูปภาพ</button>
          <span v-if="imageFile" class="file-name">{{ imageFile.name }}</span>
          <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display:none" />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "กำลังส่งรีวิว..." : "ส่งรีวิว" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db, auth, storage } from "@/firebase";
import { collection, addDoc, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const props = defineProps({ placeId: String });
const emit = defineEmits(["reviewAdded"]);

const comment = ref("");
const rating = ref(5);
const imageFile = ref(null);
const loading = ref(false);
const fileInput = ref(null);

const triggerFileInput = () => fileInput.value.click();
const onFileChange = e => imageFile.value = e.target.files[0];

const submitReview = async () => {
  if (!auth.currentUser) {
    alert("กรุณาล็อกอินก่อนเขียนรีวิว");
    return;
  }
  loading.value = true;
  try {
    let imageUrl = "";
    if (imageFile.value) {
      const imgRef = storageRef(storage, `reviews/${Date.now()}_${imageFile.value.name}`);
      await uploadBytes(imgRef, imageFile.value);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "reviews"), {
      placeId: props.placeId,
      userId: auth.currentUser.uid,
      username: auth.currentUser.email,
      rating: rating.value,
      comment: comment.value,
      imageUrl: imageUrl || null,
      createdAt: serverTimestamp()
    });

    const placeRef = doc(db, "places", props.placeId);
    await runTransaction(db, async (transaction) => {
      const placeDoc = await transaction.get(placeRef);
      const prevCount = placeDoc.data().reviewCount || 0;
      const prevRating = placeDoc.data().averageRating || 0;
      const newCount = prevCount + 1;
      const newAvg = (prevRating * prevCount + rating.value) / newCount;
      transaction.update(placeRef, { reviewCount: newCount, averageRating: newAvg });
    });

    comment.value = "";
    rating.value = 5;
    imageFile.value = null;
    emit("reviewAdded");
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-review {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

textarea {
  width: 100%;
  max-width: 840px; /* responsive */
  height: 80px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: none; /* ปรับขนาดไม่ได้ */
  font-size: 14px;
  box-sizing: border-box;
}

.review-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-upload button {
  background: #00aeef;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.file-name {
  font-size: 14px;
  color: #555;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button[type="submit"] {
  background: #00aeef;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ทำให้ responsive ในมือถือ */
@media (max-width: 600px) {
  .review-actions {
    flex-direction: column;
    align-items: stretch;
  }

  button[type="submit"] {
    width: 100%;
  }
}
</style>
