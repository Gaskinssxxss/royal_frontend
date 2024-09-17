<template>
  <div class="relative w-full h-screen p-4 bg-gray-100">
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
                <button @click="openEditCustomerModal(customer)" class="bg-black text-black rounded">
                  <h1
                    class="bg-gray-200 border-2 px-4 py-2 border-black uppercase rounded transition-transform duration-300 ease-linear transform -translate-x-1 -translate-y-1 hover:-translate-x-2 hover:-translate-y-2">
                    Edit
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
    <div v-if="isCustomerModalVisible"
      class="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-4/5 overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">Form Customer Data</h2>
        <form @submit.prevent="submitCustomerForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Blok</label>
            <select v-model="customerForm.id_blok" @change="filterHousesByBlock" required
              class="w-full p-2 border border-gray-300 rounded-lg">
              <option v-for="blok in bloks" :key="blok._id" :value="blok._id">{{ blok.blokname }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">No Rumah</label>
            <select v-model="customerForm.id_rumah" required class="w-full p-2 border border-gray-300 rounded-lg">
              <option v-for="house in filteredHouses" :key="house._id" :value="house._id">{{ house.no_rumah }}</option>
            </select>
          </div>
          <h3 class="text-lg font-semibold mb-2">Kavling</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">No Kavling</label>
              <input v-model="customerForm.kavling.no_kavling" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Type</label>
              <input v-model="customerForm.kavling.type" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Luas Bangunan</label>
              <input v-model="customerForm.kavling.luas_bangunan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Luas Tanah</label>
              <input v-model="customerForm.kavling.luas_tanah" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Data Pribadi</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input v-model="customerForm.data_pribadi.namaLengkap" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tempat Lahir</label>
              <input v-model="customerForm.data_pribadi.tempat_lahir" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tanggal Lahir</label>
              <input v-model="customerForm.data_pribadi.tanggal_lahir" type="date" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Jenis Kelamin</label>
              <select v-model="customerForm.data_pribadi.jenis_kelamin" required
                class="w-full p-2 border border-gray-300 rounded-lg">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Pekerjaan</label>
              <input v-model="customerForm.data_pribadi.pekerjaan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Alamat</label>
              <input v-model="customerForm.data_pribadi.alamat" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">No Identitas</label>
              <input v-model="customerForm.data_pribadi.no_identitas" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">No Kontak</label>
              <input v-model="customerForm.data_pribadi.no_kontak" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">No WhatsApp</label>
              <input v-model="customerForm.data_pribadi.no_wa" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="customerForm.data_pribadi.email" type="email" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status Tempat Tinggal</label>
              <select v-model="customerForm.data_pribadi.status_tempat_tinggal" required
                class="w-full p-2 border border-gray-300 rounded-lg">
                <option value="Milik Pribadi">Milik Pribadi</option>
                <option value="Sewa">Sewa</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status Pernikahan</label>
              <select v-model="customerForm.data_pribadi.status_pernikahan" required
                class="w-full p-2 border border-gray-300 rounded-lg">
                <option value="Menikah">Menikah</option>
                <option value="Belum Menikah">Belum Menikah</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">NPWP</label>
              <input v-model="customerForm.data_pribadi.npwp" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Pekerjaan</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Jenis Pekerjaan</label>
              <input v-model="customerForm.pekerjaan.jenis_pekerjaan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Jabatan</label>
              <input v-model="customerForm.pekerjaan.jabatan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status Pekerjaan</label>
              <input v-model="customerForm.pekerjaan.status_pekerjaan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nama Instansi</label>
              <input v-model="customerForm.pekerjaan.nama_instansi" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">No Telpon Instansi</label>
              <input v-model="customerForm.pekerjaan.no_telpon_instansi" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">No Fax</label>
              <input v-model="customerForm.pekerjaan.no_fax" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Penghasilan Tetap</label>
              <input v-model="customerForm.pekerjaan.penghasilan_tetap" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Penghasilan Tambahan</label>
              <input v-model="customerForm.pekerjaan.penghasilan_tambahan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Pengeluaran Perbulan</label>
              <input v-model="customerForm.pekerjaan.pengeluaran_perbulan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Sumber Penghasilan Tambahan</label>
              <input v-model="customerForm.pekerjaan.sumber_penghasilan_tambahan" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Jenis Usaha</label>
              <input v-model="customerForm.pekerjaan.jenis_usaha" type="text" required
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <h3 class="text-lg font-semibold mb-2">Customer Files</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">KTP</label>
              <div v-if="customers[0].customerFile[0].ktp">
                <img :src="getImageUrl(customers[0].customerFile[0].ktp)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'ktp')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">NPWP</label>
              <div v-if="customers[0].customerFile[0].npwp">
                <img :src="getImageUrl(customers[0].customerFile[0].npwp)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'npwp')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">KK</label>
              <div v-if="customers[0].customerFile[0].kk">
                <img :src="getImageUrl(customers[0].customerFile[0].kk)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'kk')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Slip Gaji</label>
              <div v-if="customers[0].customerFile[0].slip_gaji">
                <img :src="getImageUrl(customers[0].customerFile[0].slip_gaji)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'slip_gaji')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Buku Nikah</label>
              <div v-if="customers[0].customerFile[0].buku_nikah">
                <img :src="getImageUrl(customers[0].customerFile[0].buku_nikah)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'buku_nikah')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Pas Foto</label>
              <div v-if="customers[0].customerFile[0].pas_foto">
                <img :src="getImageUrl(customers[0].customerFile[0].pas_foto)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'pas_foto')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeCustomerModal"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Submit & Lanjutkan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerService from "@/services/custumerApi.js"
import houseApi from "@/services/houseApi.js"
import Swal from 'sweetalert2';
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
      isCustomerModalVisible: false,
      bloks: [],
      houses: [],
      filteredHouses: [],
      customerForm: {
        id_blok: "",
        id_rumah: "",
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
    handleFileUpload(event, field) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.customerForm.customerFiles[field] = files[0];
      } else {
        console.error(`No files selected for field: ${field}`);
      }
    },

    getImageUrl(filePath) {
      return `http://192.168.1.10:3000/${filePath}`;
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
        const response = await CustomerService.getAll();
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
    searchCustomer() {
      this.customers = [];
      if (this.selectedBlokname == 'semua') {
        this.fetchCustomers();
        return;
      }
      if (this.selectedBlokname.length > 0) {
        CustomerService.searchCustomerByBlokname(this.selectedBlokname)
          .then(res => {
            if (res.data.data.length > 0) {
              this.customers = res.data.data;
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
  },
};
</script>