<template>
    <div v-if="kategoriDetail">
        <Navbar :active="'categories'"></Navbar>
        <div class="px-8 lg:px-32 mb-16">
            <div class="category category-big" v-if="maxDiskon > 0">
                <div class="left-side">
                    <div class="container">
                        <p class="title header-font">Kategori {{ kategoriDetail.nama }}</p>
                        <div class="stick-bottom">
                            <p class="paragraph-font">Diskon Hingga</p>
                            <h2 class="percentage paragraph-font">{{ maxDiskon }}%</h2>
                        </div>
                    </div>
                    <div class="triangle"></div>
                </div>
                <div class="right-side">
                    <div class="container">
                        <NuxtLink v-for="buku in kategoriDetail.buku.slice(0,3)" :to="`/books/${buku.id}`">
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
                    </div>
                </div>
            </div>
            <div class="category category-small" v-if="maxDiskon > 0">
                <div class="left-side">
                    <div class="container">
                        <p class="title header-font">Kategori {{ kategoriDetail.nama }}</p>
                        <div class="stick-bottom">
                            <p class="paragraph-font">Diskon Hingga</p>
                            <h2 class="percentage paragraph-font">{{ maxDiskon }}%</h2>
                        </div>
                    </div>
                </div>
                <div class="right-side">
                    <div class="container">
                        <NuxtLink v-for="buku in kategoriDetail.buku.slice(0,4)" :to="`/books/${buku.id}`">
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
                        <NuxtLink v-for="buku in kategoriDetail.buku.slice(0,4)" :to="`/books/${buku.id}`">
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
                        <NuxtLink v-for="buku in kategoriDetail.buku.slice(0,4)" :to="`/books/${buku.id}`">
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
                        <NuxtLink v-for="buku in kategoriDetail.buku.slice(0,4)" :to="`/books/${buku.id}`">
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
                    </div>
                </div>
            </div>
            <div class="filter">
                <div class="left-side">
                    <div class="filter-header">
                        <div class="header-container">
                            <img src="assets/images/filter.png" alt="">
                            <p>FILTER</p>
                        </div>
                        <div class="filter-group">
                            <p class="filter-title">Kategori</p>
                            <p :class="{'filter-element': true, 'active': id=='semua'}">
                                <NuxtLink :to="`/categories/semua`">Semua</NuxtLink>
                            </p>
                            <p v-for="kategori in listKategori" :class="{'filter-element': true, 'active': kategori.nama == kategoriDetail.nama}">
                                <NuxtLink :to="`/categories/${kategori.id}`">{{ kategori.nama }}</NuxtLink>
                            </p>
                        </div>
                        <div class="filter-group">
                            <p class="filter-title">Jumlah Halaman</p>
                            <p class="filter-halaman filter-element active" data-min-page-param='0' data-max-page-param='99999' @click="filter($event, 'jumlah_halaman')">Semua</p>
                            <p class="filter-halaman filter-element" data-min-page-param='0' data-max-page-param='100' @click="filter($event, 'jumlah_halaman')">< 100</p>
                            <p class="filter-halaman filter-element" data-min-page-param='101' data-max-page-param='200' @click="filter($event, 'jumlah_halaman')">101 - 200</p>
                            <p class="filter-halaman filter-element" data-min-page-param='201' data-max-page-param='300' @click="filter($event, 'jumlah_halaman')">201 - 300</p>
                            <p class="filter-halaman filter-element" data-min-page-param='300' data-max-page-param='99999' @click="filter($event, 'jumlah_halaman')">> 300</p>
                        </div>
                        <div class="filter-group">
                            <p class="filter-title">Diskon</p>
                            <p class="filter-diskon filter-element active" data-min-diskon-param='0' data-max-diskon-param='100' @click="filter($event, 'diskon')">Semua</p>
                            <p class="filter-diskon filter-element" data-min-diskon-param='0' data-max-diskon-param='0' @click="filter($event, 'diskon')">0%</p>
                            <p class="filter-diskon filter-element" data-min-diskon-param='1' data-max-diskon-param='15' @click="filter($event, 'diskon')">1 - 15%</p>
                            <p class="filter-diskon filter-element" data-min-diskon-param='16' data-max-diskon-param='30' @click="filter($event, 'diskon')">16 - 30%</p>
                            <p class="filter-diskon filter-element" data-min-diskon-param='30' data-max-diskon-param='100' @click="filter($event, 'diskon')">> 30%</p>
                        </div>
                    </div>
                </div>
                <div class="right-side">
                    <div class="header">
                        <p class="header-title">
                            Menampilkan
                            <div v-if="id != 'semua'">
                                <span class="text-primary">{{ filteredBuku.length }}</span> Buku
                                <span class="font-bold">"{{ kategoriDetail.nama }}"</span>
                            </div>
                            <span v-else> semua buku <span class="text-primary">({{ filteredBuku.length }} Buku)</span></span>
                            <p class="filter-text">Filter : 
                                <span v-if="maxDiskonParam != 0 && maxDiskonParam != 100" class="mr-2">Diskon <span class="text-primary">{{minDiskonParam}}% - {{maxDiskonParam}}%</span>,</span>
                                <span v-else>Diskon diatas <span class="text-primary">{{ minDiskonParam }}%</span>, </span>
                                <span v-if="maxPageParam != 0 && maxPageParam != 99999" ><span class="text-primary">{{minPageParam}} - {{maxPageParam}}</span> halaman</span>
                                <span v-else>Diatas <span class="text-primary">{{ minPageParam }}</span> halaman</span>
                            </p>
                        </p>
                        <div class="pagination-container">
                            <div class="pagination">
                                <template>
                                    <UPagination v-model="page" :page-count="numberPerPage" :total="filteredBuku.length" />
                                </template>
                            </div>
                            <div class="dropdown">
                                <template>
                                    <client-only>
                                        <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-start' }">
                                            <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
                                        </UDropdown>
                                    </client-only>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-if="filteredBuku == 'loading'" class="text-center text-3xl font-bold">Loading...</div>
                    <div v-else-if="filteredBuku.length > 0" class="body">
                        <div v-for="buku in filteredBuku.slice((page - 1) * numberPerPage, ((page - 1) * numberPerPage) + numberPerPage)">
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
                        </div>
                    </div>
                    <div v-else class="text-center text-3xl font-bold">Tidak ada buku dengan filter yang dipilih / dalam kategori ini.</div>
                </div>
            </div>
        </div>
        <KirimkanKarya></KirimkanKarya>
        <Footer></Footer>
    </div>
    <div class="loading" v-else>
        <p class="text-center" style="font-size: 44px; margin: 8rem 0">Loading...</p>
    </div>
</template>

<script setup>
    definePageMeta({
        colorMode: 'light',
    })
    const { id } = useRoute().params;
    const config = useRuntimeConfig();
    const page = ref(1);
    const numberPerPage = ref(999);
    const dropdownItems = [
        [
            {
                label: 'Terbaru',
                icon: 'i-heroicons-calendar-20-solid'
            },
            {
                label: 'Terlama',
                icon: 'i-heroicons-arrow-path-20-solid'
            },
            {
                label: 'Harga Terrendah',
                icon: 'i-heroicons-banknotes-20-solid'
            },
            {
                label: 'Harga Tertinggi',
                icon: 'i-heroicons-currency-dollar-20-solid'
            }
        ]
    ]

    let kategoriDetail = ref();
    let filteredBuku = ref();
    let listKategori = ref();
    let fetchedKategoriDetail = ref();
    let maxDiskon = ref();
    let minDiskonParam = ref(0);
    let maxDiskonParam = ref(100);
    let minPageParam = ref(0);
    let maxPageParam = ref(99999);

    const fetchKategoriDetail = async () => {
        if(id == 'semua'){
            let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku`);
            
            if(fetchResult.data._rawValue){
                filteredBuku.value = fetchResult.data._rawValue.buku;
                kategoriDetail.value = [];
            }else{
                setTimeout(fetchKategoriDetail, 2000)
                filteredBuku.value = null;
            }
        }else{
            let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/kategori/${id}?minDiskonParam=${minDiskonParam.value}&maxDiskonParam=${maxDiskonParam.value}&minPageParam=${minPageParam.value}&maxPageParam=${maxPageParam.value}`);

            if(fetchResult.data._rawValue){
                fetchedKategoriDetail.value = fetchResult.data._rawValue;
                kategoriDetail.value = fetchedKategoriDetail.value.kategori;
                filteredBuku.value = fetchedKategoriDetail.value.filteredBuku;
                maxDiskon.value = fetchedKategoriDetail.value.maxDiskon;
            }else{
                setTimeout(fetchKategoriDetail, 2000)
                fetchedKategoriDetail.value = null;
            }
        }
    }
    
    const fetchListKategori = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/kategori`);

        if(fetchResult.data._rawValue){
            listKategori.value = fetchResult.data._rawValue.kategori;
        }else{
            setTimeout(fetchListKategori, 2000)
            listKategori.value = null;
        }
    }

    const filter = (event, filterType) => {
        if(filterType == 'jumlah_halaman'){
            const elements = document.getElementsByClassName('filter-halaman');

            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove('active');
            }
            minPageParam.value = event.target.getAttribute('data-min-page-param');
            maxPageParam.value = event.target.getAttribute('data-max-page-param');
        }else if(filterType == 'diskon'){
            const elements = document.getElementsByClassName('filter-diskon');

            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove('active');
            }
            minDiskonParam.value = event.target.getAttribute('data-min-diskon-param');
            maxDiskonParam.value = event.target.getAttribute('data-max-diskon-param');
        }
        event.target.classList.add('active');

        filteredBuku.value = 'loading';
        fetchKategoriDetail();
    }

    onMounted(() => {
        fetchKategoriDetail();
        fetchListKategori();
    });
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    html, body{
        height: 100vh;
    }
    
    .triangle {
        border-left: 160px solid $primary;
        border-right: 160px solid $cream;
        border-bottom: 160px solid $cream;
        border-top: 160px solid $primary;
        display: inline-block;
    }

    .category{
        background: $cream;
        display: grid;
        border-radius: 8px;
        grid-template-columns: 3fr 4fr;
        gap: 4rem;
        margin-bottom: 2rem;

        .left-side{
            background: $primary;
            border-radius: 8px 0 0 8px;
            color: $white;
            display: flex;
            width: calc(100% + 160px);
            position: relative;
            min-height: 320px;

            .triangle{
                position: absolute;
                right: 0;
                z-index: 0;
            }

            .container{
                padding: 3rem;
                position: relative;

                .title{
                    font-size: 32px;
                    display: inline;
                }
    
                .percentage{
                    font-size: 64px;
                    font-weight: bold;
                }

                .stick-bottom{
                    position: absolute;
                    bottom: 3rem;
                    left: 3rem;
                }
            }            

            *{
                z-index: 1;
            }
        }

        .right-side{
            border-radius: 8px;
            
            .container{
                display: flex;
                align-items: center;
                column-gap: 1rem;
                width: 100%;
                height: 100%;
            }

            .book{
                padding: 1rem;
                border-radius: 8px;
                position: relative;
                max-width: 180px;

                .image{
                    img{
                        margin: 0 auto;
                        max-height: 190px;
                    }
                }

                .nama{
                    font-size: 14px;
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
    }

    .filter{
        display: grid;
        grid-template-columns: 1fr 5fr;
        column-gap: 2rem;

        .left-side{
            padding: 1rem;

            .filter-header{
                .header-container{
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    font-weight: bold;
                    font-size: 20px;
                    
                    img{
                        width: 28px;
                        height: 28px;
                    }
                }

                .filter-group{
                    margin-bottom: 1.5rem;

                    .filter-title{
                        font-weight: bold;
                        font-size: 16px;
                        margin-bottom: 0.5rem;
                    }

                    .filter-element{
                        font-size: 14px;
                        transition: 0.3s all ease-out;

                        &.active{
                            color: $primary;
                        }

                        &:hover{
                            color: $primary;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        .right-side{
            padding: 1rem;
        }

        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;

            .header-title{
                font-size: 18px;
            }

            .pagination-container{
                display: flex;
                column-gap: 2rem;
                align-items: center;
            }
        }

        .body{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 2rem;

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
    }

    .category-small{
        display: none;
    }

    @media(max-width: 1000px){
        .filter{
            .body{
                grid-template-columns: 1fr 1fr;
            }
        }
    }

    @media(max-width: 900px){
        .category-big{
            display: none;
        }

        .category-small{
            display: block;
        }

        .category{
            .left-side{
                width: 100%;
                border-radius: 8px;
                min-height: 0;
                justify-content: center;

                .container{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .stick-bottom{
                        position: relative;
                        bottom: 0;
                        left: 0;
                    }
                }
            }

            .right-side{
                border-radius: 0 0 8px 8px;

                .container{
                    margin: 0 auto;
                    overflow-x: scroll;
                }
            }
        }
    }
    
    @media(max-width: 540px){
        .left-side{
            .container{
                display: block !important;
                padding: 2rem !important;

                .stick-bottom{
                    margin-top: 1.5rem;
                }
            }
        }

        .filter{
            .body{
                grid-template-columns: 1fr;
            }
        }
    }
</style>