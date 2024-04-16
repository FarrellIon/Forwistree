<template>
    <div>
        <h1>Test</h1>
        <div v-for="book in books">
            <h1>{{books}}</h1>
        </div>
    </div>
</template>

<script setup>
    // const { apiToken, shopID } = useRuntimeConfig();
    console.log(apiToken);
    const url = `https://shopee-e-commerce-data.p.rapidapi.com/shopee/shop/items/v2?site=id&shop_id=212700275&page=1&pageSize=20`;
    const { data: books } = await useFetch(url);

    console.log(books);
</script>

<style lang="scss" scoped>

</style>