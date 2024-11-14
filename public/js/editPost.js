import './header.js'

var id = null

var form = document.getElementById('writePostForm');
const titleField = document.getElementById('title');
const textField = document.getElementById('content');
const cancelEditButton = document.getElementById('cancelEditButton');

document.addEventListener('DOMContentLoaded', async () => {
    try{
            const url = window.location.href;
            id = url.split('/').pop();
            const response = await fetch(`/api/v1/posts/getPostById/${id}`);
    
            const data = await response.json();
            const post = data[0];
    
            if(response.ok){
                titleField.value = post.title;
                textField.value = post.text;
            }
            else {
                alert(data.message);
                console.error('failed to find requseted post');
            }
        } catch(error){
            console.error('Failed', error);
        }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    removeInvalidFields();

    const text = textField.value;

    try{
        const response = await fetch('/api/v1/posts/editPost', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id,
                text,
            }),
        });

        const data = await response.json();

        if(response.ok && data.status === 'success'){
            window.location.href = '/home';
        } else
            alert(data.message);

        if(data.field === 'text')
            contentField.classList.add('is-invalid');

    } catch (error) {
        console.error('Failed to edit post', error);
    }
});

cancelEditButton.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/home';
});



function removeInvalidFields() {
    titleField.classList.remove('is-invalid');
    textField.classList.remove('is-invalid');
}