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
                    class="bg-gray-200 rounded text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
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
                            <th class="border-2 border-black px-1 py-2 font-normal">Marketer</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nama Lengkap</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nomor Hp</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Tipe Pembayaran</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Status Berkas</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-for="custom in customer" :key="custom._id">
                        <tr>
                            <td class="px-1 py-2 border border-black text-sm">
                                ADR - 0{{ custom.kavling[0].type.replace('Type ', '') }} -
                                {{ custom.id_blok.blokname }} - 0{{ custom.id_rumah.no_rumah }}
                            </td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.id_user.username }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.type_pembayaran }}</td>
                            <div class="border-t border-black">
                                <div v-if="custom.verifikasi_data === true">
                                    <td class="px-1 pt-4 text-marydeep">Terverifikasi</td>
                                </div>
                                <div v-if="custom.verifikasi_data === false">
                                    <td class="px-1 pt-4 text-che">Belum diverifikasi</td>
                                </div>
                            </div>
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
                                    <button @click="showInvoice(custom._id)" class="bg-black text-black">
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

        <div v-else>
            <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
        </div>

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

        <div v-if="showModals" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div class="bg-white p-6 rounded-lg w-1/2">
                <h2 class="text-2xl mb-4 font-normal">Input Data Pembayaran CASH</h2>
                <div class="grid grid-cols-2 gap-x-4">
                    <div class="mb-4">

                        <label class="block mb-2">Nomor Pembayaran :</label>
                        <td class="block mb-2 border border-black py-1 pl-2">{{ formData.nomor_pembayaran }}</td>
                        <!-- <labelv-model="formData.nomor_pembayaran" type="text" class="border border-gray-300 p-2 w-full"
                            placeholder="Masukkan Nomor Pembayaran"> -->
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
import houseApi from '@/services/houseApi';
import Swal from 'sweetalert2';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ApiNotification from "../services/Notifitcation"
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
        formatNumber(value) {
            return new Intl.NumberFormat('id-ID').format(value);
        },
        async generatePDFx(customer, house, index) {
            try {
                const url = '/INVOICE.pdf';
                const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const page = pdfDoc.getPages()[0];

                // Define text settings
                const fontSize = 10;
                const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                const fontmiring = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
                const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
                page.drawText("ADHYAKSA RESIDENCE", {
                    x: 537,   // Koordinat X
                    y: 481.5,   // Koordinat Y
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });
                const bulan = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                const date = new Date(customer.perhitungan_harga_rumah[0].tgl_perhitungan);
                const tanggal = date.getUTCDate();
                const bulanIndex = date.getUTCMonth(); // Januari = 0, Agustus = 7, dll
                const tahun = date.getUTCFullYear();
                const monthsRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
                page.drawText(`${index + 1}/INV/ADR/${monthsRoman[bulanIndex]}/${tahun}`, {
                    x: 193,   // Koordinat X
                    y: 523.5,  // Koordinat Y
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${tanggal} ${bulan[bulanIndex]} ${tahun}`, {
                    x: 193,   // Koordinat X
                    y: 510.5,  // Koordinat Y
                    size: fontSize,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                // Add text at specific positions
                page.drawText(customer.id_customer.data_pribadi[0].namaLengkap.toUpperCase(), {
                    x: 193,   // Koordinat X
                    y: 478.5,   // Koordinat Y
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });
                page.drawText(customer.id_customer.data_pribadi[0].alamat.toUpperCase(), {
                    x: 193,   // Koordinat X
                    y: 462,   // Koordinat Y
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });
                page.drawText(customer.id_customer.data_pribadi[0].no_kontak.toUpperCase(), {
                    x: 193,   // Koordinat X
                    y: 416.5,   // Koordinat Y
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });

                page.drawText(house.id_blok.blokname.toUpperCase(), {
                    x: 537,   // Koordinat X
                    y: 461.7,   // Koordinat Y
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });

                const no_rumah = `- / No. 0${house.no_rumah}`
                page.drawText(no_rumah, {
                    x: 537,
                    y: 419.5,
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${this.formatNumber(customer.perhitungan_harga_rumah[0].harga_rumah)}`, {
                    x: 650,
                    y: 349,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${this.formatNumber(customer.perhitungan_harga_rumah[0].biaya_proses)}`, {
                    x: 650,
                    y: 329,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${this.formatNumber(customer.perhitungan_harga_rumah[0].harga_lokasi)}`, {
                    x: 650,
                    y: 310,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                page.drawText(`${this.formatNumber(customer.perhitungan_harga_rumah[0].kelebihan_tanah)}`, {
                    x: 650,
                    y: 292,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                // page.drawText(`-`, {
                //     x: 650,
                //     y: 272,
                //     size: 14,
                //     font: font,
                //     color: rgb(0, 0, 0),
                // });

                page.drawText(`${this.formatNumber(customer.harga_rumah[0].total)}`, {
                    x: 650,
                    y: 253,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                page.drawText(`${this.formatNumber(customer.perhitungan_harga_rumah[0].discount)}`, {
                    x: 650,
                    y: 233,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${this.formatNumber(customer.harga_rumah[0].dp)}`, {
                    x: 650,
                    y: 215,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${this.formatNumber(customer.harga_rumah[0].total_akhir)}`, {
                    x: 650,
                    y: 195,
                    size: 14,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                const terbilang = `${this.toTerbilang(customer.harga_rumah[0].total_akhir).toUpperCase()}`
                if (terbilang.length > 30) {
                    page.drawText(`${this.splitStringInHalf(terbilang).firstHalf}\n${this.splitStringInHalf(terbilang).secondHalf}`, {
                        x: 530,
                        y: 175,
                        size: 10,
                        font: fontmiring,
                        color: rgb(0, 0, 0),
                        lineHeight: 12
                    });
                } else {
                    page.drawText(terbilang, {
                        x: 530,
                        y: 170,
                        size: 10,
                        font: fontmiring,
                        color: rgb(0, 0, 0),
                    });
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const urlBlob = URL.createObjectURL(blob);
                setTimeout(() => {
                    window.open(urlBlob, '_blank');
                }, 1000);
                const link = document.createElement('a');
                link.href = urlBlob;
                link.download = `Surat_Pernyataan_customer_${customer.id_customer.data_pribadi[0].namaLengkap}.pdf`;
                link.click();
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        },
        splitStringInHalf(str) {
            const words = str.split(' ');
            const middleIndex = Math.floor(words.length / 2);
            const firstHalf = words.slice(0, middleIndex).join(' ');
            const secondHalf = words.slice(middleIndex).join(' ');
            return {
                firstHalf,
                secondHalf
            };
        },
        toTerbilang(nominal) {
            const angka = [
                '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'
            ];

            const convertToWords = (n) => {
                if (n < 12) {
                    return angka[n];
                } else if (n < 20) {
                    return convertToWords(n - 10) + ' belas';
                } else if (n < 100) {
                    return convertToWords(Math.floor(n / 10)) + ' puluh ' + convertToWords(n % 10);
                } else if (n < 200) {
                    return 'seratus ' + convertToWords(n - 100);
                } else if (n < 1000) {
                    return convertToWords(Math.floor(n / 100)) + ' ratus ' + convertToWords(n % 100);
                } else if (n < 2000) {
                    return 'seribu ' + convertToWords(n - 1000);
                } else if (n < 1000000) {
                    return convertToWords(Math.floor(n / 1000)) + ' ribu ' + convertToWords(n % 1000);
                } else if (n < 1000000000) {
                    return convertToWords(Math.floor(n / 1000000)) + ' juta ' + convertToWords(n % 1000000);
                } else if (n < 1000000000000) {
                    return convertToWords(Math.floor(n / 1000000000)) + ' miliar ' + convertToWords(n % 1000000000);
                } else if (n < 1000000000000000) {
                    return convertToWords(Math.floor(n / 1000000000000)) + ' triliun ' + convertToWords(n % 1000000000000);
                } else {
                    return 'Angka terlalu besar';
                }
            };

            return nominal === 0 ? 'nol' : convertToWords(nominal) + ' rupiah';
        },
        async showInvoice(CustomerId) {
            try {
                const keuangan = await keuanganApi.getAll()
                const index = keuangan.data.data.findIndex(item => item.id_customer._id === CustomerId);
                const data = keuangan.data.data.find(item => item.id_customer._id === CustomerId) || null;
                const resultHouse = await houseApi.getByID(data.id_customer.id_rumah._id)
                //  this.showAlert(`Customer ID : ${CustomerId}`)
                // console.log(data.status_dp)
                // console.log(CustomerId)
                if (data.status_dp) {
                    this.generatePDFx(data, resultHouse.data.data, index)
                } else {
                    this.showAlert('Silahkan Update Pembayaran Terlebih Dahulu')
                }
            } catch (error) {
                console.error(error)
            }

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
                    // console.log(this.customer)
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
                const keuangan = await keuanganApi.getAll()
                const index = keuangan.data.data.length;
                const date = new Date(Date.now());
                const bulanIndex = date.getUTCMonth();
                const tahun = date.getUTCFullYear();
                const monthsRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
                this.formData.nomor_pembayaran = `${index + 1}/INV/ADR/${monthsRoman[bulanIndex]}/${tahun}`
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
                    this.NotificationToDirektur("Ada Rumah Yang Proses Bayar")
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
        async NotificationToDirektur(message) {
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
    },
};
</script>
