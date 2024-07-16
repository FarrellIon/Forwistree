<template>
    <div>
      <Navbar :active="'products'"></Navbar>
      <EventBanner></EventBanner>
      <Categories></Categories>
      <BukuTerbaru></BukuTerbaru>
      <CategoryRandom></CategoryRandom>
      <KirimkanKarya></KirimkanKarya>
      <Footer></Footer>
    </div>
</template>
<script setup>
definePageMeta({
  colorMode: 'light',
})
</script>
<style>
html, body{
  height: 100vh;
}
</style>