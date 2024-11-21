import {
  FETCH_TEXTS_REQUEST,
  FETCH_TEXTS_SUCCESS,
  FETCH_TEXTS_FAILURE,
  SET_SEARCH_QUERY,
  SET_SORT_ORDER,
  SET_CURRENT_PAGE,
  PROCESS_TEXT_REQUEST,
  PROCESS_TEXT_SUCCESS,
  PROCESS_TEXT_FAILURE,
  SET_TEXT,
} from "../actions/appActions";

const initialState = {
  texts: [],
  totalCount: 0,
  searchQuery: "",
  sortOrder: "newest",
  currentPage: 1,
  itemsPerPage: 10,
  text: "",
  count: null,
  pdfFileName: "",
  status: "idle",
  error: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TEXTS_REQUEST:
      return { ...state, status: "loading", error: null };
    case FETCH_TEXTS_SUCCESS:
      return {
        ...state,
        status: "succeeded",
        texts: action.payload.texts,
        totalCount: action.payload.totalCount,
      };
    case FETCH_TEXTS_FAILURE:
      return { ...state, status: "failed", error: action.payload };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SET_SORT_ORDER:
      return { ...state, sortOrder: action.payload };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case PROCESS_TEXT_REQUEST:
      return { ...state, status: "processing", error: null };
    case PROCESS_TEXT_SUCCESS:
      return {
        ...state,
        status: "succeeded",
        pdfFileName: action.payload.filePath.split("\\").pop(),
        count: action.payload.count,
      };
    case PROCESS_TEXT_FAILURE:
      return { ...state, status: "failed", error: action.payload };
    case SET_TEXT:
      return { ...state, text: action.payload };
    default:
      return state;
  }
};

export default appReducer;
