<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let items;
  let loading:boolean;
  let error = '';
  let id:number;
  let cameraData = {
    name: '',
    parking_lot_id: 0,
    api: '',
    config: ''
  }
  let editData = {
    camera_id: 0,
    name: '',
    parking_lot_id: 0,
    api: '',
    config: ''
  }

    onMount(async () => {
    if (browser){
      const token = localStorage.getItem('token');
      if (!token && window.location.pathname.startsWith('/admin')) {
        goto('/admin/login');
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/cameras', {
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
      const res = await fetch("http://127.0.0.1:8000/cameras", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(cameraData)
            });
    }
    
    async function editTable(){
      editData = {
        camera_id: id,
        name: cameraData.name,
        parking_lot_id: cameraData.parking_lot_id,
        api: cameraData.api,
        config: cameraData.config
      }
      const res = await fetch(`http://127.0.0.1:8000/cameras/${id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editData)
            });
      
    }

    async function removeFromTable(){
      const res = await fetch(`http://127.0.0.1:8000/cameras/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
    }
  </script>
  
  <h1>Cameras Table</h1>
  
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
            <th>Name</th>
            <th>Parking lot id</th>
            <th>api</th>
            <th>config</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item.id)}
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.parking_lot_id}</td>
              <td>{item.api}</td>
              <td>{item.config}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <button on:click={addToTable}>add</button>
  <button on:click={editTable}>edit</button>
  <button on:click={removeFromTable}>remove</button>
  <input bind:value={id} placeholder="id">
  <input bind:value={cameraData.name} placeholder="name">
  <input bind:value={cameraData.parking_lot_id} placeholder="parking lot id">
  <input bind:value={cameraData.api} placeholder="api">
  <input bind:value={cameraData.config} placeholder="config">
