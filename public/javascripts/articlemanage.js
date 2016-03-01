var $table = $("#articles"),
    $remove = $("#remove"),
    selections = [];

$(function () {
    $("#side-menu>li:eq(2)").addClass("active").find("ul").addClass("in").find("li:eq(2)").addClass("active");

    if (selections.length == 0) {
        $remove.attr("disabled", "disabled");
    }

    $table.bootstrapTable({
        url: "/admin/getArticles",
        method: "post",
        pagination: true,
        paginationFirstText: "<i class=\"fa fa-angle-double-left\"></i>",
        paginationPreText: "<i class=\"fa fa-angle-left\"></i>",
        paginationNextText: "<i class=\"fa fa-angle-right\"></i>",
        paginationLastText: "<i class=\"fa fa-angle-double-right\"></i>",
        queryParamsType: "pageIndex",
        sidePagination: "server",
        pageList: [10, 25, 50, 100, "All"],
        search: true,
        sortName: "CreateTime",
        sortOrder: "desc",
        toolbar: "#toolbar",
        showRefresh: true,
        showColumns: true,
        iconsPrefix: "fa",
        icons: {
            refresh: "fa-refresh",
            columns: "fa-th-list"
        },
        idField: "UniqueId",
        filterControl: true,
        responseHandler: responseHandler,
        columns: [{
            field: "state",
            checkbox: true,
            align: "center",
            valign: "middle"
        }, {
            field: "CateName",
            title: "分类",
            halign: "center",
            valign: "middle",
            width: "140px",
            filterControl: "select",
            filterData: "url:/admin/getCateFilter",
            formatter: function (value, row) {
                if (row.CategoryAlias) {
                    return "<a href=\"/blog/" + row.CategoryAlias + "\" target=\"_blank\">" + value + "</a>";
                }
            }
        }, {
            field: "UniqueId",
            title: "ID",
            align: "center",
            valign: "middle",
            width: "180px",
            filterControl: "input",
            visible: false
        }, {
            field: "Title",
            title: "标题",
            halign: "center",
            valign: "middle",
            formatter: function (value, row) {
                var link = !row.IsActive ? '<span class="label label-danger" title="该文章已删除">已删除</span> ' : '';
                link += row.IsDraft ? '<span class="label label-primary" title="这是一篇草稿">草稿</span> ' : '';
                if (row.Source === '1') {
                    link += "<a href=\"" + row.Url + "\" target=\"_blank\"><i class=\"fa fa-link\"></i> " + value + "</a>";
                } else {
                    if (row.CategoryAlias) {
                        link += "<a href=\"/blog/" + row.CategoryAlias + "/" + row.Alias + "\" target=\"_blank\">" + value + "</a>";
                    }
                }
                return link;
            },
            filterControl: "input"
        }, {
            field: "CreateTime",
            title: "发布时间",
            align: "center",
            valign: "middle",
            width: "180px",
            sortable: true
        }, {
            field: "ModifyTime",
            title: "修改时间",
            align: "center",
            valign: "middle",
            width: "180px",
            sortable: true
        }, {
            field: "ViewCount",
            title: "浏览次数",
            align: "center",
            valign: "middle",
            width: "120px",
            sortable: true,
            formatter: function (value, row) {
                if (row.Source == 1) {
                    return "-";
                } else {
                    return value;
                }
            }
        }, {
            field: "operate",
            title: "操作",
            align: "center",
            valign: "middle",
            width: "120px",
            events: {
                "click .remove": function (e, value, row, index) {
                    swal({
                            title: "确定要删除该文章吗？",
                            text: "文章标题：" + row.Title,
                            html: true,
                            type: "warning",
                            allowOutsideClick: true,
                            showCancelButton: true,
                            cancelButtonText: "取消",
                            confirmButtonColor: "#d9534f",
                            confirmButtonText: "确认删除",
                            closeOnConfirm: false
                        },
                        function () {
                            $(".sweet-alert .confirm").text("提交中...");
                            $(".sweet-alert .confirm").attr("disabled", "disabled");
                            deleteArticle(row.UniqueId);
                        });
                },
                "click .undo": function (e, value, row, index) {
                    swal({
                            title: "确定要恢复该文章吗？",
                            text: "文章标题：" + row.Title,
                            html: true,
                            type: "warning",
                            allowOutsideClick: true,
                            showCancelButton: true,
                            cancelButtonText: "取消",
                            confirmButtonText: "确认恢复",
                            closeOnConfirm: false
                        },
                        function () {
                            $(".sweet-alert .confirm").text("提交中...");
                            $(".sweet-alert .confirm").attr("disabled", "disabled");
                            undoArticle(row.UniqueId);
                        });
                }
            },
            formatter: function (value, row) {
                if (row.IsActive) {
                    return "<a class=\"edit btn btn-white\" title=\"编辑\" href=\"/admin/editarticle/" + row.UniqueId + "\"><i class=\"fa fa-pencil\"></i></a> "
                        + "<button type=\"button\" class=\"remove btn btn-white\" title=\"删除\"><i class=\"fa fa-trash-o\"></i></button>";
                } else {
                    return "<a class=\"edit btn btn-white\" title=\"编辑\" href=\"/admin/editarticle/" + row.UniqueId + "\"><i class=\"fa fa-pencil\"></i></a> "
                        + "<button type=\"button\" class=\"undo btn btn-white\" title=\"恢复\"><i class=\"fa fa-undo\"></i></button>";
                }
            }
        }]
    });

    $table.on('check.bs.table check-all.bs.table ' +
        'uncheck.bs.table uncheck-all.bs.table', function (e, rows) {
        var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {
                if (row.IsActive) {
                    return row.UniqueId;
                }
            }),
            func = $.inArray(e.type, ['check', 'check-all']) > -1 ? 'union' : 'difference';
        selections = _[func](selections, ids);
        var selectionLength = selections.length;
        if (selectionLength > 0) {
            $remove.find(".badge").html(selectionLength);
            $remove.find(".badge").show();
        } else {
            $remove.find(".badge").html("");
            $remove.find(".badge").hide();
        }
        $remove.prop('disabled', !selectionLength);
    });

    $remove.click(function () {
        swal({
                title: "确定要删除这 " + selections.length + " 篇文章吗？",
                html: true,
                type: "warning",
                allowOutsideClick: true,
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#d9534f",
                confirmButtonText: "确认删除",
                closeOnConfirm: false
            },
            function () {
                $(".sweet-alert .confirm").text("提交中...");
                $(".sweet-alert .confirm").attr("disabled", "disabled");
                deleteArticle(selections.join(","));
            });
    });
});

function deleteArticle(ids) {
    $remove.prop("disabled", true);
    $.ajax({
        url: "/admin/deleteArticles",
        type: "post",
        data: "ids=" + ids,
        complete: function () {
            selections = [];
            $table.bootstrapTable('selectPage', 1);
            $remove.find(".badge").html("");
            $remove.find(".badge").hide();
            $(".sweet-alert .confirm").removeAttr("disabled");
            swal({
                title: "删除成功！",
                type: "success",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

function undoArticle(id){
    $.ajax({
        url: "/admin/undoArticle",
        type: "post",
        data: "id=" + id,
        complete: function () {
            $table.bootstrapTable('selectPage', 1);
            $(".sweet-alert .confirm").removeAttr("disabled");
            swal({
                title: "恢复成功！",
                type: "success",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.UniqueId, selections) !== -1;
    });
    return res;
}