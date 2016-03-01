$(function () {
    $(".my-nav-pills li:eq(0)").addClass("active").siblings().removeClass("active");

    //如果目录默认为收起状态，则重新计算显示目录按钮的位置
    if (expandMenu === 'false') {
        $(".btn-menu").css("margin-left", $(".post-content").width() + 31 + "px");
        $(".btn-menu").show();
    }

    //代码高亮
    var pres = $('#main-context pre');
    pres.each(function (i, pre) {
        $(pre).html($('<code></code>').html($(pre).html()))
    });
    hljs.initHighlightingOnLoad();

    //将img套上a标签，以使用lightbox显示图片
    $("#main-context").find("img").wrap(function (i) {
        return "<a href=\"" + this.src + "\" data-lightbox=\"" + i + "\"></a>"
    });

    //正常目录
    $("#main-context").scrollNav({
        sections: "h2",  //一级目录的元素
        subSections: "h3",  //二级目录的元素
        showHeadline: true,
        headlineText: "文章目录",
        showTopLink: false,
        scrollOffset: 70,
        arrowKeys: true,
        insertTarget: "#control-wrap",
        insertLocation: "prependTo"
    });

    //收起目录
    $(".close-menu").on("click", function () {
        $("#control-wrap").hide();
        $(".post-content").removeClass("col-md-9").addClass("col-md-12");
        //CSS动画完成后再执行
        $(".post-content").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
            $(".btn-menu").css("margin-left", $(".post-content").width() + 31 + "px");
            $(".btn-menu").show();
        });
    });

    //显示目录
    $(".btn-menu").on("click", function () {
        $(".btn-menu").hide();
        $(".post-content").removeClass("col-md-12").addClass("col-md-9");
        //CSS动画完成后再执行
        $(".post-content").on('transitionend webkitTransitionEnd oTransitionEnd', function () {
            $(".btn-menu").hide();  //TODO：需隐藏2次，否则显示不正常，待研究~
            $("#control-wrap").show();
        });
    });

    //改变窗口大小后，重置目录，以修正各标题的定位
    $(window).on("resize", function () {
        $.fn.scrollNav("resetPos");
    });
});