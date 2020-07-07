$(document).ready(function () {
    var history = []
    // checks if there is history in local storage
    if (localStorage.getItem("history") != undefined) {
        history = JSON.parse(localStorage.getItem("history"));

        weatherCall5day(history[history.length - 1])
        weatherCallCurrent(history[history.length - 1])


    }
    // this section runs the function to populate the history section 
    populateHistory()
    $("li").on("click", function () {
        weatherCall5day(this.textContent)
        weatherCallCurrent(this.textContent)
    })

    $("#searchBtn").on("click", function (Event) {
        Event.preventDefault()
        var cityName = $(this).siblings()[0].value

        weatherCall5day(cityName)
        weatherCallCurrent(cityName)


    }

    )
    // function to return 5 day forecast
    function weatherCall5day(cityName) {
        var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=98092cf02163d0e2417b3f3c5ba24af1&units=imperial"
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {

            var dates = $(".date")
            // this section builds out the 5day forecast cards
            for (var i = 0; i < dates.length; i++) {
                var today = new Date();

                var date = (today.getMonth() + 1) + '-' + (today.getDate() + (i + 1)) + '-' + today.getFullYear();
                var dateDiv = $("#dayDate" + (i + 1))
                var icon = response.list[i].weather[0].icon
                dateDiv.text(date)
                console.log(icon)
                var newDiv = $("<div>")
                var newTemp = $("<h6>")
                var humDiv = $("<h6>")
                var iconImg = $('<img />').attr('src', 'http://openweathermap.org/img/wn/' + icon + '.png').addClass('float-left')
                newDiv.append(iconImg)
                dateDiv.append(newDiv)
                var tempVal = "Temp: " + response.list[i].main.temp
                var humVal = "Humidity: " + response.list[i].main.humidity + "%"
                newTemp.append(tempVal).addClass('float-left')
                humDiv.append(humVal).addClass('float-left')
                dateDiv.append(newTemp)
                dateDiv.append(humDiv)



            }

        })
    }
    // this function gets uv data, checks the value for color coding and displays the value
    function uvIndex(lat, lon) {

        var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?appid=98092cf02163d0e2417b3f3c5ba24af1&lat=" + lat + "&lon=" + lon
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {

            var uvText = response.value;
            var uvDiv = $("#uv")
            uvDiv.html("UV Index: " + "<span id='uvValue'>" + uvText + "<span>")
            if (uvText <= 2) {

                $("#uvValue").attr('style', 'background-color: green')
            }
            else if (uvText > 2 && uvText <= 5) {

                $("#uvValue").attr('style', 'background-color: yellow')
            }
            else if (uvText > 5 && uvText <= 7) {

                $("#uvValue").attr('style', 'background-color: orange')
            }
            else if (uvText > 7) {

                $("#uvValue").attr('style', 'background-color: red')
            }

        })
    }
    // function for current weather 
    function weatherCallCurrent(cityName) {
        var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=98092cf02163d0e2417b3f3c5ba24af1&units=imperial"
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response, err) {
            if (response) {
                history.push(cityName)
                localStorage.setItem("history", JSON.stringify(history))
                console.log(history)
                var lat = response.coord.lat
                var lon = response.coord.lon
                // builds out current city title
                var current = $("#current")
                var currentTitle = $("#currentTitle")
                var today = new Date();
                var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
                var icon = (response.weather[0].icon)
                // console.log(icon)
                var iconImg = $('<img />').attr('src', "http://openweathermap.org/img/wn/" + icon + ".png")
                currentTitle.text(response.name + " " + "(" + date + ")" + " ").append(iconImg)

                // builds out temp display
                var temp = $("#temp")
                var tempVal = response.main.temp
                temp.text("Temperature: " + tempVal + " °F")
                // builds out humidity display
                var humVal = response.main.humidity
                var humid = $("#hum")
                humid.text("Humidity: " + humVal)
                // builds wind speed display
                var windVal = response.wind.speed
                var wind = $("#wind")
                wind.text("Wind Speed: " + windVal + " mph")
                //runs ajax call to get uv data
                uvIndex(lat, lon)
                current.append(uvDiv)
                $("#currentContainer").html(current)
            }
            else {
                console.log(err)
            }


        })
    }
    function populateHistory() {
        var list = $(".list")

        for (i = 0; i < list.length; i++) {

            if ((history[(history.length - i) - 1]) === undefined) {
                list[i].append("")
            } else {


                list[i].append((history[(history.length - i) - 1]));





            }
        }
    }


})