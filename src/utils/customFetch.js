import { nativeFetch } from "../main";
import { isRefreshTokenExipred, isAccessTokenExpired, setTokenExpiry, refreshTokens } from "../services/token.service"
import { logout } from "../services/user_service"

export const customFetch = async (url, options = {}) => {

    options = {
        ...options,
        mode: "cors",
        credentials: "include",
        headers: {
            ...options.headers, 
            "Session-ID": sessionStorage.getItem("Session-ID")
        }
    }

    if (isRefreshTokenExipred()) {
        await logout();
    }

    if (isAccessTokenExpired()) {
        await refreshTokens();
    }

    const response = await nativeFetch(url, { ...options });

    if (url.includes("http://localhost:8080/users/update-profile")) {
        await refreshTokens();
    }

    return response;
}
