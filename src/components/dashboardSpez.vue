<template>
    <div class="px-8 py-6">
        <Notification ref="notification" />
        <div class="flex justify-between">
            <div class="flex space-x-2">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-12">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                </div>
                <div class="flex justify-center items-center text-3xl">
                    <h1>
                        Dashboard {{ user.username }}
                    </h1>
                </div>
            </div>
            <button @click="toggleNotifications" class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-12">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <div class="absolute top-0 right-0 bg-red-500 text-white text-sm rounded-full px-5 py-5">
                    {{ notifCount }}
                </div>
            </button>
        </div>
        <div v-if="showNotificationList" class="notification-list">
            <div v-if="notifications.length === 0" class="notification-item">
                No Notification
            </div>
            <div v-for="(notif, index) in notifications" :key="index" class="notification-item">
                {{ notif.content }}
            </div>
        </div>
    </div>
    <div class="flex justify-between py-6 px-6 text-base">
        <div class="border-2 border-black p-4">
            <div class="flex justify-between space-x-10">
                <h1>
                    Terjual
                </h1>
                <p class="text-che">{{ soldCount }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4">
            <div class="flex justify-between space-x-10">
                <h1>
                    CASH
                </h1>
                <p class="text-che">{{ cash }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4">
            <div class="flex justify-between space-x-10">
                <h1>
                    KPR
                </h1>
                <p class="text-che">{{ kpr }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4">
            <div class="flex justify-between space-x-10">
                <h1>
                    Belum Terjual
                </h1>
                <p class="text-che">{{ notSoldCount }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4">
            <div class="flex justify-between space-x-10">
                <h1>
                    Menunggu Verifikasi
                </h1>
                <p class="text-che">{{ awaitingVerificationCount }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4">
            <div class="flex justify-between space-x-10">
                <h1>
                    Terverifikasi
                </h1>
                <p class="text-che">{{ verifiedCount }}</p>
            </div>
        </div>
    </div>
    <div id="chart">
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>

</template>

<script>
import houseCustomerService from "@/services/houseCustomerService";
import Notification from "./NotificationModal.vue";
import ApiNotification from "../services/Notifitcation"
import VueApexCharts from "vue3-apexcharts";
export default {
    components: {
        Notification,
        apexchart: VueApexCharts,
    },
    mounted() {
        this.fetchData();
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    data() {

        return {
            chartOptions: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    stackType: '100%'
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                xaxis: {
                    categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2',
                        '2012 Q3', '2012 Q4'
                    ],
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'right',
                    offsetX: 0,
                    offsetY: 50
                },
            },
            series: [{
                name: 'KPR',
                data: [44, 55, 41, 67, 22, 43, 21, 49]
            }, {
                name: 'CASH',
                data: [13, 23, 20, 8, 13, 27, 33, 12]
            }],

            soldCount: 0,
            notSoldCount: 0,
            awaitingVerificationCount: 0,
            verifiedCount: 0,
            notificationMessage: '',
            notificationCount: 0,
            notifCount: 0,
            kpr: 0,
            cash: 0,
            nilai: 0,
            pollingInterval: 5000,
            previousData: null,
            notifications: [],
            showNotificationList: false,
            kprData: [],
            cashData: []
        };
    },
    methods: {
        async showNotification(message) {
            try {
                this.$refs.notification.notify(message);
                this.notifications.push(message);
                this.notificationCount = this.notifications.length;
            } catch (error) {
                console.error(error)
            }
        },
        ShowNotifmodal() {
            this.showNotification(this.notificationMessage);
        },
        close() {
            this.showNotificationList = false;
        },
        toggleNotifications() {
            this.notifCount = 0;
            this.showNotificationList = !this.showNotificationList;
        },
        async fetchData() {
            try {
                const { houses, customers } = await houseCustomerService.getAllHousesAndCustomers();
                if (!Array.isArray(houses) || !Array.isArray(customers)) {
                    console.error("Data format is incorrect");
                    return;
                }
                const newKPRCount = customers.filter(customer => {
                    const house = customers.find(custom => custom.id_rumah === customer.id_rumah);
                    return customer.type_pembayaran === 'kpr' && house.id_rumah.status_rumah === 'terjual';
                }).length;

                const newCashCount = customers.filter(customer => {
                    const house = customers.find(custom => custom.id_rumah === customer.id_rumah);
                    return customer.type_pembayaran === 'cash' && house.id_rumah.status_rumah === 'terjual';
                }).length;
                this.cashData = customers.filter(customer => {
                    const house = customers.find(custom => custom.id_rumah === customer.id_rumah);
                    return customer.type_pembayaran === 'cash' && house.id_rumah.status_rumah === 'terjual';
                })
                // console.log(this.cashData)
                const newSoldCount = houses.filter(house => house.status_rumah === 'terjual').length;
                const newNotSoldCount = houses.filter(house => house.status_rumah === 'deterjual').length;
                const newAwaitingVerificationCount = customers.filter(customer => customer.verifikasi_data === false).length;
                const newVerifiedCount = customers.filter(customer => customer.verifikasi_data === true).length;
                this.previousData = {
                    soldCount: newSoldCount,
                    notSoldCount: newNotSoldCount,
                    awaitingVerificationCount: newAwaitingVerificationCount,
                    verifiedCount: newVerifiedCount
                };
                this.soldCount = newSoldCount;
                this.notSoldCount = newNotSoldCount;
                this.awaitingVerificationCount = newAwaitingVerificationCount;
                this.verifiedCount = newVerifiedCount;
                this.kpr = newKPRCount;
                this.cash = newCashCount;

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        async fetchNotification() {
            try {
                let result;

                if (this.user.role === "marketing") {
                    result = await ApiNotification.getByIdMarketing(this.user._id);
                } else if (this.user.role === "admin") {
                    result = await ApiNotification.getByIdRole(this.user._id);
                } else if (this.user.role === "keuangan") {
                    result = await ApiNotification.getByIdKeuangan(this.user._id);
                } else if (this.user.role === "direktur") {
                    result = await ApiNotification.getByIddDirektur(this.user._id);
                } else {
                    console.log("User tidak ada");
                    return;
                }
                const newNotifications = result.data;
                if (newNotifications.length > this.notificationCount) {
                    this.notifCount = newNotifications.length
                    const newMessages = newNotifications.slice(this.notificationCount); // Dapatkan hanya notifikasi baru
                    newMessages.forEach((notif) => this.showNotification(notif.content)); // Tampilkan notifikasi baru
                }

                this.notifications = newNotifications;
                this.notificationCount = newNotifications.length;

            } catch (error) {
                console.error(error);
            }
        },
        startPolling() {
            this.fetchNotification(); // Initial fetch
            this.pollingIntervalId = setInterval(this.fetchNotification, this.pollingInterval);
        },
        stopPolling() {
            clearInterval(this.pollingIntervalId);
        }
    },
    created() {
        this.startPolling();
    },
    beforeUnmount() {
        this.stopPolling();
    }
};
</script>

<style scoped>
.notification-list {
    position: fixed;
    top: 60px;
    right: 10px;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    max-height: 300px;
    overflow-y: auto;
}

.notification-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.notification-item:last-child {
    border-bottom: none;
}


.relative {
    position: relative;
}

.absolute {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
</style>
