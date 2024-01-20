const baza = {
  isLoggedIn: false,
  userName: null,
  userId: null,
  baseURL: "http://localhost/NewCode/",
  postURL:"http://localhost:3001/apiPOST",
  getURL: "http://localhost:3001/apiGET",
};

const authReducer = (state = baza, action: { type: any; payload: { baseURL: string; }; }) => {
  switch (action.type) {
    case 'SERVER':
      return {
        ...state,
        baseURL: action.payload.baseURL,
      };
    default:
      return state;
  }
};

export default authReducer;