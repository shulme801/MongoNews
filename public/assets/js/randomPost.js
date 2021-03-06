$(document).ready(function(){

  // Pulls in random post from our post model and stores it in local storage
  $.get("/api/random_post", function(data) {

    if (data) {
      localStorage.setItem("post_id", data.post_id);
      console.log("Here is the stored post_id: ", data.post_id);
    } else {
      console.log("Did not pull in a random post from the db!");
    }
    //Time to recurse
    writeRandomPost(data);

  });


  function writeRandomPost(data) {
    $("#randomPostContent").text("");
    $("#randomPostContent").append("<p class='post'>" + data.content + "</p>");
    
    for (var i = 0; i < data.Comments.length; i++) {
      if (i%2) {
        $("#randomPostContent").append("<p class = 'even'>" + data.Comments[i].content + "</p>");
      } else {
        $("#randomPostContent").append("<p class = 'odd'>" + data.Comments[i].content + "</p>");
      }
    };

  }

});




