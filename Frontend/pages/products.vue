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
  <style>
  html, body{
    height: 100vh;
  }
  </style>