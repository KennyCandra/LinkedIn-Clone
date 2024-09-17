import { auth, db, provider, storage } from "../../firebase";
import { getAuth, signInWithPopup } from "firebase/auth";
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

const createUserDocumentation = async (user) => {
  const userRef = collection(db, "users");

  const q = query(userRef, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0];
  if (userDoc === undefined) {
    const payload = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    return await addDoc(userRef, payload);
  }
};

export const signInAPI = () => {
  return async (dispatch) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      await createUserDocumentation(user);
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

const deleteNotificationDocument = async (payload) => {
  const notRef = collection(db, "notifications");
  return deleteDoc(notRef, payload);
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
          uid: payload.user.uid,
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
  return async (dispatch) => {
    try {
      let payload;
      const notRef = collection(db, "notifications");
      const orderedRef = query(notRef, orderBy("date", "desc"));
      onSnapshot(orderedRef, (snapshot) => {
        payload = snapshot.docs
          .map((doc) => doc.data())
          .filter((doc) => doc.uid === uid);
        dispatch(actions.getNotifications(payload));
      });
    } catch (error) {
      console.error(error);
    }
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
      const q = query(articleRef, where("id", "==", payload.article.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      const comment = {
        name: payload.user.displayName,
        Image: payload.user.photoURL,
        id: payload.id,
        description: payload.description,
        likes: [],
      };
      const notificationData = {
        articleId: payload.article.id,
        name: payload.user.displayName,
        Image: payload.user.photoURL,
        action: payload.action,
        uid: payload.article.uid,
        description: payload.article.description,
        actorName: payload.article.actor.title,
        postOwner: payload.article.actor.title,
        id: payload.id,
        date: payload.timestamp,
        seen: false,
      };

      await updateDoc(docToUpdate.ref, {
        comments: arrayUnion(comment),
      });

      (await notificationData.postOwner) !== payload.user.displayName
        ? createNotificationDocument(notificationData)
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

      const findLike = newlikes.find(
        (like) => like.email === payload.user.email
      );

      const likeObject = {
        Timestamp: payload.timestamp,
        id: payload.id,
        userName: payload.user.displayName,
        email: payload.user.email,
        type: payload.type,
      };

      const notificationData = {
        articleId: payload.article.id,
        name: payload.user.displayName,
        Image: payload.user.photoURL,
        action: payload.action,
        uid: payload.article.uid,
        description: payload.article.description,
        actorName: payload.article.actor.title,
        postOwner: payload.article.actor.title,
        id: payload.id,
        date: payload.timestamp,
        seen: false,
      };

      if (!findLike) {
        await updateDoc(docToUpdate.ref, {
          likes: arrayUnion(likeObject),
        });

        if (notificationData.postOwner !== payload.user.displayName) {
          await createNotificationDocument(notificationData);
        }
      } else if (findLike && findLike.type !== payload.type) {
        const updatedLike = newlikes.map((like) =>
          like.email === payload.user.email
            ? { ...like, type: payload.type }
            : like
        );
        await updateDoc(docToUpdate.ref, {
          likes: updatedLike,
        });
      } else if (findLike && findLike.type === payload.type) {
        await updateDoc(docToUpdate.ref, {
          likes: arrayRemove(findLike),
        });
        const notRef = collection(db, "notifications");
        const qDelete = query(
          notRef,
          where("name", "==", payload.user.displayName)
        );
        const newQ = query(qDelete, where("action", "==", "like"));
        const newestQ = query(
          newQ,
          where("description", "==", payload.article.description)
        );
        const querySnapshotDelete = await getDocs(newestQ);
        deleteDoc(querySnapshotDelete.docs[0].ref);
      }

      dispatch(actions.addLike(article, { ...payload, likes: newlikes }));
    } catch (error) {
      console.error("Error adding like: ", error);
    }
  };
};

export const updateNotificationState = (payload) => {
  return async (dispatch) => {
    try {
      const notRef = collection(db, "notifications");
      const q = query(notRef, where("id", "==", payload.id));
      const querySnapshot = await getDocs(q);
      const docToUpdate = querySnapshot.docs[0];
      await updateDoc(docToUpdate.ref, {
        seen: true,
      });
      dispatch(actions.openedNotification(payload));
    } catch (error) {
      console.error(error);
    }
  };
};
