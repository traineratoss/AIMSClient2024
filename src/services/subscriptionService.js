import axios from "axios";

export async function subscribeUser(ideaId, userId){
    const response = await axios.post("http://localhost:8080/aims/api/v1/ideas/addSubscription", null, {
    params: {
        ideaId,
        userId
    }
});
    return response.data;
}

export async function unsubscribeUser(ideaId, userId){
    const response = await axios.delete("http://localhost:8080/aims/api/v1/ideas/deleteSubscription",{
        params: {
            ideaId,
            userId
        }
});
    return response.data;
}

export async function getSubscriptions(userId){
    const response = await axios.get("http://localhost:8080/aims/api/v1/ideas/getAllSubscriptions",{
        params: {
            userId,
        }
});
    return reponse.data;
}