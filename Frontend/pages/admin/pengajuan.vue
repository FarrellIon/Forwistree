<template>
    <div id="admin-panel" style="display: flex;">
        <AdminSidebar :active="'pengajuan'" style="min-width: 158px"></AdminSidebar>
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
                    Data Pengajuan
                </h2>
            </template>

            <!-- Filters -->
            <div class="flex items-center justify-between gap-3 px-4 py-3">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
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
            <UTable :rows="filteredPengajuan.slice((page - 1) * pageCount, ((page - 1) * pageCount) + pageCount)" :columns="columnsTable" :loading="pending" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data.' }"
                sort-asc-icon="i-heroicons-arrow-up" sort-desc-icon="i-heroicons-arrow-down" sort-mode="manual"
                class="w-full" :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'gray' } } }">

                <template #pengaju.no_wa-data="{ row }">
                    <a v-if="row.pengaju" class="no-wa-link" :href="`https://wa.me/${row.pengaju.no_wa}`">{{ row.pengaju.no_wa }}</a>
                    <p v-else>-</p>
                </template>

                <template #status-data="{ row }">
                    <UBadge v-if="row.status == 'pending' && !row.accepted_by" size="xs" :label="'Pending'" :color="'primary'" />
                    <UBadge v-else-if="row.accepted_by" size="xs" :label="'Accepted'" :color="'green'" />
                    <UBadge v-else="row.accepted_by" size="xs" :label="'Rejected'" :color="'red'" />
                </template>

                <template #file_sinopsis-data="{ row }">
                    <a style="display: flex; align-items: center;" class="file-sinopsis-button" :href="row.file_sinopsis">
                        <div style="display: flex; align-items: center; padding: 0.25rem 0.5rem;">
                            <i class="i-heroicons-document mr-2"></i>
                            Cek File Sinopsis
                        </div>
                    </a>
                </template>

                <template #actions-data="{ row }">
                    <div v-if="row.status == 'pending' && !row.accepted_by">
                        <UButton class="approve mr-2" :data-id="row.id" icon="i-heroicons-check" size="2xs" color="green" variant="outline" :ui="{ rounded: 'rounded-full' }" square @click="approveData($event)" />
    
                        <UButton class="reject" :data-id="row.id" icon="i-heroicons-x-mark" size="2xs" color="red" variant="outline" :ui="{ rounded: 'rounded-full' }" square @click="rejectData($event)" />
                    </div>
                    <div v-else>
                        <p>-</p>
                    </div>
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
        <UModal v-model="isOpenStatus" prevent-close>
            <UCard id="modal-card" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h3 style="font-weight: bold; font-size: 22px; text-align: center;">{{ modalHeader }}</h3>
                </template>

                <img :src="modalImage" alt="">
                <p style="text-align: center; margin-bottom: 1rem;" v-html="modalContent"></p>
                <div v-if="modalConfirm" class="flex justify-center" style="gap: 1rem;">
                    <div v-if="modalType == 'approve'">
                        <UButton data-type="input" label="Tutup" variant="soft" color="gray" @click="closeStatusModal($event)" />
                        <UButton data-type="input" label="Approve Data" color="green" @click="approveAPI($event)" />
                    </div>
                    <div v-else>
                        <UButton data-type="input" label="Tutup" variant="soft" color="gray" @click="closeStatusModal($event)" />
                        <UButton data-type="input" label="Reject Data" color="red" @click="rejectAPI($event)" />
                    </div>
                </div>
                <div v-if="canCloseModal" class="flex justify-center">
                    <UButton data-type="input" label="Tutup" @click="closeStatusModal($event)" />
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
    key: 'pengaju.nama_pena',
    label: 'Nama Pena Pengaju',
}, {
    key: 'pengaju.email',
    label: 'Email Pengaju',
}, {
    key: 'pengaju.no_wa',
    label: 'Nomor WhatsApp Pengaju',
}, {
    key: 'status',
    label: 'Status Pengajuan',
}, {
    key: 'file_sinopsis',
    label: 'File Sinopsis',
}, {
    key: 'actions',
    label: 'Actions',
}]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

const search = ref('')
const pending = ref(true)

// Pagination
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Data
let listPengajuan = ref([]);
const config = useRuntimeConfig();
const userValue = useCookie('userValue');
let pendingApprove = ref();
let pendingReject = ref();

//Modal Popup
let isOpenStatus = ref(false);
let canCloseModal = ref(false);
let modalHeader = ref("Loading...");
let modalContent = ref("Data sedang diinput...");
let modalImage = ref(`${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`);
let modalType = ref("approve");
let modalConfirm = ref(true);

const approveData = (event: any) => {
    if(event.target.getAttribute('data-id')){
        pendingApprove = event.target.getAttribute('data-id');
    }else if(event.target.parentElement.getAttribute('data-id')){
        pendingApprove = event.target.parentElement.getAttribute('data-id');
    }
    isOpenStatus.value = true;
    modalHeader.value = 'Konfirmasi';
    modalContent.value = 'Apakah anda yakin ingin approve pengajuan ini?';
    modalType.value = 'approve';
}

const rejectData = (event: any) => {
    if(event.target.getAttribute('data-id')){
        pendingReject = event.target.getAttribute('data-id');
    }else if(event.target.parentElement.getAttribute('data-id')){
        pendingReject = event.target.parentElement.getAttribute('data-id');
    }
    isOpenStatus.value = true;
    modalHeader.value = 'Konfirmasi';
    modalContent.value = 'Apakah anda yakin ingin reject pengajuan ini?';
    modalType.value = 'reject';
}

const approveAPI = async (event: any) => {
    modalConfirm.value = false;
    modalHeader.value = "Loading...";
    modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
    modalContent.value = "Data sedang diproses...";
    
    const formResult = await $fetch(`${config.public.API_HOST}/api/database/pengajuan/pengajuan/approve/${pendingApprove}`, {
        method: 'PATCH',
        headers: {
            userValue: userValue.value!,
        }
    }) as any;
    
    if(formResult.msg == 'Berhasil'){
        modalHeader.value = "Berhasil";
        modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
        modalContent.value = "Data berhasil diapprove";
        canCloseModal.value = true;
        
        fetchListPengajuan();
    }else{
        modalHeader.value = "Gagal";
        modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
        modalContent.value = 'Data gagal diapprove, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
        canCloseModal.value = true;
    }
}

const rejectAPI = async (event: any) => {
    modalConfirm.value = false;
    modalHeader.value = "Loading...";
    modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
    modalContent.value = "Data sedang diproses...";
    
    const formResult = await $fetch(`${config.public.API_HOST}/api/database/pengajuan/pengajuan/reject/${pendingReject}`, {
        method: 'PATCH',
        headers: {
            userValue: userValue.value!,
        }
    }) as any;
    
    if(formResult.msg == 'Berhasil'){
        modalHeader.value = "Berhasil";
        modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
        modalContent.value = "Data berhasil direject";
        canCloseModal.value = true;
        
        fetchListPengajuan();
    }else{
        modalHeader.value = "Gagal";
        modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
        modalContent.value = 'Data gagal direject, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
        canCloseModal.value = true;
    }
}

const fetchListPengajuan = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/pengajuan/pengajuan`, {
        headers: {
            userValue: userValue as any,
        }
    });

    if((fetchResult.data as any)._rawValue){
        if((fetchResult.data as any)._rawValue.msg == 'Belum ada data pengajuan'){
            listPengajuan.value = [];
            pending.value = false;
        }else{
            listPengajuan.value = (fetchResult.data as any)._rawValue.pengajuan.map((pengajuan: any, index: number) => ({
                ...pengajuan,
                number: index + 1
            }));
            pending.value = false;
            pageTotal.value = listPengajuan.value.length
        }
    }else{
        setTimeout(fetchListPengajuan, 2000)
        listPengajuan.value = [];
        pending.value = true;
    }
}

const filteredPengajuan = computed(() => {
    if (!search.value) {
        return listPengajuan.value;
    }
    return listPengajuan.value.filter(pengajuan =>
        (pengajuan as any).pengaju.nama_pena.toLowerCase().includes(search.value.toLowerCase())
    );
});

const closeStatusModal = (event: any) => {
    isOpenStatus.value = false;
}

const checkLoggedIn = async () => {
    if(!userValue.value){
        await navigateTo('/not-found');
    }
}

onBeforeMount(() => {
    checkLoggedIn();
});

onMounted(() => {
    fetchListPengajuan();
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

    .approve{
        transition: 0.3s all ease-out;
        
        &:hover{
            color: $white;
            background-color: rgb(34 197 94);
            box-shadow: none;
        }
    }
    
    .reject{
        transition: 0.3s all ease-out;
        
        &:hover{
            color: $white;
            background-color: rgb(239 68 68);
            box-shadow: none;
        }
    }

    .no-wa-link{
        transition: 0.3s all ease-out;

        &:hover{
            color: $primary;
            text-decoration: underline;
        }
    }

    .file-sinopsis-button div{
        transition: 0.3s all ease-out;
        color: $primary;
        border-radius: 4px;
        border: 1px solid $primary;

        &:hover{
            color: $white;
            background: $primary;
        }
    }
</style>