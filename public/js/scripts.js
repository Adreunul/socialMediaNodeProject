console.log("wtfbroRF");
if(idCurrentUser == 0)
{
    $(".user-action").addClass("disabled");
    $(".user-action").removeClass("active");
    $(".log-button").text("Log In");
    $(".log-button").attr("href", "/login");
} else
{
    $(".user-action").removeClass("disabled");
    $(".user-action").addClass("active");
    $(".log-button").text("Log Out");
}