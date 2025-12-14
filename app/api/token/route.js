import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
export async function POST(request) {
    try{
        const {userId} = await request.json();

        if(!apiKey || !apiSecret){
            return Response.json(
                {error: "API key or secret not configured"},
                {status: 500}
            );
        }
        const serverClient = new StreamClient(apiKey, apiSecret);

        const newUser = {   
            id: userId,
            role: "admin",
            name: userId,
        };
        await serverClient.upsertUsers([newUser]);
        const now=Math.floor(Date.now()/1000);
        const validity=60*60*24; // 7 days
        const token = serverClient.generateUserToken({
            user_id:userId,
            validity_in_seconds:validity,
            iat:now-60,
        });

        return Response.json(
            {token}
        );
    } 
    
    catch(err){
        console.error("Error generating token:", err);
        return Response.json(
            {error: "failed to generate token"},
            {status: 500}
        );
    }
}