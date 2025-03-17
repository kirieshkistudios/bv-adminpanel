<script>
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { API_URL } from "$lib/config";

  let username = "";
  let password = "";
  let error = "";
  let test = "";
  if (browser) {
    test = localStorage.getItem("token");
  }

  async function handleSubmit() {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
    });

    if (response.ok && browser) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      goto("/admin");
    } else {
      error = "Invalid username or password";
    }
  }
</script>

<div class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-lg w-96">
    <h1 class="text-2xl font-bold text-center mb-6">Login</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email:</label
        >
        <input
          id="email"
          bind:value={username}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="username"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password:</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="password"
        />
      </div>
      {#if error}
        <div class="mb-2 items-center flex justify-center text-sm text-red-700">
          {error}
        </div>
      {/if}
      <button
        type="submit"
        class="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >Login</button
      >
    </form>

    <p>{test}</p>
  </div>
</div>
