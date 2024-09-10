<template>
    <div class="p-4">
        <div>
            <div class="text-base">
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
                    <tbody v-for="custom in customer" :key="custom._id">
                        <tr>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.data_pribadi[0].email }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_blok.blokname }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_rumah.no_rumah }}</td>
                            <td class="border-2 border-black px-2 py-2">{{ custom.id_rumah.type_rumah }}</td>
                            <td class="border-2 border-black pl-2 pt-3 pb-2">
                                <div @click="openModal(custom._id, 1)">
                                    <button class="bg-black text-black">
                                        <h1
                                            class="bg-gray-200 border-2 px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Data Lengkap
                                        </h1>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-for="custom in customer" :key="custom._id">
                    <div v-if="showData && selectedId === custom._id && modalPage === 1"
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
                            <button @click="closeModal"
                                class="absolute top-2 right-2 text-gray-600 hover:text-black">✖</button>

                            <h2 class="text-xl font-normal mb-4">Informasi Kavling dan Rumah</h2>
                            <table class="min-w-full border-collapse border border-gray-300">
                                <tbody>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Blok:</td>
                                        <td class="border px-4 py-2">{{ custom.id_blok.blokname }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Nomor Rumah:</td>
                                        <td class="border px-4 py-2">{{ custom.id_rumah.no_rumah }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Tipe Rumah:</td>
                                        <td class="border px-4 py-2">{{ custom.id_rumah.type_rumah }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Nomor Kavling:</td>
                                        <td class="border px-4 py-2">{{ custom.kavling[0].no_kavling }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Tipe Kavling:</td>
                                        <td class="border px-4 py-2">{{ custom.kavling[0].type }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Luas Bangunan:</td>
                                        <td class="border px-4 py-2">{{ custom.kavling[0].luas_bangunan }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Luas Tanah:</td>
                                        <td class="border px-4 py-2">{{ custom.kavling[0].luas_tanah }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="mt-4 flex justify-end">
                                <div class="bg-black">
                                    <button @click="changeModalPage(2)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="showData && selectedId === custom._id && modalPage === 2"
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
                            <button @click="closeModal"
                                class="absolute top-2 right-2 text-gray-600 hover:text-black">✖</button>

                            <h2 class="text-xl font-normal mb-4">Data Pribadi</h2>
                            <table class="min-w-full border-collapse border border-gray-300">
                                <tbody>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Nama:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Tempat Lahir:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].tempat_lahir }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Jenis Kelamin:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].jenis_kelamin }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Pekerjaan:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].pekerjaan }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Alamat:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].alamat }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">No Identitas:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].no_identitas }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">No Kontak:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Email:</td>
                                        <td class="border px-4 py-2">{{ custom.data_pribadi[0].email }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="mt-4 flex justify-between">
                                <div class="bg-black">
                                    <button @click="changeModalPage(1)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        prev
                                    </button>
                                </div>
                                <div class="bg-black">
                                    <button @click="changeModalPage(3)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="showData && selectedId === custom._id && modalPage === 3"
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
                            <button @click="closeModal"
                                class="absolute top-2 right-2 text-gray-600 hover:text-black">✖</button>
                            <h2 class="text-xl font-normal mb-4">Pekerjaan</h2>
                            <table class="min-w-full border-collapse border border-gray-300">
                                <tbody>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Jenis Pekerjaan:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].jenis_pekerjaan }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Jabatan:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].jabatan }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Status Pekerjaan:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].status_pekerjaan }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Instansi:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].nama_instansi }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">No Telp Instansi:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].no_telpon_instansi }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Penghasilan Tetap:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].penghasilan_tetap }}</td>
                                    </tr>
                                    <tr>
                                        <td class="border px-4 py-2 font-normal">Penghasilan Tambahan:</td>
                                        <td class="border px-4 py-2">{{ custom.pekerjaan[0].penghasilan_tambahan }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="mt-4 flex justify-between">
                                <div class="bg-black">
                                    <button @click="changeModalPage(2)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Prev
                                    </button>
                                </div>
                                <div class="bg-black">
                                    <button @click="changeModalPage(4)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="showData && selectedId === custom._id && modalPage === 4"
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-auto relative">
                            <button @click="closeModal"
                                class="absolute top-2 right-2 text-gray-600 hover:text-black">✖</button>
                            <table>
                                <tbody class="grid grid-cols-2 gap-x-6 pb-4 place-items-center">
                                    <tr>
                                        <td class="px-4 py-2 font-normal">KTP : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].ktp)" alt="KTP Image"
                                            class="w-60 cursor-pointer"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].ktp))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">NPWP : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].npwp)" alt="NPWP Image"
                                            class="w-60 cursor-pointer"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].npwp))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">KK : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].kk)" alt="NPWP Image"
                                            class="w-60 cursor-pointer"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].kk))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">SLIP GAJI : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].slip_gaji)" alt="NPWP Image"
                                            class="w-60 cursor-pointer"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].slip_gaji))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">BUKU NIKAH : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].buku_nikah)" alt="NPWP Image"
                                            class="w-60 cursor-pointer"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].buku_nikah))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">PAS FOTO : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].pas_foto)" alt="NPWP Image"
                                            class="w-60 cursor-pointer"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].pas_foto))" />
                                    </tr>
                                </tbody>
                            </table>

                            <div class="mt-4 flex justify-between">
                                <div class="bg-black">
                                    <button @click="changeModalPage(3)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Prev
                                    </button>
                                </div>
                                <div class="bg-black">
                                    <button @click="verifyCustomer(selectedId)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Batalkan Verifikasi Data
                                    </button>
                                </div>
                                <div class="bg-black">
                                    <button @click="terjual(custom.id_rumah._id)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Rumah Terjual
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <vue-easy-lightbox :visible="lightboxVisible" :imgs="lightboxImages" @hide="lightboxVisible = false" />
            </div>
        </div>
    </div>
</template>

<script>
import custumerApi from '@/services/custumerApi';
import VueEasyLightbox from 'vue-easy-lightbox';

export default {
    components: {
        VueEasyLightbox
    },
    data() {
        return {
            customer: '',
            showData: false,
            selectedId: '',
            modalPage: 1,
            lightboxVisible: false,
            lightboxImages: []
        }
    },
    mounted() {
        this.getUnverifiedCustomers();
    },
    methods: {
        openModal(id, page) {
            this.selectedId = id;
            this.modalPage = page;
            this.showData = true;
        },
        closeModal() {
            this.showData = false;
        },
        changeModalPage(page) {
            this.modalPage = page;
        },
        getUnverifiedCustomers() {
            custumerApi.getVerifiedCustomers()
                .then(res => {
                    this.customer = res.data.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        verifyCustomer(id) {
            custumerApi.cancelVerificationStatus(id)
                .then(() => {
                    alert('Batalkan Verifikasi Berhasil');
                    this.getUnverifiedCustomers();
                    this.closeModal();
                })
                .catch((error) => {
                    console.error('Verifikasi gagal', error);
                    alert('Verifikasi gagal, coba lagi.');
                });
        },
        terjual(houseId) {
            custumerApi.updateHouseStatus(houseId)
                .then(() => {
                    alert('Status rumah berhasil diperbarui menjadi terjual');
                    this.getUnverifiedCustomers();
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Gagal memperbarui status rumah', error);
                    alert('Gagal memperbarui status rumah');
                });
        },
        getFullImgPath(img) {
            return `http://192.168.1.7:3000/${img}`;
        },
        openLightbox(image) {
            this.lightboxImages = [image];
            this.lightboxVisible = true;
        },
    }
}
</script>
