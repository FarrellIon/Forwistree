<template>
    <Navbar></Navbar>
    <div id="buku-detail" v-if="bukuDetail">
        <div class="px-8 lg:px-32 mb-4">
            <p><span class="opacity-50">Home > {{ bukuDetail.kategori.nama }} > </span>{{ bukuDetail.nama }}</p>
        </div>
        <div class="book-grid px-8 lg:px-32 grid mb-32" style="grid-template-columns: 1fr 1fr;">
            <div class="main-container left-side">
                <div class="main-image rounded">
                    <img :src="mainImage" alt="">
                    <div class="favorite-button rounded-full">
                        <img src="assets/images/heart.png" alt="">
                    </div>
                </div>
                <div class="other-images">
                    <div v-for="(gambar, index) in bukuDetail.gambar_buku" :class="(index === 0 ? 'active other-image' : 'other-image')" :key="gambar.id" @click="changeImage(gambar.image, $event)">
                        <img :src="gambar.image" alt="">
                    </div>
                </div>
            </div>
            <div class="main-container right-side">
                <span class="paragraph-font book-title">{{ bukuDetail.nama }}</span>
                <div v-if="bukuDetail.diskon > 0" class="book-discount inline-block">-{{ bukuDetail.diskon }}%</div>
                <p class="book-writer italic mb-2">{{ bukuDetail.pivot_penulis_buku[0].penulis.nama_pena }}</p>
                <div class="flex items-end mb-4">
                    <p class="book-final-price">{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bukuDetail.harga * ((100 - bukuDetail.diskon)/100)) }}</p>
                    <p v-if="bukuDetail.diskon > 0" class="book-initial-price"><s>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bukuDetail.harga) }}</s></p>
                </div>
                <p class="mb-8">{{ (bukuDetail.deskripsi.length > 500) ? bukuDetail.deskripsi.substring(0, 500)+'...' : bukuDetail.deskripsi }}</p>
                <div class="flex justify-end w-100">
                    <a :href="bukuDetail.link_shopee">
                        <div class="shopee-button flex justify-center items-center px-4 py-2 rounded gap-3">
                            <img src="assets/images/logo/shopee.png" alt="">
                            <p>Cek di Shopee ></p>
                        </div>
                    </a>
                </div>
            </div>
            <div class="mt-16 mr-4">
                <div class="tabs">
                    <div :class="(openTab['sinopsis'].value ? 'tab active' : 'tab')" @click="changeValue('sinopsis')">
                        <p>Synopsis</p>
                    </div>
                    <div :class="(openTab['detail_buku'].value ? 'tab active' : 'tab')" @click="changeValue('detail_buku')">
                        <p>Detail Buku</p>
                    </div>
                    <div :class="(openTab['tentang_penulis'].value ? 'tab active' : 'tab')" @click="changeValue('tentang_penulis')">
                        <p>Tentang Penulis</p>
                    </div>
                </div>
                <div class="tab-content">
                    <div id="sinopsis" class="content" v-if="openTab['sinopsis'].value">
                        <p>{{ bukuDetail.deskripsi }}</p>
                    </div>
                    <div id="detail-buku" class="content" v-else-if="openTab['detail_buku'].value">
                        <div class="grid-detail-buku grid items-center" style="grid-template-columns: 1fr 1fr; gap: 0.75rem">
                            <div class="flex detail-row items-center" style="gap: 0.75rem">
                                <img src="assets/images/category.png" alt="">
                                <p>Kategori</p>
                            </div>
                            <p>{{ bukuDetail.kategori.nama }}</p>
                            <div class="flex detail-row items-center" style="gap: 0.75rem">
                                <img src="assets/images/book.png" alt="">
                                <p>Jumlah Halaman</p>
                            </div>
                            <p>{{ bukuDetail.jumlah_halaman }} Halaman</p>
                            <div class="flex detail-row items-center" style="gap: 0.75rem">
                                <img src="assets/images/tag.png" alt="">
                                <p>Harga Setelah Diskon</p>
                            </div>
                            <p>{{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bukuDetail.harga * ((100 - bukuDetail.diskon)/100)) }}</p>
                        </div>
                    </div>
                    <div id="tentang-penulis" class="content" v-else-if="openTab['tentang_penulis'].value">
                        <div class="flex">
                            <img src="assets/images/blank.png" class="rounded-full" alt="">
                            <div>
                                <h3 class="nama-penulis">{{ bukuDetail.pivot_penulis_buku[0].penulis.nama_pena }}</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere vitae metus eget consequat. Proin laoreet eget arcu ut dapibus. Suspendisse volutpat elementum felis eu tincidunt.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-16 ml-4 reviews">
                <div class="tab active mb-4">
                    <p>Reviews</p>
                </div>
                <div>
                    <a :href="bukuDetail.link_shopee">
                        <div class="shopee-button w-100 flex justify-center items-center px-4 py-2 rounded gap-3">
                            <img src="assets/images/logo/shopee.png" alt="">
                            <p>Cek di Shopee ></p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="loading" v-else>
        <p class="text-center" style="font-size: 44px; margin: 8rem 0">Loading...</p>
    </div>
    <Footer></Footer>
</template>

<script setup>
    const { id } = useRoute().params;
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    let openTab = {
        sinopsis: ref(true),
        detail_buku: ref(false),
        tentang_penulis: ref(false)
    }
    let mainImage = ref();
    let bukuDetail = ref();

    const fetchBukuDetail = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku/`+id, {
            headers: {
                userValue: userValue,
            }
        });

        if(fetchResult.data._rawValue){
            bukuDetail.value = fetchResult.data._rawValue.buku;
            mainImage.value = bukuDetail.value.gambar_buku[0].image;
        }else{
            setTimeout(fetchBukuDetail, 2000)
            bukuDetail.value = null;
            mainImage.value = null;
        }
    }

    onMounted(() => {
        fetchBukuDetail();
    });

    function changeValue(tabName){
        openTab['sinopsis'].value = false;
        openTab['detail_buku'].value = false;
        openTab['tentang_penulis'].value = false;
        openTab[tabName].value = true;
    }

    function changeImage(image, event){
        mainImage.value = image;
        document.querySelectorAll('.other-image').forEach(elem => {
            elem.classList.remove('active');
        });
        event.target.parentElement.classList.add('active');
    }
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .main-container.left-side{
        display: grid;
        grid-template-columns: 3fr 1fr;
        margin-right: 2rem;

        .main-image{
            display: flex;
            justify-content: center;
            align-items: center;
            background: $cream;
            padding: 2rem;
            position: relative;
            width: 400px;
            height: 400px;
            
            img{
                max-height: 100%;
            }

            .favorite-button{
                background: $light-grey;
                padding: 0.5rem;
                position: absolute;
                top: 1rem;
                right: 1rem;
                transition: 0.3s all ease-out;
                
                img{
                    width: 20px;
                    height: 20px;
                    transition: 0.3s all ease-out;
                }

                &:hover{
                    background: $danger;
                    cursor: pointer;

                    img{
                        filter: invert(1);
                    }
                }
            }
        }

        .other-images{
            height: 400px;
            overflow-y: scroll;
            
            .other-image{
                display: flex;
                justify-content: center;
                align-items: center;
                background: $cream;
                padding: 0.5rem;
                width: 100px;
                height: 100px;
                margin-bottom: 2rem;
                border-radius: 8px;
                transition: 0.15s all ease-in;

                img{
                    max-height: 100%;
                }

                &.active{
                    border: 1px solid $primary;
                }

                &:hover{
                    border: 1px solid $primary;
                    cursor: pointer;
                }
            }
        }
    }

    .main-container.right-side{
        .book-discount{
            background: #0F7292;
            color: white;
            border-radius: 2px;
            font-size: 12px;
            padding: 0.25rem 0.5rem;
            transform: rotate(10deg) translateY(-1.5rem) translateX(-1rem);
            margin-top: -2rem;
        }
        .book-title{
            font-weight: bold;
            font-size: 32px;
        }
        .book-writer{
            color: $primary;
        }
        .book-initial-price{
            font-size: 18px;
            opacity: 50%;
        }
        .book-final-price{
            color: $primary;
            margin-right: 1rem;
            font-size: 32px;
            font-weight: bold;
        }
        .shopee-button{
            background: #F06043;
            color: $white;
        }
    }

    .tabs{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        text-align: center;

        .tab{
            font-size: 20px;
            padding: 1rem;
            opacity: 50%;
            border-bottom: 1px solid $black;
            transition: 0.3s all ease-in;

            &.active{
                color: $primary;
                opacity: 100%;
                border-bottom: 1px solid $primary;
            }

            &:hover{
                cursor: pointer;
                color: $primary;
                border-bottom: 1px solid $primary;
                opacity: 1;
            }
        }
    }

    .tab-content{
        padding: 2rem;
    }

    .grid-detail-buku{
        .detail-row{
            opacity: 75%;

            img{
                width: 32px;
                height: 32px;
            }
        }
    }

    #tentang-penulis{
        img{
            width: 64px;
            height: 64px;
            margin-right: 2rem;
        }
        .nama-penulis{
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 1rem;
        }
    }

    .reviews{
        .shopee-button{
            background: #F06043;
            color: $white;
        }

        .tab{
            font-size: 20px;
            padding: 1rem;
            opacity: 50%;
            border-bottom: 1px solid $black;
            transition: 0.3s all ease-in;

            &.active{
                color: $primary;
                opacity: 100%;
                border-bottom: 1px solid $primary;
            }

            &:hover{
                cursor: pointer;
                color: $primary;
                border-bottom: 1px solid $primary;
                opacity: 1;
            }
        }
    }

    @media (max-width: 1244px) {
        #buku-detail{
            .book-grid{
                grid-template-columns: 1fr !important;
            }
        }

        .main-container.left-side{
            display: block;
            margin: 0 auto;

            .main-image{
                margin-bottom: 1rem;
            }

            .other-images{
                display: flex;
                gap: 1rem;
                height: auto;
            }
        }
    }

    @media (max-width: 500px) {
        .main-container.left-side{
            .main-image{
                width: auto;
            }
        }

        .tabs .tab{
            font-size: 16px;
        }
    }
</style>