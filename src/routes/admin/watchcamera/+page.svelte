<script>
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";

  let selectedFile = null;
  let previewUrl = null;
  let imageName = "";
  let imageUrl = null;
  let isLoading = false;
  let error = "";
  let success = "";
  let stoken = "";

  // Обработка выбора файла
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Валидация
    if (!file.type.startsWith("image/")) {
      error = "Только изображения разрешены";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error = "Файл слишком большой (макс. 5MB)";
      return;
    }

    selectedFile = file;
    error = "";

    // Превью
    const reader = new FileReader();
    reader.onload = (e) => (previewUrl = e.target.result);
    reader.readAsDataURL(file);
  }

  // Отправка формы
  async function handleSubmit() {
    if (!selectedFile) {
      error = "Выберите файл";
      return;
    }

    isLoading = true;
    error = "";
    success = "";

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("token", stoken);

      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Ошибка загрузки");
      }

      const result = await res.json();
      success = `Файл загружен: ${result.filename}`;
      previewUrl = null;
      selectedFile = null;
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function fetchImage() {
    if (!imageName) {
      error = "Введите название изображения";
      return;
    }

    try {
      isLoading = true;
      error = "";
      imageUrl = null;

      const response = await fetch(`${API_URL}/images/${imageName}`);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Ошибка загрузки");
      }

      const blob = await response.blob();
      imageUrl = URL.createObjectURL(blob);
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="upload-container">
  <h2>Загрузка изображения</h2>

  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Секретный токен:
      <input type="text" bind:value={stoken} required placeholder="Токен" />
    </label>
    <div class="file-input">
      <input
        type="file"
        accept="image/*"
        on:change={handleFileSelect}
        disabled={isLoading}
      />
      {#if !selectedFile}
        <div class="drop-zone">
          Перетащите сюда файл или кликните для выбора
        </div>
      {/if}
    </div>

    {#if previewUrl}
      <div class="preview">
        <img src={previewUrl} alt="Предпросмотр" />
      </div>
    {/if}

    {#if error}
      <div class="error">{error}</div>
    {/if}

    {#if success}
      <div class="success">{success}</div>
    {/if}

    <button type="submit" disabled={!selectedFile || isLoading}>
      {isLoading ? "Загрузка..." : "Загрузить"}
    </button>
  </form>
</div>

<div>
  <div class="input-group">
    <input
      type="text"
      bind:value={imageName}
      placeholder="Введите название изображения"
    />
    <button on:click={fetchImage} disabled={isLoading}>
      {isLoading ? "Загрузка..." : "Показать"}
    </button>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if imageUrl}
    <div class="image-preview">
      <img src={imageUrl} alt="Запрошенное изображение" />
    </div>
  {/if}
</div>

<style>
  .upload-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .file-input {
    position: relative;
    margin: 1rem 0;
  }

  input[type="file"] {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .drop-zone {
    border: 2px dashed #ccc;
    padding: 2rem;
    text-align: center;
    transition: border-color 0.3s;
  }

  .drop-zone:hover {
    border-color: #646cff;
  }

  .preview img {
    max-width: 100%;
    max-height: 400px;
    margin: 1rem 0;
    border-radius: 4px;
  }

  .error {
    color: #ff4444;
    padding: 0.5rem;
  }

  .success {
    color: #00c851;
    padding: 0.5rem;
  }
</style>
