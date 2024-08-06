$(document).ready(function () {
  console.log("Document is ready, making API call.");
  $.get("/api/lesson", function (data) {
    console.log("API response received.");
    console.log("Response table info:");
    console.log(data);
    var container = $('#courses-container');
    if (data.length === 0) {
      console.log("No data received.");
      container.append('<p>No courses available at the moment.</p>');
    } else {
      data.forEach(function(item) {
        console.log("Processing item:", item);
        var courseHtml = `
          <div class="card">
            <div class="image">
              <img src="${item.imagelink}" alt="${item.title} Banner Image" style="width: 100%; height: 125px; object-fit: cover;">
            </div>
            <div class="content">
              <div class="header">${item.title}</div>
              <div class="meta">
                <span class="date">Duration: ${item.duration} minutes</span>
              </div>
              <div class="description">
                ${item.subtitle}
              </div>
            </div>
            <div class="extra content">
              <a href="${item.link}">
                <button class="ui blue button">Learn Now <i class="arrow right icon"></i></button>
              </a>
            </div>
          </div>
        `;
        container.append(courseHtml);
      });
    }
  }).fail(function() {
    console.log("API call failed.");
    $('#courses-container').append('<p>Failed to load courses. Please try again later.</p>');
  });
});


  [
    {
        "_id": "66b16c7f2ccc5779eeb8ffac",
        "title": "Identity Theft",
        "subtitle": "Understand the consequences of identity theft and learn how to take action against these scams.",
        "duration": 64,
        "image": "base64 string",
        "link": "/about/identity",
        "imagelink": "/images/courses/identity-scams-banner.jpg",
        "createdAt": "2024-08-06T00:21:19.871Z",
        "updatedAt": "2024-08-06T00:21:19.871Z",
        "__v": 0
    },
    {
        "_id": "66b16d8d2ccc5779eeb8ffae",
        "title": "Romance & Friendship Scams",
        "subtitle": "Understand the consequences of romance & friendship scams and learn how to take action against these scams.",
        "duration": 107,
        "image": "base64 string",
        "link": "/about/romance",
        "imagelink": "/images/courses/romance-scams-banner.jpg",
        "createdAt": "2024-08-06T00:25:49.802Z",
        "updatedAt": "2024-08-06T00:25:49.802Z",
        "__v": 0
    }
  ]