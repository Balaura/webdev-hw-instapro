import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
    <div class="header-container">
      <div class="page-header">
        <h1 class="logo">instapro</h1>
      </div>
    </div>
    <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">
        </div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" id="description" rows="4"></textarea>
        </label>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
  </div>
  `;

    appEl.innerHTML = appHtml;
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    const description = document.getElementById("description");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: description.value,
        imageUrl: imageUrl,
      });
    });
  };



  render();
}
