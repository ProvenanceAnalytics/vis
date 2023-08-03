document.querySelector('#execute-button').addEventListener('click', () => {
    fetch('https://akdjgil288.execute-api.us-east-2.amazonaws.com/default/RunScriptOnEC2', {
        method: 'POST',
    })
    .then(response => response.text())
    .then(data => {
        document.querySelector('#result').textContent = data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
  