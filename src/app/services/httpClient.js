import axios from 'axios'

const httpClient = axios.create({
    // baseURL: 'http://ec2-3-93-247-140.compute-1.amazonaws.com:3000/rapido/api/',
});

export function setDefaultHeader(header, value) {
    httpClient.defaults.headers.common[header] = value
}

export async function apiCall(method, url, data) {
    try {
        return await httpClient({
            method,
            url,
            data,
            // withCredentials: true
        })
    } catch (error) {
        return false
    }
}