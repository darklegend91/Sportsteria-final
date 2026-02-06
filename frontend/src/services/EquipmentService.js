import api from "./api";

export const getAllEquipments = () => api.get("/api/equipments");
export const getAdminEquipments = () => api.get("/api/equipments");
export const addEquipment = (payload) => api.post("/api/admin/equipments", payload);
export const deleteEquipment = (id) => api.delete(`/api/admin/equipments/${id}`);
export const getStudentEquipments = () => api.get("/api/equipments");