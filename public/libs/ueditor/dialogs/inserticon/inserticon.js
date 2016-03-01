UE.registerUI('inserticon', function (editor, uiName) {
    var dialog = new UE.ui.Dialog({
        iframeUrl: '/libs/ueditor/dialogs/inserticon/inserticon.html',
        editor: editor,
        name: uiName,
        title: "字体图标"
    });

    var btn = new UE.ui.Button({
        name: 'my_' + uiName,
        title: "字体图标",
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