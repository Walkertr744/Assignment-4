const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const showGallery = document.getElementById("showGallery");
let lastSearch = "";
let searchNumber = 0;
searchForm.addEventListener("submit",searchShows);
searchInput.value = "Friends";
searchShows();
async function searchShows(event){
    if(event){
        event.preventDefault();
    }
    const showName= searchInput.value.trim();

    if(showName === ""){
        showGallery.textContent= "Please Enter a Valid Search";
        return;
    }
    if(showName === lastSearch){
    return;
    }
    searchNumber++;
    const currentSearch = searchNumber;
   

    const apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(showName)}`;

    try{
        const response = await fetch(apiUrl);
        if (response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
}
        if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
        }
        const shows = await response.json();
        if(currentSearch !== searchNumber){
            return;
        }
        lastSearch = showName;
        showGallery.replaceChildren();

        if(shows.length === 0){
            showGallery.textContent = "No shows found with that title";
            return;
        }
        //Creating 10 Show Cards
        for(let i=0;i<10 && i<shows.length;i++){
            const showCard = document.createElement("div");
            showCard.classList.add("show-card");
            

        //Title
        const showTitle = document.createElement("h2");
        showTitle.textContent = shows[i].show.name;
        showCard.appendChild(showTitle);

        //Summary
        const showCardText = document.createElement("p");
        let uncleanText = shows[i].show.summary; 
        if(uncleanText === null){
            uncleanText = "No summary available";
        }
        const cleanTextDiv =  document.createElement("div");
        cleanTextDiv.innerHTML = uncleanText;
        showCardText.textContent = cleanTextDiv.textContent;
        showCard.appendChild(showCardText); 

        //Premiered
        const premieredText = document.createElement("p");
        let preUnclean = shows[i].show.premiered; 
        if(preUnclean === null){
            preUnclean = "Not available";
        }
        premieredText.textContent = "Premiered: " + preUnclean;
        showCard.appendChild(premieredText);


        //Date
        const updateDate = document.createElement("p");
        let dateData = shows[i].show.updated; 
        if(dateData === null){
            updateDate.textContent = "Last Updated: Not available";
        }
        else{
        const newDateData = new Date(dateData * 1000);
        updateDate.textContent = newDateData.toLocaleString();
        }
        showCard.appendChild(updateDate);

        //Genre
        const genre = document.createElement("p");
        let genreText = shows[i].show.genres; 
        if(genreText === null || genreText.length === 0){
            genre.textContent = "Genre: Not available";
        }
        else{
        genre.textContent = "Genres: " + genreText.join(", ");
        }
        showCard.appendChild(genre);

        //Rating
        const rating = document.createElement("p");
        let ratingText = shows[i].show.rating.average; 
        if(ratingText === null){
            rating.textContent = "Rating: Not available";
        }
        else{
        rating.textContent = ratingText;
        }
        showCard.appendChild(rating);

        //Second Fetch Request
        const showID = shows[i].show.id;
        const castUrl = `https://api.tvmaze.com/shows/${showID}/cast`;

        try {
        const castResponse = await fetch(castUrl);

        if (!castResponse.ok) {
        throw new Error(`HTTP ${castResponse.status}`);
        }
        const cast = await castResponse.json();

        //Heading for Cast
        const showCast = document.createElement("h3");
        showCast.textContent = "Main Cast";
        showCard.appendChild(showCast);

        //Character List
        const characterList = document.createElement("ul");

        //Checking for empty cast list
        if(cast.length === 0){
            const noCast = document.createElement("li")
            noCast.textContent = "No cast information available"
            characterList.appendChild(noCast)
        }
        
        //Listing Cast Members
        for(let j = 0 ; j < 5 && j < cast.length ; j++){
            //Rating
        const castMemberName= document.createElement("li");
        let castName = cast[j].person.name;
        let castCharacter = cast[j].character.name;  
        if(castName === null){
            castName= "No names available";
        }
        if(castCharacter === null){
            castCharacter = "No character available";
        }
    
        const nameText = document.createElement("div");
            nameText.textContent = "Name: " + castName;
            castMemberName.appendChild(nameText);

        const characterText = document.createElement("div");
            characterText.classList.add("character-text");
            characterText.textContent = "Character: " + castCharacter;
            castMemberName.appendChild(characterText);

        characterList.appendChild(castMemberName);
        }
        
        showCard.appendChild(characterList);
       
        
        }
        catch(error){
            console.error("Unable to load cast:", error);
            const castError = document.createElement("p");
            castError.textContent = "Cast information temporarily unavailable.";
            showCard.appendChild(castError);
        }
        const showLink = document.createElement("a");
        showLink.href = shows[i].show.url;
        showLink.textContent = "Watch Show"
        showLink.target ="_blank"
        showCard.appendChild(showLink);

        if(currentSearch !== searchNumber){
             return;
        }

        showGallery.appendChild(showCard); 
    }
        

}
    catch(error){
        console.error("We have encountered a problem:", error);
        if(currentSearch !== searchNumber){
            return;
        }
        if(error.message === "Too many requests. Please try again later."){
        showGallery.textContent = error.message;
        }
        else{
        showGallery.textContent = "Unable to load TV shows, please try again later!";
        }
    }

}