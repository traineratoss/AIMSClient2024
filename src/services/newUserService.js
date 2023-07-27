const API_URL = 'http://localhost:8080/api/test/';
import authHeader from './auth-header';

async function getPublicContent(){
    const response = await fetch(API_URL+'all');
    return response.json()
}


// it works !!!

async function getUserBoard() {
    const response = await fetch(API_URL+'user', {
        headers: authHeader() 
    });
    return response.json();
}

export {
    getPublicContent,
    getUserBoard
}