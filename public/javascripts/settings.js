$(function () {
    $("#side-menu>li:eq(8)").addClass("active");

    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function (el) {
        var switchery = new Switchery(el, { color: '#1AB394' });
    });

    $(document).on({
        change: function () {
            $(this).prev(":hidden").val(this.checked);
        }
    }, ".js-switch");

    $(".fileupload").fileupload({
        url: "/admin/uploadimg",
        dataType: "text",
        done: function (e, data) {
            if(data.result){
                var path = '/images/' + JSON.parse(data.result).files[0].name;
                $(this).prev("img").attr("src", path);
                $(this).next(":hidden").val(path);
            }
        }
    });

    $('#btnSave').on('click', function () {
        var $this = $(this);
        $this.attr('disabled', 'disabled');
        $.ajax({
            url: $("#postForm")[0].action,
            type: $("#postForm")[0].method,
            data: $("#postForm").serialize(),
            success: function () {
                swal({
                    title: '保存成功！',
                    type: 'success',
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
            },
            complete: function () {
                $this.removeAttr("disabled");
            }
        });
    });
});