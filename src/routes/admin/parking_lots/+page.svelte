<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let items = [];
  let loading = true;
  let error = null;
  let id:number;
  let parkData = {
    name: '',
    latitude: 0,
    longitude: 0,
    location_name: '',
    free_spots: 0,
    capacity: 0
  }

  let editData = {
    parking_lot_id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    location_name: '',
    free_spots: 0,
    capacity: 0
  }

  // Загрузка данных при монтировании компонента
  onMount(async () => {
    if (browser){
      const token = localStorage.getItem('token');
      if (!token && window.location.pathname.startsWith('/admin')) {
        goto('/admin/login');
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/parking_lots', {
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
      const res = await fetch("http://127.0.0.1:8000/parking_lots", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(parkData)
            });
    }
    
    async function editTable(){
      editData = {
        parking_lot_id: id,
        name: parkData.name,
        latitude: parkData.latitude,
        longitude: parkData.longitude,
        location_name: parkData.location_name,
        free_spots: parkData.free_spots,
        capacity: parkData.capacity
      }
      const res = await fetch(`http://127.0.0.1:8000/parking_lots/${id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editData)
            });
      
    }

    async function removeFromTable(){
      const res = await fetch(`http://127.0.0.1:8000/parking_lots/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
    }
</script>
  
  <h1>Parking Lots Table</h1>

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
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Location Name</th>
            <th>Free spots</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item.id)}
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.latitude}</td>
              <td>{item.longitude}</td>
              <td>{item.location_name}</td>
              <td>{item.free_spots}</td>
              <td>{item.capacity}</td>
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
  <input bind:value={parkData.name} placeholder="name">
  <input bind:value={parkData.latitude} placeholder="latitude">
  <input bind:value={parkData.longitude} placeholder="longitude">
  <input bind:value={parkData.location_name} placeholder="location name">
  <input bind:value={parkData.free_spots} placeholder="free spots">
  <input bind:value={parkData.capacity} placeholder="capacity">
