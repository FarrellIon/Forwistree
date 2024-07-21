<template>
    <div id="admin-panel" style="display: flex;">
        <AdminSidebar :active="'buku'" style="min-width: 158px"></AdminSidebar>
        <UCard style="flex-grow: 1;" class="w-full" :ui="{
            base: '',
            ring: '',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: { padding: 'px-4 py-5' },
            body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
            footer: { padding: 'p-4' }
        }">
            <template #header>
                <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                    Data Buku
                </h2>
            </template>

            <!-- Filters -->
            <div class="flex items-center justify-between gap-3 px-4 py-3">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

                <UButton icon="i-heroicons-plus" color="primary" size="xs" @click="openAddModal">
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
                        <UButton icon="i-heroicons-view-columns" color="gray" size="xs" class="px-12">
                            Columns
                        </UButton>
                    </USelectMenu>
                </div>
            </div>

            <!-- Table -->
            <UTable :rows="filteredBooks.slice((page - 1) * pageCount, ((page - 1) * pageCount) + pageCount)" :columns="columnsTable" :loading="pending"
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
                    <UButton class="edit mr-2" :data-id="row.id" icon="i-heroicons-pencil" size="2xs" color="orange" variant="outline" :ui="{ rounded: 'rounded-full' }" square @click="editData($event)" />

                    <UButton class="delete" :data-id="row.id" icon="i-heroicons-trash" size="2xs" color="red" variant="outline" :ui="{ rounded: 'rounded-full' }" square @click="deleteData($event)" />
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
        <UModal id="modal-add" v-model="isOpenAdd" prevent-close>
            <UCard v-if="!loading" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            {{ mainModalTitle }}
                        </h3>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpenAdd = false" />
                    </div>
                </template>

                <UForm :state="state" class="space-y-4">
                    <UFormGroup label="Nama Buku" required>
                        <UInput v-model="state.nama_buku" placeholder="Masukkan nama buku..." icon="i-heroicons-book-open" />
                    </UFormGroup>

                    <UFormGroup label="Deskripsi Buku" required>
                        <UTextarea v-model="state.deskripsi_buku" placeholder="Masukkan deskripsi buku..." resize />
                    </UFormGroup>
                    
                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Kategori" required>
                            <USelectMenu v-model="state.kategori" placeholder="Pilih kategori..." :options="kategoriOptions"/>
                        </UFormGroup>

                        <UFormGroup label="Penulis" required>
                            <USelectMenu v-model="state.penulis" placeholder="Pilih penulis..." :options="penulisOptions"/>
                        </UFormGroup>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Jumlah Halaman" required>
                            <UInput v-model="state.jumlah_halaman" placeholder="Masukkan jumlah halaman buku..." icon="i-heroicons-bookmark" >
                                <template #trailing>
                                    <span class="text-gray-500 dark:text-gray-400 text-xs">Halaman</span>
                                </template>
                            </UInput>
                        </UFormGroup>
                    
                        <UFormGroup label="Link Shopee" required>
                            <UInput v-model="state.link_shopee" placeholder="Masukkan link shopee..." icon="i-heroicons-link" />
                        </UFormGroup>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Harga" required>
                            <UInput type="number" v-model="state.harga" placeholder="Masukkan harga buku..." >
                                <template #leading>
                                    <span class="text-gray-500 dark:text-gray-400 text-xs">Rp</span>
                                </template>
                            </UInput>
                        </UFormGroup>

                        <UFormGroup label="Diskon">
                            <UInput v-model="state.diskon" placeholder="Masukkan diskon..." >
                                <template #trailing>
                                    <span class="text-gray-500 dark:text-gray-400 text-xs">%</span>
                                </template>
                            </UInput>
                        </UFormGroup>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Bestseller">
                            <UCheckbox label="Tandai Buku Sebagai Bestseller" v-model="state.status_bestseller"/>
                        </UFormGroup>

                        <UFormGroup label="Editor's Pick">
                            <UCheckbox label="Tandai Buku Sebagai Editor's Pick" v-model="state.status_editors_pick"/>
                        </UFormGroup>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="File Sinopsis" :required="!isEditing">
                            <UInput type="file" size="md" @change="uploadSinopsis($event)" icon="i-heroicons-folder" />
                        </UFormGroup>

                        <UFormGroup label="Gambar Buku" :required="!isEditing">
                            <UInput type="file" size="md" @change="uploadGambar($event)" icon="i-heroicons-photo" multiple />
                        </UFormGroup>
                    </div>
                </UForm>

                <template #footer>
                    <div class="flex items-center justify-end">
                        <UButton color="grey" variant="soft" @click="closeAddModal">Tutup</UButton>
                        <UButton color="primary" :data-tipe="dataTipeSubmit" type="submit" variant="solid" @click="insert">{{ mainModalButton }}</UButton>
                    </div>
                </template>
            </UCard>
            <div v-else>
                <h3 class="font-bold text-center text-3xl my-4">{{ editLoadingText }}</h3>
            </div>
        </UModal>
        <UModal v-model="isOpenStatus" prevent-close>
            <UCard id="modal-card" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h3 style="font-weight: bold; font-size: 22px; text-align: center;">{{ modalHeader }}</h3>
                </template>

                <img :src="modalImage" alt="">
                <p style="text-align: center; margin-bottom: 1rem;" v-html="modalContent"></p>
                <div v-if="canCloseModal" class="flex justify-center">
                    <UButton data-type="input" label="Tutup" @click="closeStatusModal($event)" />
                </div>
            </UCard>
        </UModal>
        <UModal v-model="isOpenDelete" prevent-close>
            <UCard id="modal-delete-card" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h3 style="font-weight: bold; font-size: 22px; text-align: center;">{{ modalDeleteHeader }}</h3>
                </template>

                <img :src="modalDeleteImage" alt="">
                <p style="text-align: center; margin-bottom: 1rem;" v-html="modalDeleteContent"></p>
                <div v-if="modalDeleteConfirm" class="flex justify-center" style="gap: 1rem;">
                    <UButton data-type="input" label="Tutup" variant="soft" color="gray" @click="closeStatusModalDelete($event)" />
                    <UButton data-type="input" label="Hapus Data" color="red" @click="deleteDataAPI($event)" />
                </div>
                <div v-if="canCloseModalDelete" class="flex justify-center">
                    <UButton data-type="input" label="Tutup" @click="closeStatusModalDelete($event)" />
                </div>
            </UCard>
        </UModal>
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
const isOpenAdd = ref(false)
const isOpenDelete = ref(false)

// Pagination
const sort = ref({ column: 'id', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Data
let listBuku = ref([]);
const config = useRuntimeConfig();
const userValue = useCookie('userValue');

// Form
const kategoriOptions = ref([]);
const penulisOptions = ref([]);
const state = reactive({
    nama_buku: undefined,
    deskripsi_buku: undefined,
    kategori: undefined,
    penulis: undefined,
    jumlah_halaman: undefined,
    harga: undefined,
    diskon: undefined,
    link_shopee: undefined,
    status_bestseller: false,
    status_editors_pick: false,
    file_sinopsis: undefined,
    gambar_buku: []
});

//Modal Popup
let loading = ref(false);
let isEditing = ref(false);
let mainModalTitle = ref('Tambah Buku');
let mainModalButton = ref('Tambah');
let editLoadingText = ref('Loading...');
let dataTipeSubmit = ref('insert');

let isOpenStatus = ref(false);
let canCloseModal = ref(false);
let modalHeader = ref("Loading...");
let modalContent = ref("Data sedang diinput...");
let modalImage = ref(`${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`);

let canCloseModalDelete = ref(false);
let modalDeleteHeader = ref("Yakin ingin menghapus data?");
let modalDeleteContent = ref('');
let modalDeleteConfirm = ref(true);
let modalDeleteImage = ref(`${config.public.FRONTEND_URL}/_nuxt/assets/images/question.png`);

let pendingEdit;
let pendingDelete;

const uploadSinopsis = (files) => {
    const file = files[0];
    state.file_sinopsis = file;
}

const uploadGambar = (files) => {
    state.gambar_buku = files;
}

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

const fetchKategori = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/kategori`, {
        headers: {
            userValue: userValue.value,
        }
    });

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg != 'Belum ada data kategori'){
            const apiOptions = fetchResult.data._rawValue.kategori.map(item => {
                return { label: item.nama, id: item.id };
            });
            kategoriOptions.value = kategoriOptions.value.concat(apiOptions);
        }else{
            kategoriOptions.value = [];
        }
    }else{
        setTimeout(fetchKategori, 2000);
        kategoriOptions.value = [];
    }
}

const fetchPenulis = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/penulis`, {
        headers: {
            userValue: userValue.value,
        }
    });

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg != 'Belum ada data penulis'){
            const apiOptions = fetchResult.data._rawValue.penulis.map(item => {
                return { label: item.nama_pena, id: item.id };
            });
            penulisOptions.value = penulisOptions.value.concat(apiOptions);
        }else{
            penulisOptions.value = [];
        }
    }else{
        setTimeout(fetchPenulis, 2000);
        penulisOptions.value = [];
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

const openAddModal = () => {
    resetForm();
    isOpenAdd.value = true;
}

const closeAddModal = () => {
    resetForm();
    isOpenAdd.value = false;
}

const closeStatusModal = (event) => {
    isOpenStatus.value = false;
    isOpenAdd.value = true;
}

const closeStatusModalDelete = (event) => {
    isOpenDelete.value = false;

    canCloseModalDelete.value = false;
    modalDeleteHeader.value = "Yakin ingin menghapus data?";
    modalDeleteContent.value = '';
    modalDeleteConfirm.value = true;
    modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/question.png`;
}

const editData = (event) => {
    if(event.target.getAttribute('data-id')){
        pendingEdit = event.target.getAttribute('data-id');
    }else if(event.target.parentElement.getAttribute('data-id')){
        pendingEdit = event.target.parentElement.getAttribute('data-id');
    }
    isOpenAdd.value = true;
    isEditing.value = true;
    loading.value = true;
    mainModalTitle.value = 'Edit Buku';
    mainModalButton.value = 'Edit';
    dataTipeSubmit.value = 'edit';

    fetchBukuDetail(pendingEdit);
}

const fetchBukuDetail = async (id_buku) => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/collection/buku/${id_buku}`, {
        headers: {
            userValue: userValue,
        }
    });

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg == 'Berhasil'){
            let buku = fetchResult.data._rawValue.buku;
            state.nama_buku = buku.nama;
            state.deskripsi_buku = buku.deskripsi;
            state.kategori = {'label': buku.kategori.nama, 'id': buku.kategori.id};
            state.penulis = {'label': buku.pivot_penulis_buku[0].penulis.nama_pena, 'id': buku.pivot_penulis_buku[0].penulis.id};
            state.jumlah_halaman = buku.jumlah_halaman;
            state.harga = buku.harga;
            state.diskon = buku.diskon;
            state.link_shopee = buku.link_shopee;
            state.status_bestseller = buku.status_bestseller;
            state.status_editors_pick = buku.status_editors_pick;

            loading.value = false;
        }else{
            editLoadingText.value = 'Terjadi kesalahan, silahkan hubungi admin!';
        }
    }else{
        setTimeout(fetchBukuDetail, 2000)
    }
}

const deleteData = (event) => {
    if(event.target.getAttribute('data-id')){
        pendingDelete = event.target.getAttribute('data-id');
    }else if(event.target.parentElement.getAttribute('data-id')){
        pendingDelete = event.target.parentElement.getAttribute('data-id');
    }
    isOpenDelete.value = true;
}

const deleteDataAPI = async (event) => {
    modalDeleteConfirm.value = false;
    modalDeleteHeader.value = "Loading...";
    modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
    modalDeleteContent.value = "Data sedang dihapus...";
    
    const formResult = await $fetch(`${config.public.API_HOST}/api/database/collection/buku/${pendingDelete}`, {
        method: 'DELETE',
        headers: {
            userValue: userValue.value,
        }
    });
    
    if(formResult.msg == 'Berhasil'){
        modalDeleteHeader.value = "Berhasil";
        modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
        modalDeleteContent.value = "Data berhasil dihapus";
        canCloseModalDelete.value = true;
        
        fetchListBuku();
    }else{
        modalDeleteHeader.value = "Gagal";
        modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
        modalDeleteContent.value = 'Data gagal dihapus, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
        canCloseModalDelete.value = true;
    }
}

const insert = async (event) => {
    isOpenStatus.value = true;
    modalHeader.value = "Loading...";
    modalContent.value = "Data sedang diinput...";
    modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
    canCloseModal.value = false;

    const formData = new FormData();
    formData.append('nama', state.nama_buku);
    formData.append('deskripsi', state.deskripsi_buku);
    if(state.kategori){
        formData.append('kategori', state.kategori.id);
    }
    if(state.penulis){
        formData.append('penulis_buku', state.penulis.id);
    }
    formData.append('jumlah_halaman', state.jumlah_halaman);
    formData.append('harga', state.harga);
    formData.append('diskon', state.diskon);
    formData.append('link_shopee', state.link_shopee);
    formData.append('status_bestseller', state.status_bestseller);
    formData.append('status_editors_pick', state.status_editors_pick);
    formData.append('file_sinopsis', state.file_sinopsis);
    for(let i = 0; i < state.gambar_buku.length; i++){
        formData.append('gambar_buku', state.gambar_buku[i]);
    }
    
    if(event.target.getAttribute('data-tipe') == 'insert'){
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/collection/buku`, {
            method: 'POST',
            body: formData,
            headers: {
                userValue: userValue.value,
            }
        });
        
        if(formResult.msg == 'Berhasil'){
            modalHeader.value = "Berhasil";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
            modalContent.value = "Data berhasil diinput";
            canCloseModal.value = true;
            
            fetchListBuku();
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Data gagal diinput, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }else{
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/collection/buku/${pendingEdit}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                userValue: userValue.value,
            }
        });
        
        if(formResult.msg == 'Berhasil'){
            modalHeader.value = "Berhasil";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
            modalContent.value = "Data berhasil diedit";
            canCloseModal.value = true;

            fetchListBuku();
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Data gagal diedit, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }
}

const resetForm = async () => {
    state.nama_buku = undefined;
    state.deskripsi_buku = undefined;
    state.kategori = undefined;
    state.penulis = undefined;
    state.jumlah_halaman = undefined;
    state.harga = undefined;
    state.diskon = undefined;
    state.link_shopee = undefined;
    state.status_bestseller = false;
    state.status_editors_pick = false;
    state.file_sinopsis = undefined;
    state.gambar_buku = [];

    isEditing.value = false;
    mainModalTitle.value = 'Tambah Buku';
    mainModalButton.value = 'Tambah';
    dataTipeSubmit.value = 'insert';
}

onMounted(() => {
    fetchListBuku();
    fetchKategori();
    fetchPenulis();
});
</script>

<style lang="scss">
    @import '../assets/scss/global/global';
    #admin-panel .text-primary-500, #form-input .text-primary-500, .text-primary-500{
        --tw-text-opacity: 1;
        color: $primary;
    }

    #admin-panel .hover\:bg-primary-50:hover, .hover\:bg-primary-50:hover{
        --tw-bg-opacity: 1;
        background-color: #dbf6ff;
    }

    #admin-panel .focus\:ring-primary-500:focus, #form-input .focus\:ring-primary-500:focus, .focus\:ring-primary-500:focus{
        --tw-ring-opacity: 1;
        --tw-ring-color: #0F7292 !important;
    }

    #modal-add .sm\:max-w-lg{
        max-width: 64rem;
    }

    .focus-visible\:ring-primary-500:focus-visible {
        --tw-ring-opacity: 1;
        --tw-ring-color: #0F7292;
    }
</style>

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

    #modal-card, #modal-delete-card{
        img{
            width: 96px;
            height: 96px;
            margin: 0 auto;
            margin-bottom: 1rem;
        }
    }

    .edit{
        transition: 0.3s all ease-out;
        
        &:hover{
            color: $white;
            background-color: rgb(249 115 22);
            box-shadow: none;
        }
    }
    
    .delete{
        transition: 0.3s all ease-out;
        
        &:hover{
            color: $white;
            background-color: rgb(239 68 68);
            box-shadow: none;
        }
    }
</style>