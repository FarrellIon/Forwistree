<template>
    <div>
        <nav class="relative">
            <img class="logo" src="assets/images/logo.png" alt="">
            <ul>
                <li class="sidebar-header">
                    <span class="truncate relative">Manajemen Data</span>
                </li>
                <li>
                    <NuxtLink :class="{'sidebar-element': true, 'active': active == 'buku'}" :to="`/admin/buku`">
                        <span class="i-heroicons-book-open icon"></span>
                        <span class="truncate relative">Buku</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="sidebar-element" :to="`/admin/events`">
                        <span class="i-heroicons-calendar icon"></span>
                        <span class="truncate relative">Events</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="sidebar-element" :to="`/admin/kategori-buku`">
                        <span class="i-heroicons-tag icon"></span>
                        <span class="truncate relative">Kategori Buku</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="sidebar-element" :to="`/admin/mitra-event`">
                        <span class="i-heroicons-briefcase icon"></span>
                        <span class="truncate relative">Mitra Event</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="sidebar-element" :to="`/admin/penulis-buku`">
                        <span class="i-heroicons-pencil icon"></span>
                        <span class="truncate relative">Penulis Buku</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink class="sidebar-element" :to="`/admin/pengajuan`">
                        <span class="i-heroicons-document icon"></span>
                        <span class="truncate relative">Pengajuan</span>
                    </NuxtLink>
                </li>
                <div class="flex items-center align-center text-center p-2 w-full flex-row">
                <div class="flex border-gray-200 dark:border-gray-800 w-full border-t border-solid"></div>
                </div>
            </ul>
            <ul>
                <li>
                <a class="sidebar-element" href="/">
                    <span class="i-heroicons-arrow-uturn-left icon"></span>
                    <span class="truncate relative">Kembali ke Home</span>
                </a>
                </li>
                <li>
                <a class="sidebar-element" href="/">
                    <span class="i-heroicons-arrow-left-end-on-rectangle icon"></span>
                    <span class="truncate relative">Log Out</span>
                </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: String,
            required: false
        }
    }
}
</script>

<script setup>
</script>

<style lang="scss" scoped>
@import '../assets/scss/global/global';

nav{
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    height: 120svh;
    position: fixed;
}

.logo{
    width: 96px;
    height: 96px;
    margin: 0 auto;
    margin-top: 0.25rem;
}

.sidebar-header{
    font-weight: 500; /* font-medium */
    font-size: 1rem; /* text-sm */
    color: #1f2125; /* text-gray-500 */
    padding: 0.625rem 0.625rem 0.3rem 0.625rem;
}

.sidebar-element {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.375rem; /* gap-1.5 */
    padding: 0.375rem 0.625rem; /* px-2.5 py-1.5 */
    width: 100%; /* w-full */
    border-radius: 0.375rem; /* rounded-md */
    font-weight: 500; /* font-medium */
    font-size: 0.875rem; /* text-sm */
    color: #6b7280; /* text-gray-500 */
    outline: none;
    transition: 0.15s all ease-out;

    &:hover, &.active {
        color: $primary; /* hover:text-gray-900 */

        .icon{
            color: $primary;
        }
    }

    &:focus-visible {
        outline: none;
    }

    &:focus-visible::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        ring-inset: inset;
        ring: 2px solid #3b82f6; /* focus-visible:ring-primary-500 */
    }

    &:before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
    }

    &:hover::before {
        background-color: #f9fafb; /* hover:before:bg-gray-50 */
    }

    &:disabled {
        cursor: not-allowed; /* disabled:cursor-not-allowed */
        opacity: 0.75; /* disabled:opacity-75 */
    }
}

.icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    position: relative;
    color: #9CA3AF; /* text-gray-400 */
    transition: 0.15s all ease-out;

    &.group-hover:hover {
        color: #374151; /* group-hover:text-gray-700 */
    }
}
</style>