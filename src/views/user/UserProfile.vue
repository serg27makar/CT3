<template>
  <div class="container mt-2">
    <div class="row">
      <div v-if="userInfo" class="col-lg-12">
        <div class="card card-block card-stretch card-height">
          <div class="card-header">
            <div class="header-title">
              <h4 class="card-title">User Profile</h4>
            </div>
          </div>
          <div class="card-body">
            <ul class="list-inline p-0 m-0 iq-contact-rest">
              <li class="mb-3 d-flex">
                <span class="phone-block">
                  <i class="mr-3 ri-user-line font-size-20"></i>
                  Full Name
                </span>
                <p class="mb-0 font-size-16 text-padding">{{ fullName }}</p>
              </li>
              <li class="mb-3 d-flex">
                <span class="phone-block">
                  <i class="fas mr-3 ri-article-line  font-size-20"></i>
                  Title
                </span>
                <p class="mb-0 font-size-16 text-padding">{{ userInfo.Title }}</p>
              </li>
              <li class="mb-3 d-flex">
                <span class="phone-block">
                  <i class="fas mr-3 ri-profile-line  font-size-20"></i>
                  Department
                </span>
                <p class="mb-0 font-size-16 text-padding">{{ userInfo.Department }}</p>
              </li>

              <li class="mb-3 d-flex">
                <a :href="'mailto:' + userInfo.EMail" class="d-flex">
                  <span class="phone-block">
                    <i class="fas ri-links-fill  mr-3 font-size-20"></i>
                    Email
                  </span>
                  <p class="mb-0 font-size-16 text-padding">{{ userInfo.EMail }}</p>
                </a>
              </li>
              <li class="mb-3 d-flex">
                <span class="phone-block">
                  <i class="fas ri-phone-line mr-3 font-size-20"></i>
                  Phone
                </span>
                <p class="mb-0 font-size-16 text-padding">{{ userInfo.Phone }}</p>
              </li>
              <li class="mb-3 d-flex">
                <span class="phone-block">
                  <i class="fas ri-phone-line mr-3 font-size-20"></i>
                  Ext
                </span>
                <p class="mb-0 font-size-16 text-padding">{{ userInfo.PhoneExt }}</p>
              </li>
              <li class="mb-3 d-flex">
                <span class="phone-block">
                  <i class="fas ri-message-2-line mr-3 font-size-20"></i>
                  Mobile/SMS
                </span>
                <p class="mb-0 font-size-16 text-padding">{{ userInfo.MobileSMS }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import APIService from "@/core/utils/APIService";
import {toast} from "vue3-toastify";

const apiService = new APIService();

const userInfo = ref({})

const fullName = computed(() => {
  if (!userInfo.value) return "";

  let name = userInfo.value.FirstName || "";
  if (userInfo.value.MiddleName) name += " " + userInfo.value.MiddleName;
  if (userInfo.value.LastName) name += " " + userInfo.value.LastName;

  return name;
});

const getUserProfile = async () => {
  try {
    const res = await apiService.get("user/profile");
    userInfo.value = res.data;
  } catch (err) {
    toast.error("Response error", err);
  }
};

onMounted(() => {
  getUserProfile();
});
</script>


<style scoped>
.phone-block {
  display: block;
  width: 9.5rem;
}
.text-padding {
  padding-top: 0.5rem;
}
</style>