<template>
    <div class="px-32 py-16">
        <form id="formAddBuku" @submit.prevent="handleSubmit">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nama">
                Nama Buku
            </label>
            <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" v-model="state.nama" name="nama" type="text" placeholder="Input nama buku">
            <p class="text-red-500 text-xs italic">Silahkan isi nama buku.</p>

            <button id="submitFormAddBuku">Submit</button>
        </form>

        {{ formResult }}

        {{ formData }}
        <!-- <div v-if="!result">
            Loading...
        </div>
        <div v-else>
            {{ result }}
        </div> -->
        <!-- <div v-for="book in books">
            <h1>{{books}}</h1>
        </div> -->
    </div>
</template>

<script setup>
    let formResult;
    let formData;
    let result;

    const state = reactive({
        nama: undefined
    });
    const config = useRuntimeConfig();
    result = await $fetch(`${config.public.API_HOST}/api/database/master-data/kategori`);

    const handleSubmit = async () => {
        formData = new FormData();

        for (const key of Object.keys(state)) {
            const value = state[key];
            formData.append(key, value);
        }

        formResult = await $fetch(`${config.public.API_HOST}/api/database/buku`, {
            method: 'POST',
            body: formData
        });
    }

    // const url = ``;
    // const { data: books } = await useFetch(url);
</script>

<style lang="scss" scoped>

</style>