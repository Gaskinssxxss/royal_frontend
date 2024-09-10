<template>
    <div class="p-4 text-base">
        <table class="min-w-full border-collapse border-2 border-black text-center">
            <thead>
                <tr>
                    <th class="border-2 border-black px-2 py-2 font-normal">Nama Lengkap Customer</th>
                    <th class="border-2 border-black px-2 py-2 font-normal">Nomor Hp Customer</th>
                    <th class="border-2 border-black px-2 py-2 font-normal">Email Customer</th>
                    <th class="border-2 border-black px-2 py-2 font-normal">Nama Blok</th>
                    <th class="border-2 border-black px-2 py-2 font-normal">Nomor Rumah</th>
                    <th class="border-2 border-black px-2 py-2 font-normal">Tipe Rumah</th>
                    <th class="border-2 border-black px-2 py-2 font-normal">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customer in customers" :key="customer._id">
                    <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].namaLengkap }}</td>
                    <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].no_kontak }}</td>
                    <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].email }}</td>
                    <td class="border-2 border-black px-2 py-2">{{ customer.id_blok.blokname }}</td>
                    <td class="border-2 border-black px-2 py-2">{{ customer.id_rumah.no_rumah }}</td>
                    <td class="border-2 border-black px-2 py-2">{{ customer.id_rumah.type_rumah }}</td>
                    <td class="border-2 border-black pl-2 pt-3 pb-2">
                        <div>
                            <button @click="deleteCustomer(customer._id)" class="bg-black text-black">
                                <h1
                                    class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                    Hapus
                                </h1>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import CustomerService from "@/services/custumerApi";

export default {
    data() {
        return {
            customers: [],
            SelectId: null
        };
    },
    created() {
        this.fetchCustomers();
    },
    methods: {
        async fetchCustomers() {
            try {
                const response = await CustomerService.getAll();
                this.customers = response.data.data;
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },
        async deleteCustomer(id) {
            try {
                const response = await CustomerService.getById(id);
                this.SelectId = response.data.data;
                await CustomerService.delete(this.SelectId._id);
                this.SelectId = null;
                this.fetchCustomers();
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        }
    },
};
</script>
