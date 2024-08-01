import { nativeFetch } from "../main";

const refreshDelaySeconds = -3;

const setTokenExpiry = (accessTokenExpiryDate, refreshTokenExpiryDate) => {
    localStorage.setItem("accessTokenExpiryDate", new Date(accessTokenExpiryDate));
    localStorage.setItem("refreshTokenExpiryDate", new Date(refreshTokenExpiryDate));
}

const isAccessTokenExpired = () => {
    return getCurrentDateWithDelay(refreshDelaySeconds) >= new Date(localStorage.getItem("accessTokenExpiryDate")) &&
        localStorage.getItem("accessTokenExpiryDate") !== null;
}

const isRefreshTokenExipred = () => {
    return getCurrentDateWithDelay(refreshDelaySeconds) >= new Date(localStorage.getItem("refreshTokenExpiryDate")) &&
        localStorage.getItem("refreshTokenExpiryDate") !== null;
}

const getCurrentDateWithDelay = (delayInSeconds) => {
    return new Date(new Date().getTime() + (delayInSeconds * 1000));
}

const invalidateTokens = () => {
    localStorage.clear("accessTokenExpiryDate");
    localStorage.clear("refreshTokenExpiryDate");}

const refreshTokens = async () => {
    try {
        const response = await nativeFetch('http://localhost:8080/api/v1/auth/refresh-token', {
            method: "POST",
            mode: "cors",
            credentials: "include"
        })
        
        const json = await response.json();

        setTokenExpiry(json.accessTokenExpiryDate, json.refreshTokenExpiryDate);

        console.log("Refreshed tokens")
    } catch (error) {
        console.log(error.message);
        await logout();
    }
}

export {
    invalidateTokens,
    isAccessTokenExpired,
    isRefreshTokenExipred,
    refreshTokens,
    setTokenExpiry,
}