<template>
    <div class="p-4">
        <div class="mb-4 flex space-x-4">
            <select v-model="selectedBlokname" class="border-2 border-black px-4 py-2 flex-grow">
                <option disabled value="">Pilih Blok</option>
                <option value="semua">Semua</option>
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
        <div>
            <div class="text-sm">
                <table v-if="customer.length > 0" class="min-w-full border-collapse border-2 border-black text-center">
                    <thead>
                        <tr class="text-base">
                            <th class="px-2 py-2 border border-black font-normal text-lg">Id</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Marketer</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nama Lengkap</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Nomor Hp</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Type Pembayaran</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Status Berkas</th>
                            <th class="border-2 border-black px-1 py-2 font-normal">Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-for="custom in customer" :key="custom._id">
                        <tr>
                            <td class="px-1 py-2 border border-black text-sm text-start pl-4">
                                ADR - 0{{ custom.kavling[0].type.replace('Type ', '') }} -
                                {{ custom.id_blok.blokname }} - 0{{ custom.id_rumah.no_rumah }}
                            </td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.id_user.username }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].namaLengkap }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.data_pribadi[0].no_kontak }}</td>
                            <td class="border-2 border-black px-1 py-2">{{ custom.type_pembayaran }}</td>
                            <div class="border-t border-black">
                                <div v-if="custom.verifikasi_data === true">
                                    <td class="px-2 pt-5 text-marydeep">Terverifikasi</td>
                                </div>
                                <div v-if="custom.verifikasi_data === false">
                                    <td class="px-2 pt-5 text-che">Belum Terverifikasi</td>
                                </div>
                            </div>
                            <td class="border-2 border-black pl-2 pt-3 pb-2">
                                <div @click="openModal(custom._id, 1, custom)">
                                    <button class="bg-black text-black rounded">
                                        <h1
                                            class="bg-gray-200 border-2 rounded px-4 py-2 border-black uppercase transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Data
                                        </h1>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else>
                    <p class="text-red-500">Tidak ada hasil yang ditemukan untuk pencarian "{{ selectedBlokname }}"</p>
                </div>

                <div v-for="custom in customer" :key="custom._id">
                    <div v-if="showData && selectedId === custom._id && modalPage === 1"
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
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
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
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
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
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
                        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                        <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-auto relative">
                            <button @click="closeModal"
                                class="absolute top-2 right-2 text-gray-600 hover:text-black">✖</button>
                            <table>
                                <tbody class="grid grid-cols-3 gap-x-6 pb-4 place-items-center">
                                    <tr>
                                        <td class="px-4 py-2 font-normal">KTP : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].ktp)" alt="KTP Image"
                                            class="w-60 cursor-pointer max-h-40"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].ktp))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">NPWP : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].npwp)" alt="NPWP Image"
                                            class="w-60 cursor-pointer max-h-40"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].npwp))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">KK : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].kk)" alt="NPWP Image"
                                            class="w-60 cursor-pointer max-h-40"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].kk))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">SLIP GAJI : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].slip_gaji)" alt="NPWP Image"
                                            class="w-60 cursor-pointer max-h-40"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].slip_gaji))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">BUKU NIKAH : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].buku_nikah)" alt="NPWP Image"
                                            class="w-60 cursor-pointer max-h-40"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].buku_nikah))" />
                                    </tr>
                                    <tr>
                                        <td class="px-4 py-2 font-normal">PAS FOTO : </td>
                                        <img :src="getFullImgPath(custom.customerFile[0].pas_foto)" alt="NPWP Image"
                                            class="w-60 cursor-pointer max-h-40"
                                            @click="openLightbox(getFullImgPath(custom.customerFile[0].pas_foto))" />
                                    </tr>
                                </tbody>
                            </table>

                            <div v-if="shows"
                                class="fixed inset-0 h-screen z-50 flex justify-center items-center bg-black bg-opacity-50">
                                <div class="relative bg-white p-6 rounded-lg shadow-lg w-96">
                                    <button @click="shows = false"
                                        class="absolute top-2 right-2 text-gray-600 hover:text-black">
                                        ✖
                                    </button>
                                    <div class="mb-4">
                                        <select v-model="kondisis"
                                            class="border-2 border-gray-300 rounded w-full px-4 py-2">
                                            <option value="terjual">Terjual</option>
                                            <option value="terbooking">Terbooking</option>
                                            <option value="cash">Cash</option>
                                            <option value="kpr">KPR</option>
                                        </select>
                                    </div>
                                    <div class="flex justify-center">
                                        <button @click="terjual(custom.id_rumah._id, kondisis)"
                                            class="bg-gray-200 border-2 border-black text-black px-4 py-2 rounded transition-transform transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 flex justify-between">
                                <div class="bg-black">
                                    <button @click="changeModalPage(3)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        Prev
                                    </button>
                                </div>
                                <div class="bg-black">
                                    <button @click="deterjual(custom.id_rumah._id) && verifyCustomer(selectedId)"
                                        class="bg-gray-200 text-black border-2 border-black px-4 py-2 transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                                        <h1>
                                            Batalkan Verifikasi Data
                                        </h1>
                                    </button>
                                </div>
                                <div class="bg-black">
                                    <button @click="terjuals"
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
import Swal from 'sweetalert2';
import ApiNotification from "../services/Notifitcation"
export default {
    components: {
        VueEasyLightbox
    },
    data() {
        return {
            kondisis: "",
            customer: [],
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
            showData: false,
            selectedId: '',
            modalPage: 1,
            selectedRumah: null,
            lightboxVisible: false,
            lightboxImages: [],
            shows: false
        }
    },
    mounted() {
        this.getUnverifiedCustomers();
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
        openModal(id, page, rumah) {
            this.selectedRumah = rumah;
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
        async verifyCustomer(id) {
            custumerApi.cancelVerificationStatus(id)
                .then(() => {
                    this.showSuccessAlert('Batalkan Verifikasi Berhasil. Status rumah berhasil diperbarui menjadi tidak terjual.');
                    this.getUnverifiedCustomers();
                    this.closeModal();
                })
                .catch((error) => {
                    console.error('Verifikasi gagal', error);
                    this.showErrorAlert('Verifikasi gagal, coba lagi.');
                });
        },
        async deterjual(houseId) {
            this.PostNotification(`Rumah ${this.selectedRumah.id_blok.blokname} ${this.selectedRumah.id_rumah.no_rumah} Batal Terjual`)
            custumerApi.deupdateHouseStatus(houseId)
                .then(() => {
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Gagal memperbarui status rumah', error);
                    this.showErrorAlert('Gagal memperbarui status rumah');
                });
        },
        terjuals() {
            this.shows = true
        },
        terjual(houseId, kondisi) {
            custumerApi.updateHouseStatus(houseId, kondisi)
            this.PostNotification(`Rumah ${this.selectedRumah.id_blok.blokname} ${this.selectedRumah.id_rumah.no_rumah} Terjual`)
                .then(() => {
                    if (kondisi === "terbooking") {
                        this.showSuccessAlert('Status rumah berhasil diperbarui menjadi terbooking');
                    } else if (kondisi === "terjual") {
                        this.showSuccessAlert('Status rumah berhasil diperbarui menjadi terjual');
                    } else if (kondisi === "cash") {
                        this.showSuccessAlert('Status rumah berhasil diperbarui menjadi terjual cash');
                    } else if (kondisi === "kpr") {
                        this.showSuccessAlert('Status rumah berhasil diperbarui menjadi terjual kpr');
                    }

                    this.getUnverifiedCustomers();
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Gagal memperbarui status rumah', error);
                    this.showErrorAlert('Gagal memperbarui status rumah');
                });
        },
        searchCustomer() {
            this.customer = [];
            if (this.selectedBlokname == 'semua') {
                this.getUnverifiedCustomers();
                return;
            }

            if (this.selectedBlokname.length > 0) {
                custumerApi.searchCustomerByBlokname(this.selectedBlokname)
                    .then(res => {
                        if (res.data.data.length > 0) {
                            this.customer = res.data.data;
                            console.log(this.customer)
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
        getFullImgPath(img) {
            return `http://192.168.1.10:3000/${img}`;
        },
        openLightbox(image) {
            this.lightboxImages = [image];
            this.lightboxVisible = true;
        },
    }
}
</script>
