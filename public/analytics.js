const like = document.querySelector('.like')



fetch('https://biocad-task.herokuapp.com/api/analytics?liked')
.then(res => res.json())
.then(data => {
    console.log(data)
    if (data) like.children[0].children[0].setAttribute('fill', '#EE3F44')

    like.setAttribute('data-liked', data)

    like.addEventListener('click', (e) => {
        console.log(like.getAttribute('data-liked'))
        const liked = like.getAttribute('data-liked') === 'true' ? false : true

        liked ? like.children[0].children[0].setAttribute('fill', '#EE3F44')
        : like.children[0].children[0].setAttribute('fill', '#000')

        like.setAttribute('data-liked', liked)

        fetch('https://biocad-task.herokuapp.com/api/analytics?liked', {
            method: 'POST',
            body: JSON.stringify(liked),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    })
})

