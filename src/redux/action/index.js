import { CHANGE_MENU, LOGIN, LOGOUT } from './actionType'

export const changeMenu = (menuName) => {
    return {
        type: CHANGE_MENU,
        menuName
    }
}

export const login = (userInfo) => {
    return {
        type:LOGIN,
        userInfo
    }
}

export const logout = () => {
    return {
        type:LOGOUT
    }
}