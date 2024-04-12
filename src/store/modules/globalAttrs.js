const store = {
    namespaced: true,
    state: {
        checkMenu:''
    },
    getters: {
        getCheckMenu: state => state.userId
    },
    mutations: {
        setCheckMenu(state, checkMenu){
            state.checkMenu = checkMenu
        }
    },
    actions: {
        setCheckMenuAction(context, checkMenu) {
            context.commit('setCheckMenu', checkMenu)
        }
    }
}
export default store