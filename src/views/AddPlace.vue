<template>
  <DefaultLayout>
    <div class="auth-container">
      <h2>เพิ่มสถานที่ใหม่</h2>

      <form @submit.prevent="addPlace">
        <input v-model="name" placeholder="ชื่อสถานที่" required />

        <select v-model="type" required>
          <option value="">ประเภท</option>
          <option value="restaurant">ร้านอาหาร</option>
          <option value="cafe">คาเฟ่ & เครื่องดื่ม</option>
          <option value="apartment">หอพัก / อพาร์ตเมนต์</option>
          <option value="hotel">โรงแรม / ที่พัก</option>
          <option value="shopping">แหล่งช็อปปิ้ง</option>
          <option value="tourist">สถานที่ท่องเที่ยว</option>
          <option value="sports">สถานที่ออกกำลังกาย</option>
          <option value="entertainment">บันเทิง & ไลฟ์สไตล์</option>
          <option value="services">บริการต่าง ๆ</option>
        </select>

        <input v-model="location" placeholder="ที่ตั้ง" required />
        <textarea v-model="description" placeholder="คำอธิบาย"></textarea>

        <input type="file" @change="onFileChange" accept="image/*" />

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? "กำลังเพิ่ม..." : "เพิ่มสถานที่" }}
        </button>
      </form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { db, storage, auth } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const router = useRouter();
const name = ref("");
const type = ref("");
const location = ref("");
const description = ref("");
const imageFile = ref(null);
const isLoading = ref(false);

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) imageFile.value = file;
  else {
    alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
    e.target.value = null;
  }
};

const addPlace = async () => {
  if (!auth.currentUser) {
    alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสถานที่");
    router.push("/login");
    return;
  }
  isLoading.value = true;

  try {
    let imageUrl = "";
    if (imageFile.value) {
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${imageFile.value.name}`;
      const imgRef = storageRef(storage, `places/${uniqueFileName}`);
      await uploadBytes(imgRef, imageFile.value);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "places"), {
      name: name.value,
      type: type.value,
      location: location.value,
      description: description.value,
      imageUrl,
      averageRating: 0,
      reviewCount: 0,
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    alert("เพิ่มสถานที่สำเร็จ!");
    router.push("/");
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input, select, textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  background: #00aeef;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: #008ecf;
}
</style>
