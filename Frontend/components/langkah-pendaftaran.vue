<template>
    <div class="px-8 lg:px-32 py-16" style="background: #FFFBF5">
        <div id="grid-template" class="grid" style="grid-template-columns: 6fr 4fr; column-gap: 4rem; align-items: center;">
            <div class="left-side">
                <h1 class="header-font" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">Langkah-Langkah <span class="text-primary">Penerbitan</span></h1>
                <p class="main-paragraph paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempus eros a sapien sollicitudin molestie.</p>
                <div class="langkah flex gap-8 items-start" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                    <h1 class="number-text header-font text-primary m-0">1.</h1>
                    <div class="langkah-text-container">
                        <h4 class="header-font langkah-text">Langkah Pertama</h4>
                        <p class="paragraph-font">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>
                <div class="langkah flex gap-8 items-start" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                    <h1 class="number-text header-font text-primary m-0">2.</h1>
                    <div class="langkah-text-container">
                        <h4 class="header-font langkah-text">Langkah Kedua</h4>
                        <p class="paragraph-font">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>
                <div class="langkah flex gap-8 items-start" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">
                    <h1 class="number-text header-font text-primary m-0">3.</h1>
                    <div class="langkah-text-container">
                        <h4 class="header-font langkah-text">Langkah Ketiga</h4>
                        <p class="paragraph-font">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>
                <div class="details mt-8" data-aos="fade-right" data-aos-duration="1400" data-aos-easing="ease-out-cubic">
                    <NuxtLink to="/publish">
                        <p>Ajukan Sekarang</p>
                    </NuxtLink>
                    <img src="assets/images/right-arrow-primary.png" alt="">
                </div>
            </div>
            <div class="relative hidden lg:block">
                <img src="assets/images/langkah-penerbitan.png" alt="">
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    h1{
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: left;
    }

    .main-paragraph{
        font-size: 20px;
        opacity: 70%;
        color: $black;
        line-height: 1.25;
        margin-bottom: 2rem;
        text-align: left;
    }

    .number-text{
        font-size: 44px;
        min-width: 40px;
        max-width: 40px;
        text-shadow: -4px -4px 0px rgba(15,14,146,0.2);
    }

    .langkah-text{
        font-size: 26px;
        margin-top: 0.5rem;
    }

    .langkah{
        margin-bottom: 0.5rem;
    }

    .details{
        display: flex;
        align-items: center;
        gap: 1rem;

        p{
            font-size: 20px;
            color: $primary;
        }
    }

    @media (max-width: 1024px) {
        #grid-template{
            grid-template-columns: 1fr !important;
        }
    }
</style>