<template>
    <div class="p-4">
        <div v-if="transaksiList.length > 0">
            <table class="min-w-full border-collapse border border-black text-center mb-6 text-sm">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border border-black px-4 py-2 font-normal">ID</th>
                        <th class="border border-black px-4 py-2 font-normal">No Pembayaran</th>
                        <th class="border border-black px-4 py-2 font-normal">marketer</th>
                        <th class="border border-black px-4 py-2 font-normal">Customer</th>
                        <th class="border border-black px-4 py-2 font-normal">Status</th>
                        <th class="border border-black px-4 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transaksi in transaksiList" :key="transaksi._id">
                        <td class="px-1 py-2 border border-black text-sm">
                            ADR - 0{{ transaksi.id_customer.kavling[0].type.replace('Type ', '') }} -
                            {{ transaksi.id_customer.id_blok.blokname }} - 0{{ transaksi.id_customer.id_rumah.no_rumah
                            }}
                        </td>
                        <td class="border border-black px-4 py-2">{{ transaksi.nomor_pembayaran }}</td>
                        <td class="border border-black px-4 py-2">{{ transaksi.id_customer.id_user.username }}</td>
                        <td class="border border-black px-4 py-2">{{ transaksi.id_customer.data_pribadi[0].namaLengkap
                            }}</td>
                        <td v-if="transaksi.kredit[0].status_saldo === 'success'"
                            class="border border-black px-4 py-2 text-green-500">Valid</td>
                        <td v-else-if="transaksi.kredit[0].status_saldo === 'pending'"
                            class="border border-black px-4 py-2 text-yellow-500">Menunggu</td>
                        <td v-else class="border border-black px-4 py-2 text-red-500">Gagal</td>
                        <td class="border border-black px-4 py-2">
                            <button @click="openOtpModal(transaksi)"
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Verifikasi
                                OTP</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-red-500">Tidak ada transaksi yang perlu divalidasi.</p>
        </div>
        <div v-if="showOtpModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <button @click="closeOtpModal" class="text-red-500 float-right">✖</button>
                <h3 class="text-xl mb-4">Verifikasi OTP</h3>
                <table class="min-w-full border-collapse border border-gray-400 text-sm mb-4">
                    <tbody>
                        <tr>
                            <td class="px-2 py-2 border border-gray-400 font-medium">No Pembayaran</td>
                            <td class="px-2 py-2 border border-gray-400">
                                {{ selectedTransaksi.nomor_pembayaran }}
                            </td>
                        </tr>
                        <tr>
                            <td class="px-2 py-2 border border-gray-400 font-medium">Bukti Transaksi</td>
                            <td class="px-2 py-2 border border-gray-400">
                                <img class="w-40 h-20 cursor-pointer hover:shadow-lg hover:shadow-black"
                                    :src="getFullImgPath(selectedTransaksi.kredit[0].bukti_transaksi)" alt=""
                                    @click="openLightbox(getFullImgPath(selectedTransaksi.kredit[0].bukti_transaksi))">
                            </td>
                        </tr>
                        <tr>
                            <td class="px-2 py-2 border border-gray-400 font-medium">Total Pembayaran</td>
                            <td class="px-2 py-2 border border-gray-400">{{
                                formatRupiah(selectedTransaksi.kredit[0].saldo) }}</td>
                        </tr>
                    </tbody>
                </table>
                <input type="text" v-model="inputOtp" placeholder="Masukkan OTP"
                    class="border px-2 py-1 mb-4 w-full rounded-md" />
                <button @click="verifyOtp(selectedTransaksi._id)"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                    Verifikasi
                </button>
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
            transaksiList: [],
            inputOtp: '',
            showOtpModal: false,
            selectedTransaksi: null,
            lightboxVisible: false,
            lightboxImages: [],
        };
    },
    mounted() {
        this.getTransaksiData();
    },
    methods: {
        openLightbox(image) {
            this.lightboxImages = [image];
            this.lightboxVisible = true;
        },
        getFullImgPath(img) {
            return `http://192.168.1.10:3000/${img}`;
        },
        getTransaksiData() {
            keuanganApi.getTransaksiUntukDirektur()
                .then(res => {
                    this.transaksiList = res.data.data;
                    console.log(this.transaksiList)
                })
                .catch(error => {
                    console.error("Gagal mengambil data transaksi: ", error);
                });
        },
        openOtpModal(transaksi) {
            this.selectedTransaksi = transaksi;
            this.showOtpModal = true;
        },
        closeOtpModal() {
            this.showOtpModal = false;
            this.inputOtp = '';
        },
        verifyOtp(transaksiId) {
            keuanganApi.verifyOtp(transaksiId, { otp: this.inputOtp })
                .then(() => {
                    this.showSuccessAlert('OTP berhasil diverifikasi.');
                    this.getTransaksiData();
                    this.closeOtpModal();
                })
                .catch(error => {
                    this.showErrorAlert('Verifikasi OTP gagal: ' + error.message);
                });
        },
        showSuccessAlert(message) {
            Swal.fire({
                title: 'Success',
                text: message,
                icon: 'success',
                confirmButtonText: 'OK',
            });
        },

        showErrorAlert(message) {
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        },

        formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(angka);
        }
    },
};
</script>
