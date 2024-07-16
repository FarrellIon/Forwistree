<template>
    <div id="form-login" class="flex justify-center items-center px-8 lg:px-32 pt-8 pb-16" style="gap: 2rem;">
        <div class="image" style="flex-grow: 1">
            <img src="assets/images/login-vector.png" alt="">
        </div>
        <div class="form relative py-16" style="width: 70%">
            <NuxtLink :to="`/`">
                <p class="text-primary top-0 right-0 absolute">Kembali Ke Beranda</p>
            </NuxtLink>
            <h2 class="font-bold text-3xl mb-8">Login Admin</h2>
            <UForm id="form-data" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup class="mb-4" v-slot="{ error }" label="Username" :error="!state.username && 'Anda harus menginput username'" help="">
                    <UInput v-model="state.username" type="username" placeholder="Masukkan username anda" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UFormGroup class="mb-4" v-slot="{ error }" label="Password" :error="!state.password && 'Anda harus menginput password'" help="">
                    <UInput v-model="state.password" type="text" placeholder="Masukkan nama pena anda" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"/>
                </UFormGroup>
                <UButton type="submit">
                    Login
                </UButton>
            </UForm>
        </div>
    </div>
    <UModal v-model="isOpen" prevent-close>
        <UCard id="modal-card" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h3 style="font-weight: bold; font-size: 22px; text-align: center;">{{ modalHeader }}</h3>
            </template>

            <img :src="modalImage" alt="">
            <p style="text-align: center; margin-bottom: 1rem;" v-html="modalContent"></p>
            <div v-if="canCloseModal" class="flex justify-center">
                <UButton label="Tutup" @click="isOpen = false" />
            </div>
        </UCard>
    </UModal>
</template>

<script setup>
    const options = ref([]);

    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let isOpen = ref(false);
    let canCloseModal = ref(false);
    let modalHeader = ref("Loading...");
    let modalContent = ref("Sedang login...");
    let modalImage = ref(`${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`);

    const state = reactive({
        username: undefined,
        password: undefined
    });

    const onSubmit = async (event) => {
        modalHeader.value = "Loading...";
        modalContent.value = "Sedang login...";
        modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
        canCloseModal.value = false;

        const formData = new FormData();
        formData.append('username', state.username);
        formData.append('password', state.password);
        
        isOpen.value = true;

        try{
            const formResult = await $fetch(`${config.public.API_HOST}/api/auth/login`, {
                method: 'POST',
                body: formData
            });

            await navigateTo('/admin');
        }catch (error){
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Username atau password anda salah!';
            canCloseModal.value = true;
        }
    }
</script>

<style lang="scss">
    @import '../assets/scss/global/global';

    #form-login{
        width: 90vw;
        margin: auto;
        height: 90vh;
        border-radius: 16px;
        margin-top: 5vh;
        padding: 1rem 4rem;
    }

    .bg-primary-500{
        --tw-bg-opacity: 1;
        background-color: $primary;
    }
    
    .hover\:bg-primary-600:hover{
        --tw-bg-opacity: 1;
        background-color: $secondary;
    }
    
    #form-login .focus\:ring-primary-500:focus{
        --tw-ring-opacity: 1;
        --tw-ring-color: #0F7292 !important;
    }

    #modal-card{
        img{
            width: 96px;
            height: 96px;
            margin: 0 auto;
            margin-bottom: 1rem;
        }
    }

    @media(max-width: 840px){
        
    }
</style>