export async function subscribeUser(ideaId, userId) {
    const response = await fetch(`http://localhost:8080/aims/api/v1/ideas/addSubscription?ideaId=${ideaId}&userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}

export async function unsubscribeUser(ideaId, userId) {
    const response = await fetch(`http://localhost:8080/aims/api/v1/ideas/deleteSubscription?ideaId=${ideaId}&userId=${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.text();
    return data;
}

export async function getSubscriptions(userId) {
    const response = await fetch(`http://localhost:8080/aims/api/v1/ideas/getAllSubscriptions?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}
