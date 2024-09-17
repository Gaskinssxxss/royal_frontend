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
                <div class="flex justify-center items-center text-4xl">
                    <h1>
                        Dashboard
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
                    {{ notificationCount }}
                </div>
            </button>
        </div>
        <!-- Notifications List -->
        <div v-if="showNotificationList" class="notification-list">
            <div v-if="notifications.length === 0" class="notification-item">
                No Notification
            </div>
            <div v-for="(notif, index) in notifications" :key="index" class="notification-item">
                {{ notif }}
            </div>
        </div>
    </div>
    <div class="flex justify-between py-6 px-10">
        <div class="border-2 border-black p-4 w-56">
            <div class="flex justify-between">
                <h1>
                    Terjual
                </h1>
                <p>{{ soldCount }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4 w-56">
            <div class="flex justify-between">
                <h1>
                    Belum Terjual
                </h1>
                <p>{{ notSoldCount }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4 w-56">
            <div class="flex justify-between">
                <h1>
                    Menunggu Verifikasi
                </h1>
                <p>{{ awaitingVerificationCount }}</p>
            </div>
        </div>
        <div class="border-2 border-black p-4 w-56">
            <div class="flex justify-between">
                <h1>
                    Terverifikasi
                </h1>
                <p>{{ verifiedCount }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import houseCustomerService from "@/services/houseCustomerService";
import Notification from "./NotificationModal.vue";

export default {
    components: {
        Notification
    },
    data() {
        return {
            soldCount: 0,
            notSoldCount: 0,
            awaitingVerificationCount: 0,
            verifiedCount: 0,
            notificationMessage: '',
            notificationCount: 0,
            nilai: 0,
            pollingInterval: 5000,
            previousData: null,
            notifications: [],
            showNotificationList: false
        };
    },
    methods: {
        showNotification(message) {
            this.$refs.notification.notify(message);
            this.notifications.push(message); // Add notification to the list
            this.notificationCount = this.notifications.length; // Update notification count
        },
        ShowNotifmodal() {
            this.showNotification(this.notificationMessage);
        },
        toggleNotifications() {
            this.notificationCount = 0;
            this.showNotificationList = !this.showNotificationList;
        },
        async fetchData() {
            try {
                const { houses, customers } = await houseCustomerService.getAllHousesAndCustomers();

                if (!Array.isArray(houses) || !Array.isArray(customers)) {
                    console.error("Data format is incorrect");
                    return;
                }

                const newSoldCount = houses.filter(house => house.status_rumah === 'terjual').length;
                const newNotSoldCount = houses.filter(house => house.status_rumah === 'deterjual').length;
                const newAwaitingVerificationCount = customers.filter(customer => customer.verifikasi_data === false).length;
                const newVerifiedCount = customers.filter(customer => customer.verifikasi_data === true).length;

                // Check for changes and show notifications
                if (this.previousData) {
                    if (this.previousData.soldCount !== newSoldCount) {
                        this.showNotification('Update: Sold count changed');
                    }
                    if (this.previousData.notSoldCount !== newNotSoldCount) {
                        this.showNotification('Update: Not sold count changed');
                    }
                    if (this.previousData.awaitingVerificationCount !== newAwaitingVerificationCount) {
                        this.showNotification('Update: Awaiting verification count changed');
                    }
                    if (this.previousData.verifiedCount !== newVerifiedCount) {
                        this.showNotification('Update: Verified count changed');
                    }
                }

                // Update previousData
                this.previousData = {
                    soldCount: newSoldCount,
                    notSoldCount: newNotSoldCount,
                    awaitingVerificationCount: newAwaitingVerificationCount,
                    verifiedCount: newVerifiedCount
                };

                // Update the data in the UI
                this.soldCount = newSoldCount;
                this.notSoldCount = newNotSoldCount;
                this.awaitingVerificationCount = newAwaitingVerificationCount;
                this.verifiedCount = newVerifiedCount;

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        startPolling() {
            this.fetchData(); // Initial fetch
            this.pollingIntervalId = setInterval(this.fetchData, this.pollingInterval);
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
