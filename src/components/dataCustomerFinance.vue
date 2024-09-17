<template>
    <div class="p-4">
        <!-- Select Blok dan Tombol Cari -->
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
                    class="bg-gray-200 rounded text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                    Cari
                </button>
            </div>
        </div>

        <!-- Tabel Data Customer -->
        <div v-if="customer.length > 0">
            <div class="text-base">
                <table class="min-w-full border-collapse border-2 border-black text-center">
                    <thead>
                        <tr>
                            <th class="border-2 border-black px-1 py-2 font-normal">Marketer</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nama Lengkap</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nomor Hp</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Email</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nama Blok</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nomor Rumah</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Tipe Rumah</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Tipe Pembayaran</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Data Terverikasi</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-for="custom in customer" :key="custom._id">
                        <tr>
                            <td class="border-2 border-black px-1 py-2">{{ custom.id_user.username }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].email }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.id_blok.blokname }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.id_rumah.no_rumah }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.id_rumah.type_rumah }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.type_pembayaran }}</td>
                            <td class="border-2 border-black px-1 py-2">
                                {{ custom.verifikasi_data ? 'Terverifikasi' : 'Belum Terverifikasi' }}
                            </td>
                            <td class="border-2 border-black pl-2 pt-3 pb-2">
                                <div v-if="custom.status_pembayaran === false">
                                    <button @click="openModal(custom._id)" class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Harga Rumah
                                        </h1>
                                    </button>
                                </div>
                                <div v-else>
                                    <button @click="showInvoice" class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Cetak Invoice
                                        </h1>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pesan Jika Tidak Ada Hasil -->
        <div v-else>
            <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
        </div>

        <!-- Modal Input Data Pembayaran KPR -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h2 class="text-2xl mb-4 font-normal">Input Data Pembayaran KPR</h2>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">
                        <label class="block mb-2">Nomor Pembayaran :</label>
                        <input v-model="formData.nomor_pembayaran" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Nomor Pembayaran">
                    </div>

                    <div class="mb-4">
                        <label class="block mb-2">Harga Pokok Rumah:</label>
                        <input v-model="formattedHargaRumah" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Harga Rumah">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">
                        <label class="block mb-2">Kelebihan Lokasi:</label>
                        <input v-model="formattedKelebihanTanah" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Harga Kelebihan Lokasi">
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Biaya Lokasi :</label>
                        <input v-model="formattedHargaLokasi" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Biaya Lokasi">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">
                        <label class="block mb-2">Biaya Proses :</label>
                        <input v-model="formattedBiayaProses" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukan Biaya Proses">
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Discount:</label>
                        <input v-model="formattedDiscount" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Discount">
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Total Acc Bank:</label>
                    <input v-model="formattedTotalAccBank" type="text" class="border border-gray-300 p-2 w-full"
                        placeholder="Masukkan Total Acc Bank">
                </div>
                <div class="flex justify-end">
                    <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Batal</button>
                    <button @click="submitKeuangan" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </div>
        </div>

        <!-- Modal Input Data Pembayaran CASH -->
        <div v-if="showModals" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h2 class="text-2xl mb-4 font-normal">Input Data Pembayaran CASH</h2>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">
                        <label class="block mb-2">Nomor Pembayaran :</label>
                        <input v-model="formData.nomor_pembayaran" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Nomor Pembayaran">
                    </div>

                    <div class="mb-4">
                        <label class="block mb-2">Harga Pokok Rumah:</label>
                        <input v-model="formattedHargaRumah" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Harga Rumah">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">
                        <label class="block mb-2">Kelebihan Lokasi:</label>
                        <input v-model="formattedKelebihanTanah" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Harga Kelebihan Lokasi">
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Biaya Lokasi :</label>
                        <input v-model="formattedHargaLokasi" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Biaya Lokasi">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">
                        <label class="block mb-2">Biaya Proses :</label>
                        <input v-model="formattedBiayaProses" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukan Biaya Proses">
                    </div>
                    <div class="mb-4">
                        <label class="block mb-2">Discount:</label>
                        <input v-model="formattedDiscount" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Discount">
                    </div>
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
                // List Blok Options
            ],
            showModal: false,
            showModals: false,
            formData: {
                nomor_pembayaran: '',
                perhitungan_harga_rumah: [
                    {
                        harga_rumah: 0,
                        kelebihan_tanah: 0,
                        harga_lokasi: 0,
                        biaya_proses: 0,
                        discount: 0,
                        total_acc_bank: 0,
                        status_perhitungan: true
                    },
                ],
            },
        }
    },
    mounted() {
        this.getCustomer();
    },
    computed: {
        formattedHargaRumah: {
            get() {
                return this.formatRupiah(this.formData.perhitungan_harga_rumah[0].harga_rumah);
            },
            set(value) {
                const numericValue = parseInt(value.replace(/[^,\d]/g, ''));
                this.formData.perhitungan_harga_rumah[0].harga_rumah = isNaN(numericValue) ? 0 : numericValue;
            }
        },
        formattedKelebihanTanah: {
            get() {
                return this.formatRupiah(this.formData.perhitungan_harga_rumah[0].kelebihan_tanah);
            },
            set(value) {
                const numericValue = parseInt(value.replace(/[^,\d]/g, ''));
                this.formData.perhitungan_harga_rumah[0].kelebihan_tanah = isNaN(numericValue) ? 0 : numericValue;
            }
        },
        formattedHargaLokasi: {
            get() {
                return this.formatRupiah(this.formData.perhitungan_harga_rumah[0].harga_lokasi);
            },
            set(value) {
                const numericValue = parseInt(value.replace(/[^,\d]/g, ''));
                this.formData.perhitungan_harga_rumah[0].harga_lokasi = isNaN(numericValue) ? 0 : numericValue;
            }
        },
        formattedBiayaProses: {
            get() {
                return this.formatRupiah(this.formData.perhitungan_harga_rumah[0].biaya_proses);
            },
            set(value) {
                const numericValue = parseInt(value.replace(/[^,\d]/g, ''));
                this.formData.perhitungan_harga_rumah[0].biaya_proses = isNaN(numericValue) ? 0 : numericValue;
            }
        },
        formattedDiscount: {
            get() {
                return this.formatRupiah(this.formData.perhitungan_harga_rumah[0].discount);
            },
            set(value) {
                const numericValue = parseInt(value.replace(/[^,\d]/g, ''));
                this.formData.perhitungan_harga_rumah[0].discount = isNaN(numericValue) ? 0 : numericValue;
            }
        },
        formattedTotalAccBank: {
            get() {
                return this.formatRupiah(this.formData.perhitungan_harga_rumah[0].total_acc_bank);
            },
            set(value) {
                const numericValue = parseInt(value.replace(/[^,\d]/g, ''));
                this.formData.perhitungan_harga_rumah[0].total_acc_bank = isNaN(numericValue) ? 0 : numericValue;
            }
        },
    },
    methods: {
        showInvoice() {
            this.showAlert('Invoice Muncul')
        },
        cetakInvoice(customerId) {
            alert(customerId)
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
                    console.log(this.customer)
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
                        if (res.data.data.length > 0) {
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
                const customerData = resCustomer.data.data;
                this.isverified = customerData.verifikasi_data;
                const resKeuangan = await keuanganApi.getKeuanganCustumerById(customerId);
                this.customers = resKeuangan.data;

                if (!this.isverified) {
                    this.showAlert('Data Customer Belum Diverifikasi');
                    return;
                }

                const typePembayaran = customerData.type_pembayaran;
                if (typePembayaran === 'kpr') {
                    this.showModal = true;
                } else if (typePembayaran === 'cash') {
                    this.showModals = true;
                } else {
                    this.showAlert('Tipe Pembayaran tidak dikenal');
                    return;
                }
            } catch (error) {
                console.log(error);
                return;
            }
            this.selectedCustomerId = customerId;
        },
        closeModal() {
            this.showModal = false;
            this.showModals = false;
            this.customers = null;
            this.isverified = false;
        },
        updtStatus() {
            custumerApi.updtStatuspembayaran(this.selectedCustomerId)
                .then(() => {
                    this.showSuccessAlert('status true');
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        submitKeuangan() {
            const data = {
                id_customer: this.selectedCustomerId,
                ...this.formData,
            };
            keuanganApi.create(data)
                .then(() => {
                    this.showSuccessAlert('Data keuangan berhasil disimpan');
                    this.updtStatus()
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
