$(function () {
    $("#side-menu>li:eq(5)").addClass("active");

    $(".fileupload").fileupload({
        url: "/admin/uploadimg",
        dataType: "json",
        done: function (e, data) {
            $(this).prev("img").attr("src", data.result.files[0].url);
            $(this).next(":hidden").val('/images/' + data.result.files[0].name);
        }
    });

    $('#btnSave').on('click', function () {
        $.ajax({
            url: $('#formAbout')[0].action,
            type: $('#formAbout')[0].method,
            data: $('#formAbout').serialize(),
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
                    title: "保存失败！",
                    type: "error",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    });
});