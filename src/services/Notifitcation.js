import Api from "@/services/api";

export default {
  getAll() {
    return Api.get("/notification");
  },
  getByIdRole(idUser) {
    return Api.get(`/notification/role/${idUser}`);
  },
  getByIdMarketing(idUser) {
    return Api.get(`/notification/marketing/${idUser}`);
  },
  getByIdKeuangan(idUser) {
    return Api.get(`/notification/keuangan/${idUser}`);
  },
  getByIddDirektur(idUser) {
    return Api.get(`/notification/direktur/${idUser}`);
  },
  create(data) {
    return Api.post("/notification", data);
  },
  update(id, data) {
    return Api.put(`/notification/edit/${id}`, data);
  },
  delete(id) {
    return Api.delete(`/notification/delete/${id}`);
  },
};
