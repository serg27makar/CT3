<template>
  <div class="auth-wrapper auth-v2" style="background-color: ghostwhite;">
    <div class="auth-inner">
      <div class="auth-box">
        <div class="img-wrapper">
          <img src="../assets/images/logo/Advantage_Icon_GoldFoil.png" alt="logo image" class="w-25 mb-1" />
          <h1 class="text-uppercase">Advantage</h1>
          <h3 class="text-uppercase">Investigations</h3>
        </div>

        <hr>
        <h5 class="font-weight-bold mb-1 text-center text-muted">Quick Submission - No login required</h5>

        <button class="btn btn-primary w-100">
          <a href="https://cases.dev.advantageinvestigations.com/cases/add/public" class="text-white text-decoration-none">
            Submit a Case Now
          </a>
        </button>

        <hr>
        <h5 class="text-center text-muted mt-3"> Or log in to your SmartTrak account with your email</h5>

        <Form @submit="validationForm" :validation-schema="validationSchema">
        <div class="mb-3">
            <Field
                name="email"
                type="email"
                id="login-email"
                class="form-control"
                v-model="userEmail"
                placeholder="jonh@example.com"
            />
            <ErrorMessage name="email" class="text-danger" />
            <small class="text-danger">{{ loginError }}</small>
          </div>

          <button type="submit" class="btn btn-primary w-100">Log In</button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import {useSecurityStore} from "@/auth/auth";

const userEmail = ref('');
const loginError = ref('');

const validationSchema = yup.object({
  email: yup.string().email('Incorrect email').required('Required field')
});

const signIn = async () => {
  const securityStore = useSecurityStore();
  loginError.value = await securityStore.login(userEmail.value)
};

const validationForm = (values) => {
  if (values) signIn();
};

</script>

<style scoped>
hr {
  border-top: 3px solid;
}

h1, h3, h5 {
  font-family: Montserrat;
}

.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.auth-box {
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.7);
  padding: 2rem;
  margin: auto;
  width: 33%;
  text-align: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.w-25 {
  width: 25%;
}

.text-muted {
  color: #b4b7bd;
}
</style>
