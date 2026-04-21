
    let selectedElement = null;

    const TRAY_POSITION = {x:50,y:500};
    const MAX_WORD_LEFT = 770;
    const LINE_HEIGHT = 30;
    const WORD_MARGIN = 10;
    const WORD_SPACING = 8;
    const MAX_Z_INDEX = 1000;

    window.onload = function(){
        positionWords();
        setupDragging();
    }

    function setPosition(word,wordLeft,wordTop){
        word.style.left = wordLeft + "px";
        word.style.top = wordTop + "px";
    }

    function getWord(text){
        let allWords = document.querySelectorAll(".word");
        for (let word of allWords){
            if (word.textContent == text){
                return word; //returns matched word and breaks out of loop
            }
        }
        //no match - the function will return undefined
    }

    function positionWords(){

        let doMousedown = function(e){
            e.preventDefault();
            selectedElement = e.target;
            selectedElement.style.zIndex = MAX_Z_INDEX;
        };

        let allWords = document.querySelectorAll(".word");
        let wordSpacing = WORD_SPACING;
        let wordLeft = WORD_MARGIN;
        let wordTop = TRAY_POSITION.y;

        for (let word of allWords){
            setPosition(word,wordLeft,wordTop)
            let wordWidth = word.clientWidth;
            wordLeft += wordWidth + wordSpacing
            if (wordLeft >= MAX_WORD_LEFT){
                wordLeft = WORD_MARGIN;
                wordTop += LINE_HEIGHT;
            }

            word.onmousedown = doMousedown;
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