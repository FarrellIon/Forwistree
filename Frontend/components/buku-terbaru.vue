<template>
    <div v-if="bukuTerbaru" class="books px-32 mb-8">
        <h2 class="header-font" style="font-size: 24px; font-weight: bold; margin-bottom: 1rem">Buku Terbaru</h2>
        <div class="relative flex justify-center items-center" style="column-gap: 2rem">
            <div id="swiper-prev-btn2" style="transform: rotate(180deg)">
                <img src="assets/images/chevron.png" alt="">
            </div>
            <Swiper
                id="swiper-limited-sale"
                style="margin: 0 !important; width: 100%"
                :modules="[SwiperAutoplay, SwiperNavigation]"
                :slides-per-view="1"
                :space-between="20"
                :autoplay="{
                    delay: 2000,
                    disableOnInteraction: true,
                }"
                :breakpoints="{
                    1140: {
                        slidesPerView: 4,
                        spaceBetween: 60
                    },
                    870: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                }"
                :navigation="{
                    nextEl: '#swiper-next-btn',
                    prevEl: '#swiper-prev-btn',
                }"
            >
                <SwiperSlide v-for="buku in bukuTerbaru.slice(0,10)">
                    <NuxtLink :to="`/books/${buku.id}`">
                        <div class="book">
                            <div class="image">
                                <img :src="buku.gambar_buku[0].image" alt="">
                            </div>
                            <p class="nama paragraph-font">{{ buku.nama }}</p>
                            <p class="final-price paragraph-font">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(buku.harga * ((100 - buku.diskon)/100)) }}</p>
                            <p v-if="buku.diskon > 0" class="initial-price paragraph-font"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(buku.harga) }}</s></p>
                            <div v-if="buku.diskon > 0" class="discount paragraph-font">-{{ buku.diskon }}%</div>
                        </div>
                    </NuxtLink>
                </SwiperSlide>
            </Swiper>
            <div id="swiper-next-btn2">
                <img src="assets/images/chevron.png" alt="">
            </div>
        </div>
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');

    let bukuTerbaru = ref();

    const fetchBukuTerbaru = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku`, {
            headers: {
                userValue: userValue,
            }
        });

        if(fetchResult.data._rawValue){
            bukuTerbaru.value = fetchResult.data._rawValue.buku;
        }else{
            setTimeout(fetchBukuTerbaru, 2000)
            bukuTerbaru.value = null;
        }
    }

    onMounted(() => {
        fetchBukuTerbaru();
    });
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .books{
        .swiper-slide{
            height: 360px;
            max-height: 360px;

            a{
                height: 100%;
                display: block;

                .book{
                    height: 100%;
                }
            }
        }

        .book{
            background: $cream;
            padding: 1rem;
            border-radius: 8px;
            position: relative;

            .image{
                margin-bottom: 1rem;

                img{
                    margin: 0 auto;
                    max-height: 196px;
                    width: auto;
                }
            }

            .nama{
                font-size: 18px;
            }

            .initial-price{
                opacity: 50%;
            }

            .final-price{
                color: $primary;
                font-weight: bold;
                font-size: 20px;
            }

            .discount{
                background: $primary;
                color: $white;
                border-radius: 4px;
                position: absolute;
                font-size: 13px;
                padding: 0.25rem 0.5rem;
                top: 1.5rem;
                right: 1.5rem;
                font-weight: bold;
            }
        }
    }
</style>