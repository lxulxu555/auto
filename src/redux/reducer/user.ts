const init = {}

export default (state = init,action : any) => {
    switch (action.type) {
        case "userInfo" :
            return action.user
        default :
            return state
    }
}