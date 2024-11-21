import axios from "axios";

// Action Types
export const FETCH_TEXTS_REQUEST = "FETCH_TEXTS_REQUEST";
export const FETCH_TEXTS_SUCCESS = "FETCH_TEXTS_SUCCESS";
export const FETCH_TEXTS_FAILURE = "FETCH_TEXTS_FAILURE";

export const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
export const SET_SORT_ORDER = "SET_SORT_ORDER";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";

export const PROCESS_TEXT_REQUEST = "PROCESS_TEXT_REQUEST";
export const PROCESS_TEXT_SUCCESS = "PROCESS_TEXT_SUCCESS";
export const PROCESS_TEXT_FAILURE = "PROCESS_TEXT_FAILURE";

export const SET_TEXT = "SET_TEXT";

// Action Creators
export const fetchTexts =
  (page, limit, search, sortOrder) => async (dispatch) => {
    dispatch({ type: FETCH_TEXTS_REQUEST });
    try {
      const response = await axios.get(
        "http://localhost:3000/token/saved-texts",
        {
          params: { page, limit, search, sortOrder },
        }
      );
      dispatch({
        type: FETCH_TEXTS_SUCCESS,
        payload: {
          texts: response.data.texts,
          totalCount: response.data.totalCount,
        },
      });
    } catch (error) {
      dispatch({ type: FETCH_TEXTS_FAILURE, payload: error.message });
    }
  };

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});
export const setSortOrder = (order) => ({
  type: SET_SORT_ORDER,
  payload: order,
});
export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const processText = (text) => async (dispatch) => {
  dispatch({ type: PROCESS_TEXT_REQUEST });
  try {
    const response = await axios.post("http://localhost:3000/token/process", {
      text,
    });
    dispatch({
      type: PROCESS_TEXT_SUCCESS,
      payload: {
        filePath: response.data.filePath,
        count: response.data.count,
      },
    });
  } catch (error) {
    dispatch({ type: PROCESS_TEXT_FAILURE, payload: error.message });
  }
};

export const setText = (text) => ({ type: SET_TEXT, payload: text });
