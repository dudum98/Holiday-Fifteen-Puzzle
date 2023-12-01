(function() {
    // Global variables used in methods below
    "use strict";
    let tileSize = 100;
	let gameMoves = 0;
	let gameTimer;
    let temporaryVar = 4;
    let empty_Col = 3;
    let empty_Row = 3;
	let totalHours = 0;
	let totalSeconds = 0;
    let totalMinutes = 0;
    let finalSecondsCount = 0;
    let isnewGame = true;

    //These functions are used after the page loads in
    window.onload = function(){
		create_tiles();
		set_tileSize();
        document.getElementById("select").onchange = change_tileSize; 
		document.getElementById("start_game").onclick = shuffle_tiles;	//id from html 'start_game'   
        add_bg_events(8);
    };


    //function to play the game sound and control volume etc. 
    function playSound(sound_location, volume = 1.0){
        // Generic method to play sound effects. Pass string to location with optional volume between 0.0 & 1.0
        let puzzle_sound = new Audio(sound_location);
        puzzle_sound.play();
        puzzle_sound.volume = volume;
    }

    //function to set up timer
    function countUpTimer(){
		finalSecondsCount+=1;
        totalHours = 0;
		totalMinutes = Math.floor((finalSecondsCount) / 60);
		totalSeconds = finalSecondsCount - (totalMinutes * 60);
		document.getElementById("timer").innerHTML = "Time: " + totalHours + ":" + totalMinutes + ":" + totalSeconds;
	}
    
	//function to switch backgrounds
	function change_bg(background){
        let imgPath = "url(\"" + background + "\")";
		let change_bg = document.getElementsByClassName("tiles");
		for (let i = 0; i < (temporaryVar * temporaryVar)-1; i++){
			change_bg[i].style.backgroundImage = imgPath;
		}
	}
	//function to help set up background changes
	function add_bg_events(num_pic) {
		// Sets up background change options where num_pic is the number of backgrounds labeled in the format "pic#". 
		let col3 = document.getElementById("column3");
		
		for (let i = 0; i <= num_pic-1; i++) {	
			let img_file = "pic" + i;
			let img_file_F = img_file + ".jfif";
			let img = document.createElement("img");
            img.src =  img_file_F;
			img.classList.add("img1");
			
			let buttn = document.createElement("button");
            buttn.id = img_file;
			buttn.classList.add("choose_bg");
			buttn.addEventListener('click', change_bg.bind(this, img_file_F), false);
            buttn.appendChild(img);
			col3.appendChild(buttn);
		}
	}
	//function that creates the tiles 
	function create_tiles(){
        for (let i = 1; i < temporaryVar * temporaryVar; i++){
            let div = document.createElement("div");
            div.innerHTML = i;
            div.className = "tiles";
            let row = Math.floor((i - 1) / temporaryVar);
            let column = (i - 1) % temporaryVar;

			//set width and height
			div.style.width = tileSize - 1 + "px";
            div.style.height = div.style.width;
            
			//position of every tile
            let y = column * (-1) * tileSize + "px";
			let x = row * (-1) * tileSize + "px";

			//this centers the number on each tile
			div.style.display = "flex";
			div.style.alignItems = "center";
			div.style.justifyContent = "center";
            div.style.backgroundPosition = y + " " + x;

			//show the position
            div.id = "pos" + row + "_" + column;
            div.style.left = column * tileSize + "px";
			div.style.color = "#D1D1D1";
            div.style.top = row * tileSize + "px";
            document.getElementById("game_area").appendChild(div);
            check_mouseover(div);
        }
    }
    //function that gives each tile an animation
    function animate_tile(div) {
        div.offsetHeight; // Triggers animation to restart.
        div.style.animation=null;
        div.style.animation="ease";
    }

    //function to shuffle the puzzle board 
    function shuffle_tiles(){
        // Prompts the user if they want to actually restart game
		document.getElementById("start_game").innerHTML = "Re-Shuffle";
        let end_game_prompt = false;
    
        if (isnewGame || end_game_prompt){
            for (let i = 0; i < 1000; i++){
                let all_tiles = document.getElementsByClassName("tiles");
				let neigbors = [];
                for (let j = 0; j < all_tiles.length; j++){
                    if (check_move(all_tiles[j]))
                        neigbors.push(all_tiles[j]);
                }
				let num = rand_num(0, neigbors.length - 1);
                let let_top = neigbors[num].style.top;
                let let_Left = neigbors[num].style.left;
				neigbors[num].style.left = empty_Col * tileSize + "px";
                neigbors[num].style.top = empty_Row * tileSize + "px";
                neigbors[num].id = "pos" + empty_Row + "_" + empty_Col;
                empty_Row = parseInt(let_top) / tileSize;
                empty_Col = parseInt(let_Left) / tileSize;
				clearInterval(gameTimer);
            }
			finalSecondsCount = 0;	
            reset_score();
        }

        if (!isnewGame){
            let end_game_prompt = confirm("Restart game?");
			if(end_game_prompt){
				clearInterval(gameTimer);
			}
        }
    }
	
	function rand_num(min, max){
        // Get random integer in given range (inclusive). 
        max = Math.floor(max);
        min = Math.ceil(min);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //function to set the size of each tile
    function set_tileSize(){
        let select_tileSize = document.createElement("select");
        select_tileSize.id = "select";
        for (let i = 1; i < 9; i++){
            let options = document.createElement("option");
            options.value = (i+2);
            options.id = "option" + (i+2);
            options.innerHTML = (i+2) + " x " + (i+2);
            select_tileSize.appendChild(options);
        }
        select_tileSize.classList.add("buttons");
        document.getElementById("controls").appendChild(select_tileSize);
		//selected a 4x4 board as the default tileSize
		document.getElementById("option4").selected = "selected";
    }

    //function that adjusts the board dimensions if the user selects another size
    function change_tileSize(){
		document.getElementById("start_game").innerHTML = "Start Game"; // Reset start button when user selects a new tileSize. 
        empty_Col = this.value - 1;
        empty_Row = this.value - 1;
        temporaryVar = this.value;
        tileSize = parseInt(400 / this.value);

        while (document.getElementById("game_area").contains(document.querySelector(".tiles"))){
            document.getElementById("game_area").removeChild(document.querySelector(".tiles"));
        }
        create_tiles();
        let audio = document.getElementById("audio");
        audio.volume = 0.3;
        audio.pause();
        audio.play();
        isnewGame = true;
    }

    //function to display the number of moves made by the user
    function set_MoveText(){
        let text = "gameMoves Made: " + gameMoves.toString();
        document.getElementById("counter").innerHTML = text;
    }

    //function that will highlight movable tiles in red
    function check_mouseover(div){
        div.onmouseover = function(){
            if (check_move(this)) {
                this.classList.add("text1");
                this.style.color = "red";

            }
        };
        //removes the highlight if the mouse isn't point on the tile anymore
        div.onmouseout = function(){
            if (check_move(this)){
                this.style.color = "#D1D1D1";
				this.classList.remove("text1");
            }
        };
        div.onclick = tiles_OnClick;
    }

    //function handles a lot of click related events on the baord
    function tiles_OnClick(){
        if (check_move(this)){
            move(this);
            gameMoves+=1;
            set_MoveText();
            if (checkState()){
                let aLert = document.getElementById("alert");
                
                finalSecondsCount = 0;
                audio.pause();
				clearInterval(gameTimer);
				reset_score();
            } 
			else{
                document.getElementById("show").innerHTML = "";
            }
        }
    }

    //function to assist with the movement of tiles
    function move(div){
        div.id = "pos" + empty_Row + "_" + empty_Col;
        let div_Row = parseInt(div.style.top) / tileSize;
		let div_Column = parseInt(div.style.left) / tileSize;
        div.style.top = empty_Row * tileSize + "px";
        div.style.left = empty_Col * tileSize + "px";
        empty_Col = div_Column;
        empty_Row = div_Row;
        //plays music
		animate_tile(div);
        playSound("sound/chillout.mp3");
    }

	//function to validate if a move is allowed
    function check_move(div){
        let div_Column1 = parseInt(div.style.left) / tileSize;
        let div_Row1 = parseInt(div.style.top) / tileSize;
        if (empty_Row == div_Row1){
            return Math.abs(empty_Col - div_Column1) == 1;
        } 
		else if (empty_Col == div_Column1){
            return Math.abs(empty_Row - div_Row1) == 1;
        } 
		else {
            return false;
        }
    }

    function checkState(){
        let tiles = document.querySelectorAll(".tiles");

        for (let i = 0; i < tiles.length; i++){
            let column = i % temporaryVar;
            let row = Math.floor(i / temporaryVar);
            if (tiles[i].id != "pos" + row + "_" + column){
                return false;
            }
        }
        return true;
    }

    //function to restart the music as well as some other important data when a match is finished
    function reset_score(){ 
        gameMoves = 0;
        isnewGame = false;
		gameTimer = setInterval(countUpTimer, 1000);
        set_MoveText();
        let audio = document.getElementById("audio");
        audio.volume = 0.3; 
        audio.currentTime = 0; 
        audio.play();
    }

})();