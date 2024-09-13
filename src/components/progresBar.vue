<template>
    <div class="p-4">
        <div v-if="keuanganList.length > 0">
            <table class="min-w-full border-collapse border-2 border-black text-center mb-6 text-base">
                <thead>
                    <tr>
                        <th class="border-2 border-black px-4 py-2 font-normal">No Pembayaran</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Customer</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Harga Rumah</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">DP</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Bunga (%)</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Jangka Waktu (bulan)</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Pembayaran Bulanan</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Progress Pembayaran</th>
                        <th class="border-2 border-black px-4 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="keuangan in keuanganList" :key="keuangan._id">
                        <td class="border-2 border-black px-4 py-2">{{ keuangan.nomor_pembayaran }}</td>
                        <td class="border-2 border-black px-4 py-2">{{ keuangan.id_customer.data_pribadi[0].namaLengkap
                            }}</td>
                        <td class="border-2 border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].harga) }}
                        </td>
                        <td class="border-2 border-black px-4 py-2">{{ formatRupiah(keuangan.harga_rumah[0].dp) }}</td>
                        <td class="border-2 border-black px-4 py-2">{{ keuangan.harga_rumah[0].bunga }}%</td>
                        <td class="border-2 border-black px-4 py-2">{{
                            calculateJangkaWaktu(keuangan.harga_rumah[0].jangka_waktu) }} bulan</td>
                        <td class="border-2 border-black px-4 py-2">{{
                            formatRupiah(calculatePembayaranBulanan(keuangan)) }}</td>
                        <td class="border-2 border-black px-4 py-2">
                            <div class="relative w-full bg-gray-200">
                                <div :style="{ width: calculateProgress(keuangan) + '%' }"
                                    class="bg-blue-600 text-xs font-medium text-black text-center p-0.5 leading-none">
                                    {{ calculateProgress(keuangan) }}%
                                </div>
                            </div>
                            <p class="text-sm mt-1">{{ formatRupiah(calculateTotalTagihan(keuangan)) }} / {{
                                formatRupiah(calculateTotalPembayaran(keuangan)) }}</p>
                        </td>
                        <td class="border-2 border-black px-4 py-2">
                            <button
                                @click="openModal(keuangan.kredit, keuangan._id, keuangan, keuangan.nomor_pembayaran)"
                                class="bg-blue-500 text-white px-4 py-2 rounded">
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
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h2 class="text-xl font-bold mb-4">Nomor Pembayaran : {{ selected_no_pembayaran }}</h2>
                <h2 class="text-xl font-bold mb-4">History & Tambah Pembayaran Kredit</h2>
                <div v-if="selectedKredit.length > 0">
                    <table class="min-w-full border-collapse border-2 border-black text-center mb-4">
                        <thead>
                            <tr>
                                <th class="border-2 border-black px-4 py-2">Tanggal Pembayaran</th>
                                <th class="border-2 border-black px-4 py-2">Jumlah Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="kredit in selectedKredit" :key="kredit._id">
                                <td class="border-2 border-black px-4 py-2">{{ formatDate(kredit.tanggal) }}</td>
                                <td class="border-2 border-black px-4 py-2">{{ formatRupiah(kredit.saldo) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p class="text-red-500">Tidak ada history pembayaran kredit ditemukan</p>
                </div>
                <h3 class="text-lg font-semibold mb-2">Tambah Pembayaran Kredit</h3>
                <div class="mb-4">
                    <label class="block mb-2">Tanggal Pembayaran:</label>
                    <input v-model="newKredit.tanggal" type="date" class="border border-gray-300 p-2 w-full">
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Jumlah Pembayaran (Saldo):</label>
                    <input :value="formatRupiah(pembayaranBulananStatis)" disabled type="text"
                        class="border border-gray-300 p-2 w-full" placeholder="Masukkan jumlah saldo">
                </div>
                <div class="flex justify-end mt-4">
                    <button @click="addKreditPembayaran" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Tambah
                        Pembayaran</button>
                    <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">Tutup</button>
                </div>
            </div>
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
            showModal: false,
            selected_no_pembayaran: '',
            selectedKredit: [],
            selectedCustomerId: null,
            pembayaranBulananStatis: 0,
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
        // Mendapatkan data keuangan dari API
        getKeuanganData() {
            keuanganApi.getAll()
                .then((res) => {
                    this.keuanganList = res.data.data;
                })
                .catch((error) => {
                    console.error("Error saat mengambil data keuangan:", error);
                });
        },

        // Format angka ke Rupiah
        formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(angka);
        },

        // Format tanggal ke format yang lebih mudah dibaca
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('id-ID', options);
        },

        // Kalkulasi jangka waktu dalam bulan
        calculateJangkaWaktu(jangkaWaktu) {
            const currentDate = new Date();
            const endDate = new Date(jangkaWaktu);
            const months = (endDate.getFullYear() - currentDate.getFullYear()) * 12 + endDate.getMonth() - currentDate.getMonth();
            return months > 0 ? months : 0;
        },

        // Kalkulasi pembayaran bulanan
        calculatePembayaranBulanan(keuangan) {
            const { harga, dp, bunga } = keuangan.harga_rumah[0];
            const totalPinjaman = harga - dp;
            const months = this.calculateJangkaWaktu(keuangan.harga_rumah[0].jangka_waktu);
            if (months === 0) return 0;
            const bungaPerBulan = bunga / 100 / 12;
            const pembayaranBulanan = (totalPinjaman * bungaPerBulan) / (1 - Math.pow(1 + bungaPerBulan, -months));
            return pembayaranBulanan > 0 ? pembayaranBulanan : 0;
        },

        // Kalkulasi total tagihan yang sudah dibayar (saldo kredit)
        calculateTotalTagihan(keuangan) {
            const saldoKredit = keuangan.kredit.reduce((acc, kredit) => acc + kredit.saldo, 0);
            return saldoKredit;
        },

        // Kalkulasi total pembayaran yang harus dilakukan
        calculateTotalPembayaran(keuangan) {
            const { harga, dp } = keuangan.harga_rumah[0];
            return harga - dp;
        },

        // Kalkulasi progress pembayaran
        calculateProgress(keuangan) {
            const totalPembayaran = this.calculateTotalPembayaran(keuangan);
            const totalTagihan = this.calculateTotalTagihan(keuangan);
            if (totalPembayaran === 0) return 0;
            return Math.min((totalTagihan / totalPembayaran) * 100, 100).toFixed(2);
        },

        // Buka modal dan set data history kredit yang akan ditampilkan
        openModal(kreditList, customerId, keuangan, nomor_pembayaran) {
            this.selectedKredit = kreditList;
            this.selectedCustomerId = customerId;
            this.selected_no_pembayaran = nomor_pembayaran;
            this.pembayaranBulananStatis = this.calculatePembayaranBulanan(keuangan);
            this.showModal = true;
        },

        // Tutup modal
        closeModal() {
            this.showModal = false;
            this.selectedKredit = [];
            this.selectedCustomerId = null;
            this.newKredit = {
                tanggal: '',
                saldo: 0
            };
        },

        // Tambahkan pembayaran kredit baru
        addKreditPembayaran() {
            if (!this.newKredit.tanggal) {
                this.showAlert('Masukkan tanggal yang valid.');
                return;
            }

            const newPayment = {
                tanggal: this.newKredit.tanggal,
                saldo: this.pembayaranBulananStatis // Menggunakan saldo dari pembayaran bulanan
            };

            keuanganApi.update(this.selectedCustomerId, {
                $push: { kredit: newPayment }
            })
                .then(() => {
                    this.showSuccessAlert('Pembayaran kredit berhasil ditambahkan.');
                    this.getKeuanganData(); // Refresh data
                    this.closeModal(); // Tutup modal setelah penambahan
                })
                .catch(error => {
                    console.error('Error saat menambahkan pembayaran kredit:', error);
                    this.showErrorAlert('Gagal menambahkan pembayaran kredit.');
                });
        }
    },
};
</script>

<style scoped>
/* Optional styling for progress bar and modal */
</style>
