$(window).ready(
function () {
  $.post("/getModuleStatus", { email: user.email }, function (data) {


    if(data.length === 0) {
      // Show a message to the user that they are not enrolled in any missions
      const progressBarsContainer = $("#progress-bars-container");
  
      const noModulesHtml = `
        <div >
          <div id="raised-content" style="padding-top: 20px;">

            <p style="color:black">You are not currently enrolled in any missions. Click the button below to start your first mission!</p>
            <a href="/courses">
              <button class="ui huge blue button right floated" id="nextButton">
                Start Mission
                <i class="arrow right icon"></i>
              </button>
            </a>
          </div>
        </div>
        </br>
        </br>
      `;
      progressBarsContainer.append(noModulesHtml);
      
    } else {
      const progressBarsContainer = $("#progress-bars-container");
      console.log('public jobs 2')
      console.log(resources)
      // console.log(`${public_resources}/images/missions/` )
      data.forEach((module) => {
        const progressBarHtml = `
          <a  class="ui" href="/about/${module.moduleName}"> 
          <div class="ui raised segment">
              <div class="ui fluid container" style="height: 200px;">
                  <div class="ui image banner">
                      <img src="${resources}/images/missions/banner-${module.moduleName}.svg" style="z-index: 100 !important">
  
                      <div class="ui progress" style="margin-top: -35px; z-index: 0 !important;" id="${module.moduleName}-progress" data-percent="${(module.progress / module.total) * 100}">
                        <div class="bar">
                          <div class="progress"></div>
                        </div>
                        <div class="label">${module.progress}/${module.total}</div>
                      </div>
                  </div>
              </div>
  
              <div id="raised-content" style="padding-top: 20px;">
                  <h3 class="ui header large home-mod-title">
                      ${module.moduleName.charAt(0).toUpperCase() +
          module.moduleName.slice(1)
          } Scams
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

        // Initialize progress bars
        $(`#${module.moduleName}-progress`).progress({
          percent: (module.progress / module.total) * 100,
          showActivity: false // Disable the indicating animation
        });

        // change bar color to red and transition to none
        $(`#${module.moduleName}-progress .bar`).css({
          "background-color": "#7AC4E0",
          "border-radius": "0px",
          "transition": "none !important",
          "transition-duration": "0s !important"
        });

          
      });
  
      data.forEach((module) => {
        $(`#${module.moduleName}-progress`)
          .attr("data-total", module.total)
          .attr("data-value", module.progress)
          .progress({
            duration: 200,
            total: module.total,
            value: module.progress,
            text: {
              active: "{value}/{total}",
            },
          });
      }); 
    }

  });
});

$(window).ready(function () {
  $.get("/newsapi", function (data) {
    const newsContainer = $("#news-container");

    data.forEach((article) => {
      let truncatedTitle = article.title.length > 90 ? article.title.slice(0, 90) + '...' : article.title;
      let truncatedDescription = article.description.length > 220 ? article.description.slice(0, 220) + '...' : article.description;

      const articleHtml = `
      <a class="ui" href="${article.url}" alt="Read news article" target="_blank">
        <div class="ui raised segment" style="box-shadow: none !important; outline: none;">
          
            <div id="raised-content">
                <div class="ui header hub-alert" style="height: 75px">
                    <i class="exclamation circle icon"></i>
                    ${truncatedTitle}
                </div>
                <p class="alert-info" style="height: 100px;">${truncatedDescription}</p>
                    <button class="ui huge button right floated alert-learn-more">
                        <span>Learn More →</span>
                    </button>
                
            </div>
        </div>
      </a>

        `;
      newsContainer.append(articleHtml);
    });

    // Initialize Slick on the newsContainer after all articles are appended
    $("#news-container").slick({
      dots: true,
      arrows: true,
      infinite: true,
      speed: 800,
      slidesToShow: 1,
      slidesToScroll: 1,
      customPaging : function(slider, index) { 
          var num = index + 1;
          return '<span class="dot">'+ num +'</span>';
      }

    });

  }).fail(function (error) {
    console.error("Error:", error);
  });
});
