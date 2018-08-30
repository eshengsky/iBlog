$(function () {
    $("#side-menu>li:eq(6)").addClass("active");

    $('#keyinput').on('changed.fu.combobox', function (evt, data) {
        if (data.value) {
            $('#cacheKey').val(data.value);
        }
    });

    $("#btnQuery").on("click", function () {
        var key = $("#cacheKey").val();
        if (key) {
            $.ajax({
                url: "/admin/getcache",
                type: "Post",
                data: {
                    key: key
                },
                success: function (data) {
                    var json = data ? JSON.stringify(data, null, 2) : '';
                    $("#cacheContent").html(json);
                    $("#cacheContent").focus();
                },
                error: function () {
                    swal({
                        title: "获取失败！",
                        type: "error",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        }
    });

    $("#btnClear").on("click", function () {
        var key = $("#cacheKey").val();
        if (key) {
            $.ajax({
                url: "/admin/clearcache",
                type: "Post",
                data: {
                    key: key
                },
                success: function () {
                    swal({
                        title: "成功清除！",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    $("#cacheContent").html("");
                    $("#cacheContent").focus();
                },
                error: function () {
                    swal({
                        title: "清除失败！",
                        type: "error",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        }
    });
});