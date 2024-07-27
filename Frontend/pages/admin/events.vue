<template>
    <div id="admin-panel" style="display: flex;">
        <AdminSidebar :active="'events'" style="min-width: 158px"></AdminSidebar>
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
                    Data Events
                </h2>
            </template>

            <!-- Filters -->
            <div class="flex items-center justify-between gap-3 px-4 py-3">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

                <UButton icon="i-heroicons-plus" color="primary" size="xs" @click="openAddModal">
                    Tambah Event
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
            <UTable :rows="filteredEvents.slice((page - 1) * pageCount, ((page - 1) * pageCount) + pageCount)" :columns="columnsTable" :loading="pending" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data.' }"
                sort-asc-icon="i-heroicons-arrow-up" sort-desc-icon="i-heroicons-arrow-down" sort-mode="manual"
                class="w-full" :ui="{ td: { base: 'max-w-[0] truncate' }, default: { checkbox: { color: 'gray' } } }">

                <template #gambar_event-data="{ row }">
                    <img v-if="row.gambar_event[0]" :src="row.gambar_event[0].image" alt="" style="width: 128px; height: 128px;">
                    <p v-else>-</p>
                </template>
                
                <template #pivot_mitra_event-data="{ row }">
                    <div v-if="row.pivot_mitra_event[0]" class="flex">
                        <img v-for="mitra in row.pivot_mitra_event" :src="mitra.mitra.image" alt="" style="width: 64px; height: 64px;">
                    </div>
                    <p v-else>-</p>
                </template>

                <template #status_aktif-data="{ row }">
                    <UBadge size="xs" :label="(new Date(row.tanggal_mulai_pendaftaran) < new Date() && new Date(row.tanggal_penutupan) > new Date()) ? 'Sedang Berlangsung' : 'Event Tidak Aktif'"
                        :color="(new Date(row.tanggal_mulai_pendaftaran) < new Date() && new Date(row.tanggal_penutupan) > new Date()) ? 'primary' : 'red'" />
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

                <UForm :state="state" class="form-event space-y-4">
                    <UFormGroup label="Judul Event" required>
                        <UInput v-model="state.judul_event" placeholder="Masukkan judul event..." icon="i-heroicons-book-open" />
                    </UFormGroup>

                    <UFormGroup label="Deskripsi Event" required>
                        <UTextarea v-model="state.deskripsi_event" placeholder="Masukkan deskripsi event..." resize />
                    </UFormGroup>

                    <div class="grid" style="grid-template-columns: 1fr 1fr 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Tanggal Pendaftaran" required>
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <UButton icon="i-heroicons-calendar-days-20-solid">
                                {{ format(state.tanggal_pendaftaran.start, 'yyyy-MM-dd') }} - {{ format(state.tanggal_pendaftaran.end, 'yyyy-MM-dd') }}
                                </UButton>

                                <template #panel="{ close }">
                                    <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                                        <DatePicker v-model="state.tanggal_pendaftaran" @close="close" />
                                    </div>
                                </template>
                            </UPopover>
                        </UFormGroup>

                        <UFormGroup label="Tanggal Pembukaan Event" required>
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(state.tanggal_pembukaan, 'yyyy-MM-dd')" />

                                <template #panel="{ close }">
                                    <DatePicker type="single" v-model="state.tanggal_pembukaan" is-required @close="close" />
                                </template>
                            </UPopover>
                        </UFormGroup>

                        <UFormGroup label="Tanggal Event Dilaksanakan" required>
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <UButton icon="i-heroicons-calendar-days-20-solid">
                                {{ format(state.tanggal_event.start, 'yyyy-MM-dd') }} - {{ format(state.tanggal_event.end, 'yyyy-MM-dd') }}
                                </UButton>

                                <template #panel="{ close }">
                                    <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                                        <DatePicker v-model="state.tanggal_event" @close="close" />
                                    </div>
                                </template>
                            </UPopover>
                        </UFormGroup>

                        <UFormGroup label="Tanggal Penutupan Event" required>
                            <UPopover :popper="{ placement: 'bottom-start' }">
                                <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(state.tanggal_penutupan, 'yyyy-MM-dd')" />

                                <template #panel="{ close }">
                                    <DatePicker type="single" v-model="state.tanggal_penutupan" is-required @close="close" />
                                </template>
                            </UPopover>
                        </UFormGroup>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Cara Bergabung ke Event" required>
                            <UTextarea v-model="state.cara_bergabung" placeholder="Masukkan cara bergabung ke event..." resize />
                        </UFormGroup>

                        <UFormGroup label="Syarat Event" required>
                            <UTextarea v-model="state.syarat" placeholder="Masukkan syarat event..." resize />
                        </UFormGroup>
                    </div>

                    <div class="grid" style="grid-template-columns: 1fr 1fr; column-gap: 2rem;">
                        <UFormGroup label="Hadiah Event" required>
                            <UTextarea v-model="state.hadiah" placeholder="Masukkan hadiah event..." resize />
                        </UFormGroup>

                        <UFormGroup label="Contact Person Event" required>
                            <UTextarea v-model="state.contact_person" placeholder="Masukkan contact person..." resize />
                        </UFormGroup>
                    </div>
                    
                    <UFormGroup label="Mitra Event" :required="!isEditing">
                        <USelectMenu v-model="state.mitra_event" multiple placeholder="Pilih mitra event..." :options="mitraOptions"/>
                    </UFormGroup>

                    <UFormGroup label="Gambar Event" :required="!isEditing">
                        <UInput type="file" size="md" @change="uploadGambar($event)" icon="i-heroicons-photo" multiple />
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
import { sub, format } from 'date-fns'

definePageMeta({
    colorMode: 'light',
})

// Columns
const columns = [{
    key: 'number',
    label: '#',
}, {
    key: 'judul',
    label: 'Judul',
}, {
    key: 'deskripsi',
    label: 'Deskripsi',
}, {
    key: 'gambar_event',
    label: 'Gambar Event',
}, {
    key: 'pivot_mitra_event',
    label: 'Mitra Event',
}, {
    key: 'status_aktif',
    label: 'Status Aktif',
}, {
    key: 'actions',
    label: 'Actions',
}]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

const search = ref('')
const pending = ref(true)
const isOpenAdd = ref(false)
const isOpenDelete = ref(false)

// Pagination
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(0)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Data
let listEvent = ref([]);
const config = useRuntimeConfig();
const userValue = useCookie('userValue');

// Form
const mitraOptions = ref([]);
const state = reactive({
    judul_event: undefined,
    deskripsi_event: undefined,
    tanggal_pendaftaran: { start: sub(new Date(), { days: 14 }), end: new Date() },
    tanggal_pembukaan: new Date(),
    tanggal_event: { start: sub(new Date(), { days: 14 }), end: new Date() },
    tanggal_penutupan: new Date(),
    cara_bergabung: undefined,
    syarat: undefined,
    hadiah: undefined,
    contact_person: undefined,
    mitra_event: [],
    gambar_event: []
});

//Modal Popup
let loading = ref(false);
let isEditing = ref(false);
let mainModalTitle = ref('Tambah Event');
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

let pendingEdit: any;
let pendingDelete: any;

const uploadGambar = (files: any) => {
    state.gambar_event = files;
}

const fetchListEvent = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/admin/event`, {
        headers: {
            userValue: userValue as any,
        }
    }) as any;

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg == 'Belum ada data event'){
            listEvent.value = [];
            pending.value = false;
        }else{
            listEvent.value = fetchResult.data._rawValue.event.map((event: any, index: any) => ({
                ...event,
                number: index + 1
            }));
            pending.value = false;
            pageTotal.value = listEvent.value.length
        }
    }else{
        setTimeout(fetchListEvent, 2000)
        listEvent.value = [];
        pending.value = true;
    }
}

const fetchMitra = async () => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/mitra_event`, {
        headers: {
            userValue: userValue.value as any,
        }
    }) as any;

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg != 'Belum ada data mitra'){
            const apiOptions = fetchResult.data._rawValue.mitra.map((item: any) => {
                return { label: item.nama, id: item.id };
            });
            mitraOptions.value = mitraOptions.value.concat(apiOptions);
        }else{
            mitraOptions.value = [];
        }
    }else{
        setTimeout(fetchMitra, 2000);
        mitraOptions.value = [];
    }
}

const filteredEvents = computed(() => {
    if (!search.value) {
        return listEvent.value;
    }
    return listEvent.value.filter(event =>
        (event as any).judul.toLowerCase().includes(search.value.toLowerCase())
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

const closeStatusModal = (event: any) => {
    isOpenStatus.value = false;
    isOpenAdd.value = true;
}

const closeStatusModalDelete = (event: any) => {
    isOpenDelete.value = false;

    canCloseModalDelete.value = false;
    modalDeleteHeader.value = "Yakin ingin menghapus data?";
    modalDeleteContent.value = '';
    modalDeleteConfirm.value = true;
    modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/question.png`;
}

const editData = (event: any) => {
    if(event.target.getAttribute('data-id')){
        pendingEdit = event.target.getAttribute('data-id');
    }else if(event.target.parentElement.getAttribute('data-id')){
        pendingEdit = event.target.parentElement.getAttribute('data-id');
    }
    isOpenAdd.value = true;
    isEditing.value = true;
    loading.value = true;
    mainModalTitle.value = 'Edit Event';
    mainModalButton.value = 'Edit';
    dataTipeSubmit.value = 'edit';

    fetchEventDetail(pendingEdit);
}

const fetchEventDetail = async (id_event: any) => {
    let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/admin/event/${id_event}`, {
        headers: {
            userValue: userValue as any,
        }
    }) as any;

    if(fetchResult.data._rawValue){
        if(fetchResult.data._rawValue.msg == 'Berhasil'){
            let event = fetchResult.data._rawValue.event;
            state.judul_event = event.judul;
            state.deskripsi_event = event.deskripsi;
            state.tanggal_pendaftaran = { start: new Date(event.tanggal_mulai_pendaftaran), end: new Date(event.tanggal_selesai_pendaftaran) };
            state.tanggal_pembukaan = new Date(event.tanggal_pembukaan);
            state.tanggal_event = { start: new Date(event.tanggal_mulai_event), end: new Date(event.tanggal_selesai_event) };
            state.tanggal_penutupan = new Date(event.tanggal_penutupan);
            state.cara_bergabung = event.cara_bergabung;
            state.syarat = event.syarat;
            state.hadiah = event.hadiah;
            state.contact_person = event.contact_person;
            // let mitra_array = [];
            // for(let i = 0; i < event.pivot_mitra_event.length; i++){
            //     if(event.pivot_mitra_event[i]){
            //         mitra_array.push({'label': event.pivot_mitra_event[i].mitra.nama, 'id': event.pivot_mitra_event[i].mitra.id})
            //     }
            // }
            // state.mitra_event = mitra_array;
            state.gambar_event = [];

            loading.value = false;
        }else{
            editLoadingText.value = 'Terjadi kesalahan, silahkan hubungi admin!';
        }
    }else{
        setTimeout(fetchEventDetail, 2000)
    }
}

const deleteData = (event: any) => {
    if(event.target.getAttribute('data-id')){
        pendingDelete = event.target.getAttribute('data-id');
    }else if(event.target.parentElement.getAttribute('data-id')){
        pendingDelete = event.target.parentElement.getAttribute('data-id');
    }
    isOpenDelete.value = true;
}

const deleteDataAPI = async (event: any) => {
    modalDeleteConfirm.value = false;
    modalDeleteHeader.value = "Loading...";
    modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
    modalDeleteContent.value = "Data sedang dihapus...";
    
    const formResult = await $fetch(`${config.public.API_HOST}/api/database/admin/event/${pendingDelete}`, {
        method: 'DELETE',
        headers: {
            userValue: userValue.value as any,
        }
    }) as any;
    
    if(formResult.msg == 'Berhasil'){
        modalDeleteHeader.value = "Berhasil";
        modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
        modalDeleteContent.value = "Data berhasil dihapus";
        canCloseModalDelete.value = true;
        
        fetchListEvent();
    }else{
        modalDeleteHeader.value = "Gagal";
        modalDeleteImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
        modalDeleteContent.value = 'Data gagal dihapus, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
        canCloseModalDelete.value = true;
    }
}

const insert = async (event: any) => {
    isOpenStatus.value = true;
    modalHeader.value = "Loading...";
    modalContent.value = "Data sedang diinput...";
    modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/information.png`;
    canCloseModal.value = false;

    const formData = new FormData();
    formData.append('judul', (state as any).judul_event);
    formData.append('deskripsi', (state as any).deskripsi_event);
    formData.append('tanggal_mulai_pendaftaran', formatDate(state.tanggal_pendaftaran.start));
    formData.append('tanggal_selesai_pendaftaran', formatDate(state.tanggal_pendaftaran.end));
    formData.append('tanggal_pembukaan', formatDate(state.tanggal_pembukaan));
    formData.append('tanggal_mulai_event', formatDate(state.tanggal_event.start));
    formData.append('tanggal_selesai_event', formatDate(state.tanggal_event.end));
    formData.append('tanggal_penutupan', formatDate(state.tanggal_penutupan));
    formData.append('cara_bergabung', (state as any).cara_bergabung);
    formData.append('syarat', (state as any).syarat);
    formData.append('hadiah', (state as any).hadiah);
    formData.append('contact_person', (state as any).contact_person);
    for(let i = 0; i < state.mitra_event.length; i++){
        formData.append('mitra_event', (state as any).mitra_event[i].id);
    }
    for(let i = 0; i < state.gambar_event.length; i++){
        formData.append('gambar_event', state.gambar_event[i]);
    }

    console.log(state.mitra_event);
    
    if(event.target.getAttribute('data-tipe') == 'insert'){
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/admin/event`, {
            method: 'POST',
            body: formData,
            headers: {
                userValue: userValue.value as any,
            }
        }) as any;
        
        if(formResult.msg == 'Berhasil'){
            modalHeader.value = "Berhasil";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
            modalContent.value = "Data berhasil diinput";
            canCloseModal.value = true;
            
            fetchListEvent();
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Data gagal diinput, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }else{
        const formResult = await $fetch(`${config.public.API_HOST}/api/database/admin/event/${pendingEdit}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                userValue: userValue.value as any,
            }
        }) as any;
        
        if(formResult.msg == 'Berhasil'){
            modalHeader.value = "Berhasil";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/success.png`;
            modalContent.value = "Data berhasil diedit";
            canCloseModal.value = true;

            fetchListEvent();
        }else{
            modalHeader.value = "Gagal";
            modalImage.value = `${config.public.FRONTEND_URL}/_nuxt/assets/images/failed.png`;
            modalContent.value = 'Data gagal diedit, terjadi kesalahan : <br>'+formResult.msg.replace(/\n/g, '<br>');
            canCloseModal.value = true;
        }
    }
}

const resetForm = async () => {
    state.judul_event = undefined;
    state.deskripsi_event = undefined;
    state.tanggal_pendaftaran = { start: sub(new Date(), { days: 14 }), end: new Date() };
    state.tanggal_pembukaan = new Date();
    state.tanggal_event = { start: sub(new Date(), { days: 14 }), end: new Date() };
    state.tanggal_penutupan = new Date();
    state.cara_bergabung = undefined;
    state.syarat = undefined;
    state.hadiah = undefined;
    state.contact_person = undefined;
    state.mitra_event = [];
    state.gambar_event = [];

    isEditing.value = false;    
    mainModalTitle.value = 'Tambah Event';
    mainModalButton.value = 'Tambah';
    dataTipeSubmit.value = 'insert';
}

const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
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
    fetchListEvent();
    fetchMitra();
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