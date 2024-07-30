const setTokenExpiry = (accessTokenExpiryDate, refreshTokenExpiryDate) => {
    localStorage.setItem("accessTokenExpiryDate", new Date(accessTokenExpiryDate));
    localStorage.setItem("refreshTokenExpiryDate", new Date(refreshTokenExpiryDate));
}

const isAccessTokenExpired = () => {
    return Date.now() >= localStorage.getItem("accessTokenExpiryDate");
}

const isRefreshTokenExipred = () => {
    return Date.now() >= localStorage.getItem("refreshTokenExpiryDate");
}

const refreshAuthentication = async () => {
    // TODO
}

export {
    isAccessTokenExpired,
    isRefreshTokenExipred,
    refreshAuthentication,
    setTokenExpiry,
}