<template>
  <div class="flex flex-center bg-grey-2" style="min-height: 100vh;">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">TodoList Manager</div>
        <div class="text-subtitle2 text-center text-grey-7">Sign in to your account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="credentials.username"
            label="Username"
            type="text"
            outlined
            :rules="[(val) => !!val || 'Username is required']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="credentials.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            :rules="[(val) => !!val || 'Password is required']"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Sign In"
            class="full-width"
            :loading="isLoading"
            :disable="isLoading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { authService } from 'src/services';

const router = useRouter();

const credentials = ref({
  username: '',
  password: '',
});

const showPassword = ref(false);
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const response = await authService.login(credentials.value);
    authService.setToken(response.token);
    
    Notify.create({
      type: 'positive',
      message: 'Login successful!',
      position: 'top',
    });
    
    await router.push('/todos');
  } catch (error: unknown) {
    console.error('Login error:', error);
    const axiosError = error as { response?: { data?: { message?: string } } };
    Notify.create({
      type: 'negative',
      message: axiosError?.response?.data?.message || 'Login failed. Please check your credentials.',
      position: 'top',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
