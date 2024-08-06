import { nativeFetch } from "../main";
import { logout } from "./user_service";

const refreshDelaySeconds = -3;

const setTokenExpiry = (accessTokenExpiryDate, refreshTokenExpiryDate) => {
    sessionStorage.setItem("accessTokenExpiryDate", new Date(accessTokenExpiryDate));
    sessionStorage.setItem("refreshTokenExpiryDate", new Date(refreshTokenExpiryDate));
}

const isAccessTokenExpired = () => {
    return getCurrentDateWithDelay(refreshDelaySeconds) >= new Date(sessionStorage.getItem("accessTokenExpiryDate")) &&
        sessionStorage.getItem("accessTokenExpiryDate") !== null;
}

const isRefreshTokenExipred = () => {
    return getCurrentDateWithDelay(refreshDelaySeconds) >= new Date(sessionStorage.getItem("refreshTokenExpiryDate")) &&
        sessionStorage.getItem("refreshTokenExpiryDate") !== null;
}

const getCurrentDateWithDelay = (delayInSeconds) => {
    return new Date(new Date().getTime() + (delayInSeconds * 1000));
}

const invalidateTokens = () => {
    sessionStorage.clear("accessTokenExpiryDate");
    sessionStorage.clear("refreshTokenExpiryDate");}

const refreshTokens = async () => {
    try {
        const response = await nativeFetch('http://localhost:8080/api/v1/auth/refresh-token', {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Session-ID": sessionStorage.getItem("Session-ID")
            }
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