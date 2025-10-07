<template>
  <DefaultLayout>
    <div class="profile-settings">
      <h2 class="title">ตั้งค่าโปรไฟล์</h2>

      <!-- ส่วนรูปโปรไฟล์ -->
      <div class="profile-photo-section">
        <div class="photo-wrapper">
          <img :src="photoURL" alt="Profile Photo" class="profile-photo" />
        </div>
        <label class="upload-btn">
          เปลี่ยนรูปโปรไฟล์
          <input type="file" @change="uploadProfilePhoto" accept="image/*" />
        </label>
      </div>

      <!-- ฟอร์มแก้ไขโปรไฟล์ -->
      <form @submit.prevent="updateProfileData" class="profile-form">
        <div class="form-group">
          <label>ชื่อผู้ใช้</label>
          <input v-model="displayName" type="text" />
        </div>

        <div class="form-group">
          <label>เพศ</label>
          <select v-model="gender">
            <option value="">เลือกเพศ</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>

        <div class="form-group">
          <label>วันเกิด</label>
          <input v-model="birthday" type="date" />
        </div>

        <div class="form-group">
          <label>เกี่ยวกับฉัน</label>
          <textarea v-model="aboutMe"></textarea>
        </div>

        <div class="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input v-model="phoneNumber" type="tel" />
        </div>

        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง" }}
        </button>
      </form>

      <!-- ความปลอดภัย -->
      <div class="security-section">
        <h3>ความปลอดภัย</h3>
        <button @click="changePassword" class="btn-security">เปลี่ยนรหัสผ่าน</button>
        <button @click="verifyEmail" class="btn-security">ยืนยันอีเมล</button>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db, storage } from "@/firebase";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import {
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  updatePassword
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultAvatarImage from "@/assets/images/default-avatar.png";

const displayName = ref("");
const gender = ref("");
const birthday = ref("");
const aboutMe = ref("");
const phoneNumber = ref("");
const photoURL = ref(defaultAvatarImage);

const userId = ref("");
const user = ref(null);
const loading = ref(false);

onMounted(async () => {
  onAuthStateChanged(auth, async (u) => {
    if (!u) return;

    user.value = u;
    userId.value = u.uid;

    const userDoc = await getDoc(doc(db, "users", u.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      displayName.value = data.displayName || u.displayName || "";
      gender.value = data.gender || "";
      birthday.value = data.birthday || "";
      aboutMe.value = data.aboutMe || "";
      phoneNumber.value = data.phoneNumber || "";
      photoURL.value = data.photoURL || defaultAvatarImage;
    }
  });
});

const uploadProfilePhoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;
  try {
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `${userId.value}_${timestamp}.${extension}`;

    const storageReference = storageRef(storage, `profile_photos/${fileName}`);
    await uploadBytes(storageReference, file);

    const url = await getDownloadURL(storageReference);

    await updateProfile(auth.currentUser, { photoURL: url });
    await updateDoc(doc(db, "users", userId.value), { photoURL: url });

    photoURL.value = url;
    alert("อัปโหลดรูปโปรไฟล์เรียบร้อยแล้ว");
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการอัปโหลด: " + error.message);
  } finally {
    loading.value = false;
  }
};

const updateProfileData = async () => {
  if (!user.value) return;

  loading.value = true;
  try {
    await updateProfile(user.value, { displayName: displayName.value });
    await updateDoc(doc(db, "users", userId.value), {
      displayName: displayName.value,
      gender: gender.value,
      birthday: birthday.value,
      aboutMe: aboutMe.value,
      phoneNumber: phoneNumber.value,
    });

    alert("อัปเดตโปรไฟล์เรียบร้อยแล้ว");
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาด: " + error.message);
  } finally {
    loading.value = false;
  }
};

const changePassword = () => {
  const newPassword = prompt("กรุณากรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)");
  if (newPassword && newPassword.length >= 6) {
    updatePassword(auth.currentUser, newPassword)
      .then(() => alert("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว"))
      .catch(err => alert("เกิดข้อผิดพลาด: " + err.message));
  } else {
    alert("รหัสผ่านไม่ถูกต้อง");
  }
};

const verifyEmail = () => {
  sendEmailVerification(auth.currentUser)
    .then(() => alert("ส่งอีเมลยืนยันเรียบร้อยแล้ว"))
    .catch(err => alert("เกิดข้อผิดพลาด: " + err.message));
};
</script>

<style scoped>
.profile-settings {
  max-width: 600px;
  margin: 20px auto;
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.photo-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #00aeef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.upload-btn {
  margin-top: 10px;
  cursor: pointer;
  color: #00aeef;
  font-weight: bold;
}

.upload-btn input[type="file"] {
  display: none;
}

.profile-form .form-group {
  margin-bottom: 15px;
}

.profile-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.profile-form input,
.profile-form select,
.profile-form textarea {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.profile-form textarea {
  resize: vertical;
}

.btn-save {
  background-color: #00aeef;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
}

.btn-save:hover {
  background-color: #0091d5;
}

.security-section {
  margin-top: 20px;
}

.btn-security {
  background: none;
  border: none;
  color: #e11d1d;
  cursor: pointer;
  font-weight: bold;
}

.btn-security:hover {
  text-decoration: underline;
}
</style>
