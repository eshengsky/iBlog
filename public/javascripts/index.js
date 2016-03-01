var home_loading_timeout = 2000;
var isLoading = false;
var timeout = 1000;
var contentTimeout = 1500;
var begin = new Date();
var contentBegin = new Date();
var pageCount;
var tooltip_timeout = 1500;
$(function () {
    $(".my-nav-pills li:eq(0)").addClass("active").siblings().removeClass("active");
    $("#load-list").show();
    $("#PageIndex").val(1);
    requestData();

    $(".category-list").mCustomScrollbar({
        axis: "y",
        theme: "dark-3"
    });

    $(window).scroll(function () {
        $("[data-toggle='tooltip']").tooltip("hide");
    });

    $("[data-toggle='tooltip']").tooltip({
        container: "body"
    });

    $(document).on({
        click: function () {
            $(this).remove();
            begin = new Date();
            $("#load-list").show();
            isLoading = true;
            $("#PageIndex").val(parseInt($("#PageIndex").val()) + 1);
            requestData();
        }
    }, "#btn-load");

    $(document).on({
        click: function () {
            var index = $(this).attr("page");
            var pageItem = $("#page" + index);
            $("html,body").animate({scrollTop: $(pageItem).offset().top - 90}, 1000);
        }
    }, "#page-nav a");

    $(document).on({
        click: function () {
            var $this = $(this);
            $(".bd_weixin_popup").hide();
            $(".bd_weixin_popup_bg").hide();
            $(".post-cover").fadeIn();
            $("body").addClass("modal-open");
            $(".post-modal").css("right", 0);
            var alias = $(this).parent().attr("uid");
            if ($('body').data('preview') === alias) {
                return;
            }
            resetModal();
            var title = $(this).siblings("h4").children("a").html();
            $(".post-modal .modal-header h4").html(title);
            $("#btnFullMode").attr("href", $(this).next('h4').children('a').attr('href'));
            $(".post-content div").hide();
            var previewData = $this.data('preview-data');
            if (previewData) {
                appendContent(previewData);
                return;
            }
            $(".sk-cube-grid").show();
            contentBegin = new Date();
            $.ajax({
                url: "/blog/getPreviewContent",
                type: "Post",
                data: {alias: alias},
                success: function (data) {
                    var end = new Date();
                    $this.data('preview-data', data);
                    if (end - contentBegin > contentTimeout) {
                        appendContent(data);
                    } else {
                        var timespan = contentTimeout - (end - contentBegin);
                        setTimeout(function () {
                            appendContent(data);
                        }, timespan);
                    }
                }
            });
        }
    }, ".preview-link");

    $(".post-modal .modal-body").mCustomScrollbar({
        theme: "dark-3",
        scrollButtons: {
            enable: true
        }
    });

    $(".post-cover").on("click", function () {
        closeModal();
    });

    $("#btnCloseModal").on("click", function () {
        closeModal();
    });

    $("#btnFullMode").on("click", function () {
        setTimeout(closeModal, 800);
    });

    $(".list-top-left a").on("click", function () {
        if (!$(this).hasClass("current")) {
            $(this).addClass("current").siblings().removeClass("current");
            $(".list-wrap ol").html("");
            $("[data-toggle='tooltip']").tooltip("hide");
            $("#page-nav").html("");
            $("#btn-load").remove();
            $("#no-more").remove();
            begin = new Date();
            $("#load-list").show();
            $("#SortBy").val($(this).attr("sort"));
            $("#PageIndex").val(1);
            requestData();
        }
    });

    $("#Keyword").on("keypress", function (e) {
        if (e.which == 13 || e.which == 10) {
            searchPost();
        }
    });

    $("#btnFilter").on("click", function () {
        searchPost();
    });

    $(".selectlist").on("changed.fu.selectlist", function (e, data) {
        $(this).find("li").removeClass("active");
        $(this).find("li[data-value=" + data.value + "]").addClass("active");
    });
});

function requestData() {
    $.ajax({
        url: $('#filterForm')[0].action,
        type: $('#filterForm')[0].method,
        data: $('#filterForm').serialize(),
        success: function (result) {
            var end = new Date();
            var data = result.posts;
            pageCount = result.pageCount;
            if (end - begin > timeout) {
                addPage($("#PageIndex").val(), data);
            } else {
                var timespan = timeout - (end - begin);
                setTimeout(function () {
                    addPage($("#PageIndex").val(), data);
                }, timespan);
            }
        }
    });
}

function appendContent(data) {
    $(".sk-cube-grid").hide();
    $(".post-content div").html(data.Content);

    var labels = JSON.parse(data.Labels);
    $.each(labels, function (key, value) {
        $("#label-foot").append("<span title=\"" + value.text + "\" class=\"post-label\">" + value.text + "</span>");
    });
    $(".post-modal .modal-body").mCustomScrollbar("scrollTo", "top", {
        scrollInertia: 0
    });
    $(".post-content div").fadeIn();
    var pres = $('.post-content pre');
    pres.each(function (i, pre) {
        $(pre).html($('<code></code>').html($(pre).html()));
        hljs.highlightBlock($(pre).children('code')[0]);
    });
}

function closeModal() {
    $(".post-modal").css("right", "-1200px");
    $(".post-cover").fadeOut();
    $("body").removeClass("modal-open");
}

function resetModal() {
    $(".post-modal .modal-header h4").empty();
    $(".post-content div").empty();
    $("#label-foot").empty();
}

function searchPost() {
    $(".list-wrap ol").html("");
    $("[data-toggle='tooltip']").tooltip("hide");
    $("#page-nav").html("");
    $("#btn-load").remove();
    $("#no-more").remove();
    begin = new Date();
    $("#load-list").show();
    $("#PageIndex").val(1);
    requestData();
}

function addPage(index, data) {
    $("#load-list").hide();
    if (data.length > 0) {
        $(".list-wrap ol").append("<li id=\"page" + index + "\"></li>");
        $.each(data, function (key, value) {
            var itemHtml;
            if (value.Source == "1") {
                itemHtml = "<div uid=\""
                    + value.Alias
                    + "\" class=\"blog-item " + ($(".home-loading").length > 0 ? "" : "animated fadeIn") + "\">"
                    + "    <h4>"
                    + "        <a title=\""
                    + value.Title
                    + "\" target=\"_blank\" href=\""
                    + value.Url
                    + "\">"
                    + "<i class=\"fa fa-link\"></i> " + value.Title
                    + "        <\/a>"
                    + "    <\/h4>"
                    + "    <span title=\"文章分类\">"
                    + "        <i class=\"fa fa-map-signs\">"
                    + "        <\/i>"
                    + "        "
                    + "<a href=\"/blog/" + value.CategoryAlias + "\" target=\"_blank\">" + value.CateName + "</a>"
                    + "    <\/span>"
                    + "    <span title=\"发布时间\" class=\"margin-left-20\">"
                    + "        <i class=\"fa fa-clock-o\">"
                    + "        <\/i>"
                    + "        "
                    + value.PublishDate
                    + "    <\/span>"
                    + "    <a title=\""
                    + value.Host
                    + "\" target=\"_blank\" href=\""
                    + value.Url.substring(0, value.Url.indexOf("://") + 3) + value.Host
                    + "\" class=\"pull-right margin-left-20 hidden-xs\">"
                    + "        "
                    + "<i class=\"fa fa-globe\"></i> " + value.Host
                    + "    <\/a>"
                    + "    <div class=\"clearfix\">"
                    + "    <\/div>"
                    + "    <p>"
                    + "        "
                    + encodeHtml(value.Summary)
                    + "    <\/p>"
                    + "<\/div>"
                    + "<div class=\"hr-line-dashed\"></div>";
            } else {
                itemHtml = "<div class=\"blog-item " + ($(".home-loading").length > 0 ? "" : "animated fadeIn") + "\" uid=\"" + value.Alias + "\"><a class=\"preview-link\" title=\"点击预览\"></a><h4><a href=\"/blog/"
                    + value.CategoryAlias + "/" + value.Alias + "\" target=\"_blank\" title=\"" + value.Title + "\">" + value.Title + "</a></h4><span title=\"文章分类\"><i class=\"fa fa-map-signs\"></i> " + "<a href=\"/blog/" + value.CategoryAlias + "\" target=\"_blank\">" + value.CateName + "</a>" + "</span> <span class=\"margin-left-20\" title=\"发布时间\"><i class=\"fa fa-clock-o\"></i> " + value.PublishDate + "</span><div class=\"clearfix\"></div><p>" + encodeHtml(value.Summary) + "</p></div><div class=\"hr-line-dashed\"></div>";
            }
            $("#page" + index).append(itemHtml);
        });
        $("body").append("<script id=\"cy_cmt_num\" src=\"http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cyrUoGjWj\"><\/script>");
        var item = $("<li><a href=\"javascript:void(0)\" page=\"" + index + "\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"第" + index + "页\"></a></li>");
        item.appendTo($("#page-nav"));
        var percent = 100 / index;
        $("#page-nav li").css("height", percent + "%");
        $("[data-toggle='tooltip']:visible").tooltip({
            container: "body"
        });
        item.find("a").tooltip("show");
        setTimeout(function () {
            item.find("a").tooltip("hide");
        }, tooltip_timeout);
        if ($("#PageIndex").val() == pageCount) {
            if (pageCount != 1) {
                $(".list-wrap").append("<div id=\"no-more\" class=\"text-muted text-center\">没有更多数据<\/div>");
            }
        } else {
            $(".list-wrap").append("<button id=\"btn-load\" class=\"btn btn-white btn-block\">下一页</button>");
        }
    } else {
        $(".list-wrap ol").append("<li id=\"page" + index + "\"></li>");
        $("#page" + index).append("<div class=\"text-center text-muted\">暂无数据</div>");
    }
    isLoading = false;
    if ($(".home-loading").length > 0) {
        var home_loading_end = new Date();
        $("[data-toggle='tooltip']").tooltip("hide");
        if (home_loading_end - home_loading_begin > home_loading_timeout) {
            $(".home-loading").remove();
            document.body.style.overflow = "auto";
        } else {
            var home_loading_timespan = home_loading_timeout - (home_loading_end - home_loading_begin);
            setTimeout(function () {
                $(".home-loading").remove();
                document.body.style.overflow = "auto";
            }, home_loading_timespan);
        }
    }
}

function encodeHtml(s) {
    return (typeof s != "string") ? s :
        s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
            function ($0) {
                var c = $0.charCodeAt(0), r = ["&#"];
                c = (c == 0x20) ? 0xA0 : c;
                r.push(c);
                r.push(";");
                return r.join("");
            });
};
