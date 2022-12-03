const rows = document.getElementsByName('cardState')

fetch('https://biocad-task.onrender.com/api/cards')
.then(res => res.json())
.then(data => {
    rows.forEach((item, index) => {
        item.value = data[index]
    })
})

rows.forEach((item, index) => {
    item.addEventListener('change', (e) => {
        fetch(`https://biocad-task.onrender.com/api/cards?id=${index}`, {
            method: 'POST',
            body: JSON.stringify(e.target.value),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    })
})