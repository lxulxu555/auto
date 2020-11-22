
export const getInfo = (user : object) => {
    return (dispatch : any) => {
        dispatch({
            type: 'userInfo',
            user
        })
    }
}