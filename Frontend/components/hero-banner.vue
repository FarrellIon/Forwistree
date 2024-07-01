<template>
    <div class="hero-banner flex p-8 sm:p-8 md:p-0 lg:p-0 md:pl-16 lg:pl-32 md:py-16 lg:py-32 lg:px-0 items-center">
        <div class="left-side">
            <h1 class="header-font" data-aos="fade-right" data-aos-duration="800" data-aos-easing="ease-out-cubic">Jelajahi Dunia Buku Bersama <span class="text-primary">Forwistree</span></h1>
            <p class="main-paragraph paragraph-font" data-aos="fade-right" data-aos-duration="1100" data-aos-easing="ease-out-cubic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie. Praesent consectetur ligula eget ex dapibus, sit amet malesuada leo lobortis.</p>
            <div class="explore-button" data-aos="fade-right" data-aos-duration="1400" data-aos-easing="ease-out-cubic">
                <p>Explore</p>
                <img src="assets/images/right-arrow-primary.png" alt="">
            </div>
        </div>
        <div class="right-side hidden md:block lg:block" data-aos="fade-left" data-aos-duration="1000" data-aos-easing="ease-out-cubic">
            <img src="assets/images/hero-book.png" alt="">
        </div>
    </div>
</template>

<script setup>
    
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .hero-banner{
        background: $cream;
        justify-content: start;
        gap: 8rem;

        h1{
            font-size: 56px;
            font-weight: bold;
            margin-bottom: 1rem;
        }

        .main-paragraph{
            font-size: 20px;
            opacity: 70%;
            color: $black;
            line-height: 1.25;
            margin-bottom: 1rem;
        }

        .left-side, .right-side{
            flex: 1;
        }

        .explore-button{
            display: flex;
            align-items: center;
            gap: 1rem;

            p{
                font-size: 24px;
                color: $primary;
            }
        }
    }

    @media (max-width: 1024px) {
        .hero-banner{
            gap: 2rem;
        }

        h1.header-font{
            font-size: 44px;
        }
    }
</style>