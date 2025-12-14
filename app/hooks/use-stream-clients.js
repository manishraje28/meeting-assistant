import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react"; 

export function useStreamClients({ apiKey, user, token }) {
    const [videoClient, setVideoClient] = useState(null);
    const [chatClient, setChatClient] = useState(null);

    useEffect(() => {

        if (!user || !token || !apiKey) return;

        let isMounted = true;

        const initClients = async () => {
            try {

                const tokenProvider = () => Promise.resolve(token);

                const myVideoClient = new StreamVideoClient({
                    apiKey,
                    tokenProvider,
                    user,
                });

                const myChatClient = StreamChat.getInstance(apiKey);
                await myChatClient.connectUser(user, token);

                if (isMounted) {
                    setVideoClient(myVideoClient);
                    setChatClient(myChatClient);
                }

            } catch (err) {
                console.error("Error initializing Stream clients:", err);
            }
        };

        initClients();

        return () => {
            isMounted = false;
            if (chatClient) {
                chatClient.disconnectUser().catch(console.error);
            }

            if (videoClient) {
                videoClient.disconnect().catch(console.error);
            }

        };
    }, [apiKey, user, token]);

    return { videoClient, chatClient };



}



