﻿$(function () {
    $("#side-menu>li:eq(2)").addClass("active").find("ul").addClass("in").find("li:eq(2)").addClass("active");
    refreshCate();
    var editor;
    var simplemde;

    if (source == "1") {
        $("#soruceLink").radio("check")
    } else {
        $("#soruceLocal").radio("check")
    }
    $("#myPillbox").pillbox("addItems", 0, JSON.parse($('#Labels').val()));

    $('[name=ContentType]').on('change', evt => {
        var el = evt.currentTarget;
        if (el.value === 'markdown') {
            $('#editor').hide();
            $('#mdEditor').show();
            simplemde.value(editor.getContentTxt());
        } else {
            $('#mdEditor').hide();
            $('#editor').show();
            editor.setContent(simplemde.value());
        }
    });

    editor = UE.getEditor("editor", {
        allowDivTransToP: false,
        initialFrameHeight: 300,
        textarea: 'no-use'
    });

    editor.ready(function () {
        $("[data-toggle=tooltip]").tooltip({
            container: "body"
        });
    });

    simplemde = new SimpleMDE({
        element: document.querySelector('#mdEditor textarea'),
        status: false,
        renderingConfig: {
            codeSyntaxHighlighting: true,
        },
        toolbar: ['bold', 'italic', 'strikethrough', 'heading', 'code', 'quote', 'unordered-list', 'ordered-list', 
        'link', 'image', 'table', 'horizontal-rule', 'preview'],
        spellChecker: false
    });

    if (editorType === 'markdown') {
        $('#mdRadio').radio('check');
        $('#mdEditor').show();
    } else {
        $('#ueRadio').radio('check');
        $('#editor').css('display', 'block');
    }

    $(".btn-alias").on("click", function () {
        var appid,
            key,
            salt,
            query = $("#Title").val(),
            from,
            to,
            str1,
            sign;
        if (query) {
            var that = this;
            $(that).addClass("disabled");
            appid = '20151219000008011';
            key = translateKey;
            if (!translateKey) {
                swal({
                    title: '生成失败',
                    text: '请先在系统设置中配置百度翻译key',
                    type: "error",
                });
                return;
            }
            salt = (new Date).getTime();
            from = 'zh';
            to = 'en';
            str1 = appid + query + salt + key;
            sign = md5(str1);
            $.ajax({
                url: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    q: query,
                    appid: appid,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign
                },
                success: function (data) {
                    if (data.error_code) {
                        swal({
                            title: '生成失败',
                            text: data.error_msg,
                            type: "error",
                        });
                        return;
                    }
                    var en = data.trans_result[0].dst;
                    var result = en.trim().toLowerCase().split(' ').join('-');
                    $("#Alias").val(result).focus();
                    $('#postForm').formValidation('revalidateField', 'Alias');
                },
                complete: function () {
                    $(that).removeClass("disabled");
                }
            });
        } else {
            $("#Title").focus();
        }
    });

    function getFormData() {
        var data = $("#postForm").serialize();
        var contentType = $('[name=ContentType]:checked').val();
        var content;
        if (contentType === 'markdown') {
            content = simplemde.value();
        } else {
            content =editor.getContent();
        }
        content = encodeURIComponent(content);
        data += '&Content=' + content;
        return data;
    }

    $("#postForm").on('init.field.fv', function (e, data) {
        var $parent = data.element.parents('.form-group'),
            $icon = $parent.find('.form-control-feedback[data-fv-icon-for="' + data.field + '"]');
        $icon.on('click.clearing', function () {
            if ($icon.hasClass('fa-remove')) {
                data.fv.resetField(data.element);
            }
        });
    }).formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-remove',
                validating: 'fa fa-sync'
            },
            err: {
                container: 'tooltip'
            },
            fields: {
                Title: {
                    validators: {
                        notEmpty: {
                            message: '标题不能为空'
                        }
                    }
                },
                Alias: {
                    validators: {
                        notEmpty: {
                            message: 'Alias不能为空'
                        },
                        remote: {
                            url: '/admin/checkArticleAlias',
                            type: 'POST',
                            data: '{"uid":"' + $('#UniqueId').val() + '"}',
                            delay: 1000,
                            message: 'Alias不唯一'
                        }
                    }
                },
                Summary: {
                    validators: {
                        notEmpty: {
                            message: '摘要不能为空'
                        }
                    }
                },
                Url: {
                    validators: {
                        notEmpty: {
                            message: 'Url不能为空'
                        },
                        uri: {
                            message: 'Url地址不正确'
                        }
                    }
                }
            }
        })
        .on('err.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(false);
        })
        .on('success.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(false);
        })
        .on('success.form.fv', function (e) {
            var isPublish = $('#btnPublish').length > 0;
            e.preventDefault();
            $("#Labels").val(JSON.stringify($("#myPillbox").pillbox("items")));
            $('#IsDraft').val('False');
            swal({
                    title: isPublish ? '确定要发布该文章吗？' : '确定提交更新吗？',
                    text: $("#CategoryId").val() === "other" ? "<span style='color:#d9534f;'>注意：当前未选择文章分类</span>" : null,
                    html: true,
                    type: "warning",
                    allowOutsideClick: true,
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#d9534f",
                    confirmButtonText: isPublish ? '确定发布' : '确定提交',
                    closeOnConfirm: false
                },
                function () {
                    $(".sweet-alert .confirm").text(isPublish ? '发布中...' : '提交中...');
                    $(".sweet-alert .confirm").attr("disabled", "disabled");
                    console.log(getFormData())
                    $.ajax({
                        url: $("#postForm")[0].action,
                        type: $("#postForm")[0].method,
                        data: getFormData(),
                        success: function () {
                            if (isPublish) {
                                swal({
                                    title: '发布成功！',
                                    type: "success",
                                    showConfirmButton: false,
                                    timer: 2000
                                }, function () {
                                    window.location.href = "/admin/articlemanage";
                                });
                            } else {
                                swal({
                                    title: '更新成功！',
                                    type: "success",
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                            }
                        },
                        error: function () {
                            swal({
                                title: isPublish ? '发布失败！' : '更新失败！',
                                type: "error",
                                showConfirmButton: false,
                                timer: 2000
                            });
                        },
                        complete: function () {
                            $(".sweet-alert .confirm").removeAttr("disabled");
                        }
                    });
                });
        });

    $('#btnSave').on('click', function () {
        var $this = $(this);
        $("#Labels").val(JSON.stringify($("#myPillbox").pillbox("items")));
        $('#IsDraft').val('True');
        $this.attr('disabled', 'disabled');
        $.ajax({
            url: $("#postForm")[0].action,
            type: $("#postForm")[0].method,
            data: getFormData(),
            success: function () {
                swal({
                    title: '草稿保存成功！',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000
                });
            },
            error: function () {
                swal({
                    title: "草稿保存失败！",
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

    $(".selectlist").on("changed.fu.selectlist", function (e, data) {
        $(this).find("li").removeClass("active");
        $(this).find("li[data-value=" + data.value + "]").addClass("active");
    });
});

function refreshCate() {
    $.ajax({
        url: "/admin/getCategories",
        type: "Post",
        success: function (data) {
            $("#Categorylist ul").html("");
            $.each(data, function (key, value) {
                if (!value.Link) {
                    $("#Categorylist ul").append("<li data-value=\"" + value._id + "\">"
                        + "<a href=\"#\">" + value.CateName + "</a>"
                        + "</li>");
                }
            });
            $("#Categorylist ul").append("<li data-value=\"other\"><a href=\"#\">未分类</a></li>");
            $("#Categorylist").selectlist("enable");
            $("#Categorylist").selectlist("selectByValue", categoryId);
            $("#Categorylist li[data-value=" + categoryId + "]").addClass("active");
        }
    });
}