<template>
    <div class="footer items-center w-full">
        <div class="main-footer px-32 py-16 pb-32">
            <div class="basis-2/5">
                <div class="flex items-center mb-6">
                    <img class="size-20 mr-4" src="assets/images/logo_white.png" alt="">
                    <span class="header-font text-3xl text-white font-bold">Forwistree</span>
                </div>
                <p id="footer-description" class="w-4/5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla leo erat, fermentum sit amet odio faucibus, semper malesuada dui. Nunc id ipsum maximus, condimentum velit vel, ornare nunc.</p>
            </div>
            <div class="basis-1/5">
                <h2 class="footer-header header-font">Other Pages</h2>
                <div class="footer-links">
                    <p class="footer-link">About Us</p>
                    <p class="footer-link">Our Team</p>
                    <p class="footer-link">FAQ</p>
                </div>
            </div>
            <div class="basis-1/5">
                <h2 class="footer-header header-font">Contact</h2>
                <div class="footer-links">
                    <p class="footer-link">Customer Service</p>
                    <p class="footer-link">Report a Problem</p>
                    <p class="footer-link">How to Publish?</p>
                </div>
            </div>
            <div class="basis-1/5">
                <h2 class="footer-header header-font">Legal</h2>
                <div class="footer-links">
                    <p class="footer-link">Privacy Policy</p>
                    <p class="footer-link">Terms of Service</p>
                </div>
            </div>
        </div>
        <div class="sub-footer px-32 py-8">
            <span id="copyright" class="font-bold">Copyright © 2024 Forwistree. All rights reserved.</span>
            <div class="flex gap-4">
                <div class="social-media-circle">
                    <img src="assets/images/logo/shopee.png" alt="">
                </div>
                <div class="social-media-circle">
                    <img src="assets/images/logo/facebook.png" alt="">
                </div>
                <div class="social-media-circle">
                    <img src="assets/images/logo/instagram.png" alt="">
                </div>
                <div class="social-media-circle">
                    <img src="assets/images/logo/twitter.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    @import '../assets/scss/global/global';

    .footer{
        .main-footer{
            background: $primary;
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
            
            #footer-description{
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

            .footer-header {
                color: $white;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 32px;
            }

            .footer-links{
                .footer-link{
                    color: white;
                    margin-bottom: 1rem;
                    transition: 0.3s all ease-in;

                    &:hover{
                        cursor: pointer;
                        font-weight: bold;
                    }
                }
            }
        }

        .sub-footer{
            background: #1D2626;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .social-media-circle{
                border-radius: 50%;
                border: 1px solid $white;
                width: 44px;
                height: 44px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.3s all ease-in;

                img{
                    padding: auto;
                    transition: 0.3s all ease-in;
                }

                &:hover{
                    background: $white;
                    cursor: pointer;

                    > img{
                        filter: invert(1);
                    }
                }
            }

            #copyright{
                color: $white;
            }
        }
    }
</style>