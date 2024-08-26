import { auth, db, provider, storage } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import * as actions from "./actions";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

export const checkLocalStorage = () => {
  return (dispatch) => {
    try {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        dispatch(actions.setUser(user));
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("user");
    }
  };
};

export const signInAPI = () => {
  return async (dispatch) => {
    try {
      const result = signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
      dispatch(actions.setUser(user));
    } catch (error) {
      console.error(error);
    }
  };
};

export const getUserAuth = () => {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(actions.setUser(user));
      }
    });
  };
};

export const signOutAPI = () => {
  return async (dispatch) => {
    try {
      auth.signOut();
      localStorage.removeItem("user");
      dispatch(actions.setUser(null));
    } catch (error) {
      console.error(error);
    }
  };
};

const uploadImage = async (image) => {
  const storageRef = ref(storage, `images/${image.name}`);
  const uploadRef = await uploadBytesResumable(storageRef, image);
  return getDownloadURL(uploadRef.ref);
};

const createArticleDocument = async (articleData) => {
  const collRef = collection(db, "articles");
  return addDoc(collRef, articleData);
};

const createNotificationDocument = async (payload) => {
  const collRef = collection(db, "notifications");
  return addDoc(collRef, payload);
};

export const postArticleAPI = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(actions.setLoading(true));

      let sharedImg = null;
      if (payload.image) {
        sharedImg = await uploadImage(payload.image);
      }

      const articleData = {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: sharedImg || payload.image,
        comments: [],
        description: payload.description,
        id: payload.id,
        likes: [],
        uid: payload.user.uid,
      };

      const docRef = await createArticleDocument(articleData);
      const articleWithId = { id: docRef.id, ...articleData };
      dispatch(actions.postArticle(articleWithId));

      dispatch(actions.setLoading(false));
    } catch (error) {
      dispatch(actions.setLoading(false));
      console.error(error);
    }
  };
};

export const getArticlesApi = () => {
  return (dispatch) => {
    let payload;
    const collRef = collection(db, "articles");
    const orderedRef = query(collRef, orderBy("actor.date", "desc"));
    onSnapshot(orderedRef, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      dispatch(actions.getArticles(payload));
    });
  };
};

export const getNotificationsAPI = (uid) => {
  return (dispatch) => {
    let payload;
    const collRef = collection(db, "notifications");
    // const orderedRef = query(collRef, orderBy("actor.date", "desc"));
    onSnapshot(collRef, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      dispatch(actions.getNotifications(payload));
    });
  };
};

export const handleDelete = (payload) => {
  return async (dispatch) => {
    try {
      const articlesRef = collection(db, "articles");
      const q = query(articlesRef, where("id", "==", payload.id));
      const querySnapshot = await getDocs(q);
      const docToDelete = querySnapshot.docs[0];
      await deleteDoc(doc(db, "articles", docToDelete.id));
      dispatch(actions.deleteArticle(payload));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
};

export const addCommentAPI = (payload) => {
  return async (dispatch) => {
    try {
      const articleRef = collection(db, "articles");
      const q = query(articleRef, where("id", "==", payload.articleId));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const postOwner = payload.article.actor.title;
      const commentNotification = {
        actorName: payload.article.actor.title,
        name: payload.name,
        uid: payload.uid,
        Image: payload.Image,
        action: payload.action,
        description: payload.description,
        id: payload.id,
        seen: false,
      };
      await updateDoc(docToUpdate.ref, {
        comments: arrayUnion({
          description: payload.description,
          Image: payload.Image,
          name: payload.name,
          id: payload.id,
          likes: [],
        }),
      });
      const notRef =
        (await postOwner) !== payload.name
          ? createNotificationDocument(commentNotification)
          : null;

      dispatch(actions.addComment(payload));
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };
};

export const editArticleAPI = (payload, newPost) => {
  return async (dispatch) => {
    try {
      const articleRef = collection(db, "articles");
      const q = query(articleRef, where("id", "==", payload.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      await updateDoc(docToUpdate.ref, {
        description: newPost,
      });
      dispatch(actions.editArticle(payload));
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeCommentAPI = (payload, commentId) => {
  return async (dispatch) => {
    try {
      const articleRef = collection(db, "articles");
      const q = query(articleRef, where("id", "==", payload.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const commentToRemove = docToUpdate
        .data()
        .comments.find((comment) => comment.id === commentId);
      await updateDoc(docToUpdate.ref, {
        comments: arrayRemove({ ...commentToRemove }),
      });
      dispatch(actions.removeComment(payload, commentId));
    } catch (error) {
      console.error("Error removing comment: ", error);
    }
  };
};

export const editCommentAPI = (payload, commentId, newComment) => {
  return async (dispatch) => {
    try {
      const articleRef = collection(db, "articles");
      const q = query(articleRef, where("id", "==", payload.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const comments = docToUpdate.data().comments;
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, description: newComment }
          : comment
      );
      await updateDoc(docToUpdate.ref, {
        comments: updatedComments,
      });
      dispatch(actions.editComment({ ...payload, comments: updatedComments }));
    } catch (error) {
      console.error(error);
    }
  };
};

export const addLike = (article, payload) => {
  return async (dispatch) => {
    try {
      const articleRef = collection(db, "articles");
      const q = query(articleRef, where("id", "==", article.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const newlikes = docToUpdate.data().likes;
      const findLike = newlikes.find((like) => like.email === payload.email);
      const updatedLike = newlikes.map((like) =>
        like.email === payload.email ? { ...like, type: payload.type } : like
      );
      if (findLike === undefined) {
        await updateDoc(docToUpdate.ref, {
          likes: arrayUnion({
            ...newlikes,
            Timestamp: payload.Timestamp,
            id: payload.id,
            userName: payload.userName,
            email: payload.email,
            type: payload.type,
          }),
        });
      } else if (findLike !== undefined && findLike.type !== payload.type) {
        await updateDoc(docToUpdate.ref, {
          likes: updatedLike,
        });
      } else if (findLike !== undefined && findLike.type === payload.type) {
        await updateDoc(docToUpdate.ref, {
          likes: arrayRemove({ ...findLike }),
        });
      }
      dispatch(actions.addLike(article, { ...payload, likes: newlikes }));
    } catch (error) {
      console.error("Error adding like: ", error);
    }
  };
};

export const openedNotification = (payload) => {
  return async (dispatch) => {
    try {
      const notRef = collection(db, "notifications");
      const q = query(notRef, where("uid", "==", payload.uid));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      console.log(docToUpdate);
      dispatch(actions.openedNotification(payload));
    } catch (error) {
      console.error(error);
    }
  };
};
