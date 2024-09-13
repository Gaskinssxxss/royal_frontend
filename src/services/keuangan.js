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
    return Api.put(`/keuangan/${id}`, data);
  },
  delete(id) {
    return Api.delete(`/keuangan/${id}`);
  },
};
