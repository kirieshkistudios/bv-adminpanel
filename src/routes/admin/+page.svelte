<script>
    import { goto } from '$app/navigation';
    import {browser} from '$app/environment'

    if (browser){
        const token = localStorage.getItem('token');
        if (!token && window.location.pathname.startsWith('/admin')) {
            goto('/admin/login');
        }
    }
    

    function logout() {
        localStorage.removeItem('token')
        goto('/admin/login');
    }
</script>

<h1>Welcome!</h1>

<button on:click={goto('/admin/users')}>Users</button>
<button on:click={goto('/admin/parking_lots')}>Parking Lots</button>
<button on:click={goto('/admin/cameras')}>Cameras</button>
<button on:click={goto('/admin/watchcamera')}>Watch camera</button>

<button on:click={logout}>Logout</button>
