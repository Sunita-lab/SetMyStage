import api from "./api";

export const getOrganizerStats = async () => {
  const response = await api.get("/dashboard/organizer");
  return response.data;
};

export const getAttendeeStats = async () => {
  const response = await api.get("/dashboard/attendee");
  return response.data;
};