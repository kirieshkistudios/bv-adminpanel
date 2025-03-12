<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

    let z = "";
    let id:number;
    let userData = {
        username: "",
        password: "",
        is_superior: false
    }
    let editData = {
      user_id: 0,
      username: "",
      password: "",
      is_superior: false
    }
    let response: any = null;
    let error = ''
    let items;
    let loading:boolean;

    onMount(async () => {
    if (browser){
      const token = localStorage.getItem('token');
      if (!token && window.location.pathname.startsWith('/admin')) {
        goto('/admin/login');
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/users', {
        headers: browser ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      });

      if (!response.ok) throw new Error('Ошибка загрузки данных');
      
      items = await response.json();
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });

    async function addToTable(){
      const res = await fetch("http://127.0.0.1:8000/auth/", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
    }
    
    async function editTable(){
      editData = {
        user_id: id,
        username: userData.username,
        password: userData.password,
        is_superior: userData.is_superior
      }
      const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editData)
            });
      
    }

    async function removeFromTable(){
      const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
    }
</script>
  
  <h1>Users Table</h1>
  
  <div class="table-container">
    {#if loading}
      <div class="loader">Загрузка данных...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Hashed Password</th>
            <th>Is superior</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item.id)}
            <tr>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.hashed_password}</td>
              <td>{item.is_superior}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <button on:click={addToTable}>add</button>
  <button on:click={editTable}>edit</button>
  <button on:click={removeFromTable}>remove</button>
  <input bind:value={id}>
  <input bind:value={userData.username} placeholder="username">
  <input bind:value={userData.password} placeholder="password">
  <input bind:value={userData.is_superior}>
  <p>{z}</p>