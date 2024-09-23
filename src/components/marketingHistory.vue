<template>
    <div class="p-4">
        <div v-if="userHistory.length > 0" class="mb-6">
            <div class="overflow-y-auto h-screen">
                <table class="table-auto w-full font-anton bg-white text-sm">
                    <thead class="text-base">
                        <tr class="bg-gray-200 text-left">
                            <th class="px-4 py-2 border border-black font-normal text-lg">Id</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">Nama Customer</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">No Kavling</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">Luas Bangunan</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">Luas Tanah</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">Status Rumah</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">Status Dokumen</th>
                            <th class="px-4 py-2 border border-black font-normal text-lg">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in userHistory" :key="customer._id" class="border-b">
                            <td class="px-4 py-2 border border-black">
                                ADR - 0{{ customer.kavling[0].type.replace('Type ', '') }} -
                                {{ customer.id_blok.blokname }} - 0{{ customer.id_rumah.no_rumah }}
                            </td>
                            <td class="px-4 py-2 border border-black">{{ customer.id_user.username }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.kavling[0].no_kavling }}</td>
                            <td class="px-4 py-2 border border-black">{{ customer.kavling[0].luas_bangunan }}
                            </td>
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
            const message = `${customer.id_user.username} - ADR - 0${customer.kavling[0].type.replace('Type ', '')} - ${customer.id_blok.blokname} - 0${customer.id_rumah.no_rumah}`;
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