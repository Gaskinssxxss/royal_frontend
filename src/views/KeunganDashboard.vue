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
                <div @click="keuanganPage" :class="{ 'bg-red-500': isClick.kp }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Pembayaran</h1>
                    </button>
                </div>
                <div @click="ProgresBar" :class="{ 'bg-red-500': isClick.pg }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Progres Pembayaran </h1>
                    </button>
                </div>
                <div @click="historyPenjualan" :class="{ 'bg-red-500': isClick.historypenjualan }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">History Penjualan</h1>
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
                    <div v-if="hsp">
                        <HistoryPenjualan />
                    </div>
                    <div v-if="kp">
                        <keuanganPage />
                    </div>
                    <div v-if="pg">
                        <progresBar />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dashboardSpez from '@/components/dashboardSpez.vue';
import HistoryPenjualan from '@/components/HistoryPenjualan.vue';
import progresBar from '@/components/progresBar.vue';
import custumerApi from '@/services/custumerApi';
import keuanganPage from '@/components/keuanganPage.vue';
export default {
    components: {
        dashboardSpez,
        HistoryPenjualan,
        keuanganPage,
        progresBar
    },
    data() {
        return {
            isClick: {
                dashboard: true,
                verifikasi: false,
                historypenjualan: false,
                kp: false,
                pg: false,
            },
            ds: true,
            hsp: false,
            kp: false,
            pg: false,
            historypenjualan: false,
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
        keuanganPage() {
            this.resets()
            this.kp = true;
            this.isClick.kp = true
        },
        historyPenjualan() {
            this.resets();
            this.hsp = true;
            this.isClick.historypenjualan = true;

        },
        ProgresBar() {
            this.resets();
            this.isClick.pg = true
            this.pg = true;
        },
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
        HapusAccount() {
            this.resets();
            this.deleteakun = true;
            this.isClick.deleteaccount = true;
        },
        Editaccount() {
            this.resets();
            this.editakun = true;
            this.isClick.editaccount = true;
        },
        CreateAccount() {
            this.resets();
            this.createaccount = true;
            this.isClick.creataccount = true;
        }
        ,
        listaccount() {
            this.resets();
            this.lsaccount = true;
            this.isClick.listaccount = true;
        },
        resets() {
            this.vd = false;
            this.ds = false;
            this.ed = false;
            this.de = false;
            this.dt = false;
            this.adminlive = false;
            this.lsaccount = false;
            this.createaccount = false;
            this.isClick.dashboard = false;
            this.isClick.verifikasi = false;
            this.isClick.edit = false;
            this.isClick.deleted = false;
            this.isClick.terverifikasi = false
            this.isClick.listaccount = false;
            this.isClick.creataccount = false;
            this.editakun = false;
            this.isClick.editaccount = false;
            this.deleteakun = false;
            this.isClick.deleteaccount = false;
            this.isClick.tiketlist = false
            this.tiketlist = false;
            this.historypenjualan = false;
            this.isClick.historypenjualan = false;
            this.isClick.live = false
            this.hsp = false;
            this.isClick.historypenjualan = false;
            this.kp = false;
            this.isClick.kp = false;
            this.isClick.pg = false
            this.pg = false;
        },
        deleted() {
            this.resets();
            this.de = true;
            this.isClick.deleted = true;
        },
        dashboard() {
            this.resets();
            this.ds = true;
            this.isClick.dashboard = true;
        },
        verifikasi() {
            this.resets();
            this.vd = true;
            this.isClick.verifikasi = true;
        },
        checklist() {
            this.resets();
            this.dt = true;
            this.isClick.terverifikasi = true;
        },
        edit() {
            this.resets();
            this.ed = true;
            this.isClick.edit = true;
        }
    }
}
</script>
