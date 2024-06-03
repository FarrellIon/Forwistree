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
    const userValue = useCookie('userValue');
    const state = reactive({
        nama: undefined
    });
    const config = useRuntimeConfig();

    const login = async () => {
        let fetchResult = await $fetch(`${config.public.API_HOST}/api/auth/login`, {
            method: 'POST',
            body: {
                username: 'Farrell2',
                password: '1234'
            }
        });

        return fetchResult;
    }

    const loginResult = await login();
    console.log(loginResult);
    if(loginResult.message == "Berhasil Login"){
        userValue.value = loginResult.id;
    }


    const fetchKategori = async () => {
        let fetchResult = await useFetch(`${config.public.API_HOST}/api/database/master-data/kategori`, {
            headers: {
                userValue: userValue,
            }
        });

        return fetchResult;
    }
    const kategori = await fetchKategori();
    console.log(kategori);

    // const handleSubmit = async () => {
    //     formData = new FormData();

    //     for (const key of Object.keys(state)) {
    //         const value = state[key];
    //         formData.append(key, value);
    //     }

    //     formResult = await $fetch(`${config.public.API_HOST}/api/database/buku`, {
    //         method: 'POST',
    //         body: formData
    //     });
    // }

    // const url = ``;
    // const { data: books } = await useFetch(url);
</script>

<style lang="scss" scoped>

</style>