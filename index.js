// Values for displaying games on initial page load
var num_players = 'any';
var playing_time = 'any';
var rating = 'any';
var titles = [];
var descriptions = [];

function toggle_dropdown(val) {
    if (val == "num_players") document.getElementById("dropdown_num_players").classList.toggle("show");
    if (val == "playing_time") document.getElementById("dropdown_playing_time").classList.toggle("show");
    if (val == "rating") document.getElementById("dropdown_rating").classList.toggle("show");
}

function set_value(param, val) {
    console.clear();
    // Set parameter values
    if (param == "num_players") {
        num_players = String(val);
        document.getElementById("dropdown_num_players").classList.toggle("show");
    } else if (param == 'playing_time') {
        playing_time = String(val);
        document.getElementById("dropdown_playing_time").classList.toggle("show");
    } else if (param == 'rating') {
        rating = String(val);
        document.getElementById("dropdown_rating").classList.toggle("show");
    }
    console.log('----------------------');
    console.log('NUM PLAYERS:\t' + num_players + '\nPLAY TIME:\t' + playing_time + '\nRATING:\t\t' + rating);
    console.log('----------------------');
}

// D3 STUFF --> READ CSV, FILTER GAMES, INJECT HTML, TRANSITIONS
d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vTiim_s1-BTuF7FvWV_FAx7zKyto6avd7ziinjl6c0Clu_LV3xYXhPoxa5JTc-ZIa19g5jsXlF7z1Zp/pub?gid=1922239815&single=true&output=csv").then(function(data) {
    var image_dim = 300;
    var icon_dim = 35;

    // Sort csv by rating
    data = data.slice().sort((a, b) => d3.descending(a.rating, b.rating));

    // List games on load (based on initial values set at the top of this script)
    for (var i = 0; i < data.length; i++) {
        // Inject the games into HTML
        var div = d3.select(".injectable").append("div").attr("class", "game")
        div.append("p").attr("id", "game_title").text(data[i].primary_name);
        div.append("img").attr("src", data[i].original_image).attr("id", "thumbnail").attr("width", image_dim).attr("height", image_dim);
        div.append("p");
        div.append("img").attr("src", "icon_players.png").attr("width", icon_dim).attr("height", icon_dim);
        div.append("span").text(function() {
            // Text formatting for when min and max players are the same
            if (data[i].min_players == data[i].max_players) return " " + data[i].min_players;
            return " " + data[i].min_players + "-" + data[i].max_players });
        div.append("img").attr("src", "icon_time.png").attr("width", icon_dim).attr("height", icon_dim);
        div.append("span").text(function() {
            // Text formatting for when min and max playing times are the same
            if (data[i].min_time == data[i].max_time) return " " + data[i].min_time;
            return " " + data[i].min_time + "-" + data[i].max_time });
        div.append("img").attr("src", "icon_rating.png").attr("width", icon_dim).attr("height", icon_dim);
        div.append("span").text(" " + data[i].rating);
        titles.push(data[i].primary_name);
        descriptions.push(data[i].description.split("&#10;").join("\n").split("&rsquo;").join("'"));
        d3.selectAll("#thumbnail").on("click", function(d, i) {
            d3.select(".description").text(titles[i] + "\n\n" + descriptions[i]);
            // TODO: smooth scroll transition to top
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    };

    // Transition effect when displaying the games
    d3.selectAll(".game").transition().style("opacity", 1).style("padding-top", "5vh").duration(1000);

    // Dropdown-list user selections
    d3.selectAll("a").on("click", function() {
        titles = [];
        descriptions = [];
        // Remove any previously injected div's
        d3.selectAll(".injectable div").remove();
        // Loop through game list
        for (var i = 0; i < data.length; i++) {
            // Filter condition (this could probably be done cleaner)
            if (((num_players == 'any') || (num_players == '7+' && data[i].max_players >= 7) ||
                    (Number(num_players) >= data[i].min_players && Number(num_players) <= data[i].max_players)) && 
                        ((playing_time == 'any') || (playing_time == 'short' && data[i].avg_time < 30) || 
                            (playing_time == 'mid' && data[i].avg_time >= 30 && data[i].avg_time < 60) ||
                                (playing_time == 'long' && data[i].avg_time >= 60)) &&
                                 ((rating == 'any') || (rating == 'high' && data[i].rating >= 7))) {
                // Inject new filtered games into HTML
                console.log(data[i].primary_name);
                var div = d3.select(".injectable").append("div").attr("class","game")
                div.append("p").attr("id", "game_title").text(data[i].primary_name);
                div.append("img").attr("src", data[i].original_image).attr("id", "thumbnail").attr("width", image_dim).attr("height", image_dim);
                div.append("p");
                div.append("img").attr("src", "icon_players.png").attr("width", icon_dim).attr("height", icon_dim);
                div.append("span").text(function() {
                    // Text formatting for when min and max players are the same
                    if (data[i].min_players == data[i].max_players) return " " + data[i].min_players;
                    return " " + data[i].min_players + "-" + data[i].max_players });
                div.append("img").attr("src", "icon_time.png").attr("width", icon_dim).attr("height", icon_dim);
                div.append("span").text(function() {
                    // Text formatting for when min and max playing times are the same
                    if (data[i].min_time == data[i].max_time) return " " + data[i].min_time;
                    return " " + data[i].min_time + "-" + data[i].max_time });
                div.append("img").attr("src", "icon_rating.png").attr("width", icon_dim).attr("height", icon_dim);
                div.append("span").text(" " + data[i].rating);
                titles.push(data[i].primary_name);
                descriptions.push(data[i].description.split("&#10;").join("\n").split("&rsquo;").join("'"));
            }
            d3.selectAll("#thumbnail").on("click", function(d, i) {
                d3.select(".description").text(titles[i] + "\n\n" + descriptions[i]);
                // TODO: smooth scroll transition to top
                document.body.scrollTop = 0; // For Safari
                document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            });
        };
        // Transition effect when displaying the games
        d3.selectAll(".game").transition().style("opacity", 1).style("padding-top", "5vh").duration(1000);
        // Update the button labels after user makes a selection
        d3.select("#button_players").text("Players (" + num_players + ")");
        d3.select("#button_time").text("Time (" + playing_time + ")");
        d3.select("#button_rating").text("Rating (" + rating + ")");
        // Clear the description text (if any)
        d3.select(".description").text("");
    });
});
