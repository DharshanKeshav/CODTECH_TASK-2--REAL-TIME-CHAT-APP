import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string | null;
  is_private: boolean;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    avatar: string;
    chat_id: string;
  };
}

interface Profile {
  id: string;
  user_id: string;
  username: string;
  chat_id: string;
  avatar: string;
  status: string | null;
  is_online: boolean | null;
}

interface Crumb {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profile?: {
    username: string;
    avatar: string;
  };
}

export const useRealtimeChat = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    if (!profile) return;

    setLoading(true);

    // Fetch public messages
    const { data: publicMessages } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, avatar, chat_id)
      `)
      .eq("is_private", false)
      .order("created_at", { ascending: true })
      .limit(100);

    // Fetch private messages for current user
    const { data: privateMessages } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, avatar, chat_id)
      `)
      .eq("is_private", true)
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .order("created_at", { ascending: true })
      .limit(100);

    const allMessages = [...(publicMessages || []), ...(privateMessages || [])].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    setMessages(allMessages);

    // Fetch all users except current
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", profile.id)
      .order("is_online", { ascending: false });

    setUsers(usersData || []);

    // Fetch crumbs
    const { data: crumbsData } = await supabase
      .from("crumbs")
      .select(`
        *,
        profile:profiles!crumbs_user_id_fkey(username, avatar)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    setCrumbs(crumbsData || []);

    setLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!profile) return;

    let messagesChannel: RealtimeChannel;
    let crumbsChannel: RealtimeChannel;
    let profilesChannel: RealtimeChannel;

    const setupSubscriptions = async () => {
      // Messages subscription
      messagesChannel = supabase
        .channel("messages-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          async (payload) => {
            const newMessage = payload.new as Message;
            
            // Check if message is relevant (public or involves current user)
            if (
              !newMessage.is_private ||
              newMessage.sender_id === profile.id ||
              newMessage.receiver_id === profile.id
            ) {
              // Fetch sender info
              const { data: sender } = await supabase
                .from("profiles")
                .select("id, username, avatar, chat_id")
                .eq("id", newMessage.sender_id)
                .single();

              setMessages((prev) => [
                ...prev,
                { ...newMessage, sender: sender || undefined },
              ]);
            }
          }
        )
        .subscribe();

      // Crumbs subscription
      crumbsChannel = supabase
        .channel("crumbs-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "crumbs",
          },
          async (payload) => {
            const newCrumb = payload.new as Crumb;
            
            // Fetch profile info
            const { data: crumbProfile } = await supabase
              .from("profiles")
              .select("username, avatar")
              .eq("id", newCrumb.user_id)
              .single();

            setCrumbs((prev) => [
              { ...newCrumb, profile: crumbProfile || undefined },
              ...prev,
            ]);
          }
        )
        .subscribe();

      // Profiles subscription for online status
      profilesChannel = supabase
        .channel("profiles-realtime")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
          },
          (payload) => {
            const updatedProfile = payload.new as Profile;
            if (updatedProfile.id !== profile.id) {
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === updatedProfile.id ? updatedProfile : u
                )
              );
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "profiles",
          },
          (payload) => {
            const newProfile = payload.new as Profile;
            if (newProfile.id !== profile.id) {
              setUsers((prev) => [...prev, newProfile]);
            }
          }
        )
        .subscribe();
    };

    setupSubscriptions();

    return () => {
      if (messagesChannel) supabase.removeChannel(messagesChannel);
      if (crumbsChannel) supabase.removeChannel(crumbsChannel);
      if (profilesChannel) supabase.removeChannel(profilesChannel);
    };
  }, [profile]);

  const sendMessage = async (
    message: string,
    receiverId?: string,
    isPrivate = false
  ) => {
    if (!profile) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: profile.id,
      receiver_id: receiverId || null,
      message,
      is_private: isPrivate,
    });

    return { error };
  };

  const sendCrumb = async (status: string) => {
    if (!profile) return;

    const { error } = await supabase.from("crumbs").insert({
      user_id: profile.id,
      status,
    });

    return { error };
  };

  const searchUserByChatId = async (chatId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("chat_id", chatId)
      .maybeSingle();

    return { data, error };
  };

  return {
    messages,
    users,
    crumbs,
    loading,
    sendMessage,
    sendCrumb,
    searchUserByChatId,
    refetch: fetchInitialData,
  };
};
