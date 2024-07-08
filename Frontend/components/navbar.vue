<template>
    <div class="navbar flex px-8 lg:px-16 items-center justify-between">
        <div class="min-width flex items-center" style="min-width: 226px;">
            <img class="size-20 mr-4" src="assets/images/logo.png" alt="">
            <span class="block md:hidden lg:block header-font text-2xl text-primary font-bold">Forwistree</span>
        </div>
        <div class="lg:flex md:flex sm:hidden hidden gap-8 justify-center" style="flex-grow: 1">
            <NuxtLink to="/">
                <span :class="{'navbar-page': true, 'active': active == 'home'}">Home</span>
            </NuxtLink>
            <NuxtLink to="/products">
                <span :class="{'navbar-page': true, 'active': active == 'products'}">Products</span>
            </NuxtLink>
            <NuxtLink to="/categories/semua">
                <span :class="{'navbar-page': true, 'active': active == 'categories'}">Categories</span>
            </NuxtLink>
            <NuxtLink to="/publish">
                <span :class="{'navbar-page': true, 'active': active == 'publish'}">Publish a Book</span>
            </NuxtLink>
        </div>
        <div class="min-width navbar-right-side flex items-center justify-end" style="min-width: 226px;">
            <!-- <img class="size-6 opacity-70" src="assets/images/search.png" alt=""> -->
            <button id="loginBtn" class="hidden lg:block">Login Admin</button>
            <!-- <button id="registerBtn" class="hidden lg:block">Register</button> -->
            <button id="loginBtnSmall" class="md:block hidden lg:hidden" title="Login"><img src="assets/images/login-primary.png" class="size-6" alt="login"></button>
            <!-- <button id="registerBtnSmall" class="hidden md:block lg:hidden" title="Register"><img src="assets/images/edit.png" class="size-6" alt="login"></button> -->
            <button id="sidebarBtn" class="sm:block md:hidden lg:hidden" title="Side Menu" @click="isOpen = true"><img src="assets/images/menu-primary.png" class="size-6" alt="login"></button>
        </div>
    </div>
    <div>
        <USlideover v-model="isOpen">
        <UCard
            class="flex flex-col flex-1"
            :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
        >
            <template #header>
            <UButton
                color="gray"
                variant="ghost"
                size="sm"
                icon="i-heroicons-x-mark-20-solid"
                class="flex sm:hidden absolute end-5 top-5 z-10"
                square
                padded
                @click="isOpen = false"
            />

            <div class="flex items-center">
                <img class="size-20 mr-4" src="assets/images/logo.png" alt="">
                <span class="block md:hidden lg:block header-font text-2xl text-primary font-bold">Forwistree</span>
            </div>
            </template>
            <template #footer>
                <button id="login-admin-navbar">Login Admin</button>
            </template>

            <div class="sidebar-links">
                <NuxtLink class="block" to="/">
                    <span :class="{'navbar-page': true, 'active': active == 'home'}">Home</span>
                </NuxtLink>
                <NuxtLink class="block" to="/products">
                    <span :class="{'navbar-page': true, 'active': active == 'products'}">Products</span>
                </NuxtLink>
                <NuxtLink class="block" to="/categories">
                    <span :class="{'navbar-page': true, 'active': active == 'categories'}">Categories</span>
                </NuxtLink>
                <NuxtLink class="block" to="/publish">
                    <span :class="{'navbar-page': true, 'active': active == 'publish'}">Publish a Book</span>
                </NuxtLink>
            </div>
        </UCard>
        </USlideover>
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
const isOpen = ref(false);
</script>

<style lang="scss" scoped>
    @import '~/assets/scss/global/global';

    #login-admin-navbar{
        transition: 0.3s all ease-out;
        
        &:hover{
            color: $primary;
        }
    }

    .navbar{
        background: $white;
        height: 128px;
        display: flex;
        
        .navbar-right-side{
            gap: 1rem;
        }

        #loginBtn, #registerBtn{
            border-radius: 32px;
            padding: 4px 32px;
            outline: none;
            transition: 0.3s all ease-in;
        }

        #loginBtn{
            border: 1px solid $secondary;
            color: $secondary;

            &:hover{
                color: white;
                background: $secondary;
            }
        }

        #loginBtnSmall{
            border-radius: 32px;
            padding: 8px;
            outline: none;
            transition: 0.3s all ease-out;
            border: 1px solid $primary;
            color: $primary;

            img{
                transition: 0.3s all ease-out;
            }

            &:hover{
                img{
                    filter: brightness(0) invert(1);
                }

                background: $primary;
                transform: scale(1.15);
            }
        }

        #registerBtn{
            background: $secondary;
            color: $white;
            border: 1px solid $secondary;

            &:hover{
                opacity: 80%;
            }
        }

        #registerBtnSmall{
            border-radius: 32px;
            padding: 8px 6px 8px 10px;
            outline: none;
            transition: 0.3s all ease-out;
            background: $secondary;
            color: $white;
            border: 1px solid $secondary;

            img{
                filter: invert(1);
                transition: 0.3s all ease-out;
            }

            &:hover{
                transform: scale(1.15);
            }
        }

        .navbar-page{
            font-size: 16px;
            color: $black;
            opacity: 70%;
            transition: 0.3s all ease-out;
            
            &.active{
                color: $primary;
                opacity: 100%;
            }

            &:hover{
                cursor: pointer;
                color: $primary;
                opacity: 1;
            }
        }
    }

    .sidebar-links{
        .block{
            font-size: 20px;
            margin-bottom: 0.5rem;
            transition: 0.3s all ease-out;

            &:hover{
                color: $primary;
            }
        }
    }

    @media(max-width: 926px){
        .min-width{
            min-width: 80px !important;
        }
    }
</style>