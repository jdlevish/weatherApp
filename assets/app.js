$(document).ready(function () {
    var history = []
    $("#searchBtn").on("click", function (Event) {
        Event.preventDefault()
        var cityName = $(this).siblings()[0].value

        // console.log(cityName)
        weatherCall5day(cityName)
        weatherCallCurrent(cityName)
    }

    )
    // function to return 5 day forecast
    function weatherCall5day(cityName) {
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=98092cf02163d0e2417b3f3c5ba24af1&units=imperial"
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(response)

        })
    }
    function uvIndex(lat, lon) {
        var uvDiv = $("<h3>")
        var queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=98092cf02163d0e2417b3f3c5ba24af1&lat=" + lat + "&lon=" + lon
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            console.log(JSON.parse(response.value))
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
            // current.append(uvDiv)

            // return current.append(uvDiv)


            // .text("UV Index: " + uvVal)
            // current.append(uv)
        })
    }
    // function for current weather 
    function weatherCallCurrent(cityName) {
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=98092cf02163d0e2417b3f3c5ba24af1&units=imperial"
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response, err) {
            if (response) {
                history.push(cityName)
                console.log(history)

                var lat = response.coord.lat
                var lon = response.coord.lon
                // console.log(lat)



                // builds out current city title
                var current = $("#current")
                var currentTitle = $("#currentTitle")
                var today = new Date();
                var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
                var icon = (response.weather[0].icon)
                console.log(icon)
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
                uvIndex(lat, lon)





                // current.append(currentTitle)
                // current.append(temp)
                // current.append(Humid)
                // current.append(wind)
                current.append(uvDiv)








                $("#currentContainer").html(current)

                console.log(date)

            }
            else {
                console.log(err)
            }

        })
    }


})