<template>
    <div class="ticket-creation">
        <h2 class="text-xl font-bold mb-4">Buat Tiket Baru untuk Customer</h2>

        <div v-if="customer">
            <p class="mb-2">Nama Customer: {{ customer.data_pribadi[0].namaLengkap }}</p>
            <p class="mb-2">Blok: {{ customer.id_blok.blokname }}</p>
            <p class="mb-2">No Rumah: {{ customer.id_rumah.no_rumah }}</p>
        </div>

        <div v-if="!customer && !loading" class="mb-4">
            <label for="customerId" class="block text-sm font-medium mb-1">Pilih Customer ID</label>
            <input v-model="selectedCustomerId" id="customerId" type="text" placeholder="Masukkan Customer ID"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            <button @click="getCustomerData" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Cari
                Customer</button>
        </div>

        <div v-if="loading" class="mb-4">
            <p>Mengambil data customer...</p>
        </div>

        <div v-if="customer && !ticketCreated">
            <h3 class="text-lg font-bold mb-2">Buat Tiket</h3>
            <label for="ticketContain" class="block text-sm font-medium mb-1">Isi Tiket</label>
            <textarea v-model="ticketContent" id="ticketContain"
                class="w-full p-2 border border-gray-300 rounded-lg mb-4" placeholder="Masukkan isi tiket"></textarea>
            <button @click="createTicket" class="px-4 py-2 bg-green-500 text-white rounded-lg">Kirim Tiket</button>
        </div>

        <div v-if="ticketCreated" class="mt-4">
            <p class="text-green-500">Tiket berhasil dibuat dan dikirim ke admin!</p>
        </div>
    </div>
</template>

<script>
import ticketApi from "@/services/ticketApi.js";
import customerApi from "@/services/custumerApi.js";

export default {
    data() {
        return {
            selectedCustomerId: "",
            customer: null,
            ticketContent: "",
            loading: false,
            ticketCreated: false,
        };
    },
    methods: {
        async getCustomerData() {
            if (!this.selectedCustomerId) {
                this.$toast.error("Customer ID wajib diisi!", { duration: 3000 });
                return;
            }

            try {
                this.loading = true;
                const response = await customerApi.getById(this.selectedCustomerId);
                this.customer = response.data.data;
                this.loading = false;
            } catch (error) {
                this.loading = false;
                this.$toast.error("Gagal mengambil data customer", { duration: 3000 });
                console.error("Error fetching customer data:", error);
            }
        },
        async createTicket() {
            if (!this.ticketContent) {
                this.$toast.error("Isi tiket wajib diisi!", { duration: 3000 });
                return;
            }

            const ticketData = {
                ticket_header: [
                    {
                        id_user: this.$store.state.auth.user._id,
                        id_customer: this.customer._id,
                    },
                ],
                ticket_contain: this.ticketContent,
            };

            try {
                await ticketApi.create(ticketData);
                this.ticketCreated = true;
                this.$toast.success("Tiket berhasil dibuat!", { duration: 3000 });
            } catch (error) {
                this.$toast.error("Gagal membuat tiket", { duration: 3000 });
                console.error("Error creating ticket:", error);
            }
        },
    },
};
</script>

<style scoped>
.ticket-creation {
    max-width: 600px;
    margin: auto;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
