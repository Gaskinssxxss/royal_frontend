<template>
    <div class="p-4">
        <div class="mb-4 flex space-x-4">
            <select v-model="selectedBlokname" class="border-2 border-black px-4 py-2 flex-grow">
                <option disabled value="">Pilih Blok</option>
                <option value="semua">semua</option>
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

        <div v-if="customer.length > 0">
            <div class="text-sm">
                <table class="min-w-full border-collapse border-2 border-black text-center">
                    <thead>
                        <tr class="text-base">
                            <th class="border-2 border-black px-2 py-2 font-normal">Id</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Marketer</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Nama Lengkap</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Nomor Hp</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Tipe Pembayaran</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Status Berkas</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-for="custom in customer" :key="custom._id">
                        <tr v-if="custom.status_pembayaran === true">
                            <td class="px-1 py-2 border border-black text-sm">
                                ADR - 0{{ custom.kavling[0].type.replace('Type ', '') }} -
                                {{ custom.id_blok.blokname }} - 0{{ custom.id_rumah.no_rumah }}
                            </td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_user.username }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.type_pembayaran }}</td>
                            <div class="border-t border-black">
                                <div v-if="custom.verifikasi_data === true">
                                    <td class="px-1 pt-4 text-marydeep">Terverifikasi</td>
                                </div>
                                <div v-if="custom.verifikasi_data === false">
                                    <td class="px-1 pt-4 text-che">Belum diverifikasi</td>
                                </div>
                            </div>
                            <td class="border-2 border-black pl-2 pt-3 pb-2">
                                <div v-if="keuanganStatus[custom._id] === true">
                                    <button @click="shows" class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Telah dibayar
                                        </h1>
                                    </button>
                                </div>
                                <div v-else>
                                    <button @click="openModal(custom._id)" class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Pembayaran
                                        </h1>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else>
            <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h2 class="text-xl font-bold mb-4">Input Data Pembayaran</h2>
                <div class="mb-4">
                    <h12 class="block mb-2">Total Harga Rumah:</h12>
                    <h1 class="border border-gray-300 p-2 w-full">
                        {{ formatRupiah(total) }}
                    </h1>
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Dp :</label>
                    <input v-model="formattedDp" type="text" class="border border-gray-300 p-2 w-full"
                        inputmode="numeric" pattern="[0-9]*">
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Total akhir:</label>
                    <h1 class="border border-gray-300 p-2 w-full">
                        {{ formatRupiah(total - dp) }}
                    </h1>
                </div>
                <div class="flex justify-end">
                    <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Batal</button>
                    <button @click="submitKeuangan" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import custumerApi from '@/services/custumerApi';
import keuanganApi from '@/services/keuangan';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            customer: [],
            customers: null,
            selectedBlokname: '',
            isverified: false,
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
            showModal: false,
            newData: [],
            keuanganList: [],
            total: 0,
            dp: 0,
            total_akhir: 0,
            keuanganStatus: {},
        }
    },
    mounted() {
        this.getCustomer();
        this.getKeuanganStatusDp();
    },
    computed: {
        formattedDp: {
            get() {
                return this.formatRupiah(this.dp);
            },
            set(value) {
                const numericValue = value.replace(/[^\d]/g, '');
                this.dp = numericValue ? parseInt(numericValue, 10) : 0;
            }
        }
    },
    methods: {
        shows() {
            this.showSuccessAlert('Data Permbayaran Sudah Di Input');
        },
        getKeuanganStatusDp() {
            keuanganApi.getKeuanganCustomerStatusDp()
                .then((res) => {
                    res.data.forEach(item => {
                        this.keuanganStatus[item.id_customer] = item.status_dp;
                    });
                })
                .catch((error) => {
                    console.log('Error fetching keuangan status_dp:', error);
                });
        },
        NotifBayar() {
            this.showAlert('DP Sudah di Bayar')
        },
        onInput(event) {
            const value = event.target.value.replace(/[^\d]/g, '');
            event.target.value = value;
            this.dp = value ? parseInt(value, 10) : 0;
        },
        getFinanceById(id) {
            keuanganApi.getKeuanganCustumerById(id)
                .then((res) => {
                    this.newData = res.data[0].perhitungan_harga_rumah[0];
                    this.total = ((this.newData.harga_rumah + this.newData.kelebihan_tanah + this.newData.harga_lokasi + this.newData.biaya_proses) - this.newData.discount) - this.newData.total_acc_bank
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        showAlert(message, type = 'info') {
            Swal.fire({
                title: 'Information',
                text: message,
                icon: type,
                confirmButtonText: 'OK',
            });
        },
        showSuccessAlert(message) {
            Swal.fire({
                title: 'Success',
                text: message,
                icon: 'success',
                confirmButtonText: 'Ok!',
            });
        },
        showErrorAlert(message) {
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonText: 'Ok!',
            });
        },
        getCustomer() {
            custumerApi.getAll()
                .then(res => {
                    this.customer = res.data.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        searchCustomer() {
            this.customer = [];
            if (this.selectedBlokname == 'semua') {
                this.getCustomer();
                return;
            }

            if (this.selectedBlokname.length > 0) {
                custumerApi.searchCustomerByBlokname(this.selectedBlokname)
                    .then(res => {
                        if (res.data.data > 0) {
                            this.customer = res.data.data;
                        } else {
                            this.showAlert(`Tidak ada customer di blok ${this.selectedBlokname}`);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                this.showAlert('Pilih nama blok untuk melakukan pencarian.');
            }
        },
        async openModal(customerId) {
            try {
                const resCustomer = await custumerApi.getById(customerId);
                this.isverified = resCustomer.data.data.verifikasi_data;
                const resKeuangan = await keuanganApi.getKeuanganCustumerById(customerId);
                this.customers = resKeuangan.data;
            } catch (error) {
                console.log(error);
                return;
            }
            if (!this.isverified) {
                this.showAlert('Data Customer Belum Diverifikasi');
                return;
            }
            this.selectedCustomerId = customerId;
            this.getFinanceById(customerId)
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.customers = null;
            this.isverified = false;
        },
        async NotificationToDirektur(message) {
            try {
                const data = {
                    content: message,
                    user: this.$store.state.user._id,
                    role_receivers: ["direktur"]
                };
                const result = await keuanganApi.create(data);
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        },
        submitKeuangan() {
            const data = {
                status_dp: true,
                harga_rumah: [{
                    total: this.total,
                    total_akhir: this.total - this.dp,
                    dp: this.dp
                }]
            };
            keuanganApi.updatePembayaran(this.customers[0]._id, data)
                .then(() => {
                    this.NotificationToDirektur("Ada Yang Membayar DP")
                    this.showSuccessAlert('Data Permbayaran berhasil disimpan');
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Error saat menyimpan data keuangan:', error);
                    this.showErrorAlert('Gagal menyimpan data');
                });
        },
        formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(angka);
        },


    },
};
</script>


<!-- <template>
    <div class="p-4">
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
        <div v-if="customer.length > 0">
            <div class="text-lg">
                <table class="min-w-full border-collapse border-2 border-black text-center">
                    <thead>
                        <tr>
                            <th class="border-2 border-black px-2 py-2 font-normal">Marketer</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Nama Lengkap</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Nomor Hp</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Email</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Nama Blok</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Nomor Rumah</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Tipe Rumah</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Tipe Pembayaran</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Data Terverikasi</th>
                            <th class="border-2 border-black px-2 py-2 font-normal">Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-for="custom in customer" :key="custom._id">
                        <tr v-if="custom.status_pembayaran === true">
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_user.username }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].email }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_blok.blokname }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_rumah.no_rumah }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_rumah.type_rumah }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.type_pembayaran }}</td>
                            <td class="border-2 border-black px-2 py-2">
                                {{ custom.verifikasi_data ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                            </td>
                            <td class="border-2 border-black pl-2 pt-3 pb-2">
                                <div>
                                    <button @click="openModal(custom._id)" class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Pembayaran
                                        </h1>
                                    </button>
                                </div>
                                <div>
                                    <button @click="NotifBayar" class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Telah dibayar
                                        </h1>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else>
            <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h2 class="text-xl font-bold mb-4">Input Data Pembayaran</h2>
                <div class="mb-4">
                    <h12 class="block mb-2">Harga Pokok Rumah:</h12>
                    <h1 class="border border-gray-300 p-2 w-full">
                        {{ formatRupiah(total) }}
                    </h1>
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Dp :</label>
                    <input v-model="formattedDp" type="text" class="border border-gray-300 p-2 w-full"
                        inputmode="numeric" pattern="[0-9]*">
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Total akhir:</label>
                    <h1 class="border border-gray-300 p-2 w-full">
                        {{ formatRupiah(total - dp) }}
                    </h1>
                </div>
                <div class="flex justify-end">
                    <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Batal</button>
                    <button @click="submitKeuangan" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import custumerApi from '@/services/custumerApi';
import keuanganApi from '@/services/keuangan';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            customer: [],
            customers: null,
            selectedBlokname: '',
            isverified: false,
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
            showModal: false,
            newData: [],
            keuanganList: [],
            total: 0,
            dp: 0,
            total_akhir: 0,
            status: []
        }
    },
    mounted() {
        this.getCustomer();
    },
    computed: {
        formattedDp: {
            get() {
                return this.formatRupiah(this.dp);
            },
            set(value) {
                const numericValue = value.replace(/[^\d]/g, '');
                this.dp = numericValue ? parseInt(numericValue, 10) : 0;
            }
        }
    },
    methods: {
        NotifBayar() {
            this.showAlert('DP Sudah di Bayar')
        },
        onInput(event) {
            const value = event.target.value.replace(/[^\d]/g, '');
            event.target.value = value;
            this.dp = value ? parseInt(value, 10) : 0;
        },
        getFinanceById(id) {
            keuanganApi.getKeuanganCustumerById(id)
                .then((res) => {
                    this.newData = res.data[0].perhitungan_harga_rumah[0];
                    this.total = (this.newData.harga_rumah + this.newData.kelebihan_tanah + this.newData.harga_lokasi + this.newData.biaya_proses) - this.newData.discount
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        showAlert(message, type = 'info') {
            Swal.fire({
                title: 'Information',
                text: message,
                icon: type,
                confirmButtonText: 'OK',
            });
        },
        showSuccessAlert(message) {
            Swal.fire({
                title: 'Success',
                text: message,
                icon: 'success',
                confirmButtonText: 'Ok!',
            });
        },
        showErrorAlert(message) {
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonText: 'Ok!',
            });
        },
        getCustomer() {
            custumerApi.getAll()
                .then(res => {
                    this.customer = res.data.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        searchCustomer() {
            this.customer = [];
            if (this.selectedBlokname.length > 0) {
                custumerApi.searchCustomerByBlokname(this.selectedBlokname)
                    .then(res => {
                        if (res.data.data > 0) {
                            this.customer = res.data.data;
                        } else {
                            this.showAlert(`Tidak ada customer di blok ${this.selectedBlokname}`);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                this.showAlert('Pilih nama blok untuk melakukan pencarian.');
            }
        },
        async openModal(customerId) {
            try {
                const resCustomer = await custumerApi.getById(customerId);
                this.isverified = resCustomer.data.data.verifikasi_data;
                const resKeuangan = await keuanganApi.getKeuanganCustumerById(customerId);
                this.customers = resKeuangan.data;
            } catch (error) {
                console.log(error);
                return;
            }
            if (!this.isverified) {
                this.showAlert('Data Customer Belum Diverifikasi');
                return;
            }
            this.selectedCustomerId = customerId;
            this.getFinanceById(customerId)
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.customers = null;
            this.isverified = false;
        },
        submitKeuangan() {
            const data = {
                status_dp: true,
                harga_rumah: [{
                    total: this.total,
                    total_akhir: this.total - this.dp,
                    dp: this.dp
                }]
            };
            keuanganApi.update(this.customers[0]._id, data)
                .then(() => {
                    this.showSuccessAlert('Data Permbayaran berhasil disimpan');
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Error saat menyimpan data keuangan:', error);
                    this.showErrorAlert('Gagal menyimpan data');
                });
        },
        formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(angka);
        },
    },
};
</script> -->
