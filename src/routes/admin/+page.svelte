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
        localStorage.setItem('token', '');
        goto('/admin/login');
    }
</script>

<h1>Welcome!</h1>
<!-- Контент админки -->

<!-- В любом компоненте админки -->

<button on:click={logout}>Logout</button>