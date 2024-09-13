<template>
    <div class="relative w-full h-screen p-4 bg-gray-100">
        <div v-if="customers.length > 0">
            <table class="min-w-full border-collapse border-2 border-black text-center text-lg">
                <thead>
                    <tr>
                        <th class="border-2 border-black px-2 py-2 font-normal">Nama Lengkap</th>
                        <th class="border-2 border-black px-2 py-2 font-normal">Blok Rumah</th>
                        <th class="border-2 border-black px-2 py-2 font-normal">No Rumah</th>
                        <th class="border-2 border-black px-2 py-2 font-normal">No Kontak</th>
                        <th class="border-2 border-black px-2 py-2 font-normal">Tipe Pembayaran</th>
                        <th class="border-2 border-black px-2 py-2 font-normal">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="customer in customers" :key="customer._id">
                        <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].namaLengkap }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.id_blok.blokname }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.id_rumah.no_rumah }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].no_kontak }}</td>
                        <td class="border-2 border-black px-2 py-2">{{ customer.type_pembayaran }}</td>
                        <td class="border-2 border-black px-2 py-2">
                            <button @click="openEditCustomerModal(customer)"
                                class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                                Show Data
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div v-else>
            <p class="text-center">No customers found.</p>
        </div>

        <div v-if="isCustomerModalVisible"
            class="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-4/5 overflow-y-auto">
                <h2 class="text-lg font-normal mb-4">Form Customer Data</h2>
                <form @submit.prevent="submitCustomerForm">

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Blok:</label>
                        <p>{{ customerForm.blokname }}</p>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">No Rumah:</label>
                        <p>{{ customerForm.no_rumah }}</p>
                    </div>


                    <h3 class="text-lg font-normal mb-2">Kavling</h3>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">No Kavling:</label>
                            <p>{{ customerForm.kavling.no_kavling }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Type:</label>
                            <p>{{ customerForm.kavling.type }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Luas Bangunan:</label>
                            <p>{{ customerForm.kavling.luas_bangunan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Luas Tanah:</label>
                            <p>{{ customerForm.kavling.luas_tanah }}</p>
                        </div>
                    </div>


                    <h3 class="text-lg font-normal mb-2">Data Pribadi</h3>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Nama Lengkap:</label>
                            <p>{{ customerForm.data_pribadi.namaLengkap }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Tempat Lahir:</label>
                            <p>{{ customerForm.data_pribadi.tempat_lahir }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Tanggal Lahir:</label>
                            <p>{{ customerForm.data_pribadi.tanggal_lahir }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Jenis Kelamin:</label>
                            <p>{{ customerForm.data_pribadi.jenis_kelamin }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Pekerjaan:</label>
                            <p>{{ customerForm.data_pribadi.pekerjaan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Alamat:</label>
                            <p>{{ customerForm.data_pribadi.alamat }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">No Identitas:</label>
                            <p>{{ customerForm.data_pribadi.no_identitas }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">No Kontak:</label>
                            <p>{{ customerForm.data_pribadi.no_kontak }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">No WhatsApp:</label>
                            <p>{{ customerForm.data_pribadi.no_wa }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email:</label>
                            <p>{{ customerForm.data_pribadi.email }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Status Tempat Tinggal:</label>
                            <p>{{ customerForm.data_pribadi.status_tempat_tinggal }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Status Pernikahan:</label>
                            <p>{{ customerForm.data_pribadi.status_pernikahan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">NPWP:</label>
                            <p>{{ customerForm.data_pribadi.npwp }}</p>
                        </div>
                    </div>


                    <h3 class="text-lg font-normal mb-2">Pekerjaan</h3>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Jenis Pekerjaan:</label>
                            <p>{{ customerForm.pekerjaan.jenis_pekerjaan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Jabatan:</label>
                            <p>{{ customerForm.pekerjaan.jabatan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Status Pekerjaan:</label>
                            <p>{{ customerForm.pekerjaan.status_pekerjaan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Nama Instansi:</label>
                            <p>{{ customerForm.pekerjaan.nama_instansi }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">No Telpon Instansi:</label>
                            <p>{{ customerForm.pekerjaan.no_telpon_instansi }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">No Fax:</label>
                            <p>{{ customerForm.pekerjaan.no_fax }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Penghasilan Tetap:</label>
                            <p>{{ customerForm.pekerjaan.penghasilan_tetap }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Penghasilan Tambahan:</label>
                            <p>{{ customerForm.pekerjaan.penghasilan_tambahan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Pengeluaran Perbulan:</label>
                            <p>{{ customerForm.pekerjaan.pengeluaran_perbulan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Sumber Penghasilan Tambahan:</label>
                            <p>{{ customerForm.pekerjaan.sumber_penghasilan_tambahan }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Jenis Usaha:</label>
                            <p>{{ customerForm.pekerjaan.jenis_usaha }}</p>
                        </div>
                    </div>


                    <h3 class="text-lg font-normal mb-2">Type Pembayaran</h3>
                    <div>
                        <p>{{ customerForm.type_pembayaran }}</p>
                    </div>
                    <h4 class="text-lg font-normal mb-2">Customer Files</h4>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">KTP:</label>
                            <div v-if="customerForm.customerFiles.ktp">
                                <img :src="getImageUrl(customerForm.customerFiles.ktp)" class="w-full mb-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">NPWP:</label>
                            <div v-if="customerForm.customerFiles.npwp">
                                <img :src="getImageUrl(customerForm.customerFiles.npwp)" class="w-full mb-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">KK:</label>
                            <div v-if="customerForm.customerFiles.kk">
                                <img :src="getImageUrl(customerForm.customerFiles.kk)" class="w-full mb-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Slip Gaji:</label>
                            <div v-if="customerForm.customerFiles.slip_gaji">
                                <img :src="getImageUrl(customerForm.customerFiles.slip_gaji)" class="w-full mb-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Buku Nikah:</label>
                            <div v-if="customerForm.customerFiles.buku_nikah">
                                <img :src="getImageUrl(customerForm.customerFiles.buku_nikah)" class="w-full mb-2">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Pas Foto:</label>
                            <div v-if="customerForm.customerFiles.pas_foto">
                                <img :src="getImageUrl(customerForm.customerFiles.pas_foto)" class="w-full mb-2">
                            </div>
                        </div>
                    </div>


                    <div class="flex justify-end space-x-4">
                        <button type="button" @click="closeCustomerModal"
                            class="px-4 py-2 bg-gray-500 text-white rounded-lg">Close</button>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
import CustomerService from "@/services/custumerApi.js"
import houseApi from "@/services/houseApi.js"
export default {
    data() {
        return {
            customers: [],
            isCustomerModalVisible: false,
            bloks: [],
            houses: [],
            filteredHouses: [],
            customerForm: {
                id_blok: "",
                id_rumah: "",
                type_pembayaran: '',
                blokname: "",
                no_rumah: "",
                kavling: {
                    no_kavling: "",
                    type: "",
                    luas_bangunan: "",
                    luas_tanah: "",
                },
                data_pribadi: {
                    namaLengkap: "",
                    tempat_lahir: "",
                    tanggal_lahir: "",
                    jenis_kelamin: "",
                    pekerjaan: "",
                    alamat: "",
                    no_identitas: "",
                    no_kontak: "",
                    no_wa: "",
                    email: "",
                    status_tempat_tinggal: "",
                    status_pernikahan: "",
                    npwp: "",
                },
                pekerjaan: {
                    jenis_pekerjaan: "",
                    jabatan: "",
                    status_pekerjaan: "",
                    nama_instansi: "",
                    no_telpon_instansi: "",
                    no_fax: "",
                    penghasilan_tetap: "",
                    penghasilan_tambahan: "",
                    pengeluaran_perbulan: "",
                    sumber_penghasilan_tambahan: "",
                    jenis_usaha: "",
                },
                customerFiles: {
                    ktp: null,
                    npwp: null,
                    kk: null,
                    slip_gaji: null,
                    buku_nikah: null,
                    pas_foto: null
                },
            },
        };
    },
    created() {
        this.fetchCustomers();
        this.fetchBlocksAndHouses();
    },
    methods: {
        handleFileUpload(event, field) {
            const files = event.target.files;
            if (files && files.length > 0) {
                this.customerForm.customerFiles[field] = files[0];
            } else {
                console.error(`No files selected for field: ${field}`);
            }
        },

        getImageUrl(filePath) {
            return `http://192.168.1.4:3000/${filePath}`;
        },

        async fetchBlocksAndHouses() {
            try {
                const response = await houseApi.getBlokandHouse();
                this.bloks = response.data.blocks;
                this.houses = response.data.houses;
            } catch (error) {
                console.error("Error fetching blok and house data:", error);
            }
        },


        filterHousesByBlock() {
            this.filteredHouses = this.houses.filter(
                (house) => house.id_blok._id === this.customerForm.id_blok
            );
        },

        async fetchCustomers() {
            try {
                const response = await CustomerService.getVerifiedCustomers();
                this.customers = response.data.data;
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },

        openEditCustomerModal(customer) {
            this.customerForm.id_blok = customer.id_blok._id;
            this.customerForm.id_rumah = customer.id_rumah._id;
            this.customerForm = {
                id_blok: customer.id_blok ? customer.id_blok._id : "",
                id_rumah: customer.id_rumah ? customer.id_rumah._id : "",
                type_pembayaran: customer.type_pembayaran ? customer.type_pembayaran : "",
                blokname: customer.id_blok ? customer.id_blok.blokname : "",
                no_rumah: customer.id_rumah ? customer.id_rumah.no_rumah : "",
                kavling: {
                    no_kavling: customer.kavling.length > 0 ? customer.kavling[0].no_kavling : "",
                    type: customer.kavling.length > 0 ? customer.kavling[0].type : "",
                    luas_bangunan: customer.kavling.length > 0 ? customer.kavling[0].luas_bangunan : "",
                    luas_tanah: customer.kavling.length > 0 ? customer.kavling[0].luas_tanah : "",
                },
                data_pribadi: {
                    namaLengkap: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].namaLengkap : "",
                    tempat_lahir: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].tempat_lahir : "",
                    tanggal_lahir: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].taggal_lahir : "",
                    jenis_kelamin: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].jenis_kelamin : "",
                    pekerjaan: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].pekerjaan : "",
                    alamat: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].alamat : "",
                    no_identitas: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].no_identitas : "",
                    no_kontak: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].no_kontak : "",
                    no_wa: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].no_wa : "",
                    email: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].email : "",
                    status_tempat_tinggal: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].status_tempat_tinggal : "",
                    status_pernikahan: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].status_pernikahan : "",
                    npwp: customer.data_pribadi.length > 0 ? customer.data_pribadi[0].npwp : "",
                },
                pekerjaan: {
                    jenis_pekerjaan: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].jenis_pekerjaan : "",
                    jabatan: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].jabatan : "",
                    status_pekerjaan: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].status_pekerjaan : "",
                    nama_instansi: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].nama_instansi : "",
                    no_telpon_instansi: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].no_telpon_instansi : "",
                    no_fax: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].no_fax : "",
                    penghasilan_tetap: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].penghasilan_tetap : "",
                    penghasilan_tambahan: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].penghasilan_tambahan : "",
                    pengeluaran_perbulan: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].pengeluaran_perbulan : "",
                    sumber_penghasilan_tambahan: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].sumber_penghasilan_tambahan : "",
                    jenis_usaha: customer.pekerjaan.length > 0 ? customer.pekerjaan[0].jenis_usaha : "",
                },
                customerFiles: {
                    ktp: customer.customerFile[0].ktp,
                    npwp: customer.customerFile[0].npwp,
                    kk: customer.customerFile[0].kk,
                    slip_gaji: customer.customerFile[0].slip_gaji,
                    buku_nikah: customer.customerFile[0].buku_nikah,
                    pas_foto: customer.customerFile[0].pas_foto,
                }
            };
            this.filterHousesByBlock();
            this.isCustomerModalVisible = true;
        },

        async submitCustomerForm() {
            try {
                const formData = new FormData();
                formData.append("data_pribadi", JSON.stringify(this.customerForm.data_pribadi));
                formData.append("pekerjaan", JSON.stringify(this.customerForm.pekerjaan));
                Object.keys(this.customerForm.customerFiles).forEach(key => {
                    if (this.customerForm.customerFiles[key]) {
                        formData.append(key, this.customerForm.customerFiles[key]);
                    }
                });

                await CustomerService.update(this.customers[0]._id, formData);
                this.isCustomerModalVisible = false;
                this.fetchCustomers();
            } catch (error) {
                console.error("Error updating customer data:", error);
            }
        },

        closeCustomerModal() {
            this.isCustomerModalVisible = false;
        },
    },
};
</script>