export async function subscribeUser(ideaId, userId) {
const url = 'http://localhost:8080/aims/api/v1/ideas/addSubscription';
const params = new URLSearchParams({
    ideaId,
    userId,
});

try {
    const response = await fetch(`${url}?${params.toString()}`, {
    method: 'POST',
    });

    if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with an error: ${errorText}`);
    }

    return await response.json();
} catch (error) {
    console.error('Error subscribing user:', error);
    throw error;
}
}


export async function unsubscribeUser(ideaId, userId) {
const url = 'http://localhost:8080/aims/api/v1/ideas/deleteSubscription';
const params = new URLSearchParams({
    ideaId,
    userId,
});

try {
    const response = await fetch(`${url}?${params.toString()}`, {
    method: 'DELETE',
    });

    if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with an error: ${errorText}`);
    }

    return await response.json();
} catch (error) {
    console.error('Error unsubscribing user:', error);
    throw error;
}
}

export async function getSubscriptions(userId) {
const url = 'http://localhost:8080/aims/api/v1/ideas/getAllSubscriptions';
const params = new URLSearchParams({
    userId,
});

try {
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with an error: ${errorText}`);
    }

    return await response.json();
} catch (error) {
    console.error('Error getting subscriptions:', error);
    throw error;
}
}
  
