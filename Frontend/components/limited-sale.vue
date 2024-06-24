<template>
    <div class="px-32 py-16">
        <h1 class="header-font" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">Limited <span class="text-primary">Sale</span></h1>
        <p class="main-paragraph paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>

        <div v-if="!bukuLimitedSale">
            Loading...
        </div>
        <div v-else>
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
                    :centeredSlides="true"
                    :autoplay="{
                        delay: 2000,
                        disableOnInteraction: true,
                    }"
                    :loop="true"
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
                        nextEl: '#swiper-next-btn2',
                        prevEl: '#swiper-prev-btn2',
                    }"
                >
                    <SwiperSlide v-for="book in bukuLimitedSale" :key="book._id">
                        <NuxtLink :to="`/books/${book.id}`">
                            <div class="book-hover book-container-swiper">
                                <img :src="book.gambar_buku[0].image" alt="">
                                <p class="paragraph-font font-bold text-center mt-4" data-aos="fade-up" data-aos-offset="-10" data-aos-duration="800" data-aos-easing="ease-out-cubic">{{ book.nama }}</p>
                                <p class="text-primary paragraph-font text-center mb-4"  data-aos="fade-up" data-aos-offset="-50" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ book.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                                <div class="book-price" style="column-gap: 1rem">
                                    <p class="book-final-price text-center">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga * ((100 - book.diskon)/100)) }}</p>
                                    <div class="flex justify-center" style="column-gap: 0.5rem">
                                        <p v-if="book.diskon > 0" class="book-initial-price text-center"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga) }}</s></p>
                                        <div class="book-discount">-{{ book.diskon }}%</div>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </SwiperSlide>
                    <SwiperSlide v-for="book in bukuLimitedSale" :key="book._id">
                        <NuxtLink :to="`/books/${book.id}`">
                            <div class="book-container-swiper">
                                <img :src="book.gambar_buku[0].image" alt="">
                                <p class="paragraph-font font-bold text-center mt-4" data-aos="fade-up" data-aos-offset="-10" data-aos-duration="800" data-aos-easing="ease-out-cubic">{{ book.nama }}</p>
                                <p class="text-primary paragraph-font text-center mb-4"  data-aos="fade-up" data-aos-offset="-50" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ book.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                                <div class="book-price" style="column-gap: 1rem">
                                    <p class="book-final-price text-center">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga * ((100 - book.diskon)/100)) }}</p>
                                    <div class="flex justify-center" style="column-gap: 0.5rem">
                                        <p v-if="book.diskon > 0" class="book-initial-price text-center"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga) }}</s></p>
                                        <div class="book-discount">-{{ book.diskon }}%</div>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </SwiperSlide>
                    <SwiperSlide v-for="book in bukuLimitedSale" :key="book._id">
                        <NuxtLink :to="`/books/${book.id}`">
                            <div class="book-container-swiper">
                                <img :src="book.gambar_buku[0].image" alt="">
                                <p class="paragraph-font font-bold text-center mt-4" data-aos="fade-up" data-aos-offset="-10" data-aos-duration="800" data-aos-easing="ease-out-cubic">{{ book.nama }}</p>
                                <p class="text-primary paragraph-font text-center mb-4"  data-aos="fade-up" data-aos-offset="-50" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ book.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                                <div class="book-price" style="column-gap: 1rem">
                                    <p class="book-final-price text-center">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga * ((100 - book.diskon)/100)) }}</p>
                                    <div class="flex justify-center" style="column-gap: 0.5rem">
                                        <p v-if="book.diskon > 0" class="book-initial-price text-center"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga) }}</s></p>
                                        <div class="book-discount">-{{ book.diskon }}%</div>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </SwiperSlide>
                    <SwiperSlide v-for="book in bukuLimitedSale" :key="book._id">
                        <NuxtLink :to="`/books/${book.id}`">
                            <div class="book-container-swiper">
                                <img :src="book.gambar_buku[0].image" alt="">
                                <p class="paragraph-font font-bold text-center mt-4" data-aos="fade-up" data-aos-offset="-10" data-aos-duration="800" data-aos-easing="ease-out-cubic">{{ book.nama }}</p>
                                <p class="text-primary paragraph-font text-center mb-4"  data-aos="fade-up" data-aos-offset="-50" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ book.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                                <div class="book-price" style="column-gap: 1rem">
                                    <p class="book-final-price text-center">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga * ((100 - book.diskon)/100)) }}</p>
                                    <div class="flex justify-center" style="column-gap: 0.5rem">
                                        <p v-if="book.diskon > 0" class="book-initial-price text-center"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(book.harga) }}</s></p>
                                        <div class="book-discount">-{{ book.diskon }}%</div>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </SwiperSlide>
                </Swiper>
                <div id="swiper-next-btn2">
                    <img src="assets/images/chevron.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let bukuLimitedSale = [];

    const fetchBukuLimitedSale = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku/limited-sale`, {
            headers: {
                userValue: userValue,
            }
        });

        if(fetchResult.data._rawValue){
            return fetchResult.data._rawValue.buku;
        }else{
            return null;
        }
    }

    bukuLimitedSale = await fetchBukuLimitedSale();
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    h1{
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
    }

    .main-paragraph{
        font-size: 20px;
        opacity: 70%;
        color: $black;
        line-height: 1.25;
        margin-bottom: 3rem;
        text-align: center;
    }
    
    .book-hover:hover{
        cursor: pointer;
    }

    .book-container-swiper{
        img{
            aspect-ratio: 28/40;
            width: 100%;
            margin: 0 auto;
        }
    }

    #swiper-prev-btn2:hover, #swiper-next-btn2:hover{
        cursor: pointer;
    }

    .swiper-slide{
        transition: 0.3s all ease-out;
    }

    .swiper-slide-prev, .swiper-slide-next, .swiper-slide{
        opacity: 70%;
        transform: scale(0.75);
    }

    .swiper-slide-active{
        opacity: 100%;
        transform: scale(1);
    }

    .book-final-price{
        font-size: 24px;
        font-weight: bold;
    }

    .book-initial-price{
        opacity: 50%;
    }

    .book-discount{
        background: #0F7292;
        color: white;
        border-radius: 2px;
        font-size: 14px;
        padding: 0.25rem 0.5rem;
    }
</style>