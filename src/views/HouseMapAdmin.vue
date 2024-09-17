<template>
    <div>
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
        };
    },
    mounted() {
        this.loadSvg();
        this.fetchBloks();
        this.fetchHouses();
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
