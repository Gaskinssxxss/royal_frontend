<template>
    <div class="p-4 text-lg">
        <div class="mb-4 flex space-x-4">
            <select v-model="selectedBlokname" class="border-2 border-black px-4 py-2 flex-grow">
                <option disabled value="">Pilih Blok</option>
                <option v-for="blok in blokOptions" :key="blok._id.$oid" :value="blok.blokname"
                    class="font-bold font-Jet capitalize tracking-wide">
                    {{ blok.blokname }}
                </option>
            </select>
            <div class="bg-black rounded">
                <button @click="searchCustomer"
                    class=" bg-gray-200 rounded text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                    Cari
                </button>
            </div>
        </div>

        <div v-if="customers.length > 0">
            <table class="min-w-full border-collapse border-2 border-black text-center">
                <thead>
                    <tr>
                        <th class="border-2 border-black px-2 py-2 font-normal">Marketer</th>
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
                        <td class="border-2 border-black px-2 py-2">{{ customer.id_user.username }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].namaLengkap }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].no_kontak }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].email }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.id_blok.blokname }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.id_rumah.no_rumah }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.id_rumah.type_rumah }}</td>
                        <td class="border-2 border-black pl-2 pt-3 pb-2">
                            <div>
                                <button @click="deleteCustomer(customer._id)" class="bg-black text-black rounded">
                                    <h1
                                        class="bg-gray-200 border-2 px-4 py-2 border-black uppercase rounded transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Hapus
                                    </h1>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
        </div>
    </div>
</template>

<script>
import CustomerService from "@/services/custumerApi";

export default {
    data() {
        return {
            customers: [],
            selectedBlokname: '',
            blokOptions: [
                { "_id": { "$oid": "66dc1aa8dc6375e185b9ff0d" }, "blokname": "TERATAI" },
                { "_id": { "$oid": "66dc1ab1dc6375e185b9ff10" }, "blokname": "LAVENDER" },
                { "_id": { "$oid": "66dc1ab3dc6375e185b9ff13" }, "blokname": "ANYELIR" },
                { "_id": { "$oid": "66dc1ab9dc6375e185b9ff16" }, "blokname": "KAMBOJA" },
                { "_id": { "$oid": "66dc1abcdc6375e185b9ff19" }, "blokname": "CAMELIA" },
                { "_id": { "$oid": "66dc1ac2dc6375e185b9ff1c" }, "blokname": "LILY" },
                { "_id": { "$oid": "66dc1acadc6375e185b9ff1f" }, "blokname": "BOUGENVILLE" },
                { "_id": { "$oid": "66dc1acddc6375e185b9ff22" }, "blokname": "MATAHARI" },
                { "_id": { "$oid": "66dc1ad3dc6375e185b9ff26" }, "blokname": "MATAHARI-A" },
                { "_id": { "$oid": "66dc1ad7dc6375e185b9ff29" }, "blokname": "MATAHARI-B" },
                { "_id": { "$oid": "66dc1adbdc6375e185b9ff2c" }, "blokname": "MATAHARI-C" },
                { "_id": { "$oid": "66dc1ae1dc6375e185b9ff2f" }, "blokname": "MATAHARI-D" },
                { "_id": { "$oid": "66dc1ae8dc6375e185b9ff32" }, "blokname": "TULIP" },
                { "_id": { "$oid": "66dc1aeedc6375e185b9ff35" }, "blokname": "BROMELIA" },
                { "_id": { "$oid": "66dc1af3dc6375e185b9ff38" }, "blokname": "BROMELIA-A" },
                { "_id": { "$oid": "66dc1afadc6375e185b9ff3b" }, "blokname": "BROMELIA-B" },
                { "_id": { "$oid": "66dc1b00dc6375e185b9ff3e" }, "blokname": "BROMELIA-C" },
                { "_id": { "$oid": "66dc1b03dc6375e185b9ff41" }, "blokname": "BROMELIA-D" },
                { "_id": { "$oid": "66dc1b13dc6375e185b9ff44" }, "blokname": "ALLYSUM" },
                { "_id": { "$oid": "66dc1b14dc6375e185b9ff47" }, "blokname": "ALLYSUM-A" },
                { "_id": { "$oid": "66dc1b16dc6375e185b9ff4a" }, "blokname": "ALLYSUM-B" },
                { "_id": { "$oid": "66dc1b17dc6375e185b9ff4d" }, "blokname": "ALLYSUM-C" },
                { "_id": { "$oid": "66dc1b2bdc6375e185b9ff50" }, "blokname": "SERUNI" },
                { "_id": { "$oid": "66dc1b41dc6375e185b9ff53" }, "blokname": "KENANGA" },
                { "_id": { "$oid": "66dc1b73dc6375e185b9ff59" }, "blokname": "AZALEA" },
                { "_id": { "$oid": "66dc1b77dc6375e185b9ff5c" }, "blokname": "FLAMBOYAN" },
                { "_id": { "$oid": "66dc1b7bdc6375e185b9ff5f" }, "blokname": "DAHLIA" },
                { "_id": { "$oid": "66dc1b7edc6375e185b9ff62" }, "blokname": "GARDENIA" },
                { "_id": { "$oid": "66dc1b83dc6375e185b9ff65" }, "blokname": "ALAMANDA" },
                { "_id": { "$oid": "66dc1b85dc6375e185b9ff68" }, "blokname": "CEMPAKA" },
                { "_id": { "$oid": "66dc1b88dc6375e185b9ff6b" }, "blokname": "MELATI" },
                { "_id": { "$oid": "66dc1b93dc6375e185b9ff6e" }, "blokname": "ANGGREK" },
                { "_id": { "$oid": "66dc1b94dc6375e185b9ff71" }, "blokname": "ANGGREK-A" },
                { "_id": { "$oid": "66dc1b96dc6375e185b9ff74" }, "blokname": "ANGGREK-B" },
                { "_id": { "$oid": "66dc1b97dc6375e185b9ff77" }, "blokname": "ANGGREK-C" },
                { "_id": { "$oid": "66dc1b99dc6375e185b9ff7a" }, "blokname": "ANGGREK-D" },
                { "_id": { "$oid": "66dc1ba3dc6375e185b9ff7d" }, "blokname": "ASOKA" },
                { "_id": { "$oid": "66dc1ba4dc6375e185b9ff80" }, "blokname": "ASOKA-A" },
                { "_id": { "$oid": "66dc1ba5dc6375e185b9ff83" }, "blokname": "ASOKA-B" },
                { "_id": { "$oid": "66dc1ba7dc6375e185b9ff86" }, "blokname": "ASOKA-C" },
                { "_id": { "$oid": "66dc1ba8dc6375e185b9ff89" }, "blokname": "ASOKA-D" },
                { "_id": { "$oid": "66dc1baadc6375e185b9ff8c" }, "blokname": "ASOKA-E" },
                { "_id": { "$oid": "66dc1baddc6375e185b9ff8f" }, "blokname": "ASOKA-F" },
                { "_id": { "$oid": "66dc1bb0dc6375e185b9ff92" }, "blokname": "ASOKA-G" },
                { "_id": { "$oid": "66dc1bb2dc6375e185b9ff95" }, "blokname": "ASOKA-H" },
                { "_id": { "$oid": "66dc1bc4dc6375e185b9ff98" }, "blokname": "AMARYLIS" },
                { "_id": { "$oid": "66dc1bd6dc6375e185b9ff9b" }, "blokname": "ADHYAKSA UTAMA" },
                { "_id": { "$oid": "66dc1be4dc6375e185b9ff9e" }, "blokname": "EDELWEISS" },
                { "_id": { "$oid": "66dc1be5dc6375e185b9ffa1" }, "blokname": "EDELWEISS-A" },
                { "_id": { "$oid": "66dc1be7dc6375e185b9ffa4" }, "blokname": "EDELWEISS-B" },
                { "_id": { "$oid": "66dc1be9dc6375e185b9ffa7" }, "blokname": "EDELWEISS-C" },
                { "_id": { "$oid": "66dc1beadc6375e185b9ffaa" }, "blokname": "EDELWEISS-D" }
            ],
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
        },
        searchCustomer() {
            this.customers = [];

            if (this.selectedBlokname.length > 0) {
                CustomerService.searchCustomerByBlokname(this.selectedBlokname)
                    .then(res => {
                        if (res.data.data.length > 0) {
                            this.customers = res.data.data;
                        } else {
                            alert(`Tidak ada customer di blok ${this.selectedBlokname}`);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                alert('Pilih nama blok untuk melakukan pencarian.');
            }
        },
    },
};
</script>
