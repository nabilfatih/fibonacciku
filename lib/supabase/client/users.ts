import supabaseClient from ".";
import type { GeoLocation, UserRole } from "@/types/types";

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("email", email);

  if (error) {
    throw error;
  }

  return data[0] ? data[0] : null;
};

// TODO: Chat
export const deleteUserChat = async (userId: string) => {
  const { error } = await supabaseClient
    .from("chat")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const { error } = await supabaseClient
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) {
    throw error;
  }
};

export const updateUserLang = async (userId: string, lang: string) => {
  const { error } = await supabaseClient
    .from("users")
    .update({ lang })
    .eq("id", userId);

  if (error) {
    throw error;
  }
};

export const updateUserGeoLocation = async (
  userId: string,
  geoLocation: GeoLocation
) => {
  const { error } = await supabaseClient
    .from("users")
    .update({ geo_location: geoLocation })
    .eq("id", userId);

  if (error) {
    throw error;
  }
};

export const updateUserIp = async (userId: string, ip: string) => {
  const { error } = await supabaseClient
    .from("users")
    .update({ ip })
    .eq("id", userId);

  if (error) {
    throw error;
  }
};
