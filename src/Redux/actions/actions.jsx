import * as actions from "./actionTypes";

export const setUser = (payload) => {
  return {
    type: actions.SET_USER,
    user: payload,
  };
};

export const setLoading = (status) => {
  return {
    type: actions.SET_LOADING,
    status: status,
  };
};

export const getArticles = (payload) => {
  return {
    type: actions.GET_ARTICLES,
    payload: payload,
  };
};

export const deleteArticle = (payload) => {
  return {
    type: actions.DELETE_ARTICLE,
    payload: payload,
  };
};

export const addComment = (payload) => {
  return {
    type: actions.ADD_COMMENT,
    payload: payload,
  };
};

export const removeComment = (payload) => {
  return {
    type: actions.REMOVE_COMMENT,
    payload: payload,
  };
};

export const editArticle = (payload) => {
  return {
    type: actions.EDIT_ARTICLE,
    payload: payload,
  };
};

export const editComment = (payload) => {
  return {
    type: actions.EDIT_COMMENT,
    payload: payload,
  };
};


export const addLike = (payload) => {
  return {
    type: actions.ADD_LIKE,
    payload: payload,
  };
};
