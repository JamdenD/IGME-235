
    let selectedElement = null;

    const TRAY_POSITION = {x:50,y:500};
    const MAX_ITEM_LEFT = 770;
    const LINE_HEIGHT = 30;
    const ITEM_MARGIN = 10;
    const ITEM_SPACING = 8;
    const MAX_Z_INDEX = 100;

    let add, modal, closeButton, submitButton, itemType, subItem;

    // sub-options for each main option
    const data = {
    tops: [
        {name:"Short sleeve", img:"images/short-sleeve-shirt.png"}, 
        {name:"Long sleeve", img:"images/long-sleeve-shirt.png"}, 
        {name:"Short dress", img:"images/short-dress.png"}, 
        {name:"Long dress", img:"images/long-dress.png"}],
    bottoms: [
        {name:"Long pants", img:"images/flared-pants.png"}, 
        {name:"Long skirt", img:"images/long-skirt.png"}, 
        {name:"Short skirt", img:"images/short-skirt.png"}, 
        {name:"Shorts", img:"images/shorts.png"}],
    shoes: [
        {name:"Boots", img:"images/boots.png"}, 
        {name:"Flats", img:"images/flats.png"}, 
        {name:"Sneakers", img:"images/sneakers.png"}],
    accessories: [
        {name:"Earrings", img:"images/earrings.png"}, 
        {name:"Glasses", img:"images/glasses.png"}, 
        {name:"Hair bow", img:"images/hair-bow.png"}, 
        {name:"Hair clips", img:"images/hair-clips.png"}, 
        {name:"Headband", img:"images/headband.png"}, 
        {name:"Headphones", img:"images/headphones.png"}, 
        {name:"Necklace", img:"images/necklace.png"}, 
        {name:"Scarf", img:"images/scarf.png"}]
    };

    // onload window function
    window.onload = function(){
        //define constants
        add = document.getElementById("add");
        modal = document.getElementById("modal");
        closeButton = document.getElementById("closeButton");
        submitButton = document.getElementById("submitButton");
        itemType = document.getElementById("itemType");
        subItem = document.getElementById("subItem");

        let clearBtn = document.getElementById("clearWardrobe");
        clearBtn.onclick = clearWardrobe;

        setupDragging();
        loadWardrobe();
        
        add.onclick = () => {
            modal.classList.remove("hidden");
            updateSubOptions();
        }

        closeButton.onclick = () => {
        modal.classList.add("hidden");
        };

        itemType.onchange = updateSubOptions;
        submitButton.onclick = createNewWardrobeItem;

        const buttons = document.querySelectorAll(".dropdown");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const content = button.nextElementSibling;
                content.style.display = content.style.display === "block" ? "none" : "block";
            })
        })
    }

    //set position
    function setPosition(item,itemLeft,itemTop){
        item.style.left = itemLeft + "px";
        item.style.top = itemTop + "px";
    }

    // Shared mousedown for existing and new items
    function dragMousedown(e) {
        e.preventDefault();
        
        selectedElement = e.target.closest(".item");

        if (!selectedElement.dataset.category && selectedElement.parentElement) {
            selectedElement.dataset.category = selectedElement.parentElement.id;
        }

        const room = document.getElementById("room");

        if (e.target.parentElement !== room) {
            room.appendChild(selectedElement);
        }

        selectedElement.style.position = "absolute";
        selectedElement.style.zIndex = MAX_Z_INDEX;
    }

    function setupDragging(){
        document.onmousemove = function(e){
            if(selectedElement){
                e.preventDefault();
                let mousePos = getMousePos(document.body,e);

                mousePos.x -= selectedElement.clientWidth/2;
                mousePos.y -= selectedElement.clientHeight/2;

                setPosition(selectedElement, mousePos.x, mousePos.y);
            }
        };

        document.onmouseup = function(e){
            saveWardrobe();

            const wardrobe = document.getElementById("wardrobe");
            const wardrobeArea = wardrobe.getBoundingClientRect();

            if (
                e.clientX >= wardrobeArea.left &&
                e.clientX <= wardrobeArea.right &&
                e.clientY >= wardrobeArea.top &&
                e.clientY <= wardrobeArea.bottom 
                ) {
                    const category = selectedElement.dataset.category;
                    const section = document.getElementById(category);

                    if (section) {
                        selectedElement.style.position = "static";
                        selectedElement.style.left = "";
                        selectedElement.style.top = "";
                        selectedElement.style.zIndex = "";
                    
                        section.appendChild(selectedElement);
                    }
                } else {
                    selectedElement.style.zIndex = MAX_Z_INDEX -1;
                }

            selectedElement = null; 
        };
    }//end setup dragging

    //Helper get mouse position
    function getMousePos(parentElement,event) {
        let rect = parentElement.getBoundingClientRect();
        return{
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function updateSubOptions() {
        const selected = itemType.value;
        subItem.innerHTML = "";

        if (data[selected]) {
            data[selected].forEach(item => {
            const option = document.createElement("option");
            option.value = item.img;
            option.textContent = item.name;
            subItem.appendChild(option);
            });
        }
    }

    function createNewWardrobeItem() {
        const category = itemType.value;
        const imgFile = subItem.value;
        const color = document.getElementById("colorPicker").value;

        let newItem = document.createElement("div");
        newItem.classList.add("item");
        newItem.dataset.category = category;
        
        /*newItem.style.webkitMaskImage = `url("${imgFile}")`;
        newItem.style.maskImage = `url("${imgFile}")`;

        newItem.style.setProperty("--item-color", color);

        let img = new Image();
        img.src = imgFile;

        img.onload = () => {
            newItem.style.width = img.naturalWidth + "px";
            newItem.style.height = img.naturalHeight + "px";
        };*/

        let img = document.createElement("img");
        img.src = imgFile;

        let overlay = document.createElement("div");
        overlay.classList.add("color-overlay");
        overlay.style.backgroundColor = color;

        newItem.appendChild(img);
        newItem.appendChild(overlay);

        newItem.onmousedown = dragMousedown;

        const section = document.getElementById(category);
        if (section){
            section.appendChild(newItem);

            section.style.display = "block";
        }

        modal.classList.add("hidden");
    }

    //saving everything

    function saveWardrobe() {
        const items = document.querySelectorAll(".item");

        const data = [];

        items.forEach(item => {
            const img = item.querySelector("img");
            const overlay = item.querySelector(".color-overlay");

            data.push({
                category: item.dataset.category,
                src: img.src,
                color: overlay ? overlay.style.backgroundColor : "",
                parent: item.parentElement.id
            })
        })

        localStorage.setItem("wardrobeSave", JSON.stringify(data));
    }

    function loadWardrobe() {
        const saved = JSON.parse(localStorage.getItem("wardrobeSave"));
        if (!saved) return;

        saved.forEach(item => {
            let newItem = document.createElement("div");
            newItem.classList.add("item");
            newItem.dataset.category = item.category;

            let img = document.createElement("img");
            img.src = item.src;

            let overlay = document.createElement("div");
            overlay.classList.add("color-overlay");
            overlay.style.backgroundColor = item.color;

            newItem.appendChild(img);
            newItem.appendChild(overlay);

            newItem.onmousedown = dragMousedown;

            const section = document.getElementById(item.category);

            if (section) {
                section.appendChild(newItem);
            }
        });
    }

    function clearWardrobe() {
        if (!confirm("Are you sure you want to clear your wardrobe?")) return;

        document.querySelectorAll(".item").forEach(item => item.remove());
        localStorage.removeItem("wardrobeSave");
    }
