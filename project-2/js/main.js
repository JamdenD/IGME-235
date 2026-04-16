window.onload = (e) => {document.querySelector("#search").onclick = searchWithFilters;};
	
	let displayTerm = "";
	
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");

		let term = document.querySelector("#searchterm").value;
	displayTerm = term;

	term = term.trim().toLowerCase();

	if (term.length < 1) return;

	// PokéAPI endpoint
	let url = `https://pokeapi.co/api/v2/pokemon/${term}`;


    document.querySelector("#status").innerHTML = `<b>Searching for '${displayTerm}'</b>`;
	document.querySelector("#content").innerHTML = `<img src="images/spinner.gif" alt="loading">`;

	getData(url);

	}

	function getData(url){
	//1 - create a new XHR object
	let xhr = new XMLHttpRequest();

	//2 - set the onload handler
	xhr.onload = dataLoaded;

	//3 - set the onerror handler
	xhr.onerror = dataError;

	//4 - open connection and send the request
	xhr.open("GET", url);
	xhr.send();	
	}

	// Callback Functions

	function dataLoaded(e) {
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    console.log(obj);

    // Build display for ONE Pokémon
    let name = obj.name.toUpperCase();
    let image = obj.sprites.front_default;
	let species = obj.species;
	let gen = obj.gen;
    let types = obj.types.map(t => t.type.name).join(", ");

    let bigString = `
        <div class="result">
            <h3>${name}</h3>
            <img src="${image}" alt="${name}">
            <p><b>Type(s):</b> ${types}</p>
        </div>
    `;

    document.querySelector("#content").innerHTML = bigString;
    document.querySelector("#status").innerHTML = `<b>Success!</b>`;
}

async function searchWithFilters() {
    let type = document.querySelector("#type").value;
    let generation = document.querySelector("#generation").value;
    let eggGroup = document.querySelector("#egg-group").value;

    document.querySelector("#status").innerHTML = "Searching Pokemon...";

    try {
        let results = [];

        // Fetch type
        if (type) {
            let res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            let data = await res.json();
            results.push(data.pokemon.map(p => p.pokemon.name));
        }

        // Fetch generation
        if (generation) {
            let res = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
            let data = await res.json();
            results.push(data.pokemon_species.map(p => p.name));
        }

        // Fetch egg group
        if (eggGroup) {
            let res = await fetch(`https://pokeapi.co/api/v2/egg-group/${eggGroup}`);
            let data = await res.json();
            results.push(data.pokemon_species.map(p => p.name));
        }

        // Intersection
        let finalList = results.reduce((a, b) => 
            a.filter(x => b.includes(x))
        );

		finalList = finalList.slice(0,limit);

        displayPokemonList(finalList);

    } catch (err) {
        document.querySelector("#status").innerHTML = "Error filtering Pokémon";
        console.error(err);
    }
}

function displayPokemonList(list) {
    if (!list || list.length === 0) {
        document.querySelector("#content").innerHTML = "<p>No matches found</p>";
        return;
    }

    let html = "";

    for (let name of list) {
        html += `
            <div class="result">
                <p>${name.toUpperCase()}</p>
            </div>
        `;
    }

    document.querySelector("#content").innerHTML = html;
    document.querySelector("#status").innerHTML = `Found ${list.length} Pokémon`;
}


	function dataError(e) {
    document.querySelector("#status").innerHTML = "<b>No Pokémon found. Try a real name like 'pikachu'</b>";
}

	