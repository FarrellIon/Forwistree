<template>
  <div>
    <Navbar :active="'home'"></Navbar>
    <EventPopup></EventPopup>
    <HeroBanner></HeroBanner>
    <BukuBaruTerbit></BukuBaruTerbit>
    <EditorsPick></EditorsPick>
    <LimitedSale></LimitedSale>
    <LangkahPendaftaran></LangkahPendaftaran>
    <Testimonials></Testimonials>
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