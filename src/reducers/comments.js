// action types
const INIT_COMMENTS = 'INIT_COMMENTS';
const ADD_COMMENT = 'ADD_COMMENT';
const DELETE_COMMENT = 'DELETE_COMMENT';

//reducer
export default function (state, action) {
    if (!state) {
        state = {comments: []};
    }
    switch (action.type) {
        case INIT_COMMENTS:
            //初始化评论
            return {comments: action.comments};
        case ADD_COMMENT:
            //新增评论
            return {comments: [...state.comments, action.comments]};
        case DELETE_COMMENT:
            //删除评论
            return {
                comments: [
                    ...state.comments.slice(0, action.commentIndex),
                    ...state.comments.slice(action.commentIndex + 1)
                ]
            };
        default:
            return state;
    }

}

//action creators
export const initComments = (comments) => {
    return {type: INIT_COMMENTS, comments};
}

export const addComment = (comments) => {
    return {type: ADD_COMMENT, comments};
}

export const deleteComment = (commentsIndex) => {
    return {type: DELETE_COMMENT, commentsIndex};
}