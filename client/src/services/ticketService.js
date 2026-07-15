import api from "./api";

export const getTicketsForEvent = async (eventId) => {
  const response = await api.get(`/events/${eventId}/tickets`);
  return response.data;
};