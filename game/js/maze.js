var str="";
var strTip="";
var gameOver=false;
var ans="C";
var userans="C";

var hero={
    x:2,
    y:2,
    speed:1,
    flag:false
};
var tower=[],
    towerLight=[],
    Export=[],
    gift=[],
    trap=[],
    monster=[],
    key=[],
    lightKey=[],
    trees=[];

var heroNum=1,
    towerNum=3,
    exportNum=1,
    giftNum=3,
    trapNum=3,
    monsterNum=2,
    keyNum=3,
    getkeyNum=0;

var tools=new Array("floor","hero","tower","tree1","tree2","export","gift","trap","monster","key");
// console.log(tower[0].x);

function onTimeout(){
    //重新显现迷雾
    for(var i=1;i<=20;i++){
        for(var j=1;j<=20;j++){
            $("#"+i+'-'+j).css('background-color', 'rgba(0,0,0,1)');
        }
    }

    //保持灯塔、钥匙效果
    for(var i=1;i<=20;i++){
        for(var j=1;j<=20;j++){
            var str="";
            str="("+i+","+j+")";
            if($.inArray(str,towerLight)>=0) towerWork(i,j);
            if($.inArray(str,lightKey)>=0) $("#"+i+'-'+j).css('background-color', 'rgba(0,0,0,0)');
        }
    }
    
    //照亮勇者周围效果
    heroLight(hero.flag);
    
    //注册勇者移动事件
    document.onkeydown=heroMove;

    //陷阱、怪物触发效果
    var str="";
    str="("+hero.x+","+hero.y+")";
    if($.inArray(str,trap)>=0) trapWork(hero.x,hero.y);
    else if($.inArray(str,monster)>=0) monsterWork(hero.x,hero.y);
    
    //requestNextAnimationFrame(onTimeout);
    if(gameOver==false) setTimeout(onTimeout,100);
    else $(".gameOver").show();
}

//照亮勇者周围效果
function heroLight(flag){
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // console.log("-------")
            $("#"+(hero.x+i)+'-'+(hero.y+j)).css('background-color', 'rgba(0,0,0,0)');
        }
    }

    if(flag){
        $("#"+(hero.x)+'-'+(hero.y+2)).css('background-color', 'rgba(0,0,0,0)');
        $("#"+(hero.x)+'-'+(hero.y-2)).css('background-color', 'rgba(0,0,0,0)');
        $("#"+(hero.x+2)+'-'+(hero.y)).css('background-color', 'rgba(0,0,0,0)');
        $("#"+(hero.x-2)+'-'+(hero.y)).css('background-color', 'rgba(0,0,0,0)');
    }
}

//勇者移动效果
function heroMove(event){
    var keyCode;
    if (event == null)
    {
        keyCode = window.event.keyCode;
        window.event.preventDefault();
    }
    else
    {
        keyCode = event.keyCode;
        event.preventDefault();
    }
    //console.log(keyCode);

    $("#"+(hero.x)+'-'+(hero.y)).css('border','0px solid white');
    switch (keyCode)
    {
        case 37://left arrow
            hero.y-=hero.speed;
            //console.log(hero.y);
            break;
        case 38://up arrow
            hero.x-=hero.speed;
            //console.log(hero.x);
            break;
        case 39://right arrow
            hero.y+=hero.speed;
            //console.log(hero.y);
            break;
        case 40://down arrow
            hero.x+=hero.speed;
            //console.log(hero.x);
            break;
    }
    $("#"+(hero.x)+'-'+(hero.y)).css('border','2px solid white');

    document.onkeydown=null;
    document.onkeydown=toolsWork();
}


//道具互动效果
function toolsWork(event){
    var keyCode;
    if (event == null)
    {
        keyCode = window.event.keyCode;
        window.event.preventDefault();
    }
    else
    {
        keyCode = event.keyCode;
        event.preventDefault();
    }
    //console.log("sucess");

    if(keyCode==70){//按'f'键互动
        str="("+hero.x+","+hero.y+")";
        if($.inArray(str,tower)>=0){//tower
            towerLight.push(str);
            towerWork(hero.x,hero.y);
            tower.splice($.inArray(str, tower), 1);
        }
        else if($.inArray(str,Export)>=0){//export
            ExportWork();
        }
        else if($.inArray(str,gift)>=0){//gift
            $(".question_card").show();

            $("#button_submit").click(function(){
                $(".question_card").hide();

                if(userans==ans) giftWork(hero.x,hero.y);
            });

        }
        else if($.inArray(str,key)>=0){//key
            key.splice($.inArray(str, key), 1);
            keyWork(hero.x,hero.y);
        }

    }

    document.onkeydown=null;
}

//照亮灯塔效果
function towerWork(x,y){
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // console.log("-------")
            $("#"+(x+i)+'-'+(y+j)).css('background-color', 'rgba(0,0,0,0)');
        }
    }

    $("#"+(x)+'-'+(y+2)).css('background-color', 'rgba(0,0,0,0)');
    $("#"+(x)+'-'+(y-2)).css('background-color', 'rgba(0,0,0,0)');
    $("#"+(x+2)+'-'+(y)).css('background-color', 'rgba(0,0,0,0)');
    $("#"+(x-2)+'-'+(y)).css('background-color', 'rgba(0,0,0,0)');
}

//出口效果
function ExportWork(){
    if(getkeyNum==3){
        gameOver=true;
        $(".gameOver").show();
        $("#gameOver").text("成功逃离，游戏结束");
    }
    else console.log("钥匙不足");
}

//奖励效果
function giftWork(x,y){
    $("#gift"+x+'-'+y).css('visibility', 'hidden');
    var which=parseInt(Math.random()*2);

    //钥匙显示完
    while(key.length==0 && which==1){
        which=parseInt(Math.random()*1);
    }

    switch(which){
        case 0://扩大勇者照明范围
            hero.flag=true;
            break;
        case 1://显示钥匙的位置
            var keyLocation=key[Math.floor((Math.random()*key.length))];
            while($.inArray(keyLocation,lightKey)>=0){
                keyLocation=key[Math.floor((Math.random()*key.length))];
            } 
            lightKey.push(keyLocation);
            console.log(lightKey);
            var x=keyLocation.substring(keyLocation.indexOf('(')+1,keyLocation.indexOf(','));
            //console.log(x);
            var y=keyLocation.substring(keyLocation.indexOf(',')+1,keyLocation.indexOf(')'));
            //console.log(y);
            $("#"+(x)+'-'+(y)).css('background-color', 'rgba(0,0,0,0)');
            break;
    }
}

//钥匙效果
function keyWork(x,y){
    getkeyNum++;


    strTip="获取钥匙*"+getkeyNum+"\n";
    $("#tip").text(strTip);
    $("#tip").show();

    $("#key"+x+'-'+y).css('visibility', 'hidden');
    lightKey.splice($.inArray(str, lightKey), 1);
    //console.log("#key"+x+'-'+y);
}

//陷阱效果
function trapWork(x,y){
    var str="";
    str="("+x+","+y+")";
    trap.splice($.inArray(str, trap), 1);
    $("#trap"+x+'-'+y).css('visibility', 'hidden');

    strTip="遭遇陷阱\n";
    $("#tip").text(strTip);
    $("#tip").show();

    $(".gameOver").show();
    $("#gameOver").text("遭遇陷阱，游戏结束");
    gameOver=true;
}

//怪物效果
function monsterWork(){
    console.log("monster");

    strTip="遭遇怪物\n";
    $("#tip").text(strTip);
    $("#tip").show();

    $(".gameOver").show();
    $("#gameOver").text("遭遇怪物，游戏结束");
    gameOver=true;
}

//创造互动道具
function createTools(toolsType,i,j){
    switch(tools[toolsType])
    {
        case "floor":
            str="<div id='floor' class='tool'>";
            $(".tools").append(str);
            break;
        case "hero":
            str="<div id='hero' class='tool'>";
            str+="<span class='glyphicon glyphicon-eye-open' aria-hidden='true' style='color:#c6753f; font-size: 30px;'></span>"+"</div>";
            $(".fogs").append(str);
            break;
        case "tower":
            str="<div id='tower' class='tool'>";
            str+="<span class='glyphicon glyphicon-tower' aria-hidden='true' style='color:#155b30; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "tree1":
            str="<div id='tree1' class='tool'>";
            str+="<span class='glyphicon glyphicon-tree-conifer' aria-hidden='true' style='color:#475b3e; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "tree2":
            str="<div id='tree2' class='tool'>";
            str+="<span class='glyphicon glyphicon-tree-deciduous' aria-hidden='true' style='color:#678a56; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "export":
            str="<div id='export' class='tool'>";
            str+="<span class='glyphicon glyphicon-tent' aria-hidden='true' style='color:#1163d0; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "gift":
            str="<div id='gift"+i+"-"+j+"'"+" class='tool'>";
            str+="<span class='glyphicon glyphicon-gift' aria-hidden='true' style='color:#d05d11; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "trap":
            str="<div id='trap"+i+"-"+j+"'"+"class='tool'>";
            str+="<span class='glyphicon glyphicon-alert' aria-hidden='true' style='color:#bb1b23; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "monster":
            str="<div id='monster' class='tool'>";
            str+="<span class='glyphicon glyphicon-pawn' aria-hidden='true' style='color:#6b2ea8; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
        case "key":
            str="<div id='key"+i+"-"+j+"'"+" class='tool"+"'>";
            str+="<span class='glyphicon glyphicon-paperclip' aria-hidden='true' style='color:#e8c930; font-size: 30px;'></span>"+"</div>";
            $(".tools").append(str);
            break;
    }
}

//判定树木是否占用道具位置
function createTreesNoTools(str){
    var flag=true;
    if($.inArray(str,tower)>=0) flag=false;
    if($.inArray(str,Export)>=0) flag=false;
    if($.inArray(str,gift)>=0) flag=false;
    if($.inArray(str,trap)>=0) flag=false;
    if($.inArray(str,monster)>=0) flag=false;
    if($.inArray(str,key)>=0) flag=false;
    
    return flag;
}

//随机获取位置
function randomLocation(arr,Num){
    var num=Num;
    while(num--){
        var toolX=parseInt(Math.random()*20+1);
        var toolY=parseInt(Math.random()*20+1);
        var str="("+toolX+","+toolY+")";
        if($.inArray(str,arr)<0) arr.push("("+toolX+","+toolY+")");
        else num++;
    }
}

//--------------随机生成地图------------
function createMap(){
    $("#map").show();

    //随机生成勇者
    var X=parseInt(Math.random()*20+1);
    var Y=parseInt(Math.random()*20+1);
    hero.x=X;
    hero.y=Y;

    //生成道具地址
    randomLocation(tower,towerNum);
    randomLocation(Export,exportNum);
    randomLocation(gift,giftNum);
    randomLocation(trap,trapNum);
    randomLocation(monster,monsterNum);
    randomLocation(key,keyNum);

    //动态添加工具
    for(var i=1;i<=20;i++){
        for(var j=1;j<=20;j++){
            var str="";
            str="("+i+","+j+")";
            var toolsType;

            //处理森林密度并生成
            if(createTreesNoTools(str)==true){
                toolsType=parseInt(Math.random()*20);
                //console.log(tools[toolsType]);
                if(toolsType%5==0){
                    toolsType=3;//tree1
                    trees.push("("+i+","+j+")");
                }
                else if(toolsType%7==0){
                    toolsType=4;//tree2
                    trees.push("("+i+","+j+")");
                }
                else toolsType=0;
            }
            else toolsType=0;
            
            //生成各类道具
            if(toolsType==0){
                
                if($.inArray(str,tower)>=0){
                    toolsType=2;//tower
                    //console.log(tower);
                }
                else if($.inArray(str,Export)>=0){
                    toolsType=5;//export
                    //console.log(Export);
                }
                else if($.inArray(str,gift)>=0){
                    toolsType=6;//gift
                    //console.log(gift);
                }
                else if($.inArray(str,trap)>=0){
                    toolsType=7;//trap
                    //console.log(trap);
                }
                else if($.inArray(str,monster)>=0){
                    toolsType=8;//monster
                    //console.log(monster);
                }
                else if($.inArray(str,key)>=0){
                    toolsType=9;//key
                    //console.log(key);
                }

            }
            
            createTools(toolsType,i,j);

        }
    }

    //动态添加迷雾
    for(var i=1;i<=20;i++){
        for(var j=1;j<=20;j++){
            str="<div class='fog' name='fog' id='" + i +"-"+ j + "' value='" + i +"-"+ j +"'></div>";
            $(".fogs").append(str);
        }
    }

    //添加视角框
    $("#"+(hero.x)+'-'+(hero.y)).css('border','2px solid white');
}

//游戏结束按钮事件
function gameOverBtn(){
    console.log("游戏结束");
}


//游戏界面
function strat(){
    createMap();
    $(".gameOver").hide();
    $("#tip").hide();

    // //关闭答题界面
    // $(".red").click(function(){
    //     $(".question_card").hide();
    // });

    //注册游戏结束事件
    $("#gameOverBtn").click(gameOverBtn);

    //开始游戏动画
    setTimeout(onTimeout,100);

}

function init(){

    //开始界面
    // $("#btnStart").click(function(){
        $(".startTip").hide();
    //     strat();
    // });
    
    strat();
}

init();


