import { CHANGE_MENU, LOGIN, LOGOUT } from '../action/actionType'
const defaultState = {
    menuName:'',
    userInfo:{}
}

export default (state = defaultState, action) => {
    const newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case CHANGE_MENU:
            newState.menuName = action.menuName;
            return newState;
        case LOGIN:
            newState.userInfo = action.userInfo;
            return newState;
        case LOGOUT:
            newState.userInfo = {}
            return newState;
        default:
            return newState;
    }
}