import { addPost, getPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let userAccount = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => {
  const token = userAccount ? `Bearer ${userAccount.token}` : undefined;
  return token;
};

export const changeLike = (postId) => {
  if (!userAccount) {
    return
  }
  const post = posts.find((post) => post.id === postId);
  post.isLiked = !post.isLiked;
  if (post.isLiked) {
    post.likes.push({ "id": userAccount._id, "name": userAccount.name });
  }
  if (!post.isLiked) {
    post.likes = post.likes.filter((like) => like.id !== userAccount._id);
  }
  renderApp();
}

export const isLike = (postId) => {
  const post = posts.find((post) => post.id === postId);
  return post.isLiked;
}

export const logout = () => {
  userAccount = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      page = userAccount ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      return getPosts({ token: getToken(), userId: data.userId })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }


    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user: userAccount,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        userAccount = newUser;
        saveUserToLocalStorage(userAccount);
        goToPage(POSTS_PAGE);
      },
      user: userAccount,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        addPost({
          description,
          imageUrl,
          token: getToken(),
        })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    return;
  }
};

goToPage(POSTS_PAGE);
