import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, isLike, changeLike } from "../index.js";
import { addDislike, addLike, getPosts } from "../api.js";

export function renderPostsPageComponent({ appEl }) {

  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const postsHtml = posts
    .map(
      (post) => `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="${post.isLiked
          ? "./assets/images/like-active.svg"
          : "./assets/images/like-not-active.svg"
        }">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>
          <p class="post-text">${post.description}</p>
          <p class="post-date">
            ${post.createdAt}
          </p>
        </li>
    `
    )
    .join("");


  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      if (!isLike(likeEl.dataset.postId)) {
        addLike({ id: likeEl.dataset.postId, token: getToken() }).then((data) => { changeLike(likeEl.dataset.postId); });
      }
      else {
        addDislike({ id: likeEl.dataset.postId, token: getToken() }).then((data) => { changeLike(likeEl.dataset.postId); });
      }
    });
  }

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}