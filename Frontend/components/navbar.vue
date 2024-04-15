<template>
    <div class="navbar flex px-32 items-center">
        <div class="basis-1/2 flex items-center">
            <img class="size-20 mr-4" src="assets/images/logo.png" alt="">
            <span class="header-font text-3xl text-primary font-bold">Forwistree</span>
        </div>
        <div class="basis-full flex gap-8 justify-center">
            <span class="active navbar-page">Home</span>
            <span class="navbar-page">Products</span>
            <span class="navbar-page">Categories</span>
            <span class="navbar-page">Publish a Book</span>
        </div>
        <div class="navbar-right-side basis-1/2 flex items-center justify-end">
            <img class="size-6 opacity-70" src="assets/images/search.png" alt="">
            <button id="loginBtn">Login</button>
            <button id="registerBtn">Register</button>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    @import '~/assets/scss/global/global';

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

        #registerBtn{
            background: $secondary;
            color: $white;
            border: 1px solid $secondary;

            &:hover{
                opacity: 80%;
            }
        }

        .navbar-page{
            font-size: 20px;
            color: $black;
            opacity: 70%;
            transition: 0.3s all ease-in;
            
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
</style>