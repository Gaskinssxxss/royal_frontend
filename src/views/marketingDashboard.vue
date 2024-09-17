<template>

    <div v-if="!user" class="items-center flex justify-center">
        <div>
            <h1>403 Forbidden.</h1>
        </div>
    </div>

    <div v-if="user" class="p-2 ml-2">
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
                <div @click="blokplan" :class="{ 'bg-red-500': isClick.bp }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Blok Plan</h1>
                    </button>
                </div>
                <div @click="history" :class="{ 'bg-red-500': isClick.mh }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Customer History</h1>
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
                    <div v-if="bp">
                        <HouseMap />
                    </div>
                    <div v-if="mh">
                        <marketingHistory />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dashboardSpez from '@/components/dashboardSpez.vue';
import marketingHistory from '@/components/marketingHistory.vue';
import HouseMap from './HouseMap.vue';
import custumerApi from '@/services/custumerApi';

export default {
    components: {
        dashboardSpez,
        marketingHistory,
        HouseMap
    },
    data() {
        return {
            isClick: {
                dashboard: true,
                mh: false,
                bp: false
            },
            ds: true,
            mh: false,
            bp: false,
            nilai: 0,
            adminlive: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    mounted() {
        this.getUnverifiedCustomers()
    },
    methods: {
        getUnverifiedCustomers() {
            custumerApi.getUnverifiedCustomers()
                .then(res => {
                    if (res.data.data.length !== 0) {
                        this.nilai = res.data.data.length;
                    } else {
                        this.nilai = 0
                    }
                })
                .catch(error => {
                    console.log(error);
                });
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
            this.ds = false;
            this.mh = false;
            this.bp = false;
            this.isClick.dashboard = false;
            this.isClick.mh = false;
            this.isClick.bp = false
        },
        dashboard() {
            this.resets();
            this.ds = true;
            this.isClick.dashboard = true;
        },
        history() {
            this.resets()
            this.mh = true;
            this.isClick.mh = true
        },
        blokplan() {
            this.resets()
            this.bp = true;
            this.isClick.bp = true
        }
    }
}
</script>
