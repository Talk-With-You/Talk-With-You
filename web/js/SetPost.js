window.onload = function() {
    xs();
}

function xs() {
    // var text = "终于可以发了";
    // $.ajax({
    //     type: "post",
    //     url: "http://127.0.0.1:8011/post/like",
    //     data: { text: text },
    //     success: function(res) {
    //         console.log(res);
    //         if (res.status == 500) {
    //             return layer.open({
    //                 title: "提示",
    //                 icon: 2,
    //                 content: "获取页面数据失败，请联系管理员！"
    //             })
    //         }
    //         const  htmlStr  =  template("html-data",  res);            
    //         $(".SetPost").html(htmlStr);
    //     }
    // });

    $.get({
        url: "http://127.0.0.1:8011/post/set",
        success: function(res) {
            console.log(res);
            if (res.status == 500) {
                return layer.open({
                    title: "提示",
                    icon: 2,
                    content: "获取页面数据失败，请联系管理员！"
                })
            }
            const  htmlStr  =  template("html-data",  res);            
            $(".SetPost").html(htmlStr);
        }
    })
}
// 时间过滤器
template.defaults.imports.formatTime  =   function (data)  {    
    var  date  =  new  Date(data);    
    let  y  =  date.getFullYear();    
    let  m  =   (date.getMonth()  +  1)  <  10  ?  '0'  +  (date.getMonth()  +  1)  :  (date.getMonth()  +  1);    
    let  d  =  date.getDate()  <  10  ?  '0'  +  date.getDate()  :  date.getDate();    
    let  h  =  date.getHours()  <  10  ?  '0'  +  date.getHours()  :  date.getHours();    
    let  mm  =  date.getMinutes()  <  10  ?  '0'  +  date.getMinutes()  :  date.getMinutes();    
    let  s  =  date.getSeconds()  <  10  ?  '0'  +  date.getSeconds()  :  date.getSeconds();    
    return  `${y}-${m}-${d} ${h}:${mm}:${s}`;
};