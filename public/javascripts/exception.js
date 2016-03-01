var $table = $("#exceptions");

$(function () {
    $("#side-menu>li:eq(7)").addClass("active");

    $table.bootstrapTable({
        url: "/admin/getExceptions",
        method: "post",
        pagination: true,
        paginationFirstText: "<i class=\"fa fa-angle-double-left\"></i>",
        paginationPreText: "<i class=\"fa fa-angle-left\"></i>",
        paginationNextText: "<i class=\"fa fa-angle-right\"></i>",
        paginationLastText: "<i class=\"fa fa-angle-double-right\"></i>",
        queryParamsType: "pageIndex",
        sidePagination: "server",
        pageList: [10, 25, 50, 100, "All"],
        sortName: "timestamp",
        sortOrder: "desc",
        showRefresh: true,
        showColumns: true,
        iconsPrefix: "fa",
        icons: {
            refresh: "fa-refresh",
            columns: "fa-th-list",
            detailOpen: "fa-plus",
            detailClose: "fa-minus"
        },
        idField: "_id",
        detailView: true,
        detailFormatter: function (index, row) {
            return '<div style="white-space:pre-wrap;">' + JSON.stringify(row.meta, null, 2) + '</div>';
        },
        columns: [{
            field: "meta.os.hostname",
            title: "主机名",
            align: "center",
            valign: "middle",
            width: "120px",
        }, {
            field: "meta.code",
            title: "Code",
            align: "center",
            valign: "middle",
            width: "80px",
        }, {
            field: "message",
            title: "异常信息",
            halign: "center",
            valign: "middle"
        }, {
            field: "time",
            title: "记录时间",
            align: "center",
            valign: "middle",
            width: "200px",
            sortable: true
        }, {
            field: "level",
            title: "等级",
            align: "center",
            valign: "middle",
            width: "120px",
            sortable: true
        }]
    })
    ;
});