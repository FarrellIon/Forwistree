<template>
    <div style="display: grid; grid-template-columns: 1fr 9fr">
        <AdminSidebar></AdminSidebar>
        <UCard class="w-full" :ui="{
            base: '',
            ring: '',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">
            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Todos
                </h2>
            </template>

            <!-- Filters -->
            <div class="flex items-center justify-between gap-3 px-4 py-3">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

                <UButton icon="i-heroicons-plus" color="primary" size="xs">
                    Tambah Buku
                </UButton>
            </div>

            <!-- Header and Action buttons -->
            <div class="flex justify-between items-center w-full px-4 py-3">
                <div class="flex items-center gap-1.5">
                    <span class="text-sm leading-5">Rows per page:</span>

                    <USelect v-model="pageCount" :options="[5, 10, 20]" class="me-2 w-20" size="xs" />
                </div>

                <div class="flex gap-1.5 items-center">
                    <USelectMenu v-model="selectedColumns" :options="columns" multiple>
                        <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
                            Columns
                        </UButton>
                    </USelectMenu>
                </div>
            </div>

            <!-- Table -->
            <UTable v-model="selectedRows" :rows="filteredBooks" :columns="columnsTable" :loading="pending"
                sort-asc-icon="i-heroicons-arrow-up" sort-desc-icon="i-heroicons-arrow-down" sort-mode="manual"
                class="w-full" :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'gray' } } }"
                @select="select">

                <template #jumlah_halaman-data="{ row }">
                    {{ row.jumlah_halaman }} Halaman
                </template>

                <template #harga-data="{ row }">
                    {{ Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.harga) }}
                </template>

                <template #diskon-data="{ row }">
                    {{ row.diskon }}%
                </template>

                <template #status_bestseller-data="{ row }">
                    <UBadge size="xs" :label="row.status_bestseller ? 'Bestseller' : '-'"
                        :color="row.status_bestseller ? 'primary' : 'transparent'" />
                </template>

                <template #actions-data="{ row }">
                    <UButton class="edit mr-2" icon="i-heroicons-pencil" size="2xs" color="orange" variant="outline"
                        :ui="{ rounded: 'rounded-full' }" square />

                    <UButton class="delete" icon="i-heroicons-trash" size="2xs" color="red" variant="outline"
                        :ui="{ rounded: 'rounded-full' }" square />
                </template>
            </UTable>

            <!-- Number of rows & Pagination -->
            <template #footer>
                <div class="flex flex-wrap justify-between items-center">
                    <div>
                        <span class="text-sm leading-5">
                            Showing
                            <span class="font-medium">{{ pageFrom }}</span>
                            to
                            <span class="font-medium">{{ pageTo }}</span>
                            of
                            <span class="font-medium">{{ pageTotal }}</span>
                            results
                        </span>
                    </div>

                    <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" :ui="{
                        wrapper: 'flex items-center gap-1',
                        rounded: '!rounded-full min-w-[32px] justify-center',
                        default: {
                            activeButton: {
                                variant: 'outline'
                            }
                        }
                    }" />
                </div>
            </template>
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    colorMode: 'light',
})

// Columns
const columns = [{
    key: 'number',
    label: '#',
}, {
    key: 'nama',
    label: 'Nama',
}, {
    key: 'kategori.nama',
    label: 'Kategori',
}, {
    key: 'jumlah_halaman',
    label: 'Jumlah Halaman',
}, {
    key: 'harga',
    label: 'Harga',
}, {
    key: 'diskon',
    label: 'Diskon',
}, {
    key: 'status_bestseller',
    label: 'Status Bestseller',
}, {
    key: 'actions',
    label: 'Actions',
}]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Selected Rows
const selectedRows = ref([])

function select(row) {
    const index = selectedRows.value.findIndex((item) => item.id === row.id)
    if (index === -1) {
        selectedRows.value.push(row)
    } else {
        selectedRows.value.splice(index, 1)
    }
}

const search = ref('')
const pending = ref(true)

// Pagination
const sort = ref({ column: 'id', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0) // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Data
let listBuku = ref([]);
const config = useRuntimeConfig();
const userValue = useCookie('userValue');

const fetchListBuku = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku`, {
        headers: {
            userValue: userValue,
        }
    });

    if(fetchResult.data._rawValue){
        listBuku.value = fetchResult.data._rawValue.buku.map((book, index) => ({
          ...book,
          number: index + 1
        }));
        pending.value = false;
        pageTotal.value = listBuku.value.length
    }else{
        setTimeout(fetchListBuku, 2000)
        listBuku.value = [];
        pending.value = true;
    }
}

const filteredBooks = computed(() => {
    if (!search.value) {
        return listBuku.value;
    }
    return listBuku.value.filter(book =>
        book.nama.toLowerCase().includes(search.value.toLowerCase())
    );
});

onMounted(() => {
    fetchListBuku();
});
</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';
    .bg-primary-500{
        background-color: $primary;
    }
    
    button.bg-primary-500{
        background-color: $primary;

        &:hover{
            background-color: $secondary;
        }
    }
</style>