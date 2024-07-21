<template>
    <div id="admin-panel" style="display: flex;">
        <AdminSidebar :active="'mitra-event'" style="min-width: 158px"></AdminSidebar>
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
                    Data Mitra Event
                </h2>
            </template>

            <!-- Filters -->
            <div class="flex items-center justify-between gap-3 px-4 py-3">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

                <UButton icon="i-heroicons-plus" color="primary" size="xs" @click="openAddModal">
                    Tambah Mitra Event
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
            <UTable :rows="filteredKategori.slice((page - 1) * pageCount, ((page - 1) * pageCount) + pageCount)" :columns="columnsTable" :loading="pending"
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
                    <UFormGroup label="Nama Mitra Event" required>
                        <UInput v-model="state.nama_mitra_event" placeholder="Masukkan nama mitra event..." icon="i-heroicons-book-open" />
                    </UFormGroup>
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
let listKategori = ref([]);
const config = useRuntimeConfig();
const userValue = useCookie('userValue');

// Form
const mitraEventOptions = ref([]);
const penulisOptions = ref([]);
const state = reactive({
    nama_mitra_event: undefined
});

//Modal Popup
let loading = ref(false);
let isEditing = ref(false);
let mainModalTitle = ref('Tambah Mitra Event');
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

const fetchListKategori = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/mitra_event`, {
        headers: {
            userValue: userValue,
        }
    });

    if(fetchResult.data._rawValue){
        listKategori.value = fetchResult.data._rawValue.mitra.map((book, index) => ({
          ...book,
          number: index + 1
        }));
        pending.value = false;
        pageTotal.value = listKategori.value.length
    }else{
        setTimeout(fetchListKategori, 2000)
        listKategori.value = [];
        pending.value = true;
    }
}

const filteredKategori = computed(() => {
    if (!search.value) {
        return listKategori.value;
    }
    return listKategori.value.filter(book =>
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
    mainModalTitle.value = 'Edit Mitra Event';
    mainModalButton.value = 'Edit';
    dataTipeSubmit.value = 'edit';

    fetchKategoriDetail(pendingEdit);
}

const fetchKategoriDetail = async (id_mitra_event) => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/mitra_event/${id_mitra_event}/edit`, {
        headers: {
            userValue: userValue,
        }
    });

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg == 'Berhasil'){
            let mitra_event = fetchResult.data._rawValue.mitra;
            state.nama_mitra_event = mitra_event.nama;

            loading.value = false;
        }else{
            editLoadingText.value = 'Terjadi kesalahan, silahkan hubungi admin!';
        }
    }else{
        setTimeout(fetchKategoriDetail, 2000)
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
    
    const formResult = await $fetch(`${config.public.API_HOST}/api/database/master-data/mitra_event/${pendingDelete}`, {
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
        
        fetchListKategori();
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
    formData.append('nama', state.nama_mitra_event);
    
    if(event.target.getAttribute('data-tipe') == 'insert'){
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/master-data/mitra_event`, {
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
            
            fetchListKategori();
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Data gagal diinput, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }else{
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/master-data/mitra_event/${pendingEdit}`, {
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

            fetchListKategori();
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Data gagal diedit, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }
}

const resetForm = async () => {
    state.nama_mitra_event = undefined;

    isEditing.value = false;
    mainModalTitle.value = 'Tambah Mitra Event';
    mainModalButton.value = 'Tambah';
    dataTipeSubmit.value = 'insert';
}

onMounted(() => {
    fetchListKategori();
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