const { deleteForm } = document.forms;
// console.log(deleteForm);
deleteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { username } = deleteForm;
  const del = await fetch(`/users/${username.value}`, { method: 'DELETE' });
  // const result = await del.text()
  const resultDiv = document.getElementById('resultDiv');
  // console.log(del.status);
  if (del.status === 200) {
    resultDiv.innerText = 'Пользователь удален';
  } else {
    resultDiv.innerText = 'Произошла ошибка';
  }
});
