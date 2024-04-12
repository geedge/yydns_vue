const store = {
    namespaced: true,
    state: {
        startTraffic: false,
        endTraffic: false,
    },
    getters: {
        getStartTraffic: state => state.startTraffic,
        getEndTraffic: state => state.endTraffic
    },
    mutations: {
        setStartTraffic(state, startTraffic) {
            state.startTraffic = startTraffic
        },
        setEndTraffic(state, endTraffic) {
            state.endTraffic = endTraffic
        }
    },
    actions: {
        setStartTrafficAction(context, startTraffic) {
            context.commit('setStartTraffic', startTraffic)
        },
        setEndTrafficAction(context, endTraffic) {
            context.commit('setEndTraffic', endTraffic)
        }
    }
}
export default store