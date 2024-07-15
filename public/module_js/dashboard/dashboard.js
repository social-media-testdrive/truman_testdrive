$(window).ready(function () {
    $.post('/getModuleStatus', { "email": user.email }, function(data) {
      console.log("Response data saved to info:");
      console.log(data);
      console.log(user.name)
      console.log(user.id)
      console.log(user.email)

      const progressBarsContainer = $('#progress-bars-container');
      
      data.forEach(module => {
        const progressBarHtml = `
        <a  class="ui" href="/about/${module.moduleName}"> 
        <div class="ui raised segment">
            <div class="ui fluid container" style="height: 200px;">
                <div class="ui image banner">
                    <img src="/images/courses/${module.moduleName}-scams-banner.jpg">

                    <div class="ui bottom small progress" data-percent="${(module.progress/module.total)*100}" style="margin:0;padding:0;">
                        <div class="bar" style="border-radius: 0 !important; background: #3757A6;">
                            <div class="progress"></div>
                        </div>
                    </div>
                    <div style="text-align:center; color:grey">
                      ${module.progress}/${module.total}
                    </div>
                </div>
            </div>

            <div id="raised-content" style="padding-top: 20px;">
                <h3 class="ui header large home-mod-title">
                    ${module.moduleName.charAt(0).toUpperCase() + module.moduleName.slice(1)} Scams
                </h3>
                <p style="color:black"></p>
                <button class="ui huge blue button right floated" id="nextButton">
                    Learn Now
                    <i class="arrow right icon"></i>
                </button>
            </div>
        </div>
        </a>
        </br>
        </br>

        `;
        progressBarsContainer.append(progressBarHtml);
      });

      data.forEach(module => {
        $(`#${module.moduleName}-progress`)
          .attr('data-total', module.total)
          .attr('data-value', module.progress)
          .progress({
            duration: 200,
            total: module.total,
            value: module.progress,
            text: {
              active: '{value}/{total}'
            }
          });
      });
    });
  });


  $(window).ready(function() {
    $.get('/newsapi', function(data) {
        console.log(data);
        const newsContainer = $('#news-container');

        data.forEach(article => {
            const articleHtml = `
            <a class="ui" href="${article.url}" alt="Begin identity theft module">
              <div class="ui raised segment">
                <div id="raised-content">
                  <div class="ui header hub-alert">
                    <i class="exclamation circle icon"></i>
                    ${article.title}
                  </div>
                  <p class="alert-info">${article.description}</p>
                  <button class="ui huge button right floated alert-learn-more">
                    <span>Learn More →</span>
                  </button>
                </div>
              </div>
            </a>
            `;
            newsContainer.append(articleHtml);
        });
    }).fail(function(error) {
        console.error('Error:', error);
    });
});
