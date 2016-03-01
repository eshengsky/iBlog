$(function () {
    $.supersized({
        slide_interval: 3000,    // Length between transitions
        transition: 1,    // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed: 3000,    // Speed of transition
        performance: 1,    // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
        // Size & Position
        min_width: 0,    // Min width allowed (in pixels)
        min_height: 0,    // Min height allowed (in pixels)
        vertical_center: 1,    // Vertically center background
        horizontal_center: 1,    // Horizontally center background
        fit_always: 0,    // Image will never exceed browser width or height (Ignores min. dimensions)
        fit_portrait: 1,    // Portrait images will not exceed browser height
        fit_landscape: 0,    // Landscape images will not exceed browser width
        // Components
        slide_links: 'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        thumbnail_navigation: 0,			// Thumbnail navigation
        slides: [    // Slideshow Images
            {image: "/images/s1.jpg"},
            {image: "/images/s2.jpg"},
            {image: "/images/s3.jpg"}
        ],
        progress_bar: 1			// Timer for each slide
    });

    $("#txtUserName").focus();

    $("#btnLogin").on("click", function () {
        verify();
    });

    $(document).on({
        keypress: function (e) {
            if (e.which === 13 || e.which === 10) {
                verify();
            }
        }
    }, "#txtUserName, #txtPwd");
});

function verify() {
    var userName = $("#txtUserName").val();
    var password = $("#txtPwd").val();
    if (!userName) {
        $("#txtUserName").focus();
        return;
    }
    if (!password) {
        $("#txtPwd").focus();
        return;
    }
    password = md5(password);
    var $btn = $("#btnLogin");
    $btn.find("i").removeClass("fa-sign-in").addClass("fa-circle-o-notch fa-spin");
    $btn.attr("disabled", "disabled");
    $.ajax({
        url: "/login",
        type: "Post",
        data: {UserName: userName, Password: password},
        success: function (data) {
            if (data.valid === true) {
                window.location.href = data.returnTo;
            } else {
                swal({
                    title: data.message,
                    type: "error",
                    showConfirmButton: false,
                    timer: 2000
                });
                $btn.find("i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-sign-in");
                $btn.removeAttr("disabled");
            }
        }
    });
}