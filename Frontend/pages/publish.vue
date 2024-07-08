<template>
    <Navbar :active="'publish'"></Navbar>
    <div id="form-pengajuan" class="flex justify-center items-center px-8 lg:px-32 pt-8 pb-16" style="gap: 2rem;">
        <div class="form" style="width: 70%">
            <UForm id="form-data" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="konfirmasi flex mb-4">
                    <UFormGroup id="dont-bold" class="checkbox-item mr-4" name="checkbox" label="Konfirmasi">
                        <UCheckbox v-model="state.checkbox" label="Sudah pernah mengajukan sebelumnya?" />
                    </UFormGroup>
                    <UFormGroup name="pengaju" label="Pilih Pengaju" :error="!state.pengaju && 'Anda harus memilih pengaju' && state.checkbox" style="flex-grow: 1">
                        <USelectMenu v-model="state.pengaju" placeholder="Pilih pengaju..." :options="options" :disabled="!state.checkbox"/>
                    </UFormGroup>
                </div>
                <UFormGroup class="mb-4" v-slot="{ error }" label="Email" :error="!state.email && 'Anda harus menginput email' && !state.checkbox" help="">
                    <UInput v-model="state.email" type="email" placeholder="Masukkan email anda" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" :disabled="state.checkbox"/>
                </UFormGroup>
                <UFormGroup class="mb-4" v-slot="{ error }" label="Nama Pena" :error="!state.nama_pena && 'Anda harus menginput nama pena' && !state.checkbox" help="">
                    <UInput v-model="state.nama_pena" type="text" placeholder="Masukkan nama pena anda" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" :disabled="state.checkbox"/>
                </UFormGroup>
                <UFormGroup v-slot="{ error }" label="No Whatsapp" :error="!state.no_wa && 'Anda harus menginput nomor whatsapp' && !state.checkbox" help="">
                    <UInput v-model="state.no_wa" type="text" placeholder="Masukkan nomor whatsapp anda" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" :disabled="state.checkbox"/>
                </UFormGroup>
                <UFormGroup v-slot="{ error }" label="File Sinopsis" :error="!state.file_sinopsis && 'Anda harus menginput file sinopsis'">
                    <UInput v-model="state.file_sinopsis" type="file" size="md" @change="handleFileUpload($event)" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"  icon="i-heroicons-folder" />
                </UFormGroup>
                <UButton type="submit">
                    Kirim Pengajuan
                </UButton>
            </UForm>
        </div>
        <div class="image" style="flex-grow: 1">
            <img src="assets/images/publish.png" alt="">
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
    <Footer></Footer>
</template>

<script setup>
    const options = ref([]);

    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let pengaju = ref();
    let isOpen = ref(false);
    let canCloseModal = ref(false);
    let modalHeader = ref("Loading...");
    let modalContent = ref("Pengajuan anda sedang diproses...");
    let modalImage = ref("https://forwistree.vercel.app/_nuxt/assets/images/information.png");

    const fetchPengaju = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/pengajuan/pengajuan/get/pengaju`, {
            headers: {
                userValue: userValue.value,
            }
        });

        if(fetchResult.data._rawValue){
            if(fetchResult.data._rawValue.msg == 'Belum ada data pengaju'){
                pengaju.value = null;
            }else{
                pengaju.value = fetchResult.data._rawValue.pengaju;
                const apiOptions = fetchResult.data._rawValue.pengaju.map(item => {
                    return { label: item.nama_pena, id: item.id };
                });
                options.value = options.value.concat(apiOptions);
            }
        }else{
            setTimeout(fetchPengaju, 2000)
            pengaju.value = null;
        }
    }

    const state = reactive({
        email: undefined,
        nama_pena: undefined,
        no_wa: undefined,
        pengaju: undefined,
        checkbox: false,
        file_sinopsis: undefined
    });

    const handleFileUpload = (files) => {
        const file = files[0];
        state.file_sinopsis = file;
    }

    const onSubmit = async (event) => {
        modalHeader.value = "Loading...";
        modalContent.value = "Pengajuan anda sedang diproses...";
        modalImage.value = "https://forwistree.vercel.app/_nuxt/assets/images/information.png";
        canCloseModal.value = false;

        const formData = new FormData();
        formData.append('email', state.email);
        formData.append('nama_pena', state.nama_pena);
        formData.append('no_wa', state.no_wa);
        formData.append('checkbox', state.checkbox);
        if(state.pengaju){
            formData.append('pengaju', state.pengaju.id);
        }
        formData.append('file_sinopsis', state.file_sinopsis);
        
        isOpen.value = true;
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/pengajuan/pengajuan`, {
            method: 'POST',
            body: formData,
            headers: {
                userValue: userValue.value,
            }
        });
        
        if(formResult.msg == 'Berhasil'){
            modalHeader.value = "Berhasil";
            modalImage.value = "https://forwistree.vercel.app/_nuxt/assets/images/success.png";
            modalContent.value = "Pengajuan berhasil dikirim, kami akan secepatnya hubungi melalui WhatsApp!";
            canCloseModal.value = true;
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = "https://forwistree.vercel.app/_nuxt/assets/images/failed.png";
            modalContent.value = 'Pengajuan gagal dikirim, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }

    onMounted(() => {
        fetchPengaju();
    });
</script>

<style lang="scss">
    @import '~/assets/scss/global/global';

    ::selection {
        color: $white;
        background: $primary;
    }
    
    #dont-bold label.text-sm{
        font-weight: 400;
    }
    
    #form-pengajuan .focus\:ring-primary-500:focus{
        --tw-ring-opacity: 1;
        --tw-ring-color: #0F7292 !important;
    }

    #form-pengajuan .disabled\:opacity-75:disabled{
        opacity: 0.3 !important;
    }

    #form-pengajuan .text-primary-500{
        --tw-text-opacity: 1;
        color: $primary;
    }

    .bg-primary-500{
        --tw-bg-opacity: 1;
        background-color: $primary;
    }
    
    .hover\:bg-primary-600:hover{
        --tw-bg-opacity: 1;
        background-color: $secondary;
    }

    #modal-card{
        img{
            width: 96px;
            height: 96px;
            margin: 0 auto;
            margin-bottom: 1rem;
        }
    }

    @media (max-width: 640px) {
        #form-pengajuan{
            display: block;

            .form{
                width: 100% !important;
            }

            .konfirmasi{
                display: block;

                .checkbox-item{
                    margin-bottom: 1rem;
                    margin-right: 0;
                }
            }
        }
    }
</style>