class tree {

    constructor(state){
        this.state = state;
        this.burn_start = undefined;
        this.spreads_fire = false;
    }
    getDisplay(){
        switch(this.state){
            case "normal":
                return color_text("木", "green");
            case "burning":
                return color_text("火", "red");
            case "burnt":
                return color_text("灰", "gray");
        }
    }
    ignite(){
        if(this.state === "normal"){
            this.state = "burning";
            this.burn_start = new Date()
        }
    }
    system(){
        switch(this.state){
            case "normal":
                break;
            case "burning":
                if(current_time - this.burn_start >= 600){
                    this.spreads_fire = true;
                }
                if(current_time - this.burn_start >= 2000){
                    this.spreads_fire = false;
                    this.state = "burnt";
                }
                break;
        }
    }
    player_interact(){
        this.ignite();
    }
    player_can_traverse(){
        return true;
    }
}
class water {
    constructor(state){
        this.ripple_iterator = 0;
        this.color = undefined
    }
    getDisplay(){ 
        var modifier = Math.floor(Math.random()*10000) % 8;
        return color_text("水", this.color); 
    }
    system(){
        if(this.ripple_iterator % 10 === 0){
            this.color = "#" + 
                (Math.floor(Math.random()*10000) % 2).toString(16) +
                (Math.floor(Math.random()*10000) % 8).toString(16) +
                (Math.floor(Math.random()*10000) % 8).toString(16) +
                (Math.floor(Math.random()*10000) % 2).toString(16) +
                "FF"
        }
        this.ripple_iterator += 1;
    }
    ignite(){}
    player_can_traverse(){return false;}
}

class empty {
    constructor(state) {
        this.state = state;
    }
    getDisplay() {
        return color_text("。", "white");
    }
    ignite(){}
    system(){}
    player_interact(){}
    player_can_traverse(){
        return true;
    }
}

class forest {
    constructor(state) {
        this.state = state;
        this.burn_start = undefined;
        this.spreads_fire = false;
    }
    getDisplay() {
        switch(this.state){
            case "normal":
                return color_text("森", "darkgreen");
            case "burning":
                return color_text("焱", "red");
            case "burnt":
                return color_text("灰", "gray");
        }
    }
    ignite(){
        if(this.state === "normal"){
            this.state = "burning";
            this.burn_start = new Date()
        }
    }
    system(){
        switch(this.state){
            case "normal":
                break;
            case "burning":
                if(current_time - this.burn_start >= 500){
                    this.spreads_fire = true;
                }
                if(current_time - this.burn_start >= 10000){
                    this.spreads_fire = false;
                    this.state = "burnt";
                }
        }
    }
    player_interact(){}
    player_can_traverse(){
        return this.state === "burnt"
    }
}

function color_text(text, color){
    return "<font color=\"" + color + "\">"+ text + "</font>";
}

function keyPush(evt){
    
    var temp_x = player_x;
    var temp_y = player_y;
    switch(evt.keyCode) {
        case 37:
            temp_x--;
            break;
        case 38:
            temp_y--;
            break;
        case 39:
            temp_x++;
            break;
        case 40:
            temp_y++;
            break;
    }

    if(
        temp_x >= 0 && temp_x < level[0].length
        && temp_y >= 0 && temp_y < level.length
        && level[temp_y][temp_x].player_can_traverse()
        ){
        player_x = temp_x;
        player_y = temp_y;
        level[temp_y][temp_x].player_interact();
    }
    view_offset_x = Math.min(Math.max(0, player_x - 9), level[0].length - 19);
    view_offset_y = Math.min(Math.max(0, player_y - 9), level.length - 19);
    
}
function game_loop(){
    current_time = new Date();
    for(var i = 0; i < level.length; i++){
        for(var j = 0; j < level[0].length; j++) {
            level[i][j].system();
            if(level[i][j].spreads_fire){
                if(i-1 >= 0){ level[i-1][j].ignite() }
                if(i+1 < level.length){ level[i+1][j].ignite() }
                if(j+1 < level[0].length){ level[i][j+1].ignite() }
                if(j-1 >= 0){ level[i][j-1].ignite() }
                
            }
        }
    }

    var level_view = new Array(19);
    for(var i = view_offset_y; i < view_offset_y + 19; i++){
        level_view[i] = new Array(19);
        for(var j = view_offset_x; j < view_offset_x + 19; j++) {
            level_view[i][j] = level[i][j].getDisplay();
        }
    }

    level_view[player_y][player_x] = "兵";
    document.getElementById("r0").innerHTML = level_view[view_offset_y + 0].join("");
    document.getElementById("r1").innerHTML = level_view[view_offset_y + 1].join("");
    document.getElementById("r2").innerHTML = level_view[view_offset_y + 2].join("");
    document.getElementById("r3").innerHTML = level_view[view_offset_y + 3].join("");
    document.getElementById("r4").innerHTML = level_view[view_offset_y + 4].join("");
    document.getElementById("r5").innerHTML = level_view[view_offset_y + 5].join("");
    document.getElementById("r6").innerHTML = level_view[view_offset_y + 6].join("");
    document.getElementById("r7").innerHTML = level_view[view_offset_y + 7].join("");
    document.getElementById("r8").innerHTML = level_view[view_offset_y + 8].join("");
    document.getElementById("r9").innerHTML = level_view[view_offset_y + 9].join("");
    document.getElementById("r10").innerHTML = level_view[view_offset_y + 10].join("");
    document.getElementById("r11").innerHTML = level_view[view_offset_y + 11].join("");
    document.getElementById("r12").innerHTML = level_view[view_offset_y + 12].join("");
    document.getElementById("r13").innerHTML = level_view[view_offset_y + 13].join("");
    document.getElementById("r14").innerHTML = level_view[view_offset_y + 14].join("");
    document.getElementById("r15").innerHTML = level_view[view_offset_y + 15].join("");
    document.getElementById("r16").innerHTML = level_view[view_offset_y + 16].join("");
    document.getElementById("r17").innerHTML = level_view[view_offset_y + 17].join("");
    document.getElementById("r18").innerHTML = level_view[view_offset_y + 18].join("");
}

var level;
var game_view;
var view_offset_x = 0;
var view_offset_y = 0;
var player_y = 4;
var player_x = 0;
var current_time;

window.onload=function(){
    level = [
        ["e", "e", "e", "e", "t", "f", "t", "w", "w", "w", "e", "e", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "w", "w", "e", "e", "e", "e", "e", "t", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "e", "w", "w", "w", "e", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "t", "t", "w", "w", "t", "t", "t", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "f", "e", "e", "w", "w", "e", "e", "e", "t", "f", "f", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "t", "e", "w", "w", "w", "e", "e", "e", "e", "t", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "w", "w", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "w", "w", "e", "e", "e", "e", "e", "t", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "e", "w", "w", "w", "w", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "e", "w", "e", "e", "e", "e", "e", "t", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "e", "e", "w", "e", "e", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "e", "w", "e", "e", "e", "e", "e", "t", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "e", "e", "w", "w", "e", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "e", "e", "e", "w", "w", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "f", "e", "e", "e", "e", "e", "e", "e", "t", "f", "f", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "t", "e", "e", "e", "e", "e", "e", "e", "e", "t", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "e", "e", "e", "e", "e", "e", "e", "t", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "t", "f", "t", "e", "e", "e", "e", "e", "e", "e", "t", "f", "t", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "t", "e", "e", "e", "e", "e", "e", "e", "e", "e", "t", "e", "e", "e", "e"]
    ]
    init_level(level);
    game_view = document.getElementById("game");
    document.addEventListener("keydown", keyPush);
    setInterval(game_loop, 1000/30)
}
function init_level(level){
    for(var i = 0; i < level.length; i++) {
        for(var j = 0; j < level[i].length; j++){
            switch(level[i][j]){
                case "t":
                    level[i][j] = new tree("normal")
                    break;
                case "e":
                    level[i][j] = new empty("normal")
                    break;
                case "f":
                    level[i][j] = new forest("normal")
                    break;
                case "w":
                    level[i][j] = new water("normal")
                    break;
            }
        }
    }
}

