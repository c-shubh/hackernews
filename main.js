/* https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop */

const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const postContainer = document.getElementById("post-container");

function fetchTopStories(count) {
    fetch(BASE_URL + "topstories.json")
        .then((resp) => resp.json())
        .then((jsonResp) => fetchItems(jsonResp, 0, count));
}

function fetchItems(itemIds, index, count) {
    if (index === count - 1) {
        return;
    } else {
        const itemId = itemIds[index];

        fetch(BASE_URL + `item/${itemId}.json`)
            .then((response) => response.json())
            .then((jsonData) => {
                if (jsonData.type === "story") {
                    const post = {
                        title: jsonData.title,
                        url: jsonData.url,
                        points: jsonData.score,
                        comments: jsonData.descendants,
                        commentsURL: `https://news.ycombinator.com/item?id=${jsonData.id}`,
                        by: jsonData.by,
                    };

                    displayPost(post);
                }
            })
            .then(() => {
                fetchItems(itemIds, index + 1, count);
            });
    }
}

function displayPost(post) {
    const htmlString =
        `<div class="title-container">` +
        (post.url
            ? `<a href="${post.url}" class="title">${post.title}</a>
                        <span class="domain">(${new URL(post.url).host})</span>`
            : `<a href="${post.commentsURL}" class="title">${post.title}</a>`) +
        `</div>
                    <div class="info-container">
                        <span class="points">${post.points} points</span>
                        <span>-</span>
                        <a href="${post.commentsURL}" class="comments">${post.comments} comments</a>
                        <span>-</span>
                        <span class="by">by ${post.by}</span>
                    </div>`;

    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "post");
    newDiv.innerHTML = htmlString;

    postContainer.append(newDiv);
}

fetchTopStories(30);
