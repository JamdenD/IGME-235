
    let selectedElement = null;

    const TRAY_POSITION = {x:50,y:500};
    const MAX_ITEM_LEFT = 770;
    const LINE_HEIGHT = 30;
    const ITEM_MARGIN = 10;
    const ITEM_SPACING = 8;
    const MAX_Z_INDEX = 1000;

    window.onload = function(){
        positionItems();
        setupDragging();
        document.getElementById("add").addEventListener("click", addItem);
    }

    function addItem() {
        let newItem = document.createElement("img");

        newItem.classList.add("item");

        // default image (you can change this)
        newItem.src = "images/default.png";
        newItem.alt = "new item";

        document.body.appendChild(newItem);

        // give it drag behavior
        newItem.onmousedown = function(e) {
            e.preventDefault();
            selectedElement = newItem;
            selectedElement.style.zIndex = MAX_Z_INDEX;
        };

        // position it somewhere visible (optional starting spot)
        setPosition(newItem, 100, 100);
    }


    document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".dropdown");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const content = button.nextElementSibling;

            // toggle visibility
            content.style.display =
                content.style.display === "block" ? "none" : "block";
        });
    });
});


    function setPosition(item,itemLeft,itemTop){
        item.style.left = itemLeft + "px";
        item.style.top = itemTop + "px";
    }

    function getItem(text){
        let allItems = document.querySelectorAll(".item");
        for (let item of allItems){
            if (item.Content == item){
                return item; //returns matched word and breaks out of loop
            }
        }
        //no match - the function will return undefined
    }

    function positionItems(){

        let doMousedown = function(e){
            e.preventDefault();
            selectedElement = e.target;
            selectedElement.style.zIndex = MAX_Z_INDEX;
        };

        let allItems = document.querySelectorAll(".item");
        let itemSpacing = ITEM_SPACING;
        let itemLeft = ITEM_MARGIN;
        let itemTop = TRAY_POSITION.y;

        for (let item of allItems){
            setPosition(item,itemLeft,itemTop)
            let itemWidth = item.clientWidth;
            itemLeft += itemWidth + itemSpacing
            if (itemLeft >= MAX_ITEM_LEFT){
                itemLeft = ITEM_MARGIN;
                itemTop += LINE_HEIGHT;
            }

            item.onmousedown = doMousedown;
        }

    } //end positionWords
 	
    function setupDragging(){

        document.onmousemove = function(e){
            e.preventDefault();
            if(selectedElement){
                let mousePos = getMousePos(document.body,e);

                //adjust position so we drag words from their middle
                mousePos.x -= selectedElement.clientWidth/2;
                mousePos.y -= selectedElement.clientHeight/2;

                setPosition(selectedElement, mousePos.x, mousePos.y);
            }
        };

        document.onmouseup = function(e){
            if(selectedElement){
                selectedElement.style.zIndex =  MAX_Z_INDEX - 1;
            }
            selectedElement = null; 
        };
    }//end setup dragging

    //Helper
    function getMousePos(parentElement,event) {
        let rect = parentElement.getBoundingClientRect();
        return{
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }


    // Functions for the add new item modal
    const add = document.getElementById("add");
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("closeButton");
    const itemType = document.getElementById("itemType");
    const subItem = document.getElementById("subItem");

    // sub-options for each main option
    const data = {
    Tops: ["Shirt", "Blouse", "Mini Dress"],
    Bottoms: ["Shorts", "Pants", "Short Skirt", "Long Skirt"],
    Shoes: ["Sneakers", "Flats"],
    Accessories: ["Necklace", "Earrings", "Gloves"]
    };

    add.onclick = () => {
    modal.classList.remove("hidden");
    updateSubOptions();
    };

    closeButton.onclick = () => {
    modal.classList.add("hidden");
    };

    itemType.onchange = updateSubOptions;

    function updateSubOptions() {
    const selected = mainOption.value;
    subOption.innerHTML = "";

    data[selected].forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        subOption.appendChild(opt);
    });
}
