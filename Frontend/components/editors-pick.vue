<template>
    <div v-if="bukuEditorsPick" class="px-8 lg:px-32 py-16" style="background: #FFFBF5">
        <h1 class="block lg:hidden header-font" style="text-align: center; margin-bottom: 2rem;" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">Editor's <span class="text-primary">Pick</span></h1>
        <div id="grid-template" class="lg:grid" style="grid-template-columns: 4fr 6fr">
            <div class="book-images relative">
                <img :src="bukuEditorsPick.gambar_buku[0].image" class="z-10 relative" alt="">
                <img id="img-second" :src="bukuEditorsPick.gambar_buku[1].image" class="absolute right-16 -bottom-4 z-0" alt="">
            </div>
            <div class="right-side">
                <h1 class="hidden lg:block header-font" data-aos="fade-up" data-aos-duration="800" data-aos-easing="ease-out-cubic">Editor's <span class="text-primary">Pick</span></h1>
                <p class="book-title font-bold paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ bukuEditorsPick.nama }}</p>
                <p class="book-writer font-normal italic paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ bukuEditorsPick.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                <div class="book-category">
                    <NuxtLink :to="`/categories/${bukuEditorsPick.kategori.id}`">
                        {{ bukuEditorsPick.kategori.nama }}
                    </NuxtLink>
                </div>
                <p class="main-paragraph paragraph-font" data-aos="fade-up" data-aos-duration="1100" data-aos-easing="ease-out-cubic">{{ (bukuEditorsPick.deskripsi.length > 300) ? bukuEditorsPick.deskripsi.substring(0, 300)+'...' : bukuEditorsPick.deskripsi }}</p>
                <div class="bottom-part flex justify-between">
                    <div class="book-price flex items-end" style="column-gap: 1rem">
                        <p class="book-final-price">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bukuEditorsPick.harga * ((100 - bukuEditorsPick.diskon)/100)) }}</p>
                        <p v-if="bukuEditorsPick.diskon > 0" class="book-initial-price"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bukuEditorsPick.harga) }}</s></p>
                    </div>
                    <NuxtLink :to="`/books/${bukuEditorsPick.id}`">
                        <div class="book-hover details" data-aos="fade-right" data-aos-duration="1400" data-aos-easing="ease-out-cubic">
                            <p>Lihat Detil</p>
                            <img src="assets/images/right-arrow-primary.png" alt="">
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let bukuEditorsPick = ref();

    const fetchBukuEditorsPick = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku/editors-pick`, {
            headers: {
                userValue: userValue,
            }
        });

        if(fetchResult.data._rawValue){
            bukuEditorsPick.value = fetchResult.data._rawValue.buku;
        }else{
            setTimeout(fetchBukuEditorsPick, 2000)
            bukuEditorsPick.value = null;
        }
    }

    onMounted(() => {
        fetchBukuEditorsPick();
    });
</script>

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
        margin-bottom: 3rem;
        text-align: left;
    }
    
    .book-hover:hover{
        cursor: pointer;
    }
    
    .right-side{
        .book-title{
            font-size: 18px;
        }

        .book-writer{
            font-size: 16px;
        }

        .book-category{
            border: 1px solid black;
            color: black;
            border-radius: 2px;
            width: 80px;
            text-align: center;
            padding: 0.25rem 1rem;
            margin: 0.5rem 0 1rem 0;
            transition: 0.3s all ease-in;

            &:hover{
                color: white;
                background: #0F7292;
                border: 1px solid #0F7292;
                cursor: pointer;
            }
        }

        .book-initial-price{
            font-size: 18px;
            opacity: 50%;
        }

        .book-final-price{
            color: #0F7292;
            font-size: 32px;
            font-weight: bold;
        }

        .details{
            display: flex;
            align-items: center;
            gap: 1rem;

            p{
                font-size: 24px;
                color: $primary;
            }
        }
    }

    #img-second{
        width: 40%;
        height: 65%;
    }

    @media (max-width: 1200px) {
        #grid-template{
            grid-template-columns: 5fr 5fr !important;

            #img-second{
                bottom: 1rem;
                width: 60% !important;
                right: 2rem;
            }
        }
    }

    @media (max-width: 1024px) {
        #grid-template{
            .book-images{
                img{
                    width: 100%;
                    max-width: 240px;
                    height: auto;
                }
            }
        }

        .book-images{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-bottom: 1rem;
            
            #img-second{
                position: static;
            }
        }
    
        .book-hover{
            p{
                width: 100%;
            }
            img{
                width: 96px;
            }
        }

        .book-title, .book-writer{
            text-align: center;
        }
    }
    
    @media (max-width: 768px) {
        .book-hover{
            margin-top: 1rem;
        }

        .book-hover p{
            width: auto;
        }
        
        .bottom-part{
            display: block;
        }
    }
</style>