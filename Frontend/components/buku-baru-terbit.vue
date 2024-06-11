<template>
    <div class="px-32 py-16">
        <!-- <form id="formAddBuku" @submit.prevent="handleSubmit">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nama">
                Nama Buku
            </label>
            <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" v-model="state.nama" name="nama" type="text" placeholder="Input nama buku">
            <p class="text-red-500 text-xs italic">Silahkan isi nama buku.</p>

            <button id="submitFormAddBuku">Submit</button>
        </form> -->
        <h1 class="header-font" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">Buku Baru <span class="text-primary">Terbit</span></h1>
        <p class="main-paragraph paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>

        <div v-if="!bukuBaruTerbit">
            Loading...
        </div>
        <div v-else>
            <div class=" relative flex justify-center items-center" style="column-gap: 2rem">
                <div id="swiper-prev-btn" style="transform: rotate(180deg)">
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
                    :breakpoints="{
                        1140: {
                            slidesPerView: 4,
                            spaceBetween: 60
                        },
                        680: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },
                    }"
                    :navigation="{
                        nextEl: '#swiper-next-btn',
                        prevEl: '#swiper-prev-btn',
                    }"
                >
                    <SwiperSlide v-for="book in bukuBaruTerbit" :key="book._id">
                        <NuxtLink :to="`/books/${book.id}`">
                            <div class="book-container-swiper">
                                <img data-aos="fade-up" data-aos-offset="-10" data-aos-duration="800" :src="book.gambar_buku[0].image" alt="">
                                <p class="paragraph-font font-bold text-center mt-4" data-aos="fade-up" data-aos-offset="-10" data-aos-duration="800" data-aos-easing="ease-out-cubic">{{ book.nama }}</p>
                                <p class="paragraph-font text-center mb-8" data-aos="fade-up" data-aos-offset="-50" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ book.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                                <p class="paragraph-font text-center" data-aos="fade-up" data-aos-offset="-50" data-aos-duration="1100" data-aos-easing="ease-out-cubic">Diterbitkan : <span class="text-primary">{{ $dayjs(book.tanggal_terbit).format('D MMM YYYY') }}</span></p>
                            </div>
                        </NuxtLink>
                    </SwiperSlide>
                </Swiper>
                <div id="swiper-next-btn">
                    <img src="assets/images/chevron.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // const state = reactive({
    //     nama: undefined
    // });

    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let bukuBaruTerbit = [];
    
    const login = async () => {
        let fetchResult = await $fetch(`${config.public.API_HOST}/api/auth/login`, {
            method: 'POST',
            body: {
                username: 'Farrell2',
                password: '1234'
            }
        });

        return fetchResult;
    }

    const loginResult = await login();
    if(loginResult.message == "Berhasil Login"){
        userValue.value = loginResult.id;
    }

    const fetchBukuBaruTerbit = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku/recently-published`, {
            headers: {
                userValue: userValue,
            }
        });

        return fetchResult.data._rawValue.buku;
    }
    bukuBaruTerbit = await fetchBukuBaruTerbit();

    // const handleSubmit = async () => {
    //     formData = new FormData();

    //     for (const key of Object.keys(state)) {
    //         const value = state[key];
    //         formData.append(key, value);
    //     }

    //     formResult = await $fetch(`${config.public.API_HOST}/api/database/buku`, {
    //         method: 'POST',
    //         body: formData
    //     });
    // }

    // const url = ``;
    // const { data: books } = await useFetch(url);
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
        }
    }

    #swiper-prev-btn:hover, #swiper-next-btn:hover{
        cursor: pointer;
    }
</style>