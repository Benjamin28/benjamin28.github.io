class tree {

    constructor(state){
        this.state = state;
        this.burn_start = undefined;
        this.spreads_fire = false;
        this.translation = "tree";
    }
    getDisplay(){
        switch(this.state){
            case "normal":
                return color_text("木", "green");
            case "burning":
                return color_text("火", "red");
            case "burnt":
                return color_text("灰", "lightgray");
        }
    }
    ignite(){
        if(this.state === "normal"){
            this.state = "burning";
            this.burn_start = new Date()
        }
    }
    freeze(){}
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
        return this.state === "burnt";
    }
}
class water {
    constructor(state){
        this.ripple_iterator = 0;
        this.color = undefined
        this.translation = "water";
        this.state = state;
    }
    getDisplay(){
        switch(this.state){
            case "liquid":
                if(this.ripple_iterator % 10 === 0){
                    this.color = "#" + 
                        (Math.floor(Math.random()*10000) % 2).toString(16) +
                        (Math.floor(Math.random()*10000) % 8).toString(16) +
                        (Math.floor(Math.random()*10000) % 8).toString(16) +
                        (Math.floor(Math.random()*10000) % 2).toString(16) +
                        "FF";
                }
                this.ripple_iterator += 1;
                return color_text("水", this.color); 
            case "solid":
                return color_text("冰", "silver");
        }
        
    }
    system(){
        if(this.state == "solid" 
        && current_time - this.freeze_time > 2000){
            this.state = "liquid"
        }
    }
    player_interact(){}
    ignite(){}
    freeze(){
        if(this.state == "liquid"){
            this.state = "solid";
            this.freeze_time = current_time
        }
    }
    player_can_traverse(){return this.state == "solid";}
}
class prop {
    constructor(icon, color, translation){
        this.icon = icon;
        this.color = color;
        this.translation = translation;
    }
    getDisplay(){
        return color_text(this.icon, this.color);
    }
    ignite(){}
    freeze(){}
    system(){}
    player_interact(){}
    player_can_traverse(){ return false; }
}

class ground {
    constructor(icon, color, translation){
        this.icon = icon;
        this.color = color;
        this.translation = translation;
    }
    getDisplay(){
        return color_text(this.icon, this.color);
    }
    ignite(){}
    freeze(){}
    system(){}
    player_interact(){}
    player_can_traverse(){ return true; }
}

class empty {
    constructor(state) {
        this.state = state;
    }
    getDisplay() {
        return color_text("。", "white");
    }
    ignite(){}
    freeze(){}
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
        this.translation = "forest";
    }
    getDisplay() {
        switch(this.state){
            case "normal":
                return color_text("森", "darkgreen");
            case "burning":
                return color_text("焱", "red");
            case "burnt":
                return color_text("灰", "lightgray");
        }
    }
    ignite(){
        if(this.state === "normal"){
            this.state = "burning";
            this.burn_start = new Date();
        }
    }
    freeze(){}
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

class money {
    constructor(money_amount){
        this.money_amount = money_amount;
    }
    getDisplay(){
        var char;
        switch (this.money_amount) {
            case 0:
                return color_text("。", "white");
            default:
                return color_text("金", "gold");
        }
    }
    ignite(){
        this.money_amount = 0
    }
    freeze(){}
    system(){}
    player_interact(){
        change_player_money(player_money + this.money_amount);
        this.money_amount = 0;
    }
    player_can_traverse(){
        return true;
    }
}

function change_player_money(new_amount){
    player_money = new_amount;
    const coin_str = "<div class=\"coin\"></div>";
    document.getElementById("coinpurse").innerHTML = coin_str.repeat(player_money)
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
        case 70:
            toggleItem();
            break;
        case 87:
            cast_spell(player_y-1, player_x);
            break;
        case 65:
            cast_spell(player_y, player_x-1);
            break;
        case 83:
            cast_spell(player_y+1, player_x);
            break;
        case 68:
            cast_spell(player_y, player_x+1);
            break;
        default:
            console.log(evt.keyCode);
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

function cast_spell(y, x) {
    if (x >= 0 && x < level[0].length && y >= 0 && y < level[0].length){
        switch (inventory[equiped_item]) {
            case "fire":
                level[y][x].ignite();
                break;
            case "ice":
                level[y][x].freeze();
                break;
        }
        
    }
}

function toggleItem() {
    equiped_item = (equiped_item + 1) % inventory.length;
    var env_item_html;
    switch(inventory[equiped_item]) {
        case "fire":
            inv_item_html = color_text("火", "red");
            break;
        case "ice":
            inv_item_html = color_text("冰", "blue");
            break;
        case "earth":
            inv_item_html = color_text("土", "green");
            break;
        case "air":
            inv_item_html = color_text("气", "lightblue");
            break;        
    }
    document.getElementById("inventory").innerHTML = inv_item_html;

}

function generate_subtitles(char_to_colored_text) { 
    var subtitle_divs = new Array();
    plain_chars = Array.from(char_to_colored_text.keys()).sort();
    plain_chars.forEach(function(element) {
        if(element != "。"){
            subtitle_divs.push(
                "<div>" + char_to_colored_text.get(element) + ": " + char_translations.get(element) + "</div>");
    
        }
    });
    return subtitle_divs.join("");
}

function game_loop(){
    current_time = new Date();
    for(var i = 0; i < level.length; i++){
        for(var j = 0; j < level[0].length; j++) {
            level[i][j].system();
            if(level[i][j].spreads_fire){
                if(i-1 >= 0){ level[i-1][j].ignite(); }
                if(i+1 < level.length){ level[i+1][j].ignite(); }
                if(j+1 < level[0].length){ level[i][j+1].ignite(); }
                if(j-1 >= 0){ level[i][j-1].ignite(); }
                
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

    level_view[player_y][player_x] = color_text("英", "black");
    for(var i = 0; i < 19; i++){
        var toWrite = level_view[view_offset_y + i].join("");
        if (document.getElementById("r"+i).innerHTML != toWrite) {
            document.getElementById("r"+i).innerHTML = toWrite;
        }
    }
    var char_to_html = new Map();

    var level_chars = level_view.flat();
    for (var i = 0; i < level_chars.length; i++){
        const tile_char = level_chars[i].match(">(.)<")[1];
        if(!char_to_html.has(tile_char)){
            char_to_html.set(tile_char, level_chars[i]);
        }
    }
    visible_chars_map = char_to_html;
    const subtitles = generate_subtitles(char_to_html);
    document.getElementById("translation-box").innerHTML = subtitles;
}
var equiped_item = -1;
var inventory = ["fire", "ice", "earth", "air"];
var player_money = 0;
var level;
var view_offset_x = 0;
var view_offset_y = 0;
var player_y = 4;
var player_x = 0;
var current_time;
var visible_chars_map;
const char_translations = new Map([
    ["山", "Mountain"],
    ["墙", "Wall"],
    ["路", "Road"],
    ["草", "Grass"],
    ["桥", "Bridge"],
    ["木", "Tree"],
    ["火", "Fire"],
    ["灰", "Ash"],
    ["水", "Water"],
    ["金", "Gold"],
    ["英", "Hero"],
    ["森", "Forest"],
    ["焱", "Great Fire"],
    ["土", "Earth"]]
);

window.onload=function(){
    level_str = [
        "gggggggggggggggggggggggggggggwwwwgggggmmmmmmmmmmmmmmmmmmgmmm",
        "gggggtgggggggggggggggggggggggwwwwggggggmmmmmmmmgmmmmmmmmmmmm",
        "ggggggggggggggggggggggggggggggwwwwggggggmmmmgmmmmmmtgg8mmmmm",
        "ggggggggggggggggggggggggggggggwwwwgggggggmmmmmmmmgggmmmmmmmg",
        "ggggggggggggggtggggggggggggggggwwwwgggggmmmmmmmgggmmmmmmmmmg",
        "ggggggggggggggggggggggggggggggggwwwwgggmmmmmmmggmmmmmmmmmmgg",
        "ggggggggggggggggggggggggggggggggwwwwgggmmmmmmmgmgmmmmmmmmggg",
        "gggggggggggggggggggggggggggggggwwwwwggggmmmmmmgmmmmmmmmmgggg",
        "ggggggggggggggggggggggggggggggwwwwwggggggmmmgggmmmmmmmgggggg",
        "gggggggggggggggggggggggggggggwwwwwgggggggmmggmggmmmmmggggggg",
        "ggggggggggggggggggggggggggggwwwwwggggggggmmgmmggmmmmgggggggg",
        "gggggggggggggggggggggggggggwwgwwgggggggggggggggggmmggggggggg",
        "ggggggggggggggggggggggggggwwgtwwgggggggggggggggggggggggggggg",
        "ggggggggtggggggggggggggggwwtffwwgggggggggggggggggggggggggggg",
        "ggggggggggggggggggggggggwtwtfftwwggggggggggggggggggggggggggg",
        "gggggggggggggggggggggggwtfwtfftfwwgggggggggggggggggggggggggg",
        "gggggggggggggggggggggtwttfwtfttttwwwgggggggggggggggggggggggg",
        "ggggggggggggggggggggtfwfftwttgggggggwwgggggggggggggggggggggg",
        "ggggggggggggggggggggtfffttwfftggggggggwggggggggggggggggggggg",
        "gggggggggggggggggggggttttfffftgggggggggwwggggggggggggggggggg",
        "ggggggggggggggggggggggggtttftgggggggggggwwgggggggggggggggggg",
        "gggggggggggggggggggggggggggtgggggggggggggwgggggggggggggggggg",
        "gggggggggggggggggggggggggggggggggggggggggwgggggggggggggggggg",
        "gggggtggggggggggtgggggggggggggggggggggggggwgqqqqqqqdqqqqqqqq",
        "ggggggggggggggggggggggggggggggggggggggggggwgqddddddddddddddq",
        "gggggggggggggggggggggggggggtggggggggggggggwgqddddddddddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "gggggggggggtggggggggggggggggtggggggggggggggwqddddddddddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggbddddddd8dddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "gggggggggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "wwwwwwwggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "wwwwwwwggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "ww9wwwwgggggggggggggtggggggggggggggggggggggwqddddddddddddddq",
        "wwwwwwwggggggggggggggggggggggggggggggggggggwqddddddddddddddq",
        "wwwwwwwggggggggggggggggggggggggggggggggggggwqqqqqqqqqqqqqqqq",
    ]
    init_level(level_str);
    document.addEventListener("keydown", keyPush);

    setInterval(game_loop, 1000/30)
    toggleItem();
}
function init_level(level_str){
    level = new Array(level_str.length);
    for(var i = 0; i < level_str.length; i++) {
        level_embedded = new Array(level_str[i].length)
        level[i] = level_embedded;
        for(var j = 0; j < level[i].length; j++){
            const tile_val = level_str[i][j]
            switch(tile_val){
                case "t":
                    level[i][j] = new tree("normal")
                    break;
                case " ":
                    level[i][j] = new empty("normal")
                    break;
                case "f":
                    level[i][j] = new forest("normal")
                    break;
                case "w":
                    level[i][j] = new water("liquid")
                    break;
                case "m":
                    level[i][j] = new prop("山", "sienna")
                    break;
                case "q":
                    level[i][j] = new prop("墙", "gray")
                    break;
                case "r":
                    level[i][j] = new ground("路", "tan");
                    break;
                case "g":
                    level[i][j] = new ground("草", "lightgreen");
                    break;
                case "b":
                    level[i][j] = new ground("桥", "brown");
                    break;
                case "d":
                    level[i][j] = new ground("土", "saddlebrown");
                    break
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    level[i][j] = new money(parseInt(tile_val));
                    break;
            }
        }
    }
}

