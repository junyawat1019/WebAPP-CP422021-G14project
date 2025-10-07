<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/images/logos/konnai_logo.png" alt="Logo" class="logo" @click="goHome" />
    </div>

    <div class="navbar-center" style="position: relative;">
      <div class="location">
        <select v-model="selectedLocation" @change="changeLocation">
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="ในมหาวิทยาลัย">ในมหาวิทยาลัยขอนแก่น</option>
          <option value="รอบมหาวิทยาลัย">รอบมหาวิทยาลัยขอนแก่น</option>
          <option value="ถนนมะลิวัลย์">ถนนมะลิวัลย์</option>
          <option value="ถนนหลังมข">ถนนหลัง มข.</option>
          <option value="ถนนศรีจันทร์">ถนนศรีจันทร์</option>
          <option value="ถนนกลางเมือง">ถนนกลางเมือง</option>
        </select>
      </div>

      <div class="search-bar">
        <input
          type="text"
          placeholder="ค้นหาร้านอาหาร, โรงแรม, ที่เที่ยว..."
          v-model="searchQuery"
          @keyup.enter="search"
        />
        <button @click="search" class="search-btn">ค้นหา</button>
      </div>
    </div>

    <div class="navbar-right">
      <template v-if="user">
        <!-- รูปโปรไฟล์ -->
        <img
          :src="photoURL || defaultAvatar"
          alt="Profile Icon"
          class="profile-icon"
          @click="goProfile"
        />
        <button @click="logout" class="login-btn">ออกจากระบบ</button>
      </template>

      <template v-else>
        <button class="login-btn" @click="goLogin">เข้าสู่ระบบ</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import defaultAvatarImage from "@/assets/images/default-avatar.png";

const user = ref(null);
const photoURL = ref(defaultAvatarImage);
const router = useRouter();
const defaultAvatar = defaultAvatarImage;

const selectedLocation = ref("ทั้งหมด");
const searchQuery = ref("");

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u;
    if (u) {
      // ดึงข้อมูลรูปโปรไฟล์จาก Firestore
      const userDoc = await getDoc(doc(db, "users", u.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        photoURL.value = data.photoURL || u.photoURL || defaultAvatar;
      } else {
        photoURL.value = u.photoURL || defaultAvatar;
      }
    }
  });
});

const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
    photoURL.value = defaultAvatar;
    router.push("/");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const goHome = () => {
  router.push("/");
};

const goLogin = () => {
  router.push("/login");
};

const goProfile = () => {
  router.push("/me");
};

const changeLocation = () => {
  if (searchQuery.value?.trim()) {
    search();
  }
};

const search = () => {
  console.log("ค้นหา:", searchQuery.value, "สถานที่:", selectedLocation.value);
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 40px;
  cursor: pointer;
}

.search-bar {
  display: flex;
  gap: 5px;
}

.search-bar input {
  padding: 5px;
}

.profile-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.login-btn {
  background: #00aeef;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
