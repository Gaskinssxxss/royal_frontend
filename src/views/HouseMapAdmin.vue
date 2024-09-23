<template>
    <div class="text-2xl absolute right-6 top-4">
        <div class="text-base tracking-wider space-y-2">
            <div class="flex space-x-2">
                <div class="bg-green-500 w-5 h-5 border border-black">
                </div>
                <h1>Available</h1>
            </div>
            <div class="flex space-x-2">
                <div class="bg-che w-5 h-5 pt-3 border border-black">
                </div>
                <h1>Terjual Cash</h1>
            </div>
            <div class="flex space-x-2">
                <div class="bg-iceBlue w-5 h-5 pt-3 border border-black">
                </div>
                <h1>Terjual Kpr</h1>
            </div>
            <div class="flex space-x-2">
                <div class="bg-gray-700 w-5 h-5 pt-3 border border-black">
                </div>
                <h1>Terbookin</h1>
            </div>
            <div class="flex space-x-2">
                <div class="bg-gray-300 w-5 h-5 pt-3 border border-black">
                </div>
                <h1>Terbookin Sementara</h1>
            </div>
        </div>
    </div>
    <div>
        <div class="w-full h-screen overflow-auto">
            <div class="flex justify-center items-center -rotate-[30deg]">
                <div ref="svgContainer">
                </div>
            </div>
        </div>

        <div ref="indicator"></div>

        <div v-if="tooltipVisible" :style="tooltipStyle" class="absolute text-white text-sm p-2 rounded-lg z-20">
            <div v-html="tooltipText"></div>
        </div>

        <!-- <div v-if="tooltipVisible" :style="tooltipStyle"
            class="absolute bg-gray-800 text-white text-sm p-2 rounded-lg shadow-lg z-20">
            {{ tooltipText }}
        </div> -->
    </div>
</template>


<script>
import svgPanZoom from 'svg-pan-zoom';
import houseApi from '@/services/houseApi';
import blokApi from '@/services/blokApi';
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
            bloks: [],
            houses: [],
            HouseandUser: []
        };
    },
    mounted() {
        this.loadSvg();
        this.fetchBloks();
        this.fetchHouses();
        this.fetchCustomers();
    },
    methods: {
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
        fetchCustomers() {
            houseApi.getHouseadnUser()
                .then((response) => {
                    this.HouseandUser = response.data.data;
                })
                .catch((error) => {
                    console.error('Error fetching bloks:', error);
                });

        },
        addSvgEventListeners() {
            const paths = this.$refs.svgContainer.querySelectorAll('path');
            paths.forEach((path) => {
                const id = path.getAttribute('id');
                if (id) {
                    const house = this.houses.find((h) => h.id_rumah === id);
                    const customer = this.HouseandUser.find((house) => house.id_rumah.id_rumah === id);
                    if (house && house.status_rumah === "deterjual") {
                        path.classList.add('fill-green-500');
                    } else if (house && house.status_rumah === "terbooking") {
                        path.classList.add('fill-gray-700');
                    } else if (customer && house && house.status_rumah === "terjual" && customer.type_pembayaran === "cash") {
                        path.classList.add('fill-che');
                    } else if (house && house.status_rumah === "terbooking_sementara") {
                        path.classList.add('fill-gray-300');
                    } else if (customer && house && house.status_rumah === "terjual" && customer.type_pembayaran === "kpr") {
                        path.classList.add('fill-iceBlue');
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
                }
            });
        },
        handleMouseOver(path, id) {
            const house = this.houses.find(house => house.id_rumah === id);
            //console.log(house)
            //console.log(this.HouseandUser.id_rumah)
            if (house) {
                const blok = this.bloks.find(blok => blok._id === house.id_blok);
                const users = this.HouseandUser.find(user => user.id_rumah.id_rumah === id)

                if (users) {
                    this.tooltipText = `
        <div class="bg-white rounded text-black p-4 border-2 border-black text-center">
           <p class="font-normal text-sm">Nama Marketing: <span class="font-normal">${users.id_user.username}</span></p>
            <p class="font-normal text-sm">Type Rumah: <span class="font-normal">${house.type_rumah}</span></p>
            <p class="font-normal text-sm">Blok: <span class="font-normal">${blok ? blok.blokname : 'Tidak Ditemukan'}</span></p>
            <p class="font-normal text-sm">No Rumah: <span class="font-normal">${house.no_rumah}</span></p>
            <p class="font-normal text-sm">Type Pembayaran: <span class="font-normal">${users.type_pembayaran
                        }</span></p>
            <img src="/house.png" alt="House Image" class="w-40 h-40 rounded mb-2">
        </div>
    `;
                } else {
                    this.tooltipText = `
        <div class="bg-white rounded text-black p-4 border-2 border-black text-center">
            <p class="font-normal text-sm">Type Rumah: <span class="font-normal">${house.type_rumah}</span></p>
            <p class="font-normal text-sm">Blok: <span class="font-normal">${blok ? blok.blokname : 'Tidak Ditemukan'}</span></p>
            <p class="font-normal text-sm">No Rumah: <span class="font-normal">${house.no_rumah}</span></p>
            <img src="/house.png" alt="House Image" class="w-40 h-40 rounded mb-2">
        </div>
    `;
                }

            } else {
                this.tooltipText = `<p class="font-normal text-che text-sm">Type Rumah: <span class="font-normal">Tidak Ditemukan!!!</span></p>`
            }

            const { top, left, width } = path.getBoundingClientRect();
            this.tooltipStyle = {
                top: `${top - 100 + window.scrollY}px`,
                left: `${left + width + 40 + window.scrollX}px`,
            };

            this.tooltipVisible = true;
            this.selectedId = id;
        },
        handleMouseOut(path) {
            path.classList.remove('stroke-yellow-500');
            this.tooltipVisible = false;
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
        fetchBloks() {
            blokApi.getAll()
                .then((response) => {
                    this.bloks = response.data.data;
                })
                .catch((error) => {
                    console.error('Error fetching bloks:', error);
                });
        },
        initializePanZoom() {
            const svgElement = this.$refs.svgContainer.querySelector('svg');

            svgElement.setAttribute('width', '1200px');
            svgElement.setAttribute('height', '1200px');

            if (svgElement) {
                this.panZoomInstance = svgPanZoom(svgElement, {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
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
