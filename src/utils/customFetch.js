import nativeFetch from "../main";
import { isRefreshTokenExipred, isAccessTokenExpired, setTokenExpiry } from "../services/token.service"
import { logout } from "../services/user_service"

export const customFetch = async (url, options = {}) => {

    if (isRefreshTokenExipred()) {
        logout();
    }

    if (isAccessTokenExpired()) {
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
            logout();
        }
    }

    const response = await nativeFetch(url, { ...options });

    return response;
}
