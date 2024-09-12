<template>
  <div class="relative w-full h-screen p-4 bg-gray-100">
    <!-- Customer List -->
    <div v-if="customers.length > 0">
      <h2 class="text-lg font-semibold mb-4">Customer List</h2>
      <table class="min-w-full border-collapse border-2 border-black text-center">
        <thead>
          <tr>
            <th class="border-2 border-black px-2 py-2">Nama Lengkap</th>
            <th class="border-2 border-black px-2 py-2">Alamat</th>
            <th class="border-2 border-black px-2 py-2">No Kontak</th>
            <th class="border-2 border-black px-2 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer._id">
            <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].namaLengkap }}</td>
            <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].alamat }}</td>
            <td class="border-2 border-black px-2 py-2">{{ customer.data_pribadi[0].no_kontak }}</td>
            <td class="border-2 border-black px-2 py-2">
              <button @click="openEditCustomerModal(customer)" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Edit Data
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Customers Message -->
    <div v-else>
      <p class="text-center">No customers found.</p>
    </div>

     <!-- Edit Customer Data Modal -->
     <div v-if="isCustomerModalVisible"
      class="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-4/5 overflow-y-auto">
        <h2 class="text-lg font-semibold mb-4">Form Customer Data</h2>
        <form @submit.prevent="submitCustomerForm">
          <!-- Blok and No Rumah -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Blok</label>
            <select v-model="customerForm.id_blok" @change="filterHousesByBlock" required class="w-full p-2 border border-gray-300 rounded-lg">
              <option v-for="blok in bloks" :key="blok._id" :value="blok._id">{{ blok.blokname }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">No Rumah</label>
            <select v-model="customerForm.id_rumah" required class="w-full p-2 border border-gray-300 rounded-lg">
              <option v-for="house in filteredHouses" :key="house._id" :value="house._id">{{ house.no_rumah }}</option>
            </select>
          </div>

          <!-- Kavling Section -->
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

          <!-- Data Pribadi Section -->
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

          <!-- Pekerjaan Section -->
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

    
  <!-- Customer Files Section -->
  <h3 class="text-lg font-semibold mb-2">Customer Files</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">KTP</label>
              <div v-if="customers[0].customerFile[0].ktp">
                <img :src="getImageUrl(customers[0].customerFile[0].ktp)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'ktp')" class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">NPWP</label>
              <div v-if="customers[0].customerFile[0].npwp">
                <img :src="getImageUrl(customers[0].customerFile[0].npwp)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'npwp')" class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">KK</label>
              <div v-if="customers[0].customerFile[0].kk">
                <img :src="getImageUrl(customers[0].customerFile[0].kk)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'kk')" class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Slip Gaji</label>
              <div v-if="customers[0].customerFile[0].slip_gaji">
                <img :src="getImageUrl(customers[0].customerFile[0].slip_gaji)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'slip_gaji')" class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Buku Nikah</label>
              <div v-if="customers[0].customerFile[0].buku_nikah">
                <img :src="getImageUrl(customers[0].customerFile[0].buku_nikah)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'buku_nikah')" class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Pas Foto</label>
              <div v-if="customers[0].customerFile[0].pas_foto">
                <img :src="getImageUrl(customers[0].customerFile[0].pas_foto)" class="w-full mb-2">
              </div>
              <input type="file" @change="handleFileUpload($event, 'pas_foto')" class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <!-- Submit Button -->
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
export default {
  data() {
    return {
      customers: [], // List of customers
      isCustomerModalVisible: false, // Controls modal visibility
      bloks: [], // List of blok
      houses: [], // List of houses
      filteredHouses: [], // Houses filtered by blok
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
  },
};
</script>