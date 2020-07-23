import { LOGIN } from "./actionTypes.js"

export function login({ token, user }) {
    localStorage.setItem("token", token)

    return {
        type: LOGIN,
        token,
        user
    }
}