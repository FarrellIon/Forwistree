<template>
    <div v-if="categories" class="categories px-32 mb-8">
        <h2 class="header-font" style="font-size: 24px; font-weight: bold; margin-bottom: 1rem">Kategori</h2>
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
                        slidesPerView: 5,
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
                <SwiperSlide v-for="category in categories">
                    <NuxtLink :to="`/categories/${category.id}`">
                        <div class="category">
                            <div class="images">
                                <div v-for="buku in category.buku.slice(0,2)" class="image">
                                    <img :src="buku.gambar_buku[0].image" alt="">
                                </div>
                            </div>
                            <p class="nama">{{ category.nama }}</p>
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
    let categories;

    const fetchCategories = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/kategori`, {
            headers: {
                userValue: userValue,
            }
        });

        return fetchResult.data._rawValue.kategori;
    }
    categories = await fetchCategories();
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .categories{
        .category{
            background: $cream;
            padding: 1rem;
            border-radius: 8px;

            .images{
                display: flex;
                justify-content: center;
                align-items: end;
                margin-bottom: 1rem;

                .image{
                    img{
                        max-width: 96px;
                        max-height: 140px;
                    }
                }
                .image:nth-child(2){
                    img{
                        max-width: 48px;
                        max-height: 140px;
                    }
                }
            }

            .nama{
                color: $primary;
                font-weight: bold;
                font-size: 20px;
                text-align: center;
            }
        }
    }
</style>