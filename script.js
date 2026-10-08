const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const showGallery = document.getElementById("showGallery");

searchForm.addEventListener("submit",searchShows);

async function searchShows(event){
    event.preventDefault();
    const showName= searchInput.value.trim();

    if(showName === ""){
        showGallery.textContent= "Please Enter a Valid Search";
        return;
    }

    const apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(showName)}`;

    try{
        const response = await fetch(apiUrl);
        if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
        }
        const shows = await response.json();
        showGallery.replaceChildren();

        if(shows.length === 0){
            showGallery.textContent = "No shows found with that title";
            return;
        }
        for(i=0;i<10 && i<shows.length;i++){
            const showCard = document.createElement("div");
            showCard.classList.add("show-card")



        const showTitle = document.createElement("h2");
        showTitle.textContent = shows[i].show.name;
        showCard.appendChild(showTitle);
        showGallery.appendChild(showCard);
        }
    }
    catch(error){
        console.error("We have encountered a problem:", error);
        showGallery.textContent = "Unable to load TV shows, please try again later!";
    }
}