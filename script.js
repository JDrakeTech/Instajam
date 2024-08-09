
loadPosts();

function renderPosts() {
    let postContent = document.getElementById('contentContainer');
    postContent.innerHTML = '';
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        postContent.innerHTML += generatedPostItem(post, i);

        generatedComments(i, post);
    }
    savePosts()
}

function generatedComments(i, post) {
    let postComment = document.getElementById(`postComments${i}`);
    /*Render Solid Comments*/
    for (let s = 0; s < post['solid-comments'].length; s++) {
        const profileImg = post['solid-comments'][s]['profile-img'];
        const author = post['solid-comments'][s]['author'];
        const comment = post['solid-comments'][s]['comment'];
        postComment.innerHTML += generatedSolidCommentItem(profileImg, author, comment)
    }
    /*Render Comments */
    for (let j = 0; j < post['comments'].length; j++) {
        const profileImg = post['comments'][j]['profile-img'];
        const author = post['comments'][j]['author'];
        const comment = post['comments'][j]['comment'];
        postComment.innerHTML += generatedCommentItem(profileImg, author, comment, i, j)
    }
}

function generatedPostItem(post, i) {
    let HeartIcon = './img/Icon/heart-icon-black.png';
    let commentsNumber = post['comments'].length + post['solid-comments'].length
    if (posts[i]['isLike'] == true) {
        HeartIcon = './img/Icon/heart-icon-red.png';
    }
    return generatedPostItemHtml(post, i, HeartIcon, commentsNumber);
}

function generatedPostItemHtml(post, i, HeartIcon, commentsNumber) {
    return `
    <div class="postContainer">
       <div class="profile-box">
             <img class="profile-img" src="${post['profile-img']}" alt="">
           <div>
             <p class="author"><b>${post['author']}</b></p>
             <p class="location">${post['location']}</p>
          </div>
       </div>
        
        <img class="postImg" src="${post['image']}" alt="">
        
        <div class="postIcon-container">
           <div>
              <img onclick="liked(${i})" id="postIcon-heart${i}" class="postIcon" src="${HeartIcon}" alt="">
              <img id="postIcon-comment" class="postIcon" src="./img/Icon/comment-icon-black.png" alt="">
              <img id="postIcon-message" class="postIcon" src="./img/Icon/message-icon-black.png" alt="">
           </div>
             <img id="postIcon-bookmark" class="postIcon2" src="./img/Icon/bookmark-icon-black.png" alt="">
        </div>

        <div class="like-container">Gefällt ${post['likes']}</div>
        <div class="discription"><b>${post['author']}</b><p class="discription-text">${post['discription']}</p></div>
        <div onclick="showComments(${i})" class="show-comments">Alle ${commentsNumber} Kommentare ansehen</div>
        <div id="postComments${i}" class="comment-box d-none"></div>
        
        <div id="commentInput" class="commentInput"><input id="input${i}" type="text" placeholder="Kommentieren..."><button onclick="addComment(${i})" class="post-bt">Posten</button></div>
    </div>
    `;
}

function generatedSolidCommentItem(profileImg, author, comment,) {
    return `<div class="comment"><img class="comment-img" src="${profileImg}" alt=""><p class="author">${author}</p><p>${comment}</p></div>`;
}

function generatedCommentItem(profileImg, author, comment, i, j) {
    return `<div class="comment"><img class="comment-img" src="${profileImg}" alt=""><p class="author">${author}</p><p class="comment-text">${comment}</p><button class="deleteComment-bt" onclick="deleteComment(${i},${j})">Löschen</button></div>`;
}

function addComment(index) {
    let input = document.getElementById(`input${index}`);
    if (input.value.length > 0) {
        posts[index]['comments'].push({ "profile-img": `${profile['profile-img']}`, "author": `${profile['author']}`, "comment": input.value });
        renderPosts()
        input.value = '';
        savePosts();
    } else {
        alert('please enter comment')
    }
}

function deleteComment(i, j) {
    posts[i]['comments'].splice(j, 1);

    savePosts();
    renderPosts();

}

function savePosts() {
    let postsAsText = JSON.stringify(posts);
    localStorage.setItem('post', postsAsText);

    let profileAsText = JSON.stringify(profile);
    localStorage.setItem('profile', profileAsText);
}

function loadPosts() {
    let postsAsText = localStorage.getItem('post');
    let profileAsText = localStorage.getItem('profile');
    if (postsAsText && profileAsText) {
        posts = JSON.parse(postsAsText);
        profile = JSON.parse(profileAsText);
    }
}

function liked(i) {
    let isLiked = posts[i]['isLike'];
    let likes = posts[i]['likes'];
    isLiked = !isLiked;
    if (isLiked == true) {
        likePost(i, isLiked, likes);
    } else if (isLiked == false) {
        removeLikePost(i, isLiked, likes)
    }
    renderPosts();
}

function likePost(i, isLiked, likes) {
    document.getElementById(`postIcon-heart${i}`).src = './img/Icon/heart-icon-red.png';
    posts[i]['isLike'] = isLiked;
    likes++
    posts[i]['likes'] = likes;
}

function removeLikePost(i, isLiked, likes) {
    document.getElementById(`postIcon-heart${i}`).src = './img/Icon/heart-icon-black.png';
    posts[i]['isLike'] = isLiked;
    likes--
    posts[i]['likes'] = likes;
}

function showComments(i) {
    document.getElementById(`postComments${i}`).classList.toggle('d-none');
}

function openCreatePost() {
    document.getElementById('createPost-container').classList.remove('d-none');
}

function closeCreatePost() {
    document.getElementById('createPost-container').classList.add('d-none');
}

function ShareNewPost() {
    let image = './img/Post/new-post.jpg'
    let discription = document.getElementById('create-discription').value;
    let location = document.getElementById('create-location').value;
    posts.push({ "author": `${profile['author']}`, 'profile-img': `${profile['profile-img']}`, 'image': `${image}`, 'likes': 0, 'isLike': false, 'discription': `${discription}`, 'location': `${location}`, 'comments': [], 'solid-comments': [] });
    savePosts();
    renderPosts();
    document.getElementById('createPost-container').classList.add('d-none');
    discription = '';
    location = '';
}

function darkmode() {
    document.getElementById('body').classList.toggle('darkmode');
    document.getElementById('sidebar-top').classList.toggle('darkmode');
    document.getElementById('sidebar-bottom').classList.toggle('darkmode');

    let darkmode = profile['darkmode'];
    darkmode = !darkmode;
    if (darkmode == false) {
        profile['darkmode'] = darkmode;
        document.getElementById('icon-head').src = './img/Icon/insta-logo-black.png';
        document.getElementById('icon-home').src = './img/Icon/home-icon-black.png';
        document.getElementById('icon-search').src = './img/Icon/search-icon-black.png';
        document.getElementById('icon-compass').src = './img/Icon/compass-icon-black.png';
        document.getElementById('icon-video').src = './img/Icon/video-icon-black.png';
        document.getElementById('icon-message').src = './img/Icon/message-icon-black.png';
        document.getElementById('icon-heart').src = './img/Icon/heart-icon-black.png';
        document.getElementById('icon-create').src = './img/Icon/create-icon-black.png';
        document.getElementById('icon-mode').src = './img/Icon/light-dark-icon-black.png';
        document.getElementById('icon-at').src = './img/Icon/at-icon-black.png';
        document.getElementById('icon-menu').src = './img/Icon/menu-icon-black.png';
        document.getElementById('postIcon-comment').src = './img/Icon/comment-icon-black.png';
        document.getElementById('postIcon-message').src = './img/Icon/message-icon-black.png';
        document.getElementById('postIcon-bookmark').src = './img/Icon/bookmark-icon-black.png';
    } else {
        document.getElementById('icon-head').src = './img/Icon/insta-logo-white.png';
        document.getElementById('icon-home').src = './img/Icon/home-icon-white.png';
        document.getElementById('icon-search').src = './img/Icon/search-icon-white.png';
        document.getElementById('icon-compass').src = './img/Icon/compass-icon-white.png';
        document.getElementById('icon-video').src = './img/Icon/video-icon-white.png';
        document.getElementById('icon-message').src = './img/Icon/message-icon-white.png';
        document.getElementById('icon-heart').src = './img/Icon/heart-icon-white.png';
        document.getElementById('icon-create').src = './img/Icon/create-icon-white.png';
        document.getElementById('icon-mode').src = './img/Icon/light-dark-icon-white.png';
        document.getElementById('icon-at').src = './img/Icon/at-icon-white.png';
        document.getElementById('icon-menu').src = './img/Icon/menu-icon-white.png';
        document.getElementById('postIcon-comment').src = './img/Icon/comment-icon-white.png';
        document.getElementById('postIcon-message').src = './img/Icon/message-icon-white.png';
        document.getElementById('postIcon-bookmark').src = './img/Icon/bookmark-icon-white.png';
        profile['darkmode'] = darkmode;
    }
}

