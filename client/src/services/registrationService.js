import api from "./api";

export const registerForEvent = async (data) => {
  const response = await api.post("/registrations", data);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await api.get("/registrations/my");
  return response.data;
};

export const checkInAttendee = async (qrCode) => {
  const response = await api.post("/registrations/checkin", { qrCode });
  return response.data;
};

export const downloadAttendanceReport = async (eventId) => {
  const response = await api.get(`/registrations/event/${eventId}/export`, {
    responseType: "blob",
  });

  // Browser mein file download trigger karo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "attendance-report.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};