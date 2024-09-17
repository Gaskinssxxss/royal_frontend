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
                <div @click="live" :class="{ 'bg-red-500': isClick.live }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Live Chat</h1>
                    </button>
                </div>
                <div @click="blok" :class="{ 'bg-red-500': isClick.hs }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Blok Plan</h1>
                    </button>
                </div>
                <div @click="verifikasi" :class="{ 'bg-red-500': isClick.verifikasi }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <div>
                        <button>
                            <h1 class="pl-2 uppercase">Verifikasi Data</h1>
                        </button>
                    </div>
                </div>
                <div @click="checklist" :class="{ 'bg-red-500': isClick.terverifikasi }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Data Terverifikasi</h1>
                    </button>
                </div>
                <div @click="edit" :class="{ 'bg-red-500': isClick.edit }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Edit Data</h1>
                    </button>
                </div>
                <div @click="deleted" :class="{ 'bg-red-500': isClick.deleted }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Hapus Data</h1>
                    </button>
                </div>
                <div @click="listaccount" :class="{ 'bg-red-500': isClick.listaccount }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Verifikasi Akun</h1>
                    </button>
                </div>
                <div @click="CreateAccount" :class="{ 'bg-red-500': isClick.creataccount }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Buat Akun</h1>
                    </button>
                </div>
                <div @click="Editaccount" :class="{ 'bg-red-500': isClick.editaccount }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Edit Akun</h1>
                    </button>
                </div>
                <div @click="HapusAccount" :class="{ 'bg-red-500': isClick.deleteaccount }"
                    class="hover:bg-gray-200 hover:border hover:border-gray-200">
                    <button>
                        <h1 class="pl-2 uppercase">Hapus Akun</h1>
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
                    <div v-if="hs">
                        <HouseMap />
                    </div>
                    <div v-if="vd">
                        <verifikasiData />
                    </div>
                    <div v-if="dt">
                        <dataTerverfikasi />
                    </div>
                    <div v-if="ed">
                        <editData />
                    </div>
                    <div v-if="de">
                        <deleteData />
                    </div>
                    <div v-if="lsaccount">
                        <accountList />
                    </div>
                    <div v-if="createaccount">
                        <CreateAccount />
                    </div>
                    <div v-if="editakun">
                        <EditAccount />
                    </div>
                    <div v-if="deleteakun">
                        <DeleteAccount />
                    </div>
                    <div v-if="tiketlist">
                        <ticketList />
                    </div>
                    <div v-if="historypenjualan">
                        <HistoryPenjualan />
                    </div>
                    <div v-if="adminlive">
                        <adminLiveChat />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dashboardSpez from '@/components/dashboardSpez.vue';
import verifikasiData from '@/components/verifikasiData.vue';
import editData from '@/components/editData.vue';
import deleteData from '@/components/deleteData.vue';
import dataTerverfikasi from '@/components/dataTerverfikasi.vue';
import accountList from '@/components/accountList.vue';
import CreateAccount from '@/components/CreateAccount.vue';
import EditAccount from '@/components/EditAccount.vue';
import DeleteAccount from '@/components/deleteAccount.vue';
import ticketList from '@/components/ticketList.vue';
import HistoryPenjualan from '@/components/HistoryPenjualan.vue';
import adminLiveChat from '@/components/adminLiveChat.vue';
import Notification from '@/components/NotificationModal.vue';
import HouseMap from './HouseMapAdmin.vue';

export default {
    components: {
        dashboardSpez,
        verifikasiData,
        editData,
        deleteData,
        dataTerverfikasi,
        accountList,
        CreateAccount,
        EditAccount,
        DeleteAccount,
        ticketList,
        HistoryPenjualan,
        adminLiveChat,
        Notification,
        HouseMap
    },
    data() {
        return {
            isClick: {
                dashboard: true,
                verifikasi: false,
                edit: false,
                deleted: false,
                terverifikasi: false,
                listaccount: false,
                creataccount: false,
                editaccount: false,
                deleteaccount: false,
                LogOut: false,
                tiketlist: false,
                historypenjualan: false,
                live: false,
                hs: false
            },
            hs: false,
            ds: true,
            vd: false,
            ed: false,
            de: false,
            dt: false,
            lsaccount: false,
            createaccount: false,
            editakun: false,
            deleteakun: false,
            tiketlist: false,
            historypenjualan: false,
            adminlive: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        blok() {
            this.resets()
            this.hs = true;
            this.isClick.hs = true
        },
        showNotification(message) {
            this.$refs.notification.notify(message);
        },
        live() {
            this.resets()
            this.adminlive = true;
            this.isClick.adminlive = true
        },
        historyPenjualan() {
            this.resets();
            this.historypenjualan = true;
            this.isClick.historypenjualan = true;

        },
        TicketReques() {
            this.resets();
            this.isClick.tiketlist = true
            this.tiketlist = true;
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
            this.hs = false
            this.vd = false;
            this.ds = false;
            this.ed = false;
            this.de = false;
            this.dt = false;
            this.adminlive = false;
            this.lsaccount = false;
            this.createaccount = false;
            this.isClick.hs = false;
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
