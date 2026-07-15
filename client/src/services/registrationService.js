import api from "./api";

export const registerForEvent = async (data) => {
  const response = await api.post("/registrations", data);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get("/registrations/my");
  return response.data;
};