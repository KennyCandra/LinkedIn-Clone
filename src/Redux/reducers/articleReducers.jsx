import * as actions from "../actions/actionTypes";

export const initialState = {
  loading: false,
  articles: [],
};

const articlesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return {
        ...state,
        loading: action.status,
      };

    case actions.GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
      };

    case actions.ADD_COMMENT:
      const updatedArticles = state.articles.map((article) => {
        if (article.id === action.payload.articleId) {
          return {
            ...article,
            comments: [...article.comments, action.payload],
          };
        } else {
          return article;
        }
      });

      return {
        ...state,
        articles: updatedArticles,
      };

    case actions.REMOVE_COMMENT:
      const updateArticle = state.articles.map((article) => {
        if (article.comments.id === action.commentId) {
          return {
            ...article,
            comments: [
              ...article.comments.filter(
                (comment) => comment.id !== action.payload.commentId
              ),
            ],
          };
        } else {
          return article;
        }
      });
      return {
        ...state,
        articles: updateArticle,
      };

  
    case actions.EDIT_ARTICLE:
      const articleToEdit = state.articles.map((article, newPost) => {
        if (article.id === action.payload.id) {
          return {
            ...article,
            description: newPost,
          };
        } else {
          return article;
        }
      });
      return {
        ...state,
        articles: articleToEdit,
      };

      case actions.ADD_LIKE:
        const newUpdatedArticles = state.articles.map((article) => {
          if (article.id === action.payload.articleId) {
            return {
              ...article,
              likes: [...article.likes, action.payload],
            };
          } else {
            return article;
          }
        });
  
        return {
          ...state,
          articles: newUpdatedArticles,
        };

    default:
      return state;
  }
};

export default articlesReducer;
