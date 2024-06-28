<template>
    <div v-if="kategoriDetail">
        <Navbar :active="'categories'"></Navbar>
        <div class="px-32 mb-16">
            <div class="category" v-if="maxDiskon > 0">
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
                            <p class="filter-element">Horror</p>
                            <p class="filter-element">Romance</p>
                        </div>
                        <div class="filter-group">
                            <p class="filter-title">Jumlah Halaman</p>
                            <p class="filter-element">< 100</p>
                            <p class="filter-element">101 - 200</p>
                            <p class="filter-element">201 - 300</p>
                            <p class="filter-element">> 300</p>
                        </div>
                        <div class="filter-group">
                            <p class="filter-title">Diskon</p>
                            <p class="filter-element">0%</p>
                            <p class="filter-element">0 - 15%</p>
                            <p class="filter-element">16 - 30%</p>
                            <p class="filter-element">> 30%</p>
                        </div>
                    </div>
                </div>
                <div class="right-side">
                    <div class="header">
                        <p class="header-title">Menampilkan <span class="text-primary">{{ kategoriDetail.buku.length }}</span> Buku <span class="font-bold">"{{ kategoriDetail.nama }}"</span></p>
                        <div class="pagination-container">
                            <div class="pagination">
                                <template>
                                    <UPagination v-model="page" :page-count="numberPerPage" :total="kategoriDetail.buku.length" />
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
                    <div class="body">
                        <div v-for="buku in kategoriDetail.buku.slice((page - 1) * numberPerPage, ((page - 1) * numberPerPage) + numberPerPage)">
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
    const { id } = useRoute().params;
    const config = useRuntimeConfig();
    const userValue = useCookie('userValue');
    const page = ref(1);
    const numberPerPage = ref(5);
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
    let fetchedKategoriDetail = ref();
    let maxDiskon = ref();

    const fetchKategoriDetail = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/kategori/`+id, {
            headers: {
                userValue: userValue,
            }
        });

        if(fetchResult.data._rawValue){
            fetchedKategoriDetail.value = fetchResult.data._rawValue;
            kategoriDetail.value = fetchedKategoriDetail.value.kategori;
            maxDiskon.value = fetchedKategoriDetail.value.maxDiskon;
        }else{
            setTimeout(fetchKategoriDetail, 2000)
            fetchedKategoriDetail.value = null;
        }
    }

    onMounted(() => {
        fetchKategoriDetail();
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
            width: calc(100% + 80px);
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
            background: $cream;
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

                        &.active{
                            color: $primary;
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
</style>