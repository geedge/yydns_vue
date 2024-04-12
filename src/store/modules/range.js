const store = {
    namespaced: true,
    state: {
        targetId:'',
        nodeId: ''
    },
    getters: {
        getTargetId: state => state.targetId,
        getNodeId: state => state.nodeId
    },
    mutations: {
        setTargetId(state, targetId) {
            state.targetId = targetId
        },
        setNodeId(state, nodeId) {
            state.nodeId = nodeId
        }
    },
    actions: {
        setTargetIdAction(context, targetId) {
            context.commit('setTargetId', targetId)
        },
        setNodeIdAction(context, nodeId) {
            context.commit('setNodeId', nodeId)
        }
    }
}
export default store