const BASE_URL = "https://hacker-news.firebaseio.com/v0/";
const postContainer = document.getElementById("post-container");

async function fetchTopStories(count) {
  const response = await fetch(BASE_URL + "topstories.json");
  const jsonResp = await response.json();
  await fetchItemsLoop(jsonResp, 0, count);
}

async function fetchItemsLoop(itemIds, index, count) {
  for (; index < count - 1; index++) {
    const itemId = itemIds[index];

    const response = await fetch(BASE_URL + `item/${itemId}.json`);
    const jsonData = await response.json();
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
