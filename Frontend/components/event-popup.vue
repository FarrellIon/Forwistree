<template>
    <div>
        <UModal id="modal-popup" v-model="showPopup" prevent-close>
            <UCard v-if="!loading" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <div id="content-popup" class="content" style="display: grid; grid-template-columns: 3fr 5fr; column-gap: 2rem;">
                    <div class="left-side flex justify-center items-center">
                        <img id="popup-image" :src="eventOngoing.gambar_event[0].image" alt="">
                    </div>
                    <div class="right-side">
                        <div class="flex justify-center mb-4">
                            <div>
                                <div class="flex justify-center items-center mb-4">
                                    <img class="size-12 mr-4" src="assets/images/logo.png" alt="">
                                    <span class="block header-font text-xl text-primary font-bold">Forwistree</span>
                                </div>
                                <div class="time">
                                    <div class="days">
                                        <p class="number paragraph-font" v-if="timeRemaining['days'].value >= 10">{{ timeRemaining['days'].value }}</p>
                                        <p class="number paragraph-font" v-else>0{{ timeRemaining['days'].value }}</p>
                                        <p class="measurement paragraph-font">Hari</p>
                                    </div>
                                    <div class="hours">
                                        <p class="number paragraph-font" v-if="timeRemaining['hours'].value >= 10">{{ timeRemaining['hours'].value }}</p>
                                        <p class="number paragraph-font" v-else>0{{ timeRemaining['hours'].value }}</p>
                                        <p class="measurement paragraph-font">Jam</p>
                                    </div>
                                    <div class="minutes">
                                        <p class="number paragraph-font" v-if="timeRemaining['minutes'].value >= 10">{{ timeRemaining['minutes'].value }}</p>
                                        <p class="number paragraph-font" v-else>0{{ timeRemaining['minutes'].value }}</p>
                                        <p class="measurement paragraph-font">Menit</p>
                                    </div>
                                    <div class="seconds">
                                        <p class="number paragraph-font" v-if="timeRemaining['seconds'].value >= 10">{{ timeRemaining['seconds'].value }}</p>
                                        <p class="number paragraph-font" v-else>0{{ timeRemaining['seconds'].value }}</p>
                                        <p class="measurement paragraph-font">Detik</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 class="title header-font mb-4 text-2xl font-bold">{{ eventOngoing.judul }}</h3>
                        <p class="description paragraph-font mb-8">{{ eventOngoing.deskripsi }}</p>
                        <h4 class="mitra-title header-font mb-4 font-bold text-xl">Mitra</h4>
                        <div class="flex">
                            <img v-for="mitra in eventOngoing.pivot_mitra_event" class="gambar-mitra" :src="mitra.mitra.image" :alt="mitra.mitra.nama" :title="mitra.mitra.nama">
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="flex items-center justify-end">
                        <UButton color="grey" variant="soft" @click="closeModal">Tutup</UButton>
                        <UButton color="primary">
                            <NuxtLink :to="`/events/${eventOngoing.id}`">
                                Lihat Detil Event
                            </NuxtLink>
                        </UButton>
                    </div>
                </div>
            </UCard>
            <div v-else>
                <h3 class="font-bold text-center text-3xl my-4">Loading...</h3>
            </div>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
    const config = useRuntimeConfig();
    const popupCookie = useCookie('showPopup', {
        maxAge: 60*60*24
    });
    const showPopup = ref(false);
    const cookieValidator = ref(false);
    const loading = ref(true);

    const closeModal = () => {
        showPopup.value = false;
        popupCookie.value = "hide";
    }

    const checkCookie = () => {
        if(popupCookie.value){
            if(popupCookie.value == "show"){
                cookieValidator.value = true;
            }
        }else{
            popupCookie.value = "show";
            cookieValidator.value = true;
        }
    }

    let timeRemaining = {
        total: ref(0),
        days: ref(0),
        hours: ref(0),
        minutes: ref(0),
        seconds: ref(0)
    }

    let eventOngoing = ref();

    const fetchEventOngoing = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/admin/event/ongoing`);

        if(fetchResult.data._rawValue){
            if(fetchResult.data._rawValue.msg == 'Tidak ada event yang sedang berlangsung'){
                eventOngoing.value = null;
            }else{
                eventOngoing.value = fetchResult.data._rawValue.event;
                if(cookieValidator.value){
                    showPopup.value = true;
                }
            }
            loading.value = false;
        }else{
            setTimeout(fetchEventOngoing, 2000)
            eventOngoing.value = null;
        }
    }

    const updateTime = () => {
        if(eventOngoing.value){
            timeRemaining['total'].value = Math.round((new Date(eventOngoing.value.tanggal_penutupan) - new Date()) / 1000);
            timeRemaining['days'].value = Math.floor(timeRemaining['total'].value / 86400);
            timeRemaining['hours'].value = Math.floor((timeRemaining['total'].value % 86400) / 3600);
            timeRemaining['minutes'].value = Math.floor((timeRemaining['total'].value % 3600) / 60);
            timeRemaining['seconds'].value = Math.floor(timeRemaining['total'].value % 60);
        }
    }

    updateTime();

    onMounted(() => {
        fetchEventOngoing();
        setInterval(updateTime, 1000);
        checkCookie();
    });
</script>

<style lang="scss">
    @import '../assets/scss/global/global';

    #modal-popup{
        .items-end{
            align-items: center !important;
        }

        .sm\:max-w-lg{
            max-width: 64rem;
        }
    }

    #popup-image{
        width: 256px;
        height: 256px;
    }
    
    .bg-primary-500{
        --tw-bg-opacity: 1;
        background-color: $primary;
    }
    
    .hover\:bg-primary-600:hover{
        --tw-bg-opacity: 1;
        background-color: $secondary;
    }
    
    @media(max-width: 1036px){
        #modal-popup{
            .sm\:max-w-lg{
                max-width: 32rem !important;
            }
        }
    }
</style>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    #modal-popup{
        position: relative;
        
        .time{
            display: flex;
            column-gap: 0.5rem;

            div{
                border-radius: 4px;
                background: $primary-light;
                padding: 0.175rem 0.5rem;

                .number{
                    font-weight: bold;
                    color: $primary;
                    font-size: 28px;
                    text-align: center;
                }

                .measurement{
                    font-size: 14px;
                    margin-bottom: 8px;
                    opacity: 50%;
                    text-align: center;
                }
            }
        }

        .gambar-mitra{
            width: 64px;
            height: 64px;
        }
    }

    @media(max-width: 1036px){
        #content-popup{
            grid-template-columns: 1fr !important;
            column-gap: 0 !important;
            padding: 1.5rem !important;
        }
    }
</style>