import { axiosInstance } from "../main";

export async function subscribeUser(ideaId, userId){
    const response = await axiosInstance.post("http://localhost:8080/aims/api/v1/ideas/addSubscription", null, {
    params: {
        ideaId,
        userId
    }
});
    return response.data;
}

export async function unsubscribeUser(ideaId, userId){
    const response = await axiosInstance.delete("http://localhost:8080/aims/api/v1/ideas/deleteSubscription",{
        params: {
            ideaId,
            userId
        }
});
    return response.data;
}

export async function getSubscriptions(userId){
    const response = await axiosInstance.get("http://localhost:8080/aims/api/v1/ideas/getAllSubscriptions",{
        params: {
            userId,
        }
});
    return response.data;
}