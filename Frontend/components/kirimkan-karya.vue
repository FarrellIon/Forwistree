<template>
    <div class="kirimkan-karya px-32 py-16">
        <div class="left-side">
            <p class="title header-font mb-8">Kirimkan Karya Anda!</p>
            <p class="description paragraph-font mb-16">Kami mengundang Anda untuk menjadi bagian dari perjalanan kreatif kami. Kami percaya bahwa setiap cerita memiliki nilai dan keunikan tersendiri. Jadi, jika Anda memiliki impian untuk melihat karya Anda terbit, kami dengan senang hati menyambutnya!</p>
            <div class="flex justify-start items-center gap-4">
                <div class="kirim-button paragraph-font">
                    Kirimkan Karya >
                </div>
                <p class="pelajari-lebih paragraph-font">Pelajari Lebih</p>
            </div>
        </div>
        <div class="right-side">
            <div class="images">
                <img v-for="buku in bukuTerbaru.slice(0,3)" :src="buku.gambar_buku[0].image" alt="">
            </div>
        </div>
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let bukuTerbaru;

    const fetchBukuTerbaru = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku`, {
            headers: {
                userValue: userValue,
            }
        });

        return fetchResult.data._rawValue.buku;
    }
    bukuTerbaru = await fetchBukuTerbaru();
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .kirimkan-karya{
        background: $cream;
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;

        .left-side{
            .title{
                font-weight: bold;
                font-size: 32px;
            }

            .kirim-button{
                background: $primary;
                border-radius: 16px;
                color: $white;
                width: 196px;
                text-align: center;
                font-weight: bold;
                padding: 0.25rem 0;
            }

            .pelajari-lebih{
                color: $primary;
            }
        }

        .right-side{
            .images{
                display: flex;
                align-items: center;
                justify-content: end;
                height: 100%;
                gap: 2rem;

                img{
                    max-height: 240px;
                }
            }
        }
    }
</style>