import Api from "@/services/api";

export default {
  getAll() {
    return Api.get("/keuangan");
  },
  getById(id) {
    return Api.get(`/keuangan/${id}`);
  },
  getKeuanganCustumerById(id) {
    return Api.get(`/keuangan/customer/${id}`);
  },
  create(data) {
    return Api.post("/keuangan", data);
  },
  update(id, data) {
    return Api.put(`/keuangan/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updatePembayaran(id, data) {
    return Api.put(`/keuangan/pembayaran/${id}`, data);
  },
  delete(id) {
    return Api.delete(`/keuangan/${id}`);
  },
  getKeuanganCustomerStatusDp() {
    return Api.get("/keuangan/status-dp");
  },
  searchKeuanganByBlokname(blokname) {
    return Api.get(`/search-keuangan`, {
      params: { blokname: blokname },
    });
  },
  sendOtp(id) {
    return Api.post(`/keuangan/${id}/send-otp`);
  },
  verifyOtp(id, data) {
    return Api.post(`/keuangan/${id}/verify-otp`, data);
  },
  getTransaksiUntukDirektur() {
    return Api.get("/keuangan/transaksiDirektur");
  },
  getTransaksiUntukDirekturSuccess() {
    return Api.get("/keuangan/transaksiDirektur/success");
  },
};
