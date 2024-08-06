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
              <div class="meta" style="text-align: end;">
                ${item.duration} min
              </div>
              <div class="header">${item.title}</div>
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

$(document).ready(function() {
  $('.ui.accordion').accordion();
});