import { LOGIN } from "../actionTypes.js"

const initialState = {
    token: localStorage.getItem("token"),
    user: null,
    isLoggedIn: false
}

function authReducer(state = initialState, action) {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                token: action.token,
                user: action.user,
                isLoggedIn: true
            }
        
        default:
            return state
    }
}

export default authReducer