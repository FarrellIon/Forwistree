<template>
    <Navbar></Navbar>
    <div id="event-detail" v-if="eventDetail">
        <div class="px-8 lg:px-32 mb-4">
            <p><span class="opacity-50">Home > </span>{{ eventDetail.judul }}</p>
        </div>
        <div class="event-grid flex px-8 lg:px-32 mb-16">
            <div v-if="eventDetail.gambar_event" class="main-container left-side">
                <div class="relative flex justify-center items-center" style="column-gap: 2rem">
                    <div id="swiper-prev-btn" style="transform: rotate(180deg); cursor: pointer;">
                        <img src="assets/images/chevron.png" alt="">
                    </div>
                    <Swiper
                        id="swiper-event"
                        style="margin: 0 !important; width: 100%"
                        :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
                        :slides-per-view="1"
                        :space-between="20"
                        :autoplay="{
                            delay: 2000,
                            disableOnInteraction: true,
                        }"
                        :pagination="true"
                        :loop="true"
                        :centered-slides="true"
                        :navigation="{
                            nextEl: '#swiper-next-btn',
                            prevEl: '#swiper-prev-btn',
                        }"
                    >
                        <SwiperSlide v-for="gambar in eventDetail.gambar_event">
                            <div class="event-image">
                                <img :src="gambar.image" alt="">
                            </div>
                        </SwiperSlide>
                    </Swiper>
                    <div id="swiper-next-btn" style="cursor: pointer;">
                        <img src="assets/images/chevron.png" alt="">
                    </div>
                </div>
            </div>
            <div class="main-container right-side">
                <span class="paragraph-font event-title">{{ eventDetail.judul }}</span>
                <p class="mb-8">{{ (eventDetail.deskripsi.length > 500) ? eventDetail.deskripsi.substring(0, 500)+'...' : eventDetail.deskripsi }}</p>
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
                <div class="mitra-event">
                    <img v-for="mitra in eventDetail.pivot_mitra_event" class="gambar-mitra" :src="mitra.mitra.image" :alt="mitra.mitra.nama" :title="mitra.mitra.nama">
                </div>
            </div>
        </div>
        <div class="mt-16 mr-4 px-8 lg:px-32">
            <div class="tabs">
                <div :class="(openTab['timeline'].value ? 'tab active' : 'tab')" @click="changeValue('timeline')">
                    <p>Timeline</p>
                </div>
                <div :class="(openTab['cara_bergabung'].value ? 'tab active' : 'tab')" @click="changeValue('cara_bergabung')">
                    <p>Cara Bergabung</p>
                </div>
                <div :class="(openTab['syarat_lainnya'].value ? 'tab active' : 'tab')" @click="changeValue('syarat_lainnya')">
                    <p>Syarat & Lainnya</p>
                </div>
            </div>
            <div class="tab-content">
                <div id="timeline" class="content" v-if="openTab['timeline'].value">
                    <div class="single-timeline">
                        <div v-if="isBeforeToday(eventDetail.tanggal_selesai_pendaftaran)" class="timeline-circle finished tailed">
                            <img src="assets/images/check.png" alt="" style="filter: invert(1)">
                        </div>
                        <div v-else class="timeline-circle tailed">
                        </div>
                        <div>
                            <h2>Pendaftaran</h2>
                            <p v-if="eventDetail.tanggal_mulai_pendaftaran == eventDetail.tanggal_selesai_pendaftaran">{{ $dayjs(eventDetail.tanggal_mulai_pendaftaran).format('D MMMM YYYY') }}</p>
                            <p v-else>{{ $dayjs(eventDetail.tanggal_mulai_pendaftaran).format('D MMMM YYYY') }} - {{ $dayjs(eventDetail.tanggal_selesai_pendaftaran).format('D MMMM YYYY') }}</p>
                        </div>
                    </div>
                    <div class="single-timeline">
                        <div v-if="isBeforeToday(eventDetail.tanggal_pembukaan)" class="timeline-circle finished tailed">
                            <img src="assets/images/check.png" alt="" style="filter: invert(1)">
                        </div>
                        <div v-else class="timeline-circle tailed">
                        </div>
                        <div>
                            <h2>Pembukaan</h2>
                            <p>{{ $dayjs(eventDetail.tanggal_pembukaan).format('D MMMM YYYY') }}</p>
                        </div>
                    </div>
                    <div class="single-timeline">
                        <div v-if="isBeforeToday(eventDetail.tanggal_selesai_event)" class="timeline-circle finished tailed">
                            <img src="assets/images/check.png" alt="" style="filter: invert(1)">
                        </div>
                        <div v-else class="timeline-circle tailed">
                        </div>
                        <div>
                            <h2>Event</h2>
                            <p v-if="eventDetail.tanggal_mulai_event == eventDetail.tanggal_selesai_event">{{ $dayjs(eventDetail.tanggal_mulai_event).format('D MMMM YYYY') }}</p>
                            <p v-else>{{ $dayjs(eventDetail.tanggal_mulai_event).format('D MMMM YYYY') }} - {{ $dayjs(eventDetail.tanggal_selesai_event).format('D MMMM YYYY') }}</p>
                        </div>
                    </div>
                    <div class="single-timeline">
                        <div v-if="isBeforeToday(eventDetail.tanggal_penutupan)" class="timeline-circle finished">
                            <img src="assets/images/check.png" alt="" style="filter: invert(1)">
                        </div>
                        <div v-else class="timeline-circle">
                        </div>
                        <div>
                            <h2>Penutupan</h2>
                            <p>{{ $dayjs(eventDetail.tanggal_penutupan).format('D MMMM YYYY') }}</p>
                        </div>
                    </div>
                </div>
                <div id="cara-bergabung" class="content" v-else-if="openTab['cara_bergabung'].value">
                    <h2 class="text-2xl mb-2"><b>Cara Bergabung</b></h2>
                    <p>{{ eventDetail.cara_bergabung }}</p>
                </div>
                <div id="syarat-lainnya" class="content" v-else-if="openTab['syarat_lainnya'].value">
                    <h2 class="text-2xl mb-2"><b>Syarat</b></h2>
                    <p class="mb-8">{{ eventDetail.syarat }}</p>
                    <h2 class="text-2xl mb-2"><b>Hadiah</b></h2>
                    <p class="mb-8">{{ eventDetail.hadiah }}</p>
                    <h2 class="text-2xl mb-2"><b>Contact Person</b></h2>
                    <p class="mb-8">{{ eventDetail.contact_person }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="loading" v-else>
        <p class="text-center" style="font-size: 44px; margin: 8rem 0">Loading...</p>
    </div>
    <Footer></Footer>
</template>

<script setup>
    definePageMeta({
        colorMode: 'light',
    })
    import dayjs from 'dayjs';

    const { id } = useRoute().params;
    const config = useRuntimeConfig();
    let openTab = {
        timeline: ref(true),
        cara_bergabung: ref(false),
        syarat_lainnya: ref(false)
    }
    let eventDetail = ref();
    let timeRemaining = {
        total: ref(0),
        days: ref(0),
        hours: ref(0),
        minutes: ref(0),
        seconds: ref(0)
    }

    const fetchEventDetail = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/admin/event/`+id);

        if(fetchResult.data._rawValue){
            eventDetail.value = fetchResult.data._rawValue.event;
        }else{
            setTimeout(fetchEventDetail, 2000)
            eventDetail.value = null;
        }
    }

    onMounted(() => {
        fetchEventDetail();
        setInterval(updateTime, 1000);
    });

    function changeValue(tabName){
        openTab['timeline'].value = false;
        openTab['cara_bergabung'].value = false;
        openTab['syarat_lainnya'].value = false;
        openTab[tabName].value = true;
    }

    const updateTime = () => {
        if(eventDetail.value){
            timeRemaining['total'].value = Math.round((new Date(eventDetail.value.tanggal_penutupan) - new Date()) / 1000);
            timeRemaining['days'].value = Math.floor(timeRemaining['total'].value / 86400);
            timeRemaining['hours'].value = Math.floor((timeRemaining['total'].value % 86400) / 3600);
            timeRemaining['minutes'].value = Math.floor((timeRemaining['total'].value % 3600) / 60);
            timeRemaining['seconds'].value = Math.floor(timeRemaining['total'].value % 60);
        }
    }

    const isBeforeToday = (date) => {
        return dayjs(date).isBefore(dayjs(), 'day')
    }

    updateTime();
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .main-container.left-side{
        width: 428px;

        .swiper-slide{
            width: 100% !important;
        }

        .event-image{
            width: 320px;
            height: 320px;
        }
    }

    .main-container.right-side{
        position: relative;
        padding: 0 2rem;
        flex-grow: 1;

        .event-title{
            font-weight: bold;
            font-size: 32px;
        }

        .time{
            display: flex;
            column-gap: 1rem;
            margin-bottom: 2rem;

            div{
                border-radius: 4px;
                background: $primary-light;
                padding: 0.25rem 0.75rem;

                .number{
                    font-weight: bold;
                    color: $primary;
                    font-size: 32px;
                    text-align: center;
                }

                .measurement{
                    font-size: 16px;
                    margin-bottom: 8px;
                    opacity: 50%;
                    text-align: center;
                }
            }
        }

        .mitra-event{
            display: flex;
            gap: 1rem;
            
            .gambar-mitra{
                width: 64px;
                height: 64px;
                border-radius: 50%;
            }
        }
    }

    .tabs{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        text-align: center;

        .tab{
            font-size: 20px;
            padding: 1rem;
            opacity: 50%;
            border-bottom: 1px solid $black;
            transition: 0.3s all ease-in;

            &.active{
                color: $primary;
                opacity: 100%;
                border-bottom: 1px solid $primary;
            }

            &:hover{
                cursor: pointer;
                color: $primary;
                border-bottom: 1px solid $primary;
                opacity: 1;
            }
        }
    }

    .tab-content{
        padding: 2rem;

        #timeline{
            .single-timeline{
                display: flex;
                align-items: center;
                margin-bottom: 2rem;

                .timeline-circle{
                    border-radius: 50%;
                    border: 2px solid $dark-grey;
                    background: white;
                    width: 24px;
                    height: 24px;
                    margin-left: 20px;
                    padding: 0.25rem;
                    margin-right: calc(1rem + 20px);
                    position: relative;

                    &.finished{
                        background: $primary;
                        border: none;
                        width: 64px;
                        height: 64px;
                        margin-left: 0;
                        margin-right: 1rem;
                        padding: 1rem;

                        &.tailed::after{
                            content: '';
                            position: absolute;
                            left: 50%;
                            width: 5px;
                            bottom: -76px;
                            height: 56px;
                            background: $primary;
                            border-style: solid;
                            transform: translate(-50%, -50%);
                        }
                    }

                    &.tailed::after{
                        content: '';
                        position: absolute;
                        left: 50%;
                        width: 5px;
                        bottom: -104px;
                        height: 80px;
                        z-index: -1;
                        background: $dark-grey;
                        border-style: solid;
                        transform: translate(-50%, -50%);
                    }
                }

                h2{
                    color: $primary;
                    font-weight: bold;
                    font-size: 20px;
                }
            }
        }
    }

    @media (max-width: 870px) {
        #event-detail{
            .event-grid{
                display: block;
            }
        }

        .main-container.left-side{
            display: block;
            margin: 0 auto;

            .relative{
                margin-bottom: 2rem;
            }
        }
    }

    @media (max-width: 500px){
        .time{
            gap: 0 !important;

            div{
                background: transparent !important;
                padding: 0.25rem 0.5rem !important;
            }
        }
        
        .main-container.left-side{
            display: flex;
            justify-content: center;
            width: 320px !important;

            .relative{
                width: 240px !important;
            }
            .swiper{
                width: 160px !important;
            }
            .swiper-slide{
                display: flex;
                justify-content: center;
            }
            .event-image{
                width: 160px;
                height: 160px;
            }
        }

        .tab-content{
            padding: 1rem 0.25rem;
        }
    }
</style>