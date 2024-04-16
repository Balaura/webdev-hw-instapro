import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, isLike, changeLike } from "../index.js";
import { addDislike, addLike } from "../api.js";
import { format } from 'date-fns';
import { formatDistanceToNowStrict } from 'date-fns'
import { ru } from 'date-fns/locale'
import { userAccount } from "../index.js";
import { safeHTML } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {

  const postsHtml = posts
    .map(
      (post) => {
        return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${safeHTML(post.user.name)}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl === "https://image.png" ? "#" : post.imageUrl}">
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
          <p class="post-text">${safeHTML(post.description)}</p>
          <p class="post-date">${formatDistanceToNowStrict(post.createdAt, { locale: ru })} назад</p>
        </li>
    `}
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
      if (!userAccount) {
        alert("Войдите в аккаунт");
        return
      }
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