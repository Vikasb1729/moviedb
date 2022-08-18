// ***************************** login start *****************************
var pageCheck = document.querySelector("body > div");

if (localStorage.getItem("user") == null) {
  var userData = {
    user: [
      {
        email: "vikas@email.com",
        password: "vikas1234",
        id: 101,
        favorite: [],
        rating: [],
      },
    ],
  };
  localStorage.setItem("user", JSON.stringify(userData));
  var value = JSON.parse(localStorage.getItem("user"));
  localStorage.setItem("user", JSON.stringify(value));
}
if (pageCheck.className == "container login-page") {
  var email = document.querySelector(".login-page .email");
  var password = document.querySelector(".login-page .password");
  var login = document.querySelector('.login-page a[title="Sign In"]');
  var error = document.querySelector(".error");
  var login_display = document.querySelector(".login-page .login_display");
  var email_display = document.querySelector(".login-page .email_display");
  var password_display = document.querySelector(
    ".login-page .password_display"
  );
  var userObj = JSON.parse(localStorage.getItem("user"));
  login.addEventListener("click", function () {
    if (email.value != "" && password.value != "") {
      email_display.innerHTML = "";
      password_display.innerHTML = "";
      for (var i = 0; i < userObj.user.length; i++) {
        if (
          email.value == userObj.user[i].email &&
          password.value == userObj.user[i].password
        ) {
          error.classList.remove("show");
          var loginData = {
            id: userObj.user[i].id,
            email: userObj.user[i].email,
          };
          sessionStorage.setItem("login", JSON.stringify(loginData));
          window.location.replace("homepage.html");
          break;
        } else {
          login_display.innerHTML = "Login Email and Password does not match";
          login_display.classList.add("show");
        }
      }
    } else {
      if (email.value == "") {
        email_display.innerHTML = "Enter Your Email";
        error.classList.add("show");
      } else {
        email_display.innerHTML = "";
      }
      if (password.value == "") {
        password_display.innerHTML = "Enter Your Password";
        password_display.classList.add("show");
      } else {
        password_display.innerHTML = "";
      }
    }
  });
}

// ***************************** login end *****************************

var pageCheck = document.querySelector("body > div");
if (pageCheck.className != "container login-page") {
  var hamburger = document.querySelector(".hamburger"),
    nav = document.querySelector("nav"),
    header = document.querySelector("header"),
    body = document.querySelector("body"),
    mains = document.querySelector("main");
  hamburger.addEventListener("click", function () {
    nav.classList.toggle("show");
    hamburger.classList.toggle("show");
    header.classList.toggle("hidden");
    body.classList.toggle("hidden");
    mains.classList.toggle("hide");
  });
}
if (
  pageCheck.className == "container home-page" ||
  pageCheck.className == "container tv-page"
) {
  $(".slider").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

// *********************** home/movie page script start ***********************

pageCheck = document.querySelector("body > div");
if (pageCheck.className == "container home-page") {
  var sessionObj = JSON.parse(sessionStorage.getItem("login"));
  var userObj = JSON.parse(localStorage.getItem("user"));
  if (sessionObj == null) {
    window.location.replace("index.html");
  } else {
    for (var i = 0; i < userObj.user.length; i++) {
      var sessionCreated = false;
      if (
        sessionObj.email == userObj.user[i].email &&
        sessionObj.id == userObj.user[i].id
      ) {
        sessionCreated = true;
        break;
      } else {
        sessionCreated = false;
      }
    }
    if (sessionCreated == false) {
      window.location.replace("index.html");
    }
  }
  var logout_btn = document.querySelector('a[title="Logout"]');
  logout_btn.addEventListener("click", function () {
    sessionStorage.removeItem("login");
    window.location.replace("index.html");
  });
  // ***************************** search with api request start *****************************

  var searchInput = document.querySelector(".search_input input");
  var closeBtn = document.querySelector('.search_input a[title="Close"]');
  var searchPanelLi = document.querySelectorAll(".search_ctn ul li");
  var searchPanelUl = document.querySelector(".search_ctn ul");
  closeBtn.addEventListener("click", function () {
    searchInput.value = "";
    searchPanelUl.classList.remove("show");
    clearSearchQuery();
    closeBtn.classList.remove("show");
  });
  searchInput.addEventListener("keyup", function () {
    if (searchInput.value != "") {
      closeBtn.classList.add("show");
      searchPanelUl.classList.add("show");
      searchCtnLoad();
    } else {
      closeBtn.classList.remove("show");
      searchPanelUl.classList.remove("show");
    }
    searchPanelLi = document.querySelectorAll(".search_ctn ul li");
    if (searchPanelLi[1] == undefined) {
      searchPanelUl.classList.remove("show");
    }
  });
  function searchCtnLoad() {
    fetch(
      "https://api.themoviedb.org/3/search/multi?api_key=ca8c817a5c60b66df0b85905279777bb&language=en-US&include_adult=false&query=" +
        searchInput.value
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        clearSearchQuery();
        var result = data.results;
        result.forEach((i) => {
          if (i.media_type == "movie") {
            var li_element = document.createElement("li");
            var a_element = document.createElement("a");
            a_element.href = "detail.html?movie&" + i.id;
            a_element.innerHTML = i.title;
            li_element.appendChild(a_element);
            searchPanelUl.appendChild(li_element);
          } else {
            var li_element = document.createElement("li");
            var a_element = document.createElement("a");
            a_element.href = "detail.html?tv&" + i.id;
            a_element.innerHTML = i.name;
            li_element.appendChild(a_element);
            searchPanelUl.appendChild(li_element);
          }
        });
      });
  }
  function clearSearchQuery() {
    var clear_list = document.querySelectorAll(".search_ctn ul li");
    clear_list.forEach(function (element) {
      element.remove();
    });
  }
  // ***************************** search with api request end *****************************

  // ***************************** top rated movies api request start **********************
  var top_rated_lists_img = document.querySelectorAll(
    ".top_rated_movies .slider li img"
  );
  var top_rated_lists_title = document.querySelectorAll(
    " .top_rated_movies .slider li .movie_name"
  );
  var top_rated_lists_img_link = document.querySelectorAll(
    ".top_rated_movies .movie_image"
  );
  function topRatedLoad() {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        for (var i = 0; i < top_rated_lists_img.length; i++) {
          top_rated_lists_img[i].src =
            "https://image.tmdb.org/t/p/w154/" + data.results[i].poster_path;
          top_rated_lists_title[i].innerHTML = data.results[i].title;
          top_rated_lists_img[i].title = data.results[i].title;
          top_rated_lists_title[i].title = data.results[i].title;
          top_rated_lists_img_link[i].href =
            "detail.html?movie&" + data.results[i].id;
          top_rated_lists_title[i].href =
            "detail.html?movie&" + data.results[i].id;
        }
      });
  }
  // ***************************** top rated movies api request end *****************************

  // ***************************** most popular movies api request start ************************
  var pop_list_img = document.querySelectorAll(
    ".most_popular_movies .slider li img"
  );
  var pop_list_title = document.querySelectorAll(
    ".most_popular_movies .slider li .movie_name"
  );
  var pop_list_img_link = document.querySelectorAll(
    ".most_popular_movies .movie_image"
  );
  function popularLoad() {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        for (var i = 0; i < pop_list_img.length; i++) {
          pop_list_img[i].src =
            "https://image.tmdb.org/t/p/w154/" + data.results[i].poster_path;
          pop_list_img[i].title = data.results[i].title;
          pop_list_title[i].innerHTML = data.results[i].title;
          pop_list_title[i].title = data.results[i].title;
          pop_list_img_link[i].href = "detail.html?movie&" + data.results[i].id;
          pop_list_title[i].href = "detail.html?movie&" + data.results[i].id;
        }
      });
  }
  // ***************************** most popular movies api request end *****************************

  // ***************************** now playing movies api request start *****************************
  var nowPlay_list_img = document.querySelectorAll(
    ".nowplaying_movies .slider li img"
  );
  var nowPlay_list_title = document.querySelectorAll(
    ".nowplaying_movies .slider li .movie_name"
  );
  var nowPlay_list_img_link = document.querySelectorAll(
    ".nowplaying_movies .movie_image"
  );
  function nowPlayLoad() {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        for (var i = 0; i < nowPlay_list_img.length; i++) {
          nowPlay_list_img[i].src =
            "https://image.tmdb.org/t/p/w154/" + data.results[i].poster_path;
          nowPlay_list_img[i].title = data.results[i].title;
          nowPlay_list_title[i].innerHTML = data.results[i].title;
          nowPlay_list_title[i].title = data.results[i].title;
          nowPlay_list_img_link[i].href =
            "detail.html?movie&" + data.results[i].id;
          nowPlay_list_title[i].href =
            "detail.html?movie&" + data.results[i].id;
        }
      });
  }
  // ***************************** now playing movies api request end *****************************

  // ***************************** upcoming movies api request start *****************************
  var upcoming_list_img = document.querySelectorAll(
    ".upcoming_moives .slider li img"
  );
  var upcoming_list_title = document.querySelectorAll(
    ".upcoming_moives .slider li .movie_name"
  );
  var upcoming_list_img_link = document.querySelectorAll(
    ".upcoming_moives .movie_image"
  );
  function upcomingLoad() {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        for (var i = 0; i < upcoming_list_img.length; i++) {
          upcoming_list_img[i].src =
            "https://image.tmdb.org/t/p/w154/" + data.results[i].poster_path;
          upcoming_list_img[i].title = data.results[i].title;
          upcoming_list_title[i].innerHTML = data.results[i].title;
          upcoming_list_title[i].title = data.results[i].title;
          upcoming_list_img_link[i].href =
            "detail.html?movie&" + data.results[i].id;
          upcoming_list_title[i].href =
            "detail.html?movie&" + data.results[i].id;
        }
      });
  }
  // ***************************** upcoming movies api request end *****************************

  // ***************************** trending news api request start *****************************
  var trend_list_img = document.querySelectorAll(
    ".trending_news .slider li img"
  );
  var trend_list_title = document.querySelectorAll(
    ".trending_news .slider li .movie_name"
  );
  var trend_list_img_link = document.querySelectorAll(
    ".trending_news .movie_image"
  );
  function trendLoadMovie() {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        for (var i = 0; i < trend_list_img.length; i++) {
          trend_list_img[i].src =
            "https://image.tmdb.org/t/p/w154/" + data.results[i].poster_path;
          trend_list_img[i].title = data.results[i].title;
          trend_list_title[i].innerHTML = data.results[i].title;
          trend_list_title[i].title = data.results[i].title;
          trend_list_img_link[i].href =
            "detail.html?movie&" + data.results[i].id;
          trend_list_title[i].href = "detail.html?movie&" + data.results[i].id;
        }
      });
  }
  topRatedLoad();
  popularLoad();
  nowPlayLoad();
  upcomingLoad();
  trendLoadMovie();
  // ***************************** trending news api request end *****************************
}
// ************************ home/index page script end ************************
pageCheck = document.querySelector("body > div");
if (pageCheck.className == "container tv-page") {
  var sessionObj = JSON.parse(sessionStorage.getItem("login"));
  var userObj = JSON.parse(localStorage.getItem("user"));
  if (sessionObj == null) {
    window.location.replace("index.html");
  } else {
    for (var i = 0; i < userObj.user.length; i++) {
      var sessionCreated = false;
      if (
        sessionObj.email == userObj.user[i].email &&
        sessionObj.id == userObj.user[i].id
      ) {
        sessionCreated = true;
        break;
      } else {
        sessionCreated = false;
      }
    }
    if (sessionCreated == false) {
      window.location.replace("index.html");
    }
  }
  var logout_btn = document.querySelector('a[title="Logout"]');
  logout_btn.addEventListener("click", function () {
    sessionStorage.removeItem("login");
    window.location.replace("index.html");
  });
  var topRatedListsImg = document.querySelectorAll(
    ".toprated_tv .slider li img"
  );
  var topRatedListsTitle = document.querySelectorAll(
    " .toprated_tv .slider li .tv_name"
  );
  var topRatedListsImgLink = document.querySelectorAll(
    ".toprated_tv .tv_image"
  );
  function topRatedTvLoad() {
    fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data_tv) {
        for (var i = 0; i < topRatedListsImg.length; i++) {
          topRatedListsImg[i].src =
            "https://image.tmdb.org/t/p/w154/" + data_tv.results[i].poster_path;
          topRatedListsTitle[i].innerHTML = data_tv.results[i].name;
          topRatedListsImg[i].title = data_tv.results[i].name;
          topRatedListsTitle[i].title = data_tv.results[i].name;
          topRatedListsImgLink[i].href =
            "detail.html?tv&" + data_tv.results[i].id;
          topRatedListsTitle[i].href =
            "detail.html?tv&" + data_tv.results[i].id;
        }
      });
  }
  // ***************************** top rated tv api request end *****************************

  // ***************************** most popular tv api request start **************************
  var popListImg = document.querySelectorAll(".mostpopular_tv .slider li img");
  var popListTitle = document.querySelectorAll(
    ".mostpopular_tv .slider li .tv_name"
  );
  var popListImgLink = document.querySelectorAll(".mostpopular_tv .tv_image");
  function popularTvLoad() {
    fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data_tv) {
        for (var i = 0; i < popListImg.length; i++) {
          popListImg[i].src =
            "https://image.tmdb.org/t/p/w154/" + data_tv.results[i].poster_path;
          popListImg[i].title = data_tv.results[i].name;
          popListTitle[i].innerHTML = data_tv.results[i].name;
          popListTitle[i].title = data_tv.results[i].name;
          popListImgLink[i].href = "detail.html?tv&" + data_tv.results[i].id;
          popListTitle[i].href = "detail.html?tv&" + data_tv.results[i].id;
        }
      });
  }
  // // ***************************** most popular tv api request end *****************************

  // // ***************************** on air tv api request start *****************************
  var onAirListImg = document.querySelectorAll(".on_air .slider li img");
  var onAirListTitle = document.querySelectorAll(".on_air .slider li .tv_name");
  var onAirListImgLink = document.querySelectorAll(".on_air .tv_image");
  function onAirTvLoad() {
    fetch(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data_tv) {
        for (var i = 0; i < onAirListImg.length; i++) {
          onAirListImg[i].src =
            "https://image.tmdb.org/t/p/w154" + data_tv.results[i].poster_path;
          onAirListImg[i].title = data_tv.results[i].name;
          onAirListTitle[i].innerHTML = data_tv.results[i].name;
          onAirListTitle[i].title = data_tv.results[i].name;
          onAirListImgLink[i].href = "detail.html?tv&" + data_tv.results[i].id;
          onAirListTitle[i].href = "detail.html?tv&" + data_tv.results[i].id;
        }
      });
  }
  // // ***************************** on air tv api request end *****************************

  // // ***************************** airing today tv api request start ***********************
  var airingTodayImg = document.querySelectorAll(
    ".airing_today .slider li img"
  );
  var airingTodayTitle = document.querySelectorAll(
    ".airing_today .slider li .tv_name"
  );
  var airingTodayImgLink = document.querySelectorAll(".airing_today .tv_image");
  function airingTodayTvLoad() {
    fetch(
      `https://api.themoviedb.org/3/tv/airing_today?api_key=ca8c817a5c60b66df0b85905279777bb`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data_tv) {
        for (var i = 0; i < airingTodayImg.length; i++) {
          airingTodayImg[i].src =
            "https://image.tmdb.org/t/p/w154/" + data_tv.results[i].poster_path;
          airingTodayImg[i].title = data_tv.results[i].name;
          airingTodayTitle[i].innerHTML = data_tv.results[i].name;
          airingTodayTitle[i].title = data_tv.results[i].name;
          airingTodayImgLink[i].href =
            "detail.html?tv&" + data_tv.results[i].id;
          airingTodayTitle[i].href = "detail.html?tv&" + data_tv.results[i].id;
        }
      });
  }
  // // ***************************** airing today tv api request end *****************************

  // // ***************************** trending api request start *****************************
  var trendListImg = document.querySelectorAll(".trending_news .slider li img");
  var trendListTitle = document.querySelectorAll(
    ".trending_news .slider li .tv_name"
  );
  var trendListImgLink = document.querySelectorAll(".trending_news .tv_image");
  function trendLoadTv() {
    fetch(
      "https://api.themoviedb.org/3/trending/tv/day?api_key=ca8c817a5c60b66df0b85905279777bb"
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data_tv) {
        for (var i = 0; i < trendListImg.length; i++) {
          trendListImg[i].src =
            "https://image.tmdb.org/t/p/w154/" + data_tv.results[i].poster_path;
          trendListImg[i].title = data_tv.results[i].name;
          trendListTitle[i].innerHTML = data_tv.results[i].name;
          trendListTitle[i].title = data_tv.results[i].name;
          trendListImgLink[i].href = "detail.html?tv&" + data_tv.results[i].id;
          trendListTitle[i].href = "detail.html?tv&" + data_tv.results[i].id;
        }
      });
  }
  topRatedTvLoad();
  popularTvLoad();
  onAirTvLoad();
  airingTodayTvLoad();
  trendLoadTv();
  // ***************************** trending api request end *****************************
}
// ***************************** tv shows api request end *****************************

// *********************** view more page script start ************************
pageCheck = document.querySelector("body > div");
if (pageCheck.className == "container home_mod view_more_page") {
  var sessionObj = JSON.parse(sessionStorage.getItem("login"));
  var userObj = JSON.parse(localStorage.getItem("user"));
  if (sessionObj == null) {
    window.location.replace("index.html");
  } else {
    for (var i = 0; i < userObj.user.length; i++) {
      var sessionCreated = false;
      if (
        sessionObj.email == userObj.user[i].email &&
        sessionObj.id == userObj.user[i].id
      ) {
        sessionCreated = true;
        break;
      } else {
        sessionCreated = false;
      }
    }
    if (sessionCreated == false) {
      window.location.replace("index.html");
    }
  }
  // ***************************** movie/tv shows list api start *****************************
  var view_more_list = document.querySelector(
    ".view_more_page .view_more_list"
  );
  var paginated_no = 1;

  // url decode start
  var url_string = location.search.substring(1);
  var url_data = url_string.split("&");
  var title_value = url_data[0];
  var title = decodeURI(title_value);
  var medium = url_data[1];
  var category = url_data[2];
  var time = url_data[3];
  // url decode end

  if (url_string == "") {
    window.location.replace("index.html");
  }
  var section_title = document.querySelector(".section_title");
  section_title.innerHTML = title;
  topRatedViewMoreLoad();
  function topRatedViewMoreLoad() {
    if (time == undefined) {
      fetch(
        "https://api.themoviedb.org/3/" +
          medium +
          "/" +
          category +
          "?api_key=ca8c817a5c60b66df0b85905279777bb&page=" +
          paginated_no
      )
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          viewMoreData(data);
        });
    } else {
      fetch(
        "https://api.themoviedb.org/3/" +
          medium +
          "/" +
          category +
          "/" +
          time +
          "?api_key=ca8c817a5c60b66df0b85905279777bb&page=" +
          paginated_no
      )
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          viewMoreData(data);
        });
    }
    function viewMoreData(data) {
      var view_more_list_li = document.querySelectorAll(".view_more_list li");
      view_more_list_li.forEach(function (e) {
        e.remove();
      });
      if (category == "movie" || medium == "movie") {
        for (var i = 0; i < data.results.length; i++) {
          var li_element = document.createElement("li");
          var a_element = document.createElement("a");
          var img_link = document.createElement("a");
          var img_element = document.createElement("img");
          var figure_element = document.createElement("figure");
          var div1_element = document.createElement("div");
          var div2_element = document.createElement("div");
          var rating_element = document.createElement("span");
          var release_element = document.createElement("span");
          release_element.innerHTML = data.results[i].release_date;
          rating_element.innerHTML = data.results[i].vote_average;
          img_element.src =
            "https://image.tmdb.org/t/p/w92/" + data.results[i].poster_path;
          img_element.title = data.results[i].title;
          img_link.href = "detail.html?movie&" + data.results[i].id;
          a_element.href = "detail.html?movie&" + data.results[i].id;
          a_element.innerHTML = data.results[i].title;
          figure_element.appendChild(img_element);
          img_link.appendChild(figure_element);
          div1_element.appendChild(img_link);
          div1_element.appendChild(a_element);
          div2_element.appendChild(rating_element);
          div2_element.appendChild(release_element);
          li_element.appendChild(div1_element);
          li_element.appendChild(div2_element);
          view_more_list.appendChild(li_element);
        }
      } else {
        for (var i = 0; i < data.results.length; i++) {
          var li_element = document.createElement("li");
          var a_element = document.createElement("a");
          var img_link = document.createElement("a");
          var img_element = document.createElement("img");
          var figure_element = document.createElement("figure");
          var div1_element = document.createElement("div");
          var div2_element = document.createElement("div");
          var rating_element = document.createElement("span");
          var release_element = document.createElement("span");
          release_element.innerHTML = data.results[i].first_air_date;
          rating_element.innerHTML = data.results[i].vote_average;
          img_element.src =
            "https://image.tmdb.org/t/p/w92/" + data.results[i].poster_path;
          img_element.title = data.results[i].name;
          img_link.href = "detail.html?tv&" + data.results[i].id;
          a_element.href = "detail.html?tv&" + data.results[i].id;
          a_element.innerHTML = data.results[i].name;
          figure_element.appendChild(img_element);
          img_link.appendChild(figure_element);
          div1_element.appendChild(img_link);
          div1_element.appendChild(a_element);
          div2_element.appendChild(rating_element);
          div2_element.appendChild(release_element);
          li_element.appendChild(div1_element);
          li_element.appendChild(div2_element);
          view_more_list.appendChild(li_element);
        }
      }
    }
  }
  var paginated_li = document.querySelectorAll(".pagination_ul li");
  paginated_li.forEach(function (e) {
    e.addEventListener("click", function () {
      paginated_no = e.innerHTML;
      topRatedViewMoreLoad();
      paginated_li.forEach(function (event) {
        event.classList.remove("pagination_active");
      });
      e.classList.add("pagination_active");
    });
  });
  // ***************************** movie/tv shows list api request end *****************************
}
// ************************ view more page script end ************************

// *********************** detail.html page script start ************************
pageCheck = document.querySelector("body > div");
if (pageCheck.className == "container detail-page") {
  var sessionObj = JSON.parse(sessionStorage.getItem("login"));
  var userObj = JSON.parse(localStorage.getItem("user"));
  if (sessionObj == null) {
    window.location.replace("index.html");
  } else {
    for (var i = 0; i < userObj.user.length; i++) {
      var sessionCreated = false;
      if (
        sessionObj.email == userObj.user[i].email &&
        sessionObj.id == userObj.user[i].id
      ) {
        sessionCreated = true;
        break;
      } else {
        sessionCreated = false;
      }
    }
    if (sessionCreated == false) {
      window.location.replace("index.html");
    }
  }
  // ***************************** movie/tv shows detail api start *****************************
  var poster_img = document.querySelector(".detail .post_image img");
  var title = document.querySelector(".detail .title_box h2");
  var release_date = document.querySelector(".detail .title_box .release_date");
  var genres = document.querySelector(".detail .title_box .genres");
  var user_score = document.querySelector(".detail .user_score .score");
  var overview = document.querySelector(".detail .overview p");
  var backdrops = document.querySelector(".detail .wrapper");

  // url decode start
  var url_string = location.search.substring(1);
  var url_data = url_string.split("&");
  var medium = url_data[0];
  var id = url_data[1];
  // url decode end
  if (url_string == "") {
    window.location.replace("index.html");
  }
  detailLoad();
  function detailLoad() {
    fetch(
      "https://api.themoviedb.org/3/" +
        medium +
        "/" +
        id +
        "?api_key=ca8c817a5c60b66df0b85905279777bb"
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        if (medium == "movie") {
          poster_img.src =
            "https://image.tmdb.org/t/p/w400/" + data.poster_path;
          title.innerHTML = data.title;
          var date = data.release_date;
          release_date.innerHTML =
            "Realease Date: " + date.replaceAll("-", "/");
          var backdrop = document.createElement("figure");
          backdrop.className = "backdrop";
          var backdropImage = document.createElement("img");
          backdropImage.src =
            "https://image.tmdb.org/t/p/w500/" + data.backdrop_path;
          backdrop.append(backdropImage);
          backdrops.appendChild(backdrop);
          genres.innerHTML = "";
          data.genres.forEach(function (e) {
            var span_element = document.createElement("span");
            span_element.innerHTML += e.name;
            genres.appendChild(span_element);
          });
          user_score.innerHTML = data.vote_average * 10 + "%";
          overview.innerHTML = data.overview;
        } else {
          poster_img.src =
            "https://image.tmdb.org/t/p/w400/" + data.poster_path;
          title.innerHTML = data.name;
          var date = data.first_air_date;
          release_date.innerHTML =
            "First Air Date: " + date.replaceAll("-", "/");
          var backdrop = document.createElement("figure");
          backdrop.className = "backdrop";
          var backdropImage = document.createElement("img");
          backdropImage.src =
            "https://image.tmdb.org/t/p/w500/" + data.backdrop_path;
          backdrop.append(backdropImage);
          backdrops.appendChild(backdrop);
          genres.innerHTML = "";
          data.genres.forEach(function (e) {
            var span_element = document.createElement("span");
            span_element.innerHTML += e.name;
            genres.appendChild(span_element);
          });
          user_score.innerHTML = data.vote_average * 10 + "%";
          overview.innerHTML = data.overview;
        }
      });
  }
  var crew_li = document.querySelectorAll(".detail .cast li");
  var crew_ul = document.querySelector(".detail .cast");

  // cast list api request start
  crewLoad();
  function crewLoad() {
    fetch(
      "https://api.themoviedb.org/3/" +
        medium +
        "/" +
        id +
        "/credits?api_key=ca8c817a5c60b66df0b85905279777bb"
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        crew_li.forEach(function (e) {
          e.remove();
        });
        for (var i = 0; i < data.crew.length; i++) {
          if (data.crew[i].job == "Director") {
            var li_element = document.createElement("li");
            var job_element = document.createElement("h3");
            var name_element = document.createElement("span");
            job_element.innerHTML = "Director: ";
            name_element.innerHTML = data.crew[i].name;
            li_element.appendChild(job_element);
            li_element.appendChild(name_element);
            crew_ul.appendChild(li_element);
          }
          if (data.crew[i].job == "Producer") {
            var li_element = document.createElement("li");
            var job_element = document.createElement("h3");
            var name_element = document.createElement("span");
            job_element.innerHTML = "Producer: ";
            name_element.innerHTML = data.crew[i].name;
            li_element.appendChild(job_element);
            li_element.appendChild(name_element);
            crew_ul.appendChild(li_element);
          }
        }
        for (var i = 0; i < 2; i++) {
          if (data.cast[i].known_for_department == "Acting") {
            var li_element = document.createElement("li");
            var job_element = document.createElement("h3");
            var name_element = document.createElement("span");
            job_element.innerHTML = "Cast: ";
            name_element.innerHTML = data.cast[i].name;
            li_element.appendChild(job_element);
            li_element.appendChild(name_element);
            crew_ul.appendChild(li_element);
          }
        }
      });
  }
  // cast list api request end

  // add favorite start
  var favorite_btn = document.querySelector(".favorite");
  var login_obj = JSON.parse(sessionStorage.getItem("login"));
  var userObj = JSON.parse(localStorage.getItem("user"));
  favoriteCheck();
  function favoriteCheck() {
    for (var i = 0; i < userObj.user.length; i++) {
      if (login_obj.email == userObj.user[i].email) {
        if (userObj.user[i].favorite.length == 0) {
          favorite_btn.classList.remove("my_favourite");
        } else {
          for (var j = 0; j < userObj.user[i].favorite.length; j++) {
            if (userObj.user[i].favorite[j].movie_id == id) {
              favorite_btn.classList.add("my_favourite");
              break;
            } else {
              favorite_btn.classList.remove("my_favourite");
            }
          }
        }
      }
    }
  }
  favorite_btn.addEventListener("click", function () {
    for (var i = 0; i < userObj.user.length; i++) {
      if (login_obj.email == userObj.user[i].email) {
        if (userObj.user[i].favorite.length == 0) {
          var value = { movie_id: id };
          userObj.user[i].favorite.push(value);
          localStorage.setItem("user", JSON.stringify(userObj));
          favoriteCheck();
        } else {
          var new_movie_id = false;
          for (var j = 0; j < userObj.user[i].favorite.length; j++) {
            if (userObj.user[i].favorite[j].movie_id == id) {
              new_movie_id = false;
              break;
            } else {
              new_movie_id = true;
            }
          }
          if (new_movie_id) {
            var value = { movie_id: id };
            userObj.user[i].favorite.push(value);
            localStorage.setItem("user", JSON.stringify(userObj));
            favoriteCheck();
          } else {
            var value = { movie_id: id };
            userObj.user[i].favorite.pop(value);
            localStorage.setItem("user", JSON.stringify(userObj));
            favoriteCheck();
          }
        }
      }
    }
  });
  // add favorite end

  // rating start
  var user_rating_list = document.querySelectorAll(".user_rating li");
  user_rating_list.forEach(function (e) {
    var star_index = Array.prototype.indexOf.call(user_rating_list, e);
    e.addEventListener("mouseover", function (n) {
      for (var i = 0; i <= star_index; i++) {
        user_rating_list[i].children[0].classList.add("rate");
      }
    });

    e.addEventListener("mouseout", function (n) {
      for (var i = 0; i <= star_index; i++) {
        user_rating_list[i].children[0].classList.remove("rate");
      }
      ratingCheck();
    });

    e.addEventListener("click", function () {
      starClick(star_index);
    });
  });
  function starClick(e) {
    var star_rating = e + 1;
    for (var i = 0; i < userObj.user.length; i++) {
      if (login_obj.email == userObj.user[i].email) {
        if (userObj.user[i].rating.length == 0) {
          var value = { movie_id: id, rating: star_rating };
          userObj.user[i].rating.push(value);
          localStorage.setItem("user", JSON.stringify(userObj));
          ratingCheck();
          break;
        } else {
          var new_movie_id = false;
          for (var j = 0; j < userObj.user[i].rating.length; j++) {
            if (userObj.user[i].rating[j].movie_id == id) {
              new_movie_id = false;
              break;
            } else {
              new_movie_id = true;
            }
          }
          if (new_movie_id) {
            var value = { movie_id: id, rating: star_rating };
            userObj.user[i].rating.push(value);
            localStorage.setItem("user", JSON.stringify(userObj));
            ratingCheck();
          } else {
            var value = { movie_id: id, rating: star_rating };
            userObj.user[i].rating[j] = value;
            localStorage.setItem("user", JSON.stringify(userObj));
            ratingCheck();
          }
        }
      }
    }
  }
  function ratingCheck() {
    for (var i = 0; i < userObj.user.length; i++) {
      if (login_obj.email == userObj.user[i].email) {
        if (userObj.user[i].rating.length == 0) {
          user_rating_list[i].children[0].classList.remove("rate");
        } else {
          for (var j = 0; j < userObj.user[i].rating.length; j++) {
            if (userObj.user[i].rating[j].movie_id == id) {
              var num_star = userObj.user[i].rating[j].rating;

              user_rating_list.forEach(function (e) {
                e.children[0].classList.remove("rate");
              });
              for (var k = 0; k < num_star; k++) {
                user_rating_list[k].children[0].classList.add("rate");
              }
            }
          }
        }
      }
    }
  }
  ratingCheck();
  var rating_panel = document.querySelector(".rating_panel");
  var clear_stars = document.querySelector(".clear_stars");
  rating_panel.addEventListener("mouseover", function () {
    clear_stars.classList.add("show");
  });
  rating_panel.addEventListener("mouseout", function () {
    clear_stars.classList.remove("show");
  });
  clear_stars.addEventListener("click", function () {
    for (var i = 0; i < userObj.user.length; i++) {
      if (login_obj.email == userObj.user[i].email) {
        if (userObj.user[i].rating.length != 0) {
          for (var j = 0; j < userObj.user[i].rating.length; j++) {
            if (userObj.user[i].rating[j].movie_id == id) {
              var value = userObj.user[i].rating[j].rating;
              userObj.user[i].rating.pop(value);
              localStorage.setItem("user", JSON.stringify(userObj));
              user_rating_list.forEach(function (e) {
                e.children[0].classList.remove("rate");
              });
            }
          }
        }
      }
    }
  });
  // rating end
  // ******************* movie/tv shows detail api request end *****************
}
// ************************ detail.html page script end ************************

// *********************** search.html page script start **********************
pageCheck = document.querySelector("body > div");
if (pageCheck.className == "container search-page") {
  var sessionObj = JSON.parse(sessionStorage.getItem("login"));
  var userObj = JSON.parse(localStorage.getItem("user"));
  if (sessionObj == null) {
    window.location.replace("index.html");
  } else {
    for (var i = 0; i < userObj.user.length; i++) {
      var sessionCreated = false;
      if (
        sessionObj.email == userObj.user[i].email &&
        sessionObj.id == userObj.user[i].id
      ) {
        sessionCreated = true;
        break;
      } else {
        sessionCreated = false;
      }
    }
    if (sessionCreated == false) {
      window.location.replace("index.html");
    }
  }
  // ***************************** search result list start *****************************
  var search_result_list = document.querySelector(
    ".search_section .search_result"
  );

  // url data start
  var url_string = location.search.substring(8);
  var url_data = url_string.replaceAll("+", " ");
  // url data end

  if (url_string == "") {
    window.location.replace("index.html");
  }
  function searchResultListLoad() {
    fetch(
      "https://api.themoviedb.org/3/search/multi?api_key=ca8c817a5c60b66df0b85905279777bb&language=en-US&include_adult=false&query=" +
        url_data
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        var search_result_list_li = document.querySelectorAll(
          ".search_section .search_result li"
        );
        search_result_list_li.forEach(function (e) {
          e.remove();
        });
        var result = data.results;
        result.forEach((i) => {
          if (i.media_type == "movie") {
            var li_element = document.createElement("li");
            var a_element = document.createElement("a");
            var img_link = document.createElement("a");
            var img_element = document.createElement("img");
            var figure_element = document.createElement("figure");
            var div_element = document.createElement("div");
            var details_element = document.createElement("div");
            var release_element = document.createElement("span");
            var overview_element = document.createElement("p");
            var date = i.release_date;
            release_element.innerHTML = date.replaceAll("-", "/");
            img_element.src = "https://image.tmdb.org/t/p/w92/" + i.poster_path;
            img_element.title = i.title;
            overview_element.innerHTML = i.overview;
            img_link.href = "detail.html?movie&" + i.id;
            a_element.href = "detail.html?movie&" + i.id;
            a_element.innerHTML = i.title;
            figure_element.appendChild(img_element);
            img_link.appendChild(figure_element);
            div_element.appendChild(a_element);
            div_element.appendChild(release_element);
            li_element.appendChild(img_link);
            details_element.appendChild(div_element);
            details_element.appendChild(overview_element);
            li_element.appendChild(details_element);
            search_result_list.appendChild(li_element);
          } else {
            var li_element = document.createElement("li");
            var a_element = document.createElement("a");
            var img_link = document.createElement("a");
            var img_element = document.createElement("img");
            var figure_element = document.createElement("figure");
            var div_element = document.createElement("div");
            var details_element = document.createElement("div");
            var release_element = document.createElement("span");
            var overview_element = document.createElement("p");
            release_element.innerHTML = i.first_air_date;
            img_element.src = "https://image.tmdb.org/t/p/w92/" + i.poster_path;
            img_element.title = i.title;
            overview_element.innerHTML = i.overview;
            img_link.href = "detail.html?tv&" + i.id;
            a_element.href = "detail.html?tv&" + i.id;
            a_element.innerHTML = i.name;
            figure_element.appendChild(img_element);
            img_link.appendChild(figure_element);
            div_element.appendChild(a_element);
            div_element.appendChild(release_element);
            li_element.appendChild(img_link);
            details_element.appendChild(div_element);
            details_element.appendChild(overview_element);
            li_element.appendChild(details_element);
            search_result_list.appendChild(li_element);
          }
        });
      });
  }
  searchResultListLoad();
}

// ***************************** search result list request end *****************************
