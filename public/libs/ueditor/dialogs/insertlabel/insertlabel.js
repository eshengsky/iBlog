UE.registerUI('insertlabel', function (editor, uiName) {
    var dialog = new UE.ui.Dialog({
        iframeUrl: '/libs/ueditor/dialogs/insertlabel/insertlabel.html',
        editor: editor,
        name: uiName,
        title: "标签&徽章"
    });

    var btn = new UE.ui.Button({
        name: 'my_' + uiName,
        title: "标签&徽章",
        cssRules: 'background-position: -500px 0;',
        onclick: function () {
            dialog.render();
            dialog.open();
        }
    });

    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
        } else {
            btn.setDisabled(false);
        }
    });

    return btn;
}, 44);