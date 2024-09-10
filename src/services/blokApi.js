import Api from "@/services/api";

export default {
  getAll() {
    return Api.get("/blok");
  },
  getById(id) {
    return Api.get(`/blok/${id}`);
  },
  create(data) {
    return Api.post("/blok", data);
  },
  update(id, data) {
    return Api.put(`/blok/edit/${id}`, data);
  },
  delete(id) {
    return Api.delete(`/blok/delete/${id}`);
  },
};
