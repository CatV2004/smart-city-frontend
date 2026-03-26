import api from "@/lib/axios";

export const reverseGeocodeApi = async (
    lat: number,
    lng: number
) => {
    const res = await api.get("/geocode/reverse", {
        params: { lat, lng },
    });

    return res.data;
};