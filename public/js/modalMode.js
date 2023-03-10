document.getElementById('showModal').onclick = show;

function show(){
  window.sessionStorage.setItem('modalMode', 'true');
  window.location.reload();
}