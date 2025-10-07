<template>
  <DefaultLayout>
    <div class="profile-page">
      <div class="profile-card">
        <!-- รูปโปรไฟล์ -->
        <div class="profile-photo-wrapper">
          <img :src="photoURL || defaultAvatarImage" alt="Profile" class="profile-photo" />
        </div>

        <!-- ชื่อและอีเมล -->
        <h2 class="display-name">{{ displayName }}</h2>
        <p class="email">{{ email }}</p>

        <!-- ข้อมูลโปรไฟล์ -->
        <div class="profile-info">
          <div class="info-item">
            <span class="label">เพศ:</span>
            <span class="value">{{ gender || "ไม่มีข้อมูล" }}</span>
          </div>
          <div class="info-item">
            <span class="label">วันเกิด:</span>
            <span class="value">{{ birthday || "ไม่มีข้อมูล" }}</span>
          </div>
          <div class="info-item">
            <span class="label">เกี่ยวกับฉัน:</span>
            <span class="value">{{ aboutMe || "ไม่มีข้อมูล" }}</span>
          </div>
          <div class="info-item">
            <span class="label">เบอร์โทรศัพท์:</span>
            <span class="value">{{ phoneNumber || "ไม่มีข้อมูล" }}</span>
          </div>
        </div>

        <!-- ปุ่มแก้ไขโปรไฟล์ -->
        <div class="profile-actions">
          <button @click="goToEditProfile" class="btn-edit">แก้ไขโปรไฟล์</button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import defaultAvatarImage from "@/assets/images/default-avatar.png";

const displayName = ref("");
const gender = ref("");
const birthday = ref("");
const aboutMe = ref("");
const phoneNumber = ref("");
const email = ref("");
const photoURL = ref(defaultAvatarImage);
const createdAt = ref(null);

const router = useRouter();

onMounted(() => {
  loadUserProfile();
});

const loadUserProfile = async () => {
  onAuthStateChanged(auth, async (u) => {
    if (!u) {
      router.push("/login");
      return;
    }

    const userDoc = await getDoc(doc(db, "users", u.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      displayName.value = data.displayName || u.displayName || "";
      gender.value = data.gender || "";
      birthday.value = data.birthday?.toDate ? data.birthday.toDate().toLocaleDateString() : data.birthday || "";
      aboutMe.value = data.aboutMe || "";
      phoneNumber.value = data.phoneNumber || "";
      email.value = data.email || u.email;
      photoURL.value = data.photoURL || u.photoURL || defaultAvatarImage;
      createdAt.value = data.createdAt || null;
    }
  });
};

const formatCreatedAt = (timestamp) => {
  if (!timestamp) return "ไม่มีข้อมูล";
  if (timestamp.toDate) return timestamp.toDate().toLocaleString();
  return new Date(timestamp).toLocaleString();
};

const goToEditProfile = () => {
  router.push("/profile/settings");
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  min-height: 100vh;
}

.profile-card {
  background: white;
  max-width: 450px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  padding: 30px;
  text-align: center;
}

.profile-photo-wrapper {
  width: 130px;
  height: 130px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #00aeef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-photo:hover {
  transform: scale(1.05);
}

.display-name {
  font-size: 24px;
  font-weight: bold;
  margin-top: 15px;
}

.email {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.profile-info {
  text-align: left;
  margin-top: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #555;
}

.profile-actions {
  margin-top: 25px;
}

.btn-edit {
  background: #00aeef;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-edit:hover {
  background: #00aeef;
}
</style>
