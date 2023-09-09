document.addEventListener("DOMContentLoaded", () => {
    const campgroundsContainer = document.getElementById("campgrounds-container");
    const seeMoreButton = document.getElementById("see-more-button");
  
    let displayedCampgrounds = 20;
  
    function renderCampgrounds(campgrounds) {
      campgroundsContainer.innerHTML = "";
  
      for (let i = 0; i < Math.min(displayedCampgrounds, campgrounds.length); i++) {
        const campground = campgrounds[i];
        const campgroundHTML = `
          <div class="col">
            <div class="card">
              ${
                campground.images.length
                  ? `<img src="${campground.images[0].url}" class="card-img-top card-img" alt="Campground Image">`
                  : `<img src="" class="card-img-top card-img" alt="Campground Image">`
              }
              <div class="card-body">
                <h5 class="card-title">${campground.title}</h5>
                <p class="card-text">${campground.description}</p>
                <p class="card-text"><strong>Location:</strong> ${campground.location}</p>
                <p class="card-text"><strong>Price:</strong> ${campground.price}</p>
                <a href="/campgrounds/${campground._id}" class="btn btn-primary">View Location</a>
              </div>
            </div>
          </div>
        `;
        const newCampgroundElement = document.createElement("div");
        newCampgroundElement.innerHTML = campgroundHTML;
        campgroundsContainer.appendChild(newCampgroundElement);
      }
  
      if (displayedCampgrounds >= campgrounds.length) {
        seeMoreButton.style.display = "none";
      }
    }
  
    renderCampgrounds(window.campgroundsData);
  
    seeMoreButton.addEventListener("click", () => {
      displayedCampgrounds += 10;
      renderCampgrounds(window.campgroundsData);
    });
  });
  