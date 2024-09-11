<template>
    <div class="px-8 py-6">
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
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-12">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
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

export default {
    data() {
        return {
            soldCount: 0,
            notSoldCount: 0,
            awaitingVerificationCount: 0,
            verifiedCount: 0,
        };
    },
    methods: {
        async fetchData() {
            try {
                const { houses, customers } = await houseCustomerService.getAllHousesAndCustomers();

                if (!Array.isArray(houses)) {
                    console.error("Houses is not an array:", houses);
                }
                if (!Array.isArray(customers)) {
                    console.error("Customers is not an array:", customers);
                }
                this.soldCount = Array.isArray(houses) ? houses.filter(house => house.status_rumah === false).length : 0;
                this.notSoldCount = Array.isArray(houses) ? houses.filter(house => house.status_rumah === true).length : 0;

                this.awaitingVerificationCount = Array.isArray(customers) ? customers.filter(customer => customer.verifikasi_data === false).length : 0;
                this.verifiedCount = Array.isArray(customers) ? customers.filter(customer => customer.verifikasi_data === true).length : 0;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    },
    created() {
        this.fetchData();
    }
};
</script>
