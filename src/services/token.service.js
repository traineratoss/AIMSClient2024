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

export {
    invalidateTokens,
    isAccessTokenExpired,
    isRefreshTokenExipred,
    setTokenExpiry,
}