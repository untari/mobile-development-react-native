import * as ActionTypes from './ActionTypes';

export const comments = (state = {
    isLoading: true,
    errMess: null,
    comments: []
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_COMMENTS;
            return { ...state, errMess: null, dishes: action.payload};
        case  ActionTypes.COMMENTS_FAILED:
            return { ...state, errMess: action.payload, comments: []};
        case ActionTypes.ADD_COMMENT:
            var comment = action.payload;
            comment.id = state.comments.length;
            return {...state, comments: state.comments.concat(comment)};
        default:
            return state;
    }
}
