import { nativeFetch } from "../main";
import { isRefreshTokenExipred, isAccessTokenExpired, setTokenExpiry, refreshTokens } from "../services/token.service"
import { logout } from "../services/user_service"

let wait = false;
let refreshTokensAction = null;

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
        if (!wait) {
            wait = true;
            refreshTokensAction = (async () => {
                try {
                    await refreshTokens();
                } finally {
                    wait = false;
                    refreshTokensAction = null;
                }
            })();
            await refreshTokensAction;
        } else {
            await refreshTokensAction;
        }
    }

    const response = await nativeFetch(url, { ...options });
    
    if (url.includes("http://localhost:8080/users/update-profile")) {
        await refreshTokens();
    }

    return response;
}
