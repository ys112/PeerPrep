import { UserRoomCreatedData } from "@common/shared-types";
import { createAuthAxiosInstance } from "./axios";

const roomAxios = createAuthAxiosInstance(
  import.meta.env.VITE_COLLABORATION_SERVICE_API_URL
);

const ROOM_API_URL = "/room";

const getRoom = async (roomId: string): Promise<UserRoomCreatedData> => {
  try {
    const response = await roomAxios.get(ROOM_API_URL + `/${roomId}`);
    console.log("Room fetched: ", response.data.data);
    return response.data.data as UserRoomCreatedData;
  } catch (error) {
    console.error("Error fetching room: ", error);
    throw error;
  }
};

export const roomClient = {
  getRoom,
};
