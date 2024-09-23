<template>
    <div v-if="!user" class="items-center flex justify-center">
        <div>
            <h1>403 Forbidden.</h1>
        </div>
    </div>

    <div v-if="user" class="p-2 ml-2">
        <Notification ref="notification" />
        <div class="h-screen w-screen flex justify-start font-anton uppercase text-xl">
            <div class="border-2 border-black space-y-4">
                <div class="flex space-x-24 pb-4 p-2 hover:bg-gray-200 hover:border hover:border-gray-200">
                    <div>
                        <h1>Menu</h1>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                </div>
                <div @click="dashboard" :class="{ 'bg-red-500': isClick.dashboard }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Dashboard</h1>
                    </button>
                </div>
                <div @click="blok" :class="{ 'bg-red-500': isClick.hs }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Blok Plan</h1>
                    </button>
                </div>
                <div @click="otps" :class="{ 'bg-red-500': isClick.otp }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Pembayaran</h1>
                    </button>
                </div>
                <div @click="history" :class="{ 'bg-red-500': isClick.his }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">history</h1>
                    </button>
                </div>
                <div @click="logout" :class="{ 'bg-red-500': isClick.LogOut }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Log Out</h1>
                    </button>
                </div>
            </div>
            <div class="w-screen mr-8">
                <div class="h-screen border-2 border-black">
                    <div v-if="ds">
                        <dashboardSpez />
                    </div>
                    <div v-if="hs">
                        <HouseMap />
                    </div>
                    <div v-if="vo">
                        <verifyOtp />
                    </div>
                    <div v-if="his">
                        <historyDirektur />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dashboardSpez from '@/components/dashboardSpez.vue';
import HouseMap from './HouseMapAdmin.vue';
import Notification from '@/components/NotificationModal.vue';
import verifyOtp from '@/components/verifyOtp.vue';
import historyDirektur from '@/components/historyDirektur.vue';

export default {
    components: {
        dashboardSpez,
        Notification,
        HouseMap,
        verifyOtp,
        historyDirektur
    },
    data() {
        return {
            isClick: {
                dashboard: true,
                hs: false,
                otp: false,
                his: false
            },
            vo: false,
            hs: false,
            ds: true,
            his: false,
            notifications: []
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        notify(message) {
            this.notifications.push({ message });
            setTimeout(() => {
                this.notifications.shift();
            }, 10000);
        },
        async logout() {
            try {
                await this.$store.dispatch("logout");
                this.$toast.success("Successfully logged out.", { position: "bottom-left", duration: 1000 });
                await this.$router.push("/login");
            } catch (e) {
                console.log(e);
                this.$toast.error("Couldn't log out.", { position: "bottom-left", duration: 1000 });
            }
        },
        resets() {
            this.hs = false
            this.ds = false;
            this.vo = false;
            this.his = false;
            this.isClick.his = false;
            this.isClick.otp = false;
            this.isClick.hs = false;
            this.isClick.dashboard = false;
        },
        dashboard() {
            this.resets();
            this.ds = true;
            this.isClick.dashboard = true;
        },
        blok() {
            this.resets()
            this.hs = true;
            this.isClick.hs = true;
        },
        otps() {
            this.resets()
            this.vo = true;
            this.isClick.otp = true
        },
        history() {
            this.resets()
            this.his = true;
            this.isClick.his = true
        }
    }
}
</script>

<style scoped>
.notification-container {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
}

.notification {
    background: #333;
    color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: opacity 0.5s ease;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
