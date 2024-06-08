<template>
    <div class="px-32 py-16">
        <h1 class="header-font" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic"><span class="text-primary">Testimonials</span></h1>
        <p class="main-paragraph paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie.</p>

        <div v-if="!bukuLimitedSale">
            Loading...
        </div>
        <div v-else>
            <div class="relative flex justify-center items-center" style="column-gap: 2rem">
                <div id="swiper-prev-btn3" style="transform: rotate(180deg)">
                    <img src="assets/images/chevron.png" alt="">
                </div>
                <Swiper
                    :modules="[SwiperAutoplay, SwiperNavigation]"
                    :slides-per-view="1"
                    :space-between="20"
                    :autoplay="{
                        delay: 8000,
                        disableOnInteraction: true,
                    }"
                    :loop="true"
                    :breakpoints="{
                        680: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },
                    }"
                    :navigation="{
                        nextEl: '#swiper-next-btn3',
                        prevEl: '#swiper-prev-btn3',
                    }"
                >
                    <SwiperSlide>
                        <div class="testimonial grid" style="grid-template-columns: 2fr 8fr;">
                            <img src="assets/images/quote.png" alt="" class="quote">
                            <div class="right-side">
                                <p class="string">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>
                                <div class="user flex items-center gap-4">
                                    <img src="assets/images/testimonial-profile.png" alt="" class="profile-picture">
                                    <div class="bio">
                                        <p class="text-primary">Test</p>
                                        <h2>Scott Green</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div class="testimonial grid" style="grid-template-columns: 2fr 8fr;">
                            <img src="assets/images/quote.png" alt="" class="quote">
                            <div class="right-side">
                                <p class="string">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>
                                <div class="user flex items-center gap-4">
                                    <img src="assets/images/testimonial-profile.png" alt="" class="profile-picture">
                                    <div class="bio">
                                        <p class="text-primary">Test</p>
                                        <h2>Scott Green</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div class="testimonial grid" style="grid-template-columns: 2fr 8fr;">
                            <img src="assets/images/quote.png" alt="" class="quote">
                            <div class="right-side">
                                <p class="string">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>
                                <div class="user flex items-center gap-4">
                                    <img src="assets/images/testimonial-profile.png" alt="" class="profile-picture">
                                    <div class="bio">
                                        <p class="text-primary">Test</p>
                                        <h2>Scott Green</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div class="testimonial grid" style="grid-template-columns: 2fr 8fr;">
                            <img src="assets/images/quote.png" alt="" class="quote">
                            <div class="right-side">
                                <p class="string">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>
                                <div class="user flex items-center gap-4">
                                    <img src="assets/images/testimonial-profile.png" alt="" class="profile-picture">
                                    <div class="bio">
                                        <p class="text-primary">Test</p>
                                        <h2>Scott Green</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
                <div id="swiper-next-btn3">
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

        return fetchResult.data._rawValue.buku;
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
    
    .testimonial{
        background: #FFFBF5;
        box-shadow: 10px 10px 5px -6px rgba(0,0,0,0.2);
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border-top: 8px solid #0F7292;
        padding: 2rem;
        margin-bottom: 1rem;

        .quote{
            width: 44px;
            height: 44px;
        }

        .string{
            font-size: 18px;
            line-height: 1.4;
            margin-top: 1.5rem;
            margin-bottom: 2rem;
        }

        .bio{
            h2{
                font-weight: bolder;
                font-size: 18px;
            }
        }
    }

    #swiper-prev-btn3:hover, #swiper-next-btn3:hover{
        cursor: pointer;
    }
</style>