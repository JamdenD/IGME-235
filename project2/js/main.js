window.onload = (e) => {
    document.querySelector("#search").onclick = searchWithFilters;

    loadLastSearch();
};
	
	let displayTerm = "";
	
function loadLastSearch() {
    let saved = localStorage.getItem("pokedopt_last_search");

    if (!saved) return;

    let data = JSON.parse(saved);

    if (data.type) document.querySelector("#type").value = data.type;
    if (data.generation) document.querySelector("#generation").value = data.generation;
    if (data.habitat) document.querySelector("#habitat").value = data.habitat;
    if (data.limit) document.querySelector("#limit").value = data.limit;
}

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
    let types = obj.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`).join(" ");

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

function saveLastSearch() {
    let lastSearch = {
        type: document.querySelector("#type").value,
        generation: document.querySelector("#generation").value,
        habitat: document.querySelector("#habitat").value,
        limit: document.querySelector("#limit").value
    };

    localStorage.setItem("pokedopt_last_search", JSON.stringify(lastSearch));
}

async function searchWithFilters() {
    saveLastSearch();

    let type = document.querySelector("#type").value;
    let generation = document.querySelector("#generation").value;
    let habitat = document.querySelector("#habitat").value;
    let limit = parseInt(document.querySelector("#limit").value);

    document.querySelector("#status").innerHTML = "Searching Pokemon...";

    try {
        let results = [];

        if (type !== "any") {
            let res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            let data = await res.json();
            results.push(data.pokemon.map(p => p.pokemon.name));
        }

        if (generation !== "any") {
            let genMap = {
                "gen-I": 1, "gen-II": 2, "gen-III": 3,
                "gen-IV": 4, "gen-V": 5, "gen-VI": 6,
                "gen-VII": 7, "gen-VIII": 8, "gen-IX": 9
            };

            let res = await fetch(`https://pokeapi.co/api/v2/generation/${genMap[generation]}`);
            let data = await res.json();
            results.push(data.pokemon_species.map(p => p.name));
        }

        let habitat = document.querySelector("#habitat").value;

        if (habitat !== "any") {
            let res = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`);
            let data = await res.json();
            results.push(data.pokemon_species.map(p => p.name));
        }


        if (results.length === 0) {
            document.querySelector("#content").innerHTML = "<p>Select at least one filter</p>";
            return;
        }

        let finalList = results.reduce((a, b) =>
            a.filter(x => b.includes(x))
        );

        finalList = finalList.slice(0, limit);

        displayPokemonList(finalList);

    } catch (err) {
        document.querySelector("#status").innerHTML = "Error filtering Pokémon";
        console.error(err);
    }
}

function getEvolutionChain(chain) {
    let evo = [];
    let current = chain;

    while (current) {
        evo.push(current.species.name);
        current = current.evolves_to[0];
    }

    return evo.join(" → ");
}


async function displayPokemonList(list) {
    if (!list || list.length === 0) {
        document.querySelector('#status').innerHTML = "<p>No pokemon match that description XP</p>";
        document.querySelector("#content").innerHTML = "<p>No matches found</p>";
        return;
    }

    document.querySelector("#content").innerHTML = "<p>Loading Pokémon data...</p>";

    let html = "";

    for (let name of list) {
        try {
            let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            let data = await res.json();

            let sprite = data.sprites.front_default;

            let types = data.types
            .map(t => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`)
            .join(" ");


            // 2. Species data (important new part)
        let speciesRes = await fetch(data.species.url);
        let speciesData = await speciesRes.json();

        // Pokédex entry (English only)
        let entryObj = speciesData.flavor_text_entries.find(
            e => e.language.name === "en"
        );
        let pokedexEntry = entryObj ? entryObj.flavor_text.replace(/\f/g, " ") : "No entry found.";

        let habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";
        let captureRate = speciesData.capture_rate;

        // 3. Evolution chain
        let evoRes = await fetch(speciesData.evolution_chain.url);
        let evoData = await evoRes.json();

        let evolutionChain = getEvolutionChain(evoData.chain);

            html += `
            <div class="result">

                <div class="card-header">
                    <h3>${name.toUpperCase()}</h3>
                </div>

                <div class="sprite-container">
                    <img src="${sprite}" alt="${name}">
                </div>

                <div class="type-row">
                    ${types}
                </div>

                <div class="pokedex-entry">
                    <p>${pokedexEntry}</p>
                </div>

                <div class="info-block">
                <p><b>Habitat:</b> ${habitat}</p>
                <p><b>Capture Rate:</b> ${captureRate}</p>
            </div>

            <div class="evo-chain">
                <p><b>Evolution:</b> ${evolutionChain}</p>
            </div>

            </div>
        `;

        } catch (err) {
            console.error("Error loading", name);
        }
    }

    document.querySelector("#content").innerHTML = html;
    document.querySelector("#status").innerHTML = `Showing ${list.length} Pokémon`;
}



	function dataError(e) {
    document.querySelector("#status").innerHTML = "<b>No Pokémon found. Try a real name like 'pikachu'</b>";
}

	