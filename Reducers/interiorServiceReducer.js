const interiorServiceReducer = (state = {}, action) => {
    switch(action.type) {
        case 'GET_INTERIOR_SERVICE_DATES':
            console.log('Getting interior service dates', action.dates);
            return {state, action}
        case 'GET_INTERIOR_SERVICE_DATES_ERROR':
            console.log('Getting interior service dates error', action.err);
            return {...state.error=true, state};
        case 'UPDATE_INTERIOR_DATES':
                console.log('updated interior service dates', action.dates);
                return {...state.submitted=true, state}
        case 'UPDATE_INTERIOR_DATES_ERROR':
            console.log('error updating interior service dates', action.err);
            return {...state.error=true, state, action}
        default:
            return state;
    }
}
export default interiorServiceReducer
