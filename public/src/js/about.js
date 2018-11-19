$(function () {
    $(".my-nav-pills li:contains('关于')").addClass("active").siblings().removeClass("active");
    $("#job-title").cycleText();
});