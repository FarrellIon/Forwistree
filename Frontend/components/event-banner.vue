<template>
    <div v-if="eventOngoing" class="event-banner px-32" style="margin-bottom: 4rem">
        <div class="event-banner-container grid" style="grid-template-columns: 2fr 3fr 2fr;">
            <p class="label">Event Sekarang</p>
            <div class="images flex items-center">
                <div class="image" v-for="gambar in eventOngoing.gambar_event.slice(0,3)">
                    <img :src="gambar.image" alt="">
                </div>
            </div>
            <div class="content"> 
                <h3 class="title header-font">{{ eventOngoing.judul }}</h3>
                <p class="description paragraph-font">{{ eventOngoing.deskripsi }}</p>
            </div>
            <div class="right-side">
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
                <NuxtLink :to="`/events/${eventOngoing.id}`">
                    <div class="see-details">
                        <p>See Details ></p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let timeRemaining = {
        total: ref(0),
        days: ref(0),
        hours: ref(0),
        minutes: ref(0),
        seconds: ref(0)
    }

    let eventOngoing = ref();

    const fetchEventOngoing = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/admin/event/ongoing`, {
            headers: {
                userValue: userValue,
            }
        });

        if(fetchResult.data._rawValue){
            eventOngoing.value = fetchResult.data._rawValue.event;
        }else{
            setTimeout(fetchEventOngoing, 2000)
            eventOngoing.value = null;
        }
    }

    onMounted(() => {
        fetchEventOngoing();
        setInterval(updateTime, 1000);
    });

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
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .event-banner{
        .event-banner-container{
            background: $cream;
            border-radius: 1rem;
            padding: 1rem;
            position: relative;

            .label{
                background: $primary;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 1rem 0 0.25rem 0;
                padding: 0.25rem 1rem;
                color: $white;
            }

            .images{
                margin-top: 2rem;
                .image{
                    max-width: 96px;
                    max-height: 96px;
                }
                .image:nth-child(1){
                    opacity: 50%;
                    transform: translateX(64px);
                    z-index: 0;
                }
                .image:nth-child(2){
                    max-width: 160px;
                    max-height: 160px;
                    z-index: 1;
                }
                .image:nth-child(3){
                    opacity: 50%;
                    transform: translateX(-64px);
                    z-index: 0;
                }
            }
            .content{
                margin-top: 2rem;

                .title{
                    font-size: 28px;
                    font-weight: bold;
                }
                .description{
                    opacity: 80%;
                }
            }
        }

        .right-side{
            position: relative;

            .time{
                position: absolute;
                top: 1rem;
                right: 1rem;
                display: flex;
                column-gap: 1rem;

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
            
            .see-details{
                position: absolute;
                bottom: 1rem;
                right: 1rem;
                background: $primary;
                color: $white;
                border-radius: 32px;
                padding: 0.25rem 1rem;
            }
        }
    }
</style>