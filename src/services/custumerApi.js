import Api from "@/services/api";

export default {
  getAll() {
    return Api.get("/customer");
  },
  getById(id) {
    return Api.get(`/customer/${id}`);
  },
  getUnverifiedCustomers() {
    return Api.get("/unverified-customers");
  },
  getVerifiedCustomers() {
    return Api.get("/verified-customers");
  },
  create(data) {
    return Api.post("/customer", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update(id, data) {
    return Api.put(`/customer/edit/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateVerificationStatus(id) {
    return Api.put(`/verifikasi/${id}`, { verifikasi_data: true });
  },
  cancelVerificationStatus(id) {
    return Api.put(`/verifikasi/batal/${id}`, { verifikasi_data: false });
  },
  updateHouseStatus(id) {
    return Api.put(`/update-house-status/${id}`, { status_rumah: false });
  },
  delete(id) {
    return Api.delete(`/customer/delete/${id}`);
  },
};
