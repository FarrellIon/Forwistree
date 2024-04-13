<template>
    <div class="navbar flex px-32 items-center">
        <div class="basis-1/2 flex items-center">
            <img class="size-20 mr-4" src="assets/images/logo.png" alt="">
            <span class="header-font text-3xl text-primary font-bold">Forwistree</span>
        </div>
        <div class="basis-full flex gap-8 justify-center">
            <span class="active navbar-page">Home</span>
            <span class="navbar-page">About Us</span>
            <span class="navbar-page">Services</span>
            <span class="navbar-page">Contact</span>
        </div>
        <div class="navbar-right-side basis-1/2 flex items-center justify-end">
            <img class="size-6 opacity-50" src="assets/images/search.png" alt="">
            <button id="loginBtn">Login</button>
            <button id="registerBtn">Register</button>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .navbar{
        background: $white;
        height: 148px;
        display: flex;
        
        .navbar-right-side{
            gap: 1rem;
        }

        #loginBtn, #registerBtn{
            border-radius: 32px;
            padding: 4px 48px;
        }

        #loginBtn{
            border: 1px solid $secondary;
            color: $primary;
        }

        #registerBtn{
            background: $secondary;
            color: $white;
        }

        .navbar-page{
            font-size: 20px;
            color: $black;
            opacity: 70%;
            
            &.active{
                color: $primary;
                opacity: 100%;
            }
        }
    }
</style>