<script>
  import Swal from 'sweetalert2';
  import '../assets/css/splash.css';

  Swal.fire({
    title: 'Atenção!',
    html: import.meta.env.VITE_SPLASH_MESSAGE,
    width: 300,
    showConfirmButton: true,
    confirmButtonText: 'Continuar',
    confirmButtonColor: '#20c3c4',
    showCloseButton: true,
    customClass: {
      confirmButton: 'w-full'
    }
  })
  .then((result) => {
    if (result.isConfirmed) window.location.hash = import.meta.env.VITE_HOME_PAGE;
    else window.location.href = import.meta.env.VITE_URL_REDIRECT;
  })
</script>