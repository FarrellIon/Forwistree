<template>
    <Navbar></Navbar>
    <div id="event-detail" v-if="eventDetail">
        <div class="px-8 lg:px-32 mb-4">
            <p><span class="opacity-50">Home > </span>{{ eventDetail.judul }}</p>
        </div>
        <div class="event-grid px-8 lg:px-32 grid mb-32" style="grid-template-columns: 1fr 1fr;">
            <div class="main-container left-side">
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
                </div>
                <div id="cara-bergabung" class="content" v-else-if="openTab['cara_bergabung'].value">
                </div>
                <div id="syarat-lainnya" class="content" v-else-if="openTab['syarat_lainnya'].value">
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
    const { id } = useRoute().params;
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
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
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/admin/event/`+id, {
            headers: {
                userValue: userValue,
            }
        });

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

    updateTime();
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .main-container.left-side{
        display: grid;
        grid-template-columns: 3fr 1fr;
        margin-right: 2rem;
    }

    .main-container.right-side{
        position: relative;

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
    }

    @media (max-width: 1244px) {
        #event-detail{
            .event-grid{
                grid-template-columns: 1fr !important;
            }
        }

        .main-container.left-side{
            display: block;
            margin: 0 auto;
        }
    }

    @media (max-width: 500px) {
        .main-container.left-side{
            .main-image{
                width: auto;
            }
        }

        .tabs .tab{
            font-size: 16px;
        }
    }
</style>