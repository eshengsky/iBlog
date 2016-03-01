$(function () {
    getData();

    var adjustment;
    var group = $("#cate-list").sortable({
        group: 'cate-list',
        handle: 'i.fa-arrows',
        pullPlaceholder: false,
        onDrop: function ($item, container, _super) {
            var $clonedItem = $('<li/>').css({height: 0});
            $item.before($clonedItem);
            $clonedItem.animate({'height': $item.height()});

            $item.animate($clonedItem.position(), function () {
                $clonedItem.detach();
                _super($item, container);
            });
        },
        onDragStart: function ($item, container, _super) {
            var offset = $item.offset(),
                pointer = container.rootGroup.pointer;

            adjustment = {
                left: pointer.left - offset.left,
                top: pointer.top - offset.top
            };

            _super($item, container);
        },
        onDrag: function ($item, position) {
            $item.css({
                left: position.left - adjustment.left,
                top: position.top - adjustment.top
            });
        }
    });

    $(document).on({
        change: function () {
            var $input = $(this).parent().parent().next("input");
            if ($(this).prop("checked")) {
                $input.removeAttr("disabled");
                $(this).parents(".list-group-item").data("link", $input.val());
            } else {
                $input.attr("disabled", "disabled");
                $(this).parents(".list-group-item").data("link", "");
            }
        }
    }, "input:checkbox");

    $(document).on({
        change: function (event) {
            var val = $(this).val();
            if ($(event.target).hasClass("txtName")) {
                $(this).parents(".list-group-item").data("catename", val);
                $(this).parents(".list-group-item").attr("data-catename", val);
            } else if ($(event.target).hasClass("txtAlias")) {
                $(this).parents(".list-group-item").data("alias", val);
                $(this).parents(".list-group-item").attr("data-alias", val);
            } else {
                $(this).parents(".list-group-item").data("link", val);
                $(this).parents(".list-group-item").attr("data-link", val);
            }
        }
    }, ".txtName, .txtAlias, .txtLink");

    $(document).on({
        click: function () {
            $(this).parents(".list-group-item").slideUp("normal", function () {
                $(this).remove();
            });
        }
    }, ".btn-del-cate");

    $(document).on({
        click: function () {
            var cate = $("<li class=\"list-group-item\" data-uniqueid=\"" + "" + "\" data-catename=\"" + "" + "\" data-alias=\"" + "" + "\" data-img=\"" + "" + "\" data-link=\"" + "" + "\">"
                + "<div class=\"row\">"
                + "<div class=\"col-md-2\">"
                + "<i class=\"fa fa-arrows\"></i> "
                + "<span class=\"fileinput-button\">"
                + "<img src=\"" + "" + "\"/>"
                + "<input type=\"file\" class=\"fileupload\" name=\"file\">"
                + "</span>"
                + "</div>"
                + "<div class=\"col-md-2\">"
                + "<input class=\"form-control txtName\" type=\"text\" value=\"" + "" + "\" placeholder=\"分类名称\"/>"
                + "</div>"
                + "<div class=\"col-md-2\">"
                + "<input class=\"form-control txtAlias\" type=\"text\" value=\"" + "" + "\" placeholder=\"分类alias\"/>"
                + "</div>"
                + "<div class=\"col-md-5\">"
                + "<div class=\"input-group cate-link\">"
                + "<span class=\"input-group-addon\"><label>"
                + "<input type=\"checkbox\"/> 链接"
                + "</label></span>"
                + "<input type=\"text\" class=\"form-control txtLink\" value=\"" + "" + "\" disabled=\"disabled\">"
                + "</div>"
                + "</div>"
                + "<div class=\"col-md-1\">"
                + "<button class=\"btn btn-link btn-del-cate\" title=\"移除分类\"><i class=\"fa fa-times\"></i></button>"
                + "</div>"
                + "</div>"
                + "</li>");
            cate.appendTo($("#cate-list"));
            bindFileUpload();
        }
    }, "#btnNew");

    $(document).on({
        click: function () {
            if (isValidData()) {
                var $this = $(this);
                $this.attr("disabled", "disabled");
                $this.find(".fa").removeClass("fa-cloud-upload").addClass("fa-circle-o-notch fa-spin");
                var gdata = group.sortable("serialize").get();
                var json = JSON.stringify(gdata);
                $.ajax({
                    url: "/admin/saveCategories",
                    type: "Post",
                    data: {json: json},
                    success: function () {
                        swal({
                            title: "保存成功！",
                            type: "success",
                            showConfirmButton: false,
                            timer: 2000
                        });
                    },
                    error: function () {
                        swal({
                            title: "操作失败！",
                            type: "error",
                            showConfirmButton: false,
                            timer: 2000
                        });
                    },
                    complete: function () {
                        $this.removeAttr("disabled");
                        $this.find(".fa").removeClass("fa-circle-o-notch fa-spin").addClass("fa-cloud-upload");
                        getData();
                    }
                });
            }
        }
    }, "#btnSave");
});

function getData() {
    $.ajax({
        url: "/admin/getCategories",
        type: "Post",
        dataType: "json",
        success: function (data) {
            $("#cate-list").empty();
            $.each(data, function (key, value) {
                var cate = $("<li class=\"list-group-item\" data-uniqueid=\"" + value._id + "\" data-catename=\"" + value.CateName + "\" data-alias=\"" + value.Alias + "\" data-img=\"" + value.Img + "\" data-link=\"" + value.Link + "\">"
                    + "<div class=\"row\">"
                    + "<div class=\"col-md-2\">"
                    + "<i class=\"fa fa-arrows\"></i> "
                    + "<span class=\"fileinput-button\">"
                    + "<img src=\"" + value.Img + "\"/>"
                    + "<input type=\"file\" class=\"fileupload\" name=\"file\">"
                    + "</span>"
                    + "</div>"
                    + "<div class=\"col-md-2\">"
                    + "<input class=\"form-control txtName\" type=\"text\" value=\"" + value.CateName + "\" placeholder=\"分类名称\"/>"
                    + "</div>"
                    + "<div class=\"col-md-2\">"
                    + "<input class=\"form-control txtAlias\" type=\"text\" value=\"" + value.Alias + "\" placeholder=\"分类alias\"/>"
                    + "</div>"
                    + "<div class=\"col-md-5\">"
                    + "<div class=\"input-group cate-link\">"
                    + "<span class=\"input-group-addon\"><label>"
                    + "<input type=\"checkbox\" " + (value.Link != "" ? "checked=\"checked\"" : "") + "/> 链接"
                    + "</label></span>"
                    + "<input type=\"text\" class=\"form-control txtLink\" value=\"" + value.Link + "\" " + (value.Link == "" ? "disabled=\"disabled\"" : "") + ">"
                    + "</div>"
                    + "</div>"
                    + "<div class=\"col-md-1\">"
                    + "<button class=\"btn btn-link btn-del-cate\" title=\"移除分类\"><i class=\"fa fa-times\"></i></button>"
                    + "</div>"
                    + "</div>"
                    + "</li>");
                cate.appendTo($("#cate-list"));
            });
        },
        complete: function () {
            bindFileUpload();
        }
    });
}

function bindFileUpload() {
    $(".fileupload").fileupload({
        url: "/admin/uploadimg",
        dataType: "text",
        done: function (e, data) {
            $(this).prev().attr("src", '/images/' + data.files[0].name);
            $(this).parent().parent().parent().parent().data("img", '/images/' + data.files[0].name);
        }
    });
}

function isValidData() {
    var result = true;
    var items = $("#cate-list li");
    for (var i = 0; i < items.length; i++) {
        var cateName = $(items[i]).data("catename");
        var cateAlias = $(items[i]).data("alias");
        if (cateName === "" || cateAlias === "") {
            swal({
                title: "分类名称、分类alias都不能为空！",
                type: "warning",
                showConfirmButton: false,
                timer: 2000
            });
            result = false;
            break;
        }

        if ($("#cate-list li[data-catename='" + cateName + "']").length > 1) {
            swal({
                title: "分类名称 \"" + cateName + "\" 不唯一！",
                type: "warning",
                showConfirmButton: false,
                timer: 2000
            });
            result = false;
            break;
        }

        if ($("#cate-list li[data-alias='" + cateAlias + "']").length > 1) {
            swal({
                title: "分类alias \"" + cateAlias + "\" 不唯一！",
                type: "warning",
                showConfirmButton: false,
                timer: 2000
            });
            result = false;
            break;
        }
    }
    return result;
}