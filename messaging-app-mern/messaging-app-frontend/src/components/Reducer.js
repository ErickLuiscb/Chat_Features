export const initialState = { user: null, cid: null };
export const actionTypes = {
  SET_USER: "SET_USER",
  SET_CID: "SET_CID"
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_CID:
      return {
        ...state,
        cid: action.cid
      };
    default:
      return state;
  }
};
export default reducer;
