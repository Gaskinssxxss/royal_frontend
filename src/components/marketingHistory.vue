<template>
    <div>
        <div v-if="userHistory.length > 0" class="mb-6">
            <div class="overflow-y-auto h-screen">
                <table class="table-auto w-full font-anton bg-white">
                    <thead>
                        <tr class="bg-gray-200 text-left">
                            <th class="px-4 py-2 border border-black font-normal">Nama Customer</th>
                            <th class="px-4 py-2 border border-black font-normal">Blok</th>
                            <th class="px-4 py-2 border border-black font-normal">No Rumah</th>
                            <th class="px-4 py-2 border border-black font-normal">No Kavling</th>
                            <th class="px-4 py-2 border border-black font-normal">Type Kavling</th>
                            <th class="px-4 py-2 border border-black font-normal">Luas Bangunan</th>
                            <th class="px-4 py-2 border border-black font-normal">Luas Tanah</th>
                            <th class="px-4 py-2 border border-black font-normal">Status Rumah</th>
                            <th class="px-4 py-2 border border-black font-normal">Status Dokumen</th>
                            <th class="px-4 py-2 border border-black font-normal">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in userHistory" :key="customer._id" class="border-b">
                            <td class="px-4 py-2 border border-black">{{ customer.data_pribadi.nama_lengkap }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.id_blok.blokname }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.id_rumah.no_rumah }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.kavling[0].no_kavling }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.kavling[0].type }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.kavling[0].luas_bangunan }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.kavling[0].luas_tanah }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.id_rumah.status_rumah }}</td>
                            <td class="px-4 py-2 border border-black">
                                {{ customer.verifikasi_data ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                            </td>
                            <td class="px-4 py-2 border border-black">
                                <button @click="tanyaAdmin(customer)"
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg">
                                    Chat
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else>
            <p class="text-center pt-4">Belum ada riwayat.</p>
        </div>
    </div>
</template>

<script>
import custumerApi from '@/services/custumerApi';

export default {
    data() {
        return {
            userHistory: [],
            selectedCustomer: null,
        }
    },
    mounted() {
        this.getUserHistory()
    },
    methods: {
        async tanyaAdmin(customer) {
            this.selectedCustomer = customer;
            const message = `Marketing : ${customer.id_user.username} - Blok : ${customer.id_blok.blokname} - 
      No Rumah : ${customer.id_rumah.no_rumah} - Tipe : ${customer.id_rumah.type_rumah}`;
            const encodedMessage = btoa(message);
            await this.$router.push({ path: '/live-chat', query: { message: encodedMessage } });
        },
        async getUserHistory() {
            custumerApi.getUserHistory()
                .then(res => {
                    this.userHistory = res.data.data
                    console.log(this.userHistory)
                })
                .catch(error => {
                    console.log(error)
                })
        },
    }
}
</script>