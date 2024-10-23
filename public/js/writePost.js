import './header.js';

var form = document.getElementById('writePostForm');
var titleField = document.getElementById('title');
var contentField = document.getElementById('content');

let currentUserId = null;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    removeInvalidFields();

    const title = titleField.value;
    const text = contentField.value;

    try{
        const response = await fetch('/api/v1/auth/session');
        if(response.ok) {
            const sessionData = await response.json();
            currentUserId = sessionData.userId;
        }
        else {
            console.error('Failed to fetch session');
        }
    } catch(error) {
        console.error('Failed to fetch session', error);
    }

    try{
        const id_author = currentUserId;
        console.log("ID: " + id_author);
        const response = await fetch('/api/v1/posts/writePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                title,
                text,
                id_author,
            }),
        });    
        
        const data = await response.json();

        if (response.ok && data.status === 'success') {
            window.location.href = '/home';
        } else {
            alert(data.message);
        }

        switch(data.field){
            case 'title':
                titleField.classList.add('is-invalid');
                break;
            case 'text':
                contentField.classList.add('is-invalid');
                break;
            case 'all':
                if(titleField.value === '')
                    titleField.classList.add('is-invalid');
                if(contentField.value === '')
                    contentField.classList.add('is-invalid');
                break;
        }
    } catch(error) {
        console.error('Error:', error);
    }
});

function removeInvalidFields() {
    titleField.classList.remove('is-invalid');
    contentField.classList.remove('is-invalid');
}