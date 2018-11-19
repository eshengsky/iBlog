//代码高亮自定义
$("code").each(function(){
  $(this).html("<ul><li>" + $(this).html().replace(/\n/g,"\n</li><li>") +"\n</li></ul>");
});