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
    if (localStorage.getItem("user")) {
      dispatch(actions.setUser(JSON.parse(localStorage.getItem("user"))));
    } else {
      return null;
    }
  };
};

export const signInAPI = () => {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        localStorage.setItem("user", JSON.stringify(payload.user));
        dispatch(actions.setUser(payload.user));
      })
      .catch((error) => {
        alert(error.message);
      });
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
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        localStorage.clear();
        dispatch(actions.setUser(null));
      })
      .catch((error) => alert(error.message));
  };
};

export const postArticleAPI = (payload) => {
  return (dispatch) => {
    if (payload.image) {
      dispatch(actions.setLoading(true));
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadRef = uploadBytesResumable(storageRef, payload.image);

      uploadRef.on(
        "state_changed",
        (snapshot) => {
          const progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("progress", progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadRef.snapshot.ref).then((downloadURL) => {
            const collRef = collection(db, "articles");
            addDoc(collRef, {
              actor: {
                description: payload.user.email,
                title: payload.user.displayName,
                date: payload.timestamp,
                image: payload.user.photoURL,
              },
              video: payload.video,
              sharedImg: downloadURL,
              comments: [],
              description: payload.description,
              id: payload.id,
              likes: [],
            });
          });
          dispatch(actions.setLoading(false));
        }
      );
    } else if (payload.video) {
      dispatch(actions.setLoading(true));
      const collRef = collection(db, "articles");
      addDoc(collRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: payload.image,
        comments: [],
        description: payload.description,
        id: payload.id,
        likes: [],
      });
      dispatch(actions.setLoading(false));
    } else {
      dispatch(actions.setLoading(true));
      const collRef = collection(db, "articles");
      addDoc(collRef, {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: payload.image,
        comments: [],
        description: payload.description,
        id: payload.id,
        likes: [],
      });
      dispatch(actions.setLoading(false));
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
      console.log(docToUpdate);

      await updateDoc(docToUpdate.ref, {
        comments: arrayUnion({
          description: payload.description,
          Image: payload.Image,
          name: payload.name,
          id: payload.id,
          likes: [],
        }),
      });

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

export const addLike = (article , payload) => {
  return async (dispatch) => {
    try {
      const articleRef = collection(db, "articles");
      const q = query(articleRef, where("id", "==", article.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const newlikes = docToUpdate.data().likes;
      const findLike = newlikes.find(
        (like) => like.email === payload.email)
      if(findLike === undefined){
       await updateDoc(docToUpdate.ref, {
          likes: arrayUnion({
            ...newlikes,
            Timestamp : payload.Timestamp,
            id : payload.id,
            userName : payload.userName,
            email : payload.email,
            type : payload.type,
          }),
        });
      } else {
        await updateDoc(docToUpdate.ref, {
          likes: arrayRemove({ ...findLike }),
        })
      }
      dispatch(actions.addLike(article , {...payload , likes: newlikes}));
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };
};
