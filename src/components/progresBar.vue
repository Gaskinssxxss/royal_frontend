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
                <button @click="searchKeuangan"
                    class="bg-gray-200 rounded text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                    Cari
                </button>
            </div>
        </div>

        <div v-if="keuanganList.length > 0">
            <table class="min-w-full border-collapse border border-black text-center mb-6 text-sm">
                <thead class="bg-gray-100">
                    <tr class="text-base">
                        <th class="border border-black px-4 py-2 font-normal">Id</th>
                        <th class="border border-black px-4 py-2 font-normal">No Pembayaran</th>
                        <th class="border border-black px-4 py-2 font-normal">Customer</th>
                        <th class="border border-black px-4 py-2 font-normal">Harga Rumah</th>
                        <th class="border border-black px-4 py-2 font-normal">DP</th>
                        <th class="border border-black px-4 py-2 font-normal">Hutang Awal</th>
                        <th class="border border-black px-4 py-2 font-normal">Sisa Hutang</th>
                        <th class="border border-black px-4 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="keuangan in keuanganList" :key="keuangan._id">
                        <td class=" px-1 py-2 border border-black text-sm">
                            ADR - 0{{ keuangan.id_customer.kavling[0].type.replace('Type ', '') }} -
                            {{ keuangan.id_customer.id_blok.blokname }} - 0{{ keuangan.id_customer.id_rumah.no_rumah
                            }}
                        </td>
                        <td class="border border-black px-4 py-2">{{ keuangan.nomor_pembayaran }}</td>
                        <td class="border border-black px-4 py-2">{{
                            keuangan.id_customer.data_pribadi[0].namaLengkap }}
                        </td>
                        <td class="border border-black px-4 py-2">{{
                            formatRupiah(keuangan.perhitungan_harga_rumah[0].harga_rumah) }}</td>
                        <td class="border border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].dp) }}
                        </td>
                        <td class="border border-black px-4 py-2">{{
                            formatRupiah(keuangan.harga_rumah[0].total_akhir)
                            }}</td>
                        <div class="border-t border-black px-4 py-4">
                            <div v-if="keuangan.kredit.length > 0">
                                <td v-if="keuangan.kredit[0].status_saldo === 'success'">
                                    {{ formatRupiah(
                                        keuangan.harga_rumah[0].total_akhir -
                                        keuangan.kredit[0].saldo
                                    ) }}
                                </td>
                                <td v-else>{{
                                    formatRupiah(keuangan.harga_rumah[0].total_akhir) }}</td>
                            </div>
                            <div v-else>
                                <td>{{
                                    formatRupiah(keuangan.harga_rumah[0].total_akhir) }}</td>
                            </div>
                        </div>
                        <td class="border border-black px-4 py-2">
                            <button @click="openModal(keuangan)"
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Progres</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg shadow-lg w-3/5">
                <button @click="closeModal" class="text-red-500 float-right">✖</button>
                <h3 class="text-xl mb-4">Input Kredit</h3>

                <div class="overflow-x-auto mb-4">
                    <table class="min-w-full border border-gray-300">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal</th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Saldo (Rupiah)
                                </th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Status
                                    Transaksi</th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Bukti Transaksi
                                </th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Kirim OTP</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="kredit in selectedKeuangan.kredit" :key="kredit._id" class="bg-white">
                                <td class="border px-4 py-2">{{ formatDate(kredit.tanggal) }}</td>
                                <td class="border px-4 py-2">{{ formatRupiah(kredit.saldo) }}</td>
                                <td v-if="kredit.status_saldo === 'success'" class="border px-4 py-2 text-maryjane">
                                    Valid
                                </td>
                                <td v-else class="border px-4 py-2 text-che">Menunggu</td>
                                <td class="border px-4 py-2">
                                    <img class="w-20 h-10 mx-auto cursor-pointer hover:shadow-lg hover:shadow-black"
                                        :src="getFullImgPath(kredit.bukti_transaksi)" alt=""
                                        @click="openLightbox(getFullImgPath(kredit.bukti_transaksi))">
                                </td>
                                <td v-if="kredit.status_saldo === 'pending' || kredit.status_saldo === 'failed'"
                                    class="border px-4 py-2">
                                    <button @click="sendOtp(selectedKeuangan._id)"
                                        class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Kirim
                                        OTP</button>
                                </td>
                                <td v-else>
                                    <div class="flex justify-center">
                                        <svg height="50px" width="50px" version="1.1" id="Capa_1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17.837 17.837"
                                            xml:space="preserve">
                                            <g>
                                                <path style="fill:#AAE73D;" d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27
		c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0
		L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z" />
                                            </g>
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <form @submit.prevent="addKredit">
                    <div class="mb-4">
                        <label for="tanggal" class="block text-sm font-medium text-gray-700">Tanggal:</label>
                        <input type="date" v-model="newKredit.tanggal"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="saldo" class="block text-sm font-medium text-gray-700">Saldo (Rupiah):</label>
                        <input type="text" v-model="formattedSaldo" @input="formatInputSaldo"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="bukti_transaksi" class="block text-sm font-medium text-gray-700">Upload Bukti
                            Transaksi:</label>
                        <input type="file" ref="buktiTransaksi"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    </div>
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Tambah
                        Kredit</button>
                </form>

                <div v-if="selectedKeuangan" class="mt-6">
                    <h4 class="text-lg">Progres Pembayaran</h4>
                    <div class="relative pt-1">
                        <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                            <div :style="{ width: kreditProgress + '%' }"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                            </div>
                        </div>
                    </div>
                    <p>{{ kreditProgress.toFixed(2) }}% Terbayar</p>
                </div>
            </div>
        </div>
        <vue-easy-lightbox :visible="lightboxVisible" :imgs="lightboxImages" @hide="lightboxVisible = false" />
    </div>
</template>

<script>
import keuanganApi from "@/services/keuangan";
import Swal from 'sweetalert2';
import VueEasyLightbox from 'vue-easy-lightbox';
import ApiNotification from "../services/Notifitcation"
export default {
    components: {
        VueEasyLightbox
    },
    data() {
        return {
            keuanganList: [],
            selectedKeuangan: null,
            newKredit: {
                tanggal: '',
                saldo: 0
            },
            formattedSaldo: '',
            showModal: false,
            selectedBlokname: '',
            inputOtp: '',
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
            lightboxVisible: false,
            lightboxImages: [],
        };
    },
    computed: {
        kreditProgress() {
            if (this.selectedKeuangan && this.selectedKeuangan.harga_rumah[0]) {
                const totalHutang = this.selectedKeuangan.harga_rumah[0].total_akhir;
                const totalKredit = this.selectedKeuangan.kredit.reduce((sum, kredit) => sum + kredit.saldo, 0);
                return (totalKredit / totalHutang) * 100;
            }
            return 0;
        }
    },
    mounted() {
        this.getKeuanganData();
    },
    methods: {
        async PostNotification(message) {
            try {
                const data = {
                    content: message,
                    user: this.$store.state.user._id,
                    role_receivers: ["direktur"]
                };
                const result = await ApiNotification.create(data);
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        },
        openLightbox(image) {
            this.lightboxImages = [image];
            this.lightboxVisible = true;
        },
        getFullImgPath(img) {
            return `http://192.168.1.10:3000/${img}`;
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
        sendOtp(id) {
            this.PostNotification("Ada Pembayaran Yang Membutuhkan OTP")
            keuanganApi.sendOtp(id)
                .then(response => {
                    this.showSuccessAlert('OTP berhasil dikirim! Periksa OTP Anda.');
                    console.log(response)
                })
                .catch(error => {
                    this.showErrorAlert('Gagal mengirim OTP: ' + error.message);
                });
        },
        getKeuanganData() {
            keuanganApi.getAll()
                .then((res) => {
                    this.keuanganList = res.data.data;
                    console.log(this.keuanganList)
                    console.log(this.keuanganList.length)
                })
                .catch((error) => {
                    console.error("Error saat mengambil data keuangan:", error);
                });
        },
        formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(angka);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        openModal(keuangan) {
            this.selectedKeuangan = keuangan;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.selectedKeuangan = null;
            this.newKredit = {
                tanggal: '',
                saldo: 0
            };
            this.formattedSaldo = '';
        },
        formatInputSaldo() {
            let input = this.formattedSaldo.replace(/[^,\d]/g, '').toString();
            let split = input.split(',');
            let sisa = split[0].length % 3;
            let rupiah = split[0].substr(0, sisa);
            let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

            if (ribuan) {
                let separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }

            this.formattedSaldo = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
            this.newKredit.saldo = parseInt(input.replace(/\./g, ''), 10);
        },
        addKredit() {
            const formData = new FormData();
            formData.append('tanggal', this.newKredit.tanggal);
            formData.append('saldo', this.newKredit.saldo);

            const fileInput = this.$refs.buktiTransaksi;
            if (fileInput.files.length > 0) {
                formData.append('bukti_transaksi', fileInput.files[0]);
            }

            keuanganApi.update(this.selectedKeuangan._id, formData)
                .then(() => {
                    this.showSuccessAlert('Kredit berhasil ditambahkan');
                    this.closeModal();
                    this.getKeuanganData();
                })
                .catch((error) => {
                    this.showErrorAlert('Error menambahkan kredit: ' + error.message);
                });
        }
    },
};
</script>


<!-- <template>
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
                <button @click="searchKeuangan"
                    class="bg-gray-200 rounded text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                    Cari
                </button>
            </div>
        </div>

        <div v-if="keuanganList.length > 0">
            <table class="min-w-full border-collapse border border-black text-center mb-6 text-sm">
                <thead class="bg-gray-100">
                    <tr class="text-base">
                        <th class="border border-black px-4 py-2 font-normal">Id</th>
                        <th class="border border-black px-4 py-2 font-normal">No Pembayaran</th>
                        <th class="border border-black px-4 py-2 font-normal">Customer</th>
                        <th class="border border-black px-4 py-2 font-normal">Harga Rumah</th>
                        <th class="border border-black px-4 py-2 font-normal">DP</th>
                        <th class="border border-black px-4 py-2 font-normal">Hutang Awal</th>
                        <th class="border border-black px-4 py-2 font-normal">Sisa Hutang</th>
                        <th class="border border-black px-4 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="keuangan in keuanganList" :key="keuangan._id">
                        <td class="px-1 py-2 border border-black text-sm">
                            ADR - 0{{ keuangan.id_customer.kavling[0].type.replace('Type ', '') }} -
                            {{ keuangan.id_customer.id_blok.blokname }} - 0{{ keuangan.id_customer.id_rumah.no_rumah }}
                        </td>
                        <td class="border border-black px-4 py-2">{{ keuangan.nomor_pembayaran }}</td>
                        <td class="border border-black px-4 py-2">{{ keuangan.id_customer.data_pribadi[0].namaLengkap }}
                        </td>
                        <td class="border border-black px-4 py-2">{{
                            formatRupiah(keuangan.perhitungan_harga_rumah[0].harga_rumah) }}</td>
                        <td class="border border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].dp) }}</td>
                        <td class="border border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].total_akhir)
                            }}</td>
                        <td v-if="keuangan.kredit.some(kredit => kredit.status_saldo === true)"
                            class="border border-black px-4 py-2">
                            {{ formatRupiah(
                                keuangan.harga_rumah[0].total_akhir -
                                keuangan.kredit
                                    .filter(kredit => kredit.status_saldo === true)
                                    .reduce((total, kredit) => total + kredit.saldo, 0)
                            ) }}
                        </td>
                        <td v-else class="border border-black px-4 py-2">{{
                            formatRupiah(keuangan.harga_rumah[0].total_akhir) }}</td>
                        <td class="border border-black px-4 py-2">
                            <button @click="openModal(keuangan)"
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Progres</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <button @click="closeModal" class="text-red-500 float-right">✖</button>
                <h3 class="text-xl mb-4">Input Kredit</h3>

                <div class="overflow-x-auto mb-4">
                    <table class="min-w-full border border-gray-300">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal</th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Saldo (Rupiah)
                                </th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Status
                                    Transaksi</th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Bukti Transaksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="kredit in selectedKeuangan.kredit" :key="kredit._id" class="bg-white">
                                <td class="border px-4 py-2">{{ formatDate(kredit.tanggal) }}</td>
                                <td class="border px-4 py-2">{{ formatRupiah(kredit.saldo) }}</td>
                                <td v-if="kredit.status_saldo === true" class="border px-4 py-2 text-maryjane">Valid
                                </td>
                                <td v-else class="border px-4 py-2 text-che">Menunggu</td>
                                <td class="border px-4 py-2">
                                    <img class="w-20 h-10 mx-auto" :src="getFullImgPath(kredit.bukti_transaksi)" alt="">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <form @submit.prevent="addKredit">
                    <div class="mb-4">
                        <label for="tanggal" class="block text-sm font-medium text-gray-700">Tanggal:</label>
                        <input type="date" v-model="newKredit.tanggal"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="saldo" class="block text-sm font-medium text-gray-700">Saldo (Rupiah):</label>
                        <input type="text" v-model="formattedSaldo" @input="formatInputSaldo"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="bukti_transaksi" class="block text-sm font-medium text-gray-700">Upload Bukti
                            Transaksi:</label>
                        <input type="file" ref="buktiTransaksi"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    </div>
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Tambah
                        Kredit</button>
                </form>

                <button @click="sendOtp(selectedKeuangan._id)"
                    class="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    Kirim OTP
                </button>

                <div class="mt-4">
                    <label for="otp" class="block text-sm font-medium text-gray-700">Masukkan OTP:</label>
                    <input type="text" v-model="inputOtp"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required />
                    <button @click="verifyOtp(selectedKeuangan._id)"
                        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Verifikasi OTP</button>
                </div>

                <div v-if="selectedKeuangan" class="mt-6">
                    <h4 class="text-lg">Progres Pembayaran</h4>
                    <div class="relative pt-1">
                        <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                            <div :style="{ width: kreditProgress + '%' }"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                            </div>
                        </div>
                    </div>
                    <p>{{ kreditProgress.toFixed(2) }}% Terbayar</p>
                </div>
            </div>
        </div>
    </div>
</template> -->


<!-- <template>
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
                <button @click="searchKeuangan"
                    class="bg-gray-200 rounded text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                    Cari
                </button>
            </div>
        </div>

        <div v-if="keuanganList.length > 0">
            <table class="min-w-full border-collapse border border-black text-center mb-6 text-sm">
                <thead class="bg-gray-100">
                    <tr class="text-base">
                        <th class="border border-black px-4 py-2 font-normal">Id</th>
                        <th class="border border-black px-4 py-2 font-normal">No Pembayaran</th>
                        <th class="border border-black px-4 py-2 font-normal">Customer</th>
                        <th class="border border-black px-4 py-2 font-normal">Harga Rumah</th>
                        <th class="border border-black px-4 py-2 font-normal">DP</th>
                        <th class="border border-black px-4 py-2 font-normal">Hutang Awal</th>
                        <th class="border border-black px-4 py-2 font-normal">Sisa Hutang</th>
                        <th class="border border-black px-4 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="keuangan in keuanganList" :key="keuangan._id">
                        <td class="px-1 py-2 border border-black text-sm">
                            ADR - 0{{ keuangan.id_customer.kavling[0].type.replace('Type ', '') }} -
                            {{ keuangan.id_customer.id_blok.blokname }} - 0{{ keuangan.id_customer.id_rumah.no_rumah }}
                        </td>
                        <td class="border border-black px-4 py-2">{{ keuangan.nomor_pembayaran }}</td>
                        <td class="border border-black px-4 py-2">{{ keuangan.id_customer.data_pribadi[0].namaLengkap
                            }}</td>
                        <td class="border border-black px-4 py-2">{{
                            formatRupiah(keuangan.perhitungan_harga_rumah[0].harga_rumah) }}</td>
                        <td class="border border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].dp) }}</td>
                        <td class="border border-black px-4 py-2">{{
                            formatRupiah(keuangan.harga_rumah[0].total_akhir)
                            }}</td>
                        <td v-if="keuangan.kredit.some(kredit => kredit.status_saldo === true)"
                            class="border border-black px-4 py-2">
                            {{ formatRupiah(
                                keuangan.harga_rumah[0].total_akhir -
                                keuangan.kredit
                                    .filter(kredit => kredit.status_saldo === true)
                                    .reduce((total, kredit) => total + kredit.saldo, 0)
                            ) }}
                        </td>
                        <td v-else class="border border-black px-4 py-2">
                            {{ formatRupiah(keuangan.harga_rumah[0].total_akhir) }}
                        </td>
                        <td class="border border-black px-4 py-2">
                            <button @click="openModal(keuangan)"
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Progres
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <button @click="closeModal"
                    class="text-red-500 float-right hover:scale-150 transition-transform duration-300 ease-linear transform">✖</button>
                <h3 class="text-xl mb-4">Input Kredit</h3>

                <div class="overflow-x-auto mb-4">
                    <table class="min-w-full border border-gray-300">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal</th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Saldo (Rupiah)
                                </th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Status
                                    Transaksi
                                </th>
                                <th class="border px-4 py-2 text-left text-sm font-medium text-gray-700">Bukti Transaksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="kredit in selectedKeuangan.kredit" :key="kredit._id" class="bg-white">
                                <td class="border px-4 py-2">{{ formatDate(kredit.tanggal) }}</td>
                                <td class="border px-4 py-2">{{ formatRupiah(kredit.saldo) }}</td>
                                <td v-if="kredit.status_saldo === true" class="border px-4 py-2 text-maryjane">Valid
                                </td>
                                <td v-else class="border px-4 py-2 text-che">Menunggu</td>
                                <td class="border px-4 py-2">
                                    <img class="w-20 h-10 mx-auto cursor-pointer hover:shadow-lg hover:shadow-black"
                                        :src="getFullImgPath(kredit.bukti_transaksi)" alt=""
                                        @click="openLightbox(getFullImgPath(kredit.bukti_transaksi))">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <form @submit.prevent="addKredit">
                    <div class="mb-4">
                        <label for="tanggal" class="block text-sm font-medium text-gray-700">Tanggal:</label>
                        <input type="date" v-model="newKredit.tanggal"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="saldo" class="block text-sm font-medium text-gray-700">Saldo (Rupiah):</label>
                        <input type="text" v-model="formattedSaldo" @input="formatInputSaldo"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required />
                    </div>
                    <div class="mb-4">
                        <label for="bukti_transaksi" class="block text-sm font-medium text-gray-700">Upload Bukti
                            Transaksi:</label>
                        <input type="file" ref="buktiTransaksi"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    </div>
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Tambah Kredit
                    </button>
                </form>

                <div v-if="selectedKeuangan" class="mt-6">
                    <h4 class="text-lg">Progres Pembayaran</h4>
                    <div class="relative pt-1">
                        <div class="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                            <div :style="{ width: kreditProgress + '%' }"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                            </div>
                        </div>
                    </div>
                    <p>{{ kreditProgress.toFixed(2) }}% Terbayar</p>
                </div>
            </div>
        </div>
        <vue-easy-lightbox :visible="lightboxVisible" :imgs="lightboxImages" @hide="lightboxVisible = false" />
    </div>
</template>

<script>
import keuanganApi from "@/services/keuangan";
import Swal from 'sweetalert2';
import VueEasyLightbox from 'vue-easy-lightbox';

export default {
    components: {
        VueEasyLightbox
    },
    data() {
        return {
            keuanganList: [],
            selectedKeuangan: null,
            newKredit: {
                tanggal: '',
                saldo: 0
            },
            formattedSaldo: '',
            showModal: false,
            selectedBlokname: '',
            lightboxVisible: false,
            lightboxImages: [],
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
        };
    },
    computed: {
        kreditProgress() {
            if (this.selectedKeuangan && this.selectedKeuangan.harga_rumah[0]) {
                const totalHutang = this.selectedKeuangan.harga_rumah[0].total_akhir;
                const totalKredit = this.selectedKeuangan.kredit.reduce((sum, kredit) => sum + kredit.saldo, 0);
                return (totalKredit / totalHutang) * 100;
            }
            return 0;
        }
    },
    mounted() {
        this.getKeuanganData();
    },
    methods: {
        getFullImgPath(img) {
            return `http://192.168.1.10:3000/${img}`;
        },
        openLightbox(image) {
            this.lightboxImages = [image];
            this.lightboxVisible = true;
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
        getKeuanganData() {
            keuanganApi.getAll()
                .then((res) => {
                    this.keuanganList = res.data.data;
                    console.log(this.keuanganList)
                })
                .catch((error) => {
                    console.error("Error saat mengambil data keuangan:", error);
                });
        },
        searchKeuangan() {
            if (!this.selectedBlokname) {
                this.showAlert('Pilih blok terlebih dahulu.');
                return;
            }
            if (this.selectedBlokname === 'semua') {
                this.getKeuanganData();
                return;
            }

            keuanganApi.searchKeuanganByBlokname(this.selectedBlokname)
                .then((res) => {
                    if (res.data.data.length > 0) {
                        this.keuanganList = res.data.data;
                    } else {
                        this.showAlert(`Tidak ada data keuangan ditemukan di blok ${this.selectedBlokname}`);
                    }
                })
                .catch((error) => {
                    console.error('Error saat mencari data keuangan:', error);
                    this.showErrorAlert('Gagal mencari data keuangan.');
                });
        },
        formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(angka);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
        openModal(keuangan) {
            this.selectedKeuangan = keuangan;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.selectedKeuangan = null;
            this.newKredit = {
                tanggal: '',
                saldo: 0
            };
            this.formattedSaldo = '';
        },
        formatInputSaldo() {
            let input = this.formattedSaldo.replace(/[^,\d]/g, '').toString();
            let split = input.split(',');
            let sisa = split[0].length % 3;
            let rupiah = split[0].substr(0, sisa);
            let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

            if (ribuan) {
                let separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }

            this.formattedSaldo = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
            this.newKredit.saldo = parseInt(input.replace(/\./g, ''), 10);
        },
        addKredit() {
            const formData = new FormData();
            formData.append('tanggal', this.newKredit.tanggal);
            formData.append('saldo', this.newKredit.saldo);

            const fileInput = this.$refs.buktiTransaksi;
            if (fileInput.files.length > 0) {
                formData.append('bukti_transaksi', fileInput.files[0]);
            }

            keuanganApi.update(this.selectedKeuangan._id, formData)
                .then(() => {
                    this.showSuccessAlert('Kredit berhasil ditambahkan');
                    this.closeModal();
                    this.getKeuanganData();
                })
                .catch((error) => {
                    this.showErrorAlert('Error menambahkan kredit: ' + error.message);
                });
        }
    },
};
</script> -->

<!-- // addKredit() {
//     const kreditData = {
//         tanggal: this.newKredit.tanggal,
//         saldo: this.newKredit.saldo
//     };
//     this.selectedKeuangan.kredit.push(kreditData);

//     keuanganApi.update(this.selectedKeuangan._id, {
//         kredit: this.selectedKeuangan.kredit
//     })
//         .then(() => {
//             this.showSuccessAlert('Kredit berhasil ditambahkan');
//             this.closeModal();
//             this.getKeuanganData();
//         })
//         .catch((error) => {
//             this.showErrorAlert('Error menambahkan kredit: ' + error.message);
//         });
// } -->

<!-- <template>
    <div class="p-4">
        <div v-if="keuanganList.length > 0">
            <table class="min-w-full border-collapse border-2 border-black text-center mb-6 text-base">
                <thead>
                    <tr>
                        <th class="border-2 border-black px-4 py-2 font-normal">No Pembayaran</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Customer</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Harga Rumah</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">DP</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Sisa Hutang</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="keuangan in keuanganList" :key="keuangan._id">
                        <td class="border-2 border-black px-4 py-2">{{ keuangan.nomor_pembayaran }}</td>
                        <td class="border-2 border-black px-4 py-2">{{ keuangan.id_customer.data_pribadi[0].namaLengkap
                            }}</td>
                        <td class="border-2 border-black px-4 py-2">{{
                            formatRupiah(keuangan.perhitungan_harga_rumah[0].harga_rumah) }}
                        </td>
                        <td class="border-2 border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].dp) }}</td>
                        <td class="border-2 border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].total_akhir)
                            }}</td>
                        <td class="border-2 border-black px-4 py-2">
                            <button class="bg-blue-500 text-white px-4 py-2 rounded">
                                Progres
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else>
            <p class="text-red-500">Data keuangan tidak ditemukan</p>
        </div>
    </div>
</template>

<script>
import keuanganApi from "@/services/keuangan";
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            keuanganList: [],
            selectedCustomerId: null,
            newKredit: {
                tanggal: '',
                saldo: 0
            },
        };
    },
    mounted() {
        this.getKeuanganData();
    },
    methods: {
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
        getKeuanganData() {
            keuanganApi.getAll()
                .then((res) => {
                    this.keuanganList = res.data.data;
                    console.log(this.keuanganList)
                })
                .catch((error) => {
                    console.error("Error saat mengambil data keuangan:", error);
                });
        },
        formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(angka);
        },
    },
};
</script> -->