document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('inputBook');
  
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener('ondatasaved', () => {
  console.log('Data berhasil disimpan');
});

document.addEventListener('ondataloaded', () => {
  refreshDataFromBook();
});

