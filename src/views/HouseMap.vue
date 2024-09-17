<template>
  <div>
    <div v-if="showChoose" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="relative bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="absolute top-2 right-2">
          <button @click="closed" class="text-gray-600 hover:text-black text-xl">✖</button>
        </div>
        <div class="mt-8 mb-4">
          <button @click="bookHouse" class="px-4 py-2 bg-blue-500 text-white rounded-lg">
            <h1>Booking</h1>
          </button>
        </div>
        <div>
          <button @click="forms" class="px-4 py-2 bg-green-500 text-white rounded-lg">
            <h1>Isi Form</h1>
          </button>
        </div>
      </div>
    </div>

    <div v-if="validationForm" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="relative bg-white p-6 rounded-lg shadow-lg text-center">
        <div>
          <div class="absolute top-2 right-2">
            <button @click="closed" class="text-gray-600 hover:text-black text-xl">✖</button>
          </div>
          <div>
            <h1>Apakah Anda Yakin Ingin Membooking?</h1>
          </div>
        </div>
        <div class="flex justify-around mt-6">
          <div>
            <button @click="no" class="px-4 py-2 bg-green-500 text-white rounded-lg">
              <h1>Cance</h1>
            </button>
          </div>
          <div>
            <button @click="yes" class="px-4 py-2 bg-blue-500 text-white rounded-lg">
              <h1>Yes</h1>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isCustomerModalVisible"
      class="fixed inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl h-4/5 overflow-y-auto">
        <h1 class="text-lg font-semibold mb-4">Form Customer Data</h1>
        <form @submit.prevent="submitCustomerForm">
          <div>
            <label class="block text-sm font-medium mb-1">No STR</label>
            <input v-model="customerForm.nomor_str" type="text" required
              class="w-50 p-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Blok</label>
            <select v-model="customerForm.id_blok" required class="w-full p-2 border border-gray-300 rounded-lg">
              <option v-for="blok in bloks" :key="blok._id" :value="blok._id">{{ blok.blokname }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">No Rumah</label>
            <select v-model="customerForm.id_rumah" required class="w-full p-2 border border-gray-300 rounded-lg">
              <option v-for="house in houses" :key="house._id" :value="house._id">{{ house.no_rumah }}</option>
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
              <input v-model="customerForm.data_pribadi.taggal_lahir" type="date" required
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
              <input type="file" @change="onFileChange($event, 'ktp')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">NPWP</label>
              <input type="file" @change="onFileChange($event, 'npwp')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">KK</label>
              <input type="file" @change="onFileChange($event, 'kk')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Slip Gaji</label>
              <input type="file" @change="onFileChange($event, 'slip_gaji')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Buku Nikah</label>
              <input type="file" @change="onFileChange($event, 'buku_nikah')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Pas Foto</label>
              <input type="file" @change="onFileChange($event, 'pas_foto')"
                class="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <h4 class="text-lg mb-2 font-normal">Tipe Pembayaran</h4>
          <div class="pt-2 pb-4">
            <select v-model="customerForm.type_pembayaran" required
              class="w-full p-2 border border-gray-300 rounded-lg">
              <option value="kpr">KPR</option>
              <option value="cash">CASH</option>
            </select>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeCustomerModal"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <div class="w-full h-screen overflow-auto">
      <div class="flex justify-center items-center -rotate-[30deg]">
        <div ref="svgContainer">
        </div>
      </div>
    </div>

    <div ref="indicator"></div>
    <div v-if="tooltipVisible" :style="tooltipStyle"
      class="absolute bg-gray-800 text-white text-sm p-2 rounded-lg shadow-lg z-20">
      {{ tooltipText }}
    </div>
  </div>

</template>


<script>
import svgPanZoom from 'svg-pan-zoom';
import houseApi from '@/services/houseApi';
import blokApi from '@/services/blokApi';
import custumerApi from '@/services/custumerApi';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      svgUrl: '/img/file_with_ids.svg',
      selectedId: null,
      isModalVisible: false,
      isEdit: false,
      tooltipVisible: false,
      tooltipText: '',
      tooltipStyle: {},
      panZoomInstance: null,
      isCustomerModalVisible: false,
      path_id: [],
      path_rumah: [],
      form: {
        id_blok: '',
        id_rumah: '',
        no_rumah: '',
        type_rumah: '',
        status_rumah: true,
      },
      customerForm: {
        id_blok: '',
        id_rumah: '',
        type_pembayaran: '',
        nomor_str: 'HUHBSA2',
        kavling: {
          no_kavling: 'A12',
          type: 'Type 36',
          luas_bangunan: '36 m²',
          luas_tanah: '72 m²'
        },
        data_pribadi: {
          namaLengkap: 'John Doe',
          tempat_lahir: 'Surabaya',
          taggal_lahir: '1990-01-01',
          jenis_kelamin: 'Laki-laki',
          pekerjaan: 'Software Engineer',
          alamat: 'Jalan Merdeka No. 123, Surabaya',
          no_identitas: '3510123456789012',
          no_kontak: '081234567890',
          no_wa: '081234567890',
          email: 'john.doe@example.com',
          status_tempat_tinggal: 'Milik Pribadi',
          status_pernikahan: 'Menikah',
          npwp: '123456789012345'
        },
        pekerjaan: {
          jenis_pekerjaan: 'IT & Software',
          jabatan: 'Senior Developer',
          status_pekerjaan: 'Karyawan Tetap',
          nama_instansi: 'PT Teknologi Indonesia',
          no_telpon_instansi: '0315678901',
          no_fax: '0315678902',
          penghasilan_tetap: '10.000.000',
          penghasilan_tambahan: '2.000.000',
          pengeluaran_perbulan: '5.000.000',
          sumber_penghasilan_tambahan: 'Freelance',
          jenis_usaha: 'IT Services'
        },
        customerFile: {
          ktp: null,
          npwp: null,
          kk: null,
          slip_gaji: null,
          buku_nikah: null,
          pas_foto: null
        }
      },
      bloks: [],
      houses: [],
      userHistory: [],
      selectedCustomer: null,
      show: false,
      showChoose: false,
      validationForm: false
    };
  },
  mounted() {
    this.loadSvg();
    this.fetchBloks();
    this.fetchHouses();
  },
  methods: {
    closed() {
      this.showChoose = false;
      this.validationForm = false;
    },
    forms() {
      this.isCustomerModalVisible = true;
      this.handleClick(this.path_id, this.path_rumah);
      this.showChoose = false
    },
    async yes() {
      this.loadHouseData(this.path_id, this.path_rumah.id_blok);
      console.log(this.path_rumah._id);
      if (this.path_rumah.status_rumah === 'deterjual') {
        try {
          const response = await custumerApi.updateHouseStatus(this.path_rumah._id, 'terbooking');
          console.log(response)
          this.showSuccessAlert('Rumah berhasil dibooking');
          this.customerForm.house_info.status_rumah = 'terbooking';
          this.closeCustomerModal();
          this.showChoose = false;
          this.validationForm = false
        } catch (error) {
          this.showErrorAlert('Gagal membooking rumah');
          console.error('Error booking house:', error);
        }
      } else {
        this.showAlert('Rumah Sudah dibooking, mohon cari rumah yang lain.', 'info');
      }
    },
    no() {
      this.validationForm = false
    },
    async bookHouse() {
      this.validationForm = true
    },
    onFileChange(event, fieldName) {
      const file = event.target.files[0];
      this.customerForm.customerFile[fieldName] = file;
    },
    async loadSvg() {
      try {
        const response = await fetch(this.svgUrl);
        const svgText = await response.text();

        if (this.$refs.svgContainer) {
          this.$refs.svgContainer.innerHTML = svgText;
          this.addSvgEventListeners();
          this.initializePanZoom();
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      }
    },
    async fetchHouses() {
      houseApi.getAll()
        .then((response) => {
          this.houses = response.data.data;
          this.addSvgEventListeners();
        })
        .catch((error) => {
          console.error('Error fetching houses:', error);
        });
    },
    addSvgEventListeners() {
      const paths = this.$refs.svgContainer.querySelectorAll('path');
      paths.forEach((path) => {
        const id = path.getAttribute('id');
        if (id) {
          const house = this.houses.find((h) => h.id_rumah === id);

          if (house && house.status_rumah === "deterjual") {
            path.classList.add('fill-green-500');
          } else if (house && house.status_rumah === "terbooking") {
            path.classList.add('fill-gray-500');
          } else if (house && house.status_rumah === "terjual") {
            path.classList.add('fill-che');
          } else if (house && house.status_rumah === "cash") {
            path.classList.add('fill-maryjane');
          } else if (house && house.status_rumah === "kpn") {
            path.classList.add('fill-blue-600');
          }

          path.classList.add(
            'cursor-pointer',
            'stroke-black',
            'stroke-1.5',
            'transition-all',
            'duration-300',
            'ease-in-out'
          );

          path.addEventListener('mouseover', () => {
            this.handleMouseOver(path, id);
          });

          path.addEventListener('mouseout', () => {
            this.handleMouseOut(path);
          });

          path.addEventListener('click', () => {
            if (house && house.status_rumah === "deterjual") {
              this.showChoose = true
              this.path_id = id;
              this.path_rumah = house;
              console.log(this.path_id)
            } else if (house && house.status_rumah === "terbooking") {
              this.showChoose = true
              this.path_id = id;
              this.path_rumah = house;
            } else if (house && house.status_rumah === "terjual") {
              this.showAlert('Rumah Sudah Terjual', 'info');
            } else if (house && house.status_rumah === "cash") {
              this.showAlert('Rumah Sudah Terjual Cash', 'info');
            } else if (house && house.status_rumah === "kpr") {
              this.showAlert('Rumah Sudah Terjual Kpr', 'info');
            }
            //console.log(this.path_rumah)
            // this.handleClick(id, house);
          });
        }
      });
    },
    handleMouseOver(path, id) {
      const house = this.houses.find(house => house.id_rumah === id);

      if (house) {
        const blok = this.bloks.find(blok => blok._id === house.id_blok);
        this.tooltipText = `Blok: ${blok ? blok.blokname : 'Tidak Ditemukan'}\n No Rumah: ${house.no_rumah}\n Type Rumah: ${house.type_rumah}`;
      } else {
        this.tooltipText = `Informasi rumah tidak ditemukan \n ID:${id}`;
      }

      const { top, left, width } = path.getBoundingClientRect();
      this.tooltipStyle = {
        top: `${top - 40 + window.scrollY}px`,
        left: `${left + width / 2 + window.scrollX}px`,
      };

      this.tooltipVisible = true;
      this.selectedId = id;
    }
    ,
    handleMouseOut(path) {
      path.classList.remove('stroke-yellow-500');
      this.tooltipVisible = false;
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
    handleClick(id, house) {
      this.selectedId = id;
      if (house && house.status_rumah === "deterjual") {
        this.customerForm.id_rumah = house._id;
        this.customerForm.id_blok = house.id_blok;
        this.closeModal();
        this.loadHouseData(id, house.id_blok);
      } else if (house && house.status_rumah === "terjual") {
        this.showAlert('Rumah Sudah Terjual', 'info');
        this.closeModal();
      } else if (house && house.status_rumah === "cash") {
        this.showAlert('Rumah Sudah Terjual Cash', 'info');
        this.closeModal();
      } else if (house && house.status_rumah === "kpr") {
        this.showAlert('Rumah Dalam KPR', 'info');
        this.closeModal();
      } else if (house && house.status_rumah === "terbooking") {
        this.customerForm.id_rumah = house._id;
        this.customerForm.id_blok = house.id_blok;
        this.closeModal();
        this.loadHouseData(id, house.id_blok);
      }
    },
    openModal() {
      this.isModalVisible = true;
      this.form.id_rumah = this.selectedId;
    },
    closeModal() {
      this.isModalVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        id_blok: '',
        id_rumah: '',
        no_rumah: '',
        type_rumah: '',
        status_rumah: true,
      };
      this.isEdit = false;
    },
    loadHouseData(id, id_blok) {
      houseApi.getById(id)
        .then((response) => {
          this.customerForm.house_info = response.data.data;
          this.loadBlokData(id_blok);
        })
        .catch((error) => {
          console.error("Error fetching house data:", error);
        });
    },
    loadBlokData(id_blok) {
      blokApi.getById(id_blok)
        .then((response) => {
          this.customerForm.blokname = response.data.data.blokname;
          //this.isCustomerModalVisible = true;
          //this.isModalVisible = false;
        })
        .catch((error) => {
          console.error("Error fetching blok data:", error);
        });
    },
    async submitCustomerForm() {
      try {
        const formData = new FormData();

        if (!this.customerForm.id_blok || !this.customerForm.id_rumah) {
          throw new Error("ID Blok dan ID Rumah wajib diisi.");
        }
        formData.append("id_blok", this.customerForm.id_blok);
        formData.append("id_rumah", this.customerForm.id_rumah);
        formData.append("type_pembayaran", this.customerForm.type_pembayaran)
        formData.append("nomor_str", this.customerForm.nomor_str)
        if (!this.customerForm.kavling) {
          throw new Error("Data Kavling wajib diisi.");
        }
        formData.append("kavling", JSON.stringify([this.customerForm.kavling]));

        if (!this.customerForm.data_pribadi) {
          throw new Error("Data Pribadi wajib diisi.");
        }
        formData.append("data_pribadi", JSON.stringify([this.customerForm.data_pribadi]));

        if (!this.customerForm.pekerjaan) {
          throw new Error("Data Pekerjaan wajib diisi.");
        }
        formData.append("pekerjaan", JSON.stringify([this.customerForm.pekerjaan]));

        for (let fileKey in this.customerForm.customerFile) {
          formData.append(fileKey, this.customerForm.customerFile[fileKey]);
        }

        await custumerApi.create(formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        this.showSuccessAlert('Form berhasil dikirim!');
        this.closeCustomerModal();
      } catch (error) {
        this.showErrorAlert('Form gagal dikirim!');
        console.error(error);
      }
    }
    ,
    closeCustomerModal() {
      this.isCustomerModalVisible = false;
      this.resetCustomerForm();
    },
    resetCustomerForm() {
      this.customerForm = {
        id_blok: '',
        id_rumah: '',
        kavling: {
          no_kavling: '',
          type: '',
          luas_bangunan: '',
          luas_tanah: ''
        },
        data_pribadi: {
          namaLengkap: '',
          tempat_lahir: '',
          taggal_lahir: '',
          jenis_kelamin: '',
          pekerjaan: '',
          alamat: '',
          no_identitas: '',
          no_kontak: '',
          no_wa: '',
          email: '',
          status_tempat_tinggal: '',
          status_pernikahan: '',
          npwp: ''
        },
        pekerjaan: {
          jenis_pekerjaan: '',
          jabatan: '',
          status_pekerjaan: '',
          nama_instansi: '',
          no_telpon_instansi: '',
          no_fax: '',
          penghasilan_tetap: '',
          penghasilan_tambahan: '',
          pengeluaran_perbulan: '',
          sumber_penghasilan_tambahan: '',
          jenis_usaha: ''
        }
      };
      this.path_id = null;
      this.path_rumah = null;
    },
    fetchBloks() {
      blokApi.getAll()
        .then((response) => {
          this.bloks = response.data.data;
        })
        .catch((error) => {
          console.error('Error fetching bloks:', error);
        });
    }, submitForm() {
      if (this.isEdit) {
        houseApi
          .update(this.selectedId, this.form)
          .then(() => {
            this.closeModal();
          })
          .catch((error) => {
            console.error('Error updating house:', error);
          });
      } else {
        houseApi
          .create(this.form)
          .then(() => {
            this.closeModal();
          })
          .catch((error) => {
            console.error('Error creating house:', error);
          });
      }
    },
    initializePanZoom() {
      const svgElement = this.$refs.svgContainer.querySelector('svg');

      svgElement.setAttribute('width', '1200px');  // Atur lebar sesuai kebutuhan
      svgElement.setAttribute('height', '1200px'); // Atur tinggi sesuai kebutuhan

      if (svgElement) {
        this.panZoomInstance = svgPanZoom(svgElement, {
          zoomEnabled: true,
          // controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.5,
          maxZoom: 10,
        });

        this.panZoomInstance.zoom(0.8);
      }
    },
  },
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
