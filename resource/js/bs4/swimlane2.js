  var typLine = 'line-svg-1'
  var lineColor = '#6d6d6d'
  var addFgColor = '#fff'
  var addFgFigure = "14"



  function LaneRepair() {
     readLeadLineApi();
  }

  function checkProccesLast() {

    var dt = Utility.getParamFromUrl('process_name');
    if (dt.length > 0) {
      genProccesListCore(dt);
      genLaneListApi(dt, "")
      $('#CardSwimAdd-gen').toggle();
      $('#projectListSwimlaneInside').change();
    }
  }

  function genLeadeLine(start, end, type, clor, text,idLine) {



    if (type === "line-svg-3") {
      dataLieaderLineId =idLine
      new LeaderLine(document.getElementById(start), document.getElementById(end), {

        middleLabel: LeaderLine.pathLabel(text),
        size: 2,
        startPlug: 'arrow',
        color: clor,
        dash: {
          animation: true
        },
    
          
      })
      
    }
    if (type === "line-svg-2") {
      dataLieaderLineId =idLine
      new LeaderLine(document.getElementById(start), document.getElementById(end), {

        middleLabel: LeaderLine.pathLabel(text),
        outlineColor: clor,
        color: "tansparent",
        outline: true,
        endPlugOutline: true,
        endPlugSize: 1.5,
        id:idLine

      })
    
    }
    if (type === "line-svg-1") {
      dataLieaderLineId =idLine
      new LeaderLine(document.getElementById(start), document.getElementById(end), {

        middleLabel: LeaderLine.pathLabel(text),
        size: 2,
        startPlug: 'square',
        color: clor,
        id:idLine

      })
     
    }
    if (type === "line-svg-4") {
      dataLieaderLineId =idLine
      new LeaderLine(document.getElementById(start), document.getElementById(end), {

        middleLabel: LeaderLine.pathLabel(text),
        size: 2,
        startPlug: 'arrow1',
        color: clor,
        id:idLine

      })
     
    }


  }




  var is_line_dragged2 = false
  var idgenvLane = 23734723742;

  function genLaneListApi(prcId, namePro) {

    $(".editNameProcessDiv h4").text(namePro)
    Utility.addParamToUrl('process_name', prcId);
    
    var prop = {
      "kv": {
        'processId': prcId
      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmreadLaneApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json",
      crossDomain: true,
      async: true,
      success: function (res) {
        try {
       
          var ln = res.tbl[0].r;
          $(".Graphtable").html('');
       
          for (let index = 0; index < ln.length; index++) {

            var nm = ln[index].laneName;
            var id = ln[index].id;
            var on = ln[index].orderNo;
            if (ln[index].columnCount === "") {
              var wd = 1;

            } else {
              var wd = parseFloat(ln[index].columnCount);

            }



            $(".Graphtable").append(genUsLane(nm, id, on));

            for (let j = 0; j < wd; j++) {

              $("#" + id + " table tbody").append('<tr></tr>');
            }
            var countsltd1 = 30
            for (var i = 0; i < countsltd1; i++) {


              $("#" + id + " table tbody tr").append('<td></td>');



            }
            $("#" + id + " table tbody tr").find("td").append(genusAdderPopupopenedSl());


            lineInsideGen(id);

          }

        } catch (error) {
          $(".Graphtable ").html('');
          $(".leader-line").remove();
          $('#loader-actvty').hide();
          $('.Graphtable').css("visibility", "visible");

          var alen = 3;
          for (let index = 0; index < alen; index++) {
           addLaneApi(index);
            
          }
      
        }



        $(".Graphtable .laneColumnDiv").arrangeable({
          dragSelector: ".dragLaneClass",

        })

        

      },
      error: function () {
        Toaster.showError(('somethingww'));
      }
    });
  }

  function genProccesList() {

      
   
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmreadProcessListApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json",
      crossDomain: true,
      async: true,
      success: function (data) {
      
        var dt = data._table.r;
        $("#projectListSwimlane").html("");
        for (let index = 0; index < dt.length; index++) {
    
    
          var nm = dt[index].processName;
          var id = dt[index].id;
    
          $("#projectListSwimlane").append("<option value=" + id + ">" + nm + "</option>");
    
        }
      },
      error: function () {
        Toaster.showError(('somethingww'));
      }
    });
 
   
  }

  function genProccesListCore(val) {
  
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmreadProcessListApi",
      type: "POST",
      data: JSON.stringify(),
      contentType: "application/json",
      crossDomain: true,
      async: true,
      success: function (res) {
        var dt = res._table.r;
        $("#projectListSwimlaneInside").html("");
        for (let index = 0; index < dt.length; index++) {
    
    
          var nm = dt[index].processName;
          var id = dt[index].id;
    
          $("#projectListSwimlaneInside").append("<option value=" + id + ">" + nm + "</option>");
    
        }
        if (val.length > 2) {
          $("#projectListSwimlaneInside").val(val);
        }
       },
      error: function () {
        Toaster.showError(('somethingww'));
      }
    });
    

  

  }
  function genProccesListCoreFigur(val) {
 

    $.ajax({
      url: urlGl + "api/post/srv/serviceTmreadProcessListApi",
      type: "POST",
      data: JSON.stringify(),
      contentType: "application/json",
      crossDomain: true,
      async: true,
      success: function (res) {
      
        var dt = res._table.r;
    $(".procces_List_activity").html("");
    for (let index = 0; index < dt.length; index++) {

  
      var nm = dt[index].processName;
      var id = dt[index].id;

      $(".procces_List_activity").append("<option value=" + id + ">" + nm + "</option>");

    }
    if (val.length > 2) {
      $(".procces_List_activity").val(val);
    }
      },
      error: function () {
        Toaster.showError(('somethingww'));
      }
    });
    

  }


  function addLaneApi(on) {
  

  
    var prcId = Utility.getParamFromUrl('process_name');
    
    var prop = {
      "kv": {
        "laneName": "Lane",
        "orderNo": on,
        'processId': prcId
      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmaddLaneApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json",
      crossDomain: true,
      async: true,
      success: function (res) {
        var id = res.kv.id;

        $(".Graphtable").append(genUsLane("Lane", id, on));
        $("#" + id + " table tbody ").append('<tr></tr>');
        var countsltd1 = 30
        for (var i = 0; i < countsltd1; i++) {


          $("#" + id + " table tbody tr").append('<td></td>');



        }
        $("#" + id + " table tbody").find("td").append(genusAdderPopupopenedSl());


        $(".Graphtable .laneColumnDiv").arrangeable({
          dragSelector: ".dragLaneClass",

        })

        var items = document.querySelectorAll('.Graphtable td');
        items.forEach(function (item) {
          item.addEventListener('dragstart', handleDragStart, false);
          item.addEventListener('dragenter', handleDragEnter, false);
          item.addEventListener('dragover', handleDragOver, false);
          item.addEventListener('dragleave', handleDragLeave, false);
          item.addEventListener('drop', handleDrop, false);
          item.addEventListener('dragend', handleDragEnd, false);
        });
        LaneRepair();
      },
      error: function () {
        Toaster.showError(('somethingww'));
      }
    });
 
  }

  function lineInsideGen(LineIds) {

    
   
    var prop = {
      "kv": {

        "fkLineId": LineIds,
        

      }
    }

    $.ajax({
      url: urlGl + "api/post/srv/serviceTmupdateLaneApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (data) {

        try {
          var ln = data._table.r;
          for (let index = 0; index < ln.length; index++) {
    
            var prId = ln[index].fkLineId;
            var orn = parseFloat(ln[index].orderNo1);
            var fgText = ln[index].figureText1;
            var id = ln[index].id;
            var typ = ln[index].figureName1;
            var clr = ln[index].figureColor1;
            var UsCaId = ln[index].storyCardId;
            var col = ln[index].columnNo;
            var ftSzTxt = ln[index].fontSizeNew;
            console.log(ftSzTxt)
            if (ftSzTxt.length  <= 0) {
              ftSzTxt = "9";
            }else{
            
            }
        
            var el = $('#' + prId + " table tbody").find('tr:eq(' + col + ')').find('td:eq(' + orn + ')');
            figureAddBlock(el, clr, typ, id, UsCaId, fgText, ftSzTxt.trim());
    
           
    
          }
          readLeadLineApi();
        
        } catch(error) {
         
              $('#loader-actvty').hide();
              $('.Graphtable').css("visibility", "visible");
              $('.leader-line').remove();
        }
    
    
    
        var items = document.querySelectorAll('.Graphtable td');
        items.forEach(function (item) {
          item.addEventListener('dragstart', handleDragStart, false);
          item.addEventListener('dragenter', handleDragEnter, false);
          item.addEventListener('dragover', handleDragOver, false);
          item.addEventListener('dragleave', handleDragLeave, false);
          item.addEventListener('drop', handleDrop, false);
          item.addEventListener('dragend', handleDragEnd, false);
        });
    
      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
    
   



  }



  function laneUpdateApi(id) {

    var on = $('#' + id).css('order');
    var nm = $('#' + id).find('.laneHeaderName span').text();
    var prop = {
      "kv": {

        "id": id.trim(),
        "laneName": nm.trim(),
        "orderNo": on.trim(),
        "updatedField": "id,laneName,orderNo",

      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmupdateLaneApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {


      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }

  function laneUpdateApiColumnOr(id) {

    var wd = $('#' + id + " table tbody tr").length;
     var on = $('#' + id ).index();
    var prop = {
      "kv": {

        "id": id.trim(),
        "columnCount": wd,
        "orderNo": on,
        "updatedField": "id,columnCount,orderNo",

      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmupdateLaneApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {


      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }
  function laneUpdateApiColumn(id) {

    var wd = $('#' + id + " table tbody tr").length;

    var prop = {
      "kv": {

        "id": id.trim(),
        "columnCount": wd,
        "updatedField": "id,columnCount",

      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmupdateLaneApi",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {


      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }

  function figureUpdateApi(fb) {


    $.ajax({
      url: urlGl + "api/post/srv/serviceTmupdateFigureInside",
      type: "POST",
      data: JSON.stringify(fb),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {


      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }
  function LaneUpdateApi(fb) {


    $.ajax({
      url: urlGl + "api/post/srv/serviceTmupdateLeaderLine",
      type: "POST",
      data: JSON.stringify(fb),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {


      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }

  function figureAddApi(el, clr, nm, txt, on, lId, col) {

    var prop = {
      "kv": {
        "figureColor": clr,
        "figureName": nm,
        "figureText": txt,
        "orderNo": on,
        "fkLineId": lId,
        "columnNo": col
      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmcreateFigureInside",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {
        var countFigure = res.kv.id;
        if (nm == 10) {
          $(el).parents("td").append(genUsStickMAn(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());
          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 12) {
          $(el).parents("td").append(genUsCircle(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());
          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 14) {
          $(el).parents("td").append(genUsSquare(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());
          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 16) {
          $(el).parents("td").append(genUsDiamond(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());
          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 18) {
          $(el).parents("td").append(genUsHexagon(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());
          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 20) {
          $(el).parents("td").append(genUsTriangle(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 22) {
          $(el).parents("td").append(genUSCardfg(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 24) {
          $(el).parents("td").append(genUsRhomb(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 26) {
          $(el).parents("td").append(genUsEllipse(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 28) {
          $(el).parents("td").append(genUsDocumentFg(countFigure, clr, txt));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

        }
        if (nm == 30) {

          $(el).parents("td").append(genUsRectangle1(countFigure, clr, "", txt));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

          var dataHtml = $('[data-text="TextVal"]').clone();

          $(".ContentCopyDiv").html(dataHtml);

          $(".CardSwimAdd").css("display", "Block");
          $(".ChangeFigur").css("display", "none");
          $(".Forgeneralfigure").css("display", "none");
          $(".ForUSerStFigure").css("display", "flex");
          $(".ForProcesstFigure").css("display", "none");

        }
        if (nm == 32) {

          $(el).parents("td").append(genUSCardproccess(countFigure, clr, "", txt,"","4","TextVal"));
          $(el).parents("td").append(genTableEditbtn());

          $(el).parents(".tdAdderSwimlane").remove();

          var dataHtml = $('[data-text="TextVal"]').clone();

          $(".ContentCopyDiv").html(dataHtml);

          $(".CardSwimAdd").css("display", "block");
          $(".ChangeFigur").css("display", "none");
          $(".Forgeneralfigure").css("display", "none");
          $(".ForProcesstFigure").css("display", "flex");
          $(".ForUSerStFigure").css("display", "none");
          genProccesListCoreFigur('');

        }

      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }

  function figureAddBlock(el, clr, nm, id, UsCaId, fgText, ftSzTxt) {


    var countFigure = id
    if (nm == 10) {
      $(el).append(genUsStickMAn(countFigure, clr, fgText, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());
      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 12) {
      $(el).append(genUsCircle(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());
      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 14) {
      $(el).append(genUsSquare(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());
      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 16) {
      $(el).append(genUsDiamond(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());
      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 18) {
      $(el).append(genUsHexagon(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());
      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 20) {
      $(el).append(genUsTriangle(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());

      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 22) {
      $(el).append(genUSCardfg(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());

      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 24) {
      $(el).append(genUsRhomb(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());

      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 26) {
      $(el).append(genUsEllipse(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());

      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 28) {
      $(el).append(genUsDocumentFg(countFigure, clr, fgText, ftSzTxt));
      $(el).append(genTableEditbtn());

      $(el).find(".tdAdderSwimlaneOpened").remove();

    }
    if (nm == 30) {
      if (UsCaId.length > 3) {
        $(el).append(genUsRectangle(countFigure, clr, UsCaId, fgText, ftSzTxt));
        $(el).append(genTableEditbtn());

        $(el).find(".tdAdderSwimlaneOpened").remove();
      }

      /*  
      var dataHtml = $('[data-text="TextVal"]').clone();
  
      $(".ContentCopyDiv").html(dataHtml);
      $(".CardSwimAdd").css("display","Block");
      $(".ChangeFigur").css("display","none");
      $(".Forgeneralfigure").css("display","none");
      $(".ForUSerStFigure").css("display","flex"); */

    }
    if (nm == 32) {
      if (UsCaId.length > 3) {
        $(el).append(genUSCardproccess(countFigure, clr, UsCaId, fgText, ftSzTxt,"3",""));
        $(el).append(genTableEditbtn());

        $(el).find(".tdAdderSwimlaneOpened").remove();
      }


    }


  }



  function leadLineAddApi(from, to, txt, clr, type,fkPriD) {

    var prop = {
      "kv": {
        "fromId": from,
        "toId": to,
        "text": txt,
        "color": clr,
        "lineType": type,
        "fkProcessId":fkPriD
      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmcreateLeaderLine",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {

      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }

  function readLeadLineApi() {

   var slda = Utility.getParamFromUrl('process_name')
    var prop = {
      "kv":{
        "fkProcessId": slda,
      }
    }
    $.ajax({
      url: urlGl + "api/post/srv/serviceTmreadLeaderLine",
      type: "POST",
      data: JSON.stringify(prop),
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      async: true,
      success: function (res) {
       
      try {
        var oldTop = $('#gui_component_main_view').scrollTop();
        var oldLeft = $('#gui_component_main_view').scrollLeft();
        $('#gui_component_main_view').scrollTop(0);
        $('#gui_component_main_view').scrollLeft(0);
        var dt = res.tbl[0].r;
        $('.leader-line').remove();
    
      
        for (let index = 0; index < dt.length; index++) {
          var start = dt[index].fromId;
          var end = dt[index].toId;
          var type = dt[index].lineType;
          var clor = dt[index].color;
          var txt = dt[index].text;
          var idsed = dt[index].id;
              
          try {
            genLeadeLine(start, end, type, clor,txt,idsed);
          } catch (error) {

          }



        }

     
      } catch (error) {
        $(".leader-line").remove();
      }
       
      $('#loader-actvty').hide();
      $('.Graphtable').css("visibility", "visible");
      $('#gui_component_main_view').scrollTop(oldTop);
      $('#gui_component_main_view').scrollLeft(oldLeft);
      },
      error: function (err) {
        Toaster.showError(err);
      }
    });
  }
  //add lane btn 


  function genUsLane(nm, id, on) {
    return $("<div>")
      .addClass('laneColumnDiv')
      .attr("id", id)
      .attr('style', 'order:' + on + ';')
      .append($("<div>")
        .addClass("LaneheaderColumn")
        .append($("<div>")
          .addClass("laneHeaderName")
          .append($("<span>")
            .text(nm))
          .append('<input type="text" class="form-control LaneheaderRenameInput" >'))

        .append($("<div>").addClass("EditSectionLane")
          .append($("<div>")

            .addClass(' btn btn-light dragLaneClass')
            .append('<i class="fas fa-arrows-alt"></i>'))
          .append($("<div>")
            .addClass("dropdown addlineAfterPart ")
            .append('<button class="btn btn-light" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ><i class="fas fa-ellipsis-v"></i></button>')
            .append($("<div>")
              .addClass("dropdown-menu ")
              .append('<a class="dropdown-item" id="AddLeftColmn" href="#"> <i class="fas fa-chevron-left arrowCustom"></i>Add Column</a>')
              .append('<a class="dropdown-item" id="LaneWidthAddBtn"  href="#"><i class="fas fa-chevron-right arrowCustom"></i>Add Column</a>')
              .append('<a class="dropdown-item" id="LaneWidthRemoveBtn" href="#"><i class="fas fa-times arrowCustom"></i>Remove Column</a>')
              .append('<a class="dropdown-item" id="LaneHideBtn" href="#"><i class="fas fa-minus arrowCustom"></i>Hide Line</a>')
              .append('<a class="dropdown-item" id="LaneRemoveBTn" href="#"><i class="fas fa-trash-alt arrowCustom"></i>Delete Lane</a>')

            )))
        .append($("<div>")
          .addClass(" ShowLaneBtnSect")
          .append('<button class="ShowLaneBtn btn btn-light" ><i class="fas fa-plus"></i></button>')
          .append($("<div>")
            .addClass("HideNameLine")
            .append($("<span>")))))
      .append($("<table>")

        .append($("<tbody>")))



  }
  //generate figure jquery


  function genUsStickMAn(idgen, bgclr, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("stickManFigure Content")
        .attr("draggable", "true")
        .attr("data-colorcst", "4")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg3.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody StickMnbody")
          .append('<span>' + fgText + '</span>')))

  }

  function genUsSquare(idgen, bgclr, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content  square")
        .attr("draggable", "true")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg10.png" alt="">')
        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

     

  }

  function genUsRectangle(idgen, bgclr, UsCaId, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content USrectangle")
        .attr("draggable", "true")
        .attr("data-colorcst", "5")
        .attr("id", idgen)

        .attr('data-sed-id', UsCaId)
        .attr("style", "background-color:" + bgclr + " ;")
        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>")
          .addClass("UserRectBody")
          .attr("data-hastxt", "2")
          .css("font-size", ftSzTxt)
          .append('<span>' + fgText + '</span>'))
        .append($("<div>")
          .addClass("StatFigure data-show-activity-storycard")
          .html("User  <br> Story"))
        .append($("<div>")
          .addClass("StatFigure1 data-show-activity-ipo")
          .html("show  <br> proto")))

  }

  function genUsRectangle1(idgen, bgclr, UsCaId, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content USrectangle")
        .attr("draggable", "true")
        .attr("data-colorcst", "5")
        .attr("id", idgen)
        .attr("data-text", "TextVal")
        .attr('data-sed-id', UsCaId)
        .attr("style", "background-color:" + bgclr + " ;")
        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>")
          .addClass("UserRectBody")
          .attr("data-hastxt", "1")
          .css("font-size", ftSzTxt)
          .append('<span>' + fgText + '</span>'))
        .append($("<div>")
          .addClass("StatFigure data-show-activity-storycard")
          .html("User  <br> Story"))
        .append($("<div>")
          .addClass("StatFigure1 data-show-activity-ipo")
          .html("show  <br> proto")))

  }
  function genUSCardproccess(idgen, bgclr, UsCaId, fgText, ftSzTxt,hstxt,txtVale) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content USrectangle")
        .attr("draggable", "true")
        .attr("data-colorcst", "6")
        .attr("id", idgen)
        .attr("data-text", txtVale)
        .attr('data-sed-id', UsCaId)
        .attr("style", "background-color:" + bgclr + " ;")
        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>")
          .addClass("UserRectBody")
          .attr("data-hastxt", hstxt)
          .css("font-size", ftSzTxt)
          .append('<span>' + fgText + '</span>'))
        .append($("<div>")
          .addClass("StatFigure data-show-procees")
          .html("Process")))

  }
  function printDiv(element) {
    

  var divToPrint=$(element).clone();
    $(divToPrint).find(".LaneAdder").remove();
  var newWin=window.open('','Print-Window');

  newWin.document.open();

  newWin.document.write(`
  <html>
  <head>
  <link rel="stylesheet" href="resource/css/bs4/bootstrap.min.css">
  <link rel="stylesheet" href="resource/css/fontawesome-5-pro-master/css/all.css">
  <link rel="stylesheet" href="resource/css/bs4/bs4-custom_1.css">
  <link rel="stylesheet" href="resource/css/bs4/g_1.css">
  <link rel="stylesheet" href="resource/css/bs4/style-kanban.css">
  <link rel="stylesheet" href="resource/css/bs4/style-storytask-Manager.css">
  <link rel="stylesheet" href="resource/css/bs4/jquery-ui.css">
  <link rel="stylesheet" href="resource/css/bs4/dragtable.css">
  <link rel="stylesheet" href="resource/css/bs4/print.css">


  <link rel="stylesheet" href="resource/froala/css/froala_editor.pkgd.min.css"> 
  <link rel="stylesheet" type="text/css" href="resource/froala/css/froala_editor.css">
  <link rel="stylesheet" href="resource/css/bs4/writearticle.css">
  <link rel="stylesheet" href="resource/css/bs4/hummingbird-treeview.css">
  <link rel="stylesheet" href="resource/css/bs4/bootstrap-select.css" />
  <link rel="stylesheet" href="resource/css/bs4/entity.css" />
  <link rel="stylesheet" href="resource/css/bs4/data-base.css" />
  <link rel="stylesheet" href="resource/css/bs4/testCase.css" />
  <link rel="stylesheet" href="resource/css/bs4/easyTree.css" />
  <link rel="stylesheet" href="resource/css/bs4/swimlane.css" />

  </head>
  <body  onload="window.print()"><page size="A4">${divToPrint.html()}<page></body></html>`);

  //newWin.document.close();

 // setTimeout(function(){newWin.close();},10);

}

  function genUsTriangle(idgen, bgclr, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content triangle")
        .attr("draggable", "true")
        .attr("data-colorcst", "2")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg2.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow trinagleArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

  }

  function genUsHexagon(idgen, bgclr, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content hexagon")
        .attr("draggable", "true")
        .attr("data-colorcst", "2")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg6.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

  }

  function genUsRhomb(idgen, bgclr, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content rhomb")
        .attr("draggable", "true")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg4.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow  ")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

  }

  function genUsEllipse(idgen, bgclr, fgText, ftSzTxt) {

    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content ellipse")
        .attr("draggable", "true")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg8.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow  ")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

  }

  function genUsCircle(idgen, bgclr, fgText, ftSzTxt) {
    return $("<div>")
      .addClass("resizeFigure")
      .append(
        $("<div>")
        .attr("draggable", "true")
        .addClass("Content   circle")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg1.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

  }

  function genUsDocumentFg(idgen, bgclr, fgText, ftSzTxt) {
    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .attr("draggable", "true")
        .addClass("Content DocumentFg")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg7.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))
  }


  function genUsDiamond(idgen, bgclr, fgText, ftSzTxt) {
    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content diamond")
        .attr("draggable", "true")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg5.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow ")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))

  }

  function genUSCardfg(idgen, bgclr, fgText, ftSzTxt) {
    return $("<div>")
      .addClass("resizeFigure")
      .append($("<div>")
        .addClass("Content cardfg")
        .attr("draggable", "true")
        .attr("data-colorcst", "1")
        .attr("id", idgen)
        .attr("style", "background-color:" + bgclr + " ;")
        .append(' <img src="resource/img/lg9.png" alt="">')

        .append($("<div>")
          .addClass("contentArrow ")
          .attr("id", "dragArrow")
          .attr("draggable", "true")
          .append('<i class="fas fa-arrow-right"></i>'))
        .append($("<div>").addClass("ContentBody").css('font-size', ftSzTxt)
          .append('<span>' + fgText + '</span>')))
  }



  //tdAdder swimlane 
  function genusAdderPopUpTdSl() {

    return $("<div>")
      .addClass("tdAdderSwimlane")
      .append('<p class="selectColorWord">Select Figure</p>')
      .append($("<div>")
        .addClass("figureSelectOption")
        .append(`<span data-figurnum="10" class="figureFromspansw"><img src="resource/img/lg3.png" alt=""></span>`)
        .append('<span data-figurnum="12" class="figureFromspansw "><img src="resource/img/lg1.png" alt=""></span>')
        .append('<span data-figurnum="14" class="figureFromspansw selectedfigureswfg"><img src="resource/img/lg10.png" alt=""></span>')
        .append('<span data-figurnum="16" class="figureFromspansw"><img src="resource/img/lg5.png" alt=""></span>')
        .append('<span data-figurnum="18" class="figureFromspansw"><img src="resource/img/lg6.png" alt=""></span>')
        .append('<span data-figurnum="20" class="figureFromspansw"><img src="resource/img/lg2.png" alt=""></span>')
        .append('<span data-figurnum="22" class="figureFromspansw"><img src="resource/img/lg9.png" alt=""></span>')
        .append('<span data-figurnum="24" class="figureFromspansw"><img src="resource/img/lg4.png" alt=""></span>')
        .append('<span data-figurnum="26" class="figureFromspansw"><img src="resource/img/lg8.png" alt=""></span>')
        .append(`<span data-figurnum="28" class="figureFromspansw"><img src="resource/img/lg7.png" alt=""></span>`)
        .append(`<span data-figurnum="30" class="figureFromspansw usicon"><img src="resource/img/lg10.png" alt=""> <span class="customSpanUst">User <br> Story</span></span>`)
        .append(`<span data-figurnum="32" class="figureFromspansw usicon"><img src="resource/img/lg10.png" alt=""> <span class="customSpanUst">Pro <br>cess </span></span>`)
      )
      .append('<p class="selectColorWord">Select Color Figure</p>')
      .append($("<div>")
        .addClass("figureBgSelectOption")
        .append('<span data-bgcolorspan="#fff" style="background-color: #fff;" class="ColopickerSpan selectedColorPickerswfg"></span>')
        .append('<span data-bgcolorspan="#e3b6aac4" style="background-color: #e3b6aa;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#bad9f9c4" style="background-color: #bad9f9;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#c1e57cc4" style="background-color: #c1e57c;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#fdf67cc4" style="background-color: #fdf67c;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#fa8065c4" style="background-color: #fa8065;" class="ColopickerSpan "></span>')
        .append('<span data-bgcolorspan="#b0b0b0c4" style="background-color: #b0b0b0;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#ff3300c4" style="background-color: #ff3300;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#3399ffc4" style="background-color: #3399ff;" class="ColopickerSpan"></span>')
        .append('<span data-bgcolorspan="#bda8b6c4" style="background-color: #bda8b6;" class="ColopickerSpan"></span>')
      )
      .append($("<div>")
        .addClass("tableAdderAccept")
        .append('<div class="figureAddbtn" id="tdAdderslAccept"><i class="fas fa-check"></i></div>')
        .append('<div class="figureAddbtn" id="CancelSlpopup" ><i class="fas fa-times"></i></div>')
      )




  }

  function genusAdderPopupopenedSl() {

    return $("<div>")
      .addClass("tdAdderSwimlaneOpened")
      .append($("<div>")
        .addClass("tdAdderSlopDiv")
        .append($("<button>")
          .addClass("btn tdAdderSwimlaneOpenedbtn")
          .append('<i class="fas fa-plus-circle"></i>')));
  }

  function updateFigureCore(id) {
    var el = $("#" + id)
    var x = $(el).parents("tr").index();
    var on = $(el).parents("td").index();
    var fb = {
      "kv": {
        "updatedField": "id,orderNo,fkLineId,columnNo",
        "id": id,
        "orderNo": on,
        "columnNo": x,

      }
    }
    figureUpdateApi(fb)
  }
  //generate  table tdd 

  function generateTDSl() {

    var genTdCount = 4;

    for (var i = 0; i < genTdCount; i++) {


      $(".Graphtable tbody").append(genUsLane(idgenvLane));
      idgenvLane++
    }
    var countsltd = 30;
    for (var x = 0; x < countsltd; x++) {


      $(".Graphtable tbody tr").append('<td></td>');


    };



    $(".Graphtable tbody tr td").append(genusAdderPopupopenedSl());

  }


  function genTableEditbtn() {
    return $("<div>")
      .addClass("btn-group contentDropEDit")
      .append('<button type="button" class="btn  " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>')
      .append($("<div>")
        .addClass("dropdown-menu")
        .append('<a class="dropdown-item" id="AddTopColmn" href="#"><i class="fas fa-chevron-up arrowCustom"></i>Add Column</a>')
        .append('<a class="dropdown-item"  id="AddBottomColmn" href="#"><i class="fas fa-chevron-down arrowCustom"></i>Add Column</a>')
        .append('<a class="dropdown-item"  id="AddRightColmn" href="#"><i class="fas fa-chevron-right arrowCustom"></i>Add Column</a>')
        .append('<a class="dropdown-item"  id="AddLeftColmn" href="#"><i class="fas fa-chevron-left arrowCustom"></i>Add Column</a>')
        .append('<a class="dropdown-item" id="FigureIndexUp" href="#"><i class="fas fa-level-up-alt arrowCustom"></i>Backward</a>')
        .append('<a class="dropdown-item" id="FigureIndexDown" href="#"><i class="fas fa-level-down-alt arrowCustom"></i>Forward</a>')
        .append('<a class="dropdown-item" id="FigureRemoveBTn" href="#"><i class="fas fa-trash-alt arrowCustom"></i>Delete Figure</a>')
      )
  }



  //open edit popup and edit figure ---->>>>>>


  function genusReadyTdSl() {

    return $("<td>")
      .append($("<div>")
        .addClass("tdAdderSwimlaneOpened")
        .append($("<div>")
          .addClass("tdAdderSlopDiv")
          .append($("<button>")
            .addClass("btn tdAdderSwimlaneOpenedbtn")
            .append('<i class="fas fa-plus-circle"></i>'))))
  }

  $(document).ready(function () {



    $(document).on("change", '#projectListSwimlaneInside', function (e) {
      $(".Graphtable tbody").html('');
      $('#loader-actvty').show();
      $('.Graphtable').css("visibility", "hidden");
      var dt = $(this).val();
      var namePro = $("#projectListSwimlaneInside option:selected").text();
      genLaneListApi(dt, namePro);
      $(".card-custom-popUpNew").hide();
    })
    $(document).on("click", '.data-show-procees', function (e) {

      var dt  = $(this).parents('.Content').attr('data-sed-id')
      $('#projectListSwimlaneInside').val(dt);
      $('#projectListSwimlaneInside').change();


    })
    $(document).on("click", '.popCloseModal', function (e) {
      $(this).parents('.card-custom-popUpNew').hide()
    })
    $(document).on("click", '#openOldProcess', function (e) {
      $(".Graphtable tbody").html('');
      $('#loader-actvty').show();
      $('.Graphtable').css("visibility", "hidden");
      var dt = $('#projectListSwimlane').val();
      var namePro = $("#projectListSwimlane option:selected").text();
      genLaneListApi(dt, namePro);
      genProccesListCore(dt);
      $(".card-custom-popUpNew").hide();
    })


    $(document).on("click", '#addNewPorcessButton', function (e) {

      var dt = $("#newProcessNameInput").val()
      if (dt.trim().length > 3) {

        var prop = {
          "kv": {
  
            "processName": dt
    
          }
        }
        $.ajax({
          url: urlGl + "api/post/srv/serviceTmcreatePorcessApi",
          type: "POST",
          data: JSON.stringify(prop),
          contentType: "application/json; charset=utf-8",
          crossDomain: true,
          async: true,
          success: function (res) {
    
            var set = res;
            $("#newProcessNameInput").val("");
            $(this).parents(".card-custom-popUpNew").hide();
            $("#newProcessName").show();
    
            $(".Graphtable tbody").html('');
            $('#loader-actvty').show();
            $('.Graphtable').css("visibility", "hidden");
    
            genLaneListApi(set.id, dt);
            genProccesListCore(set.id);
            $(".card-custom-popUpNew").hide();
          },
          error: function (err) {
            Toaster.showError(err);
          }
        });
       
      }



    })
    $(document).on("click", '#newPorcessModal', function (e) {

      $("#CardSwimAdd-new").toggle();

    })
    $(document).on("click", '#existingProcessModal', function (e) {

      $("#CardSwimAdd-old").toggle();
      genProccesList();


    })

    $(document).on("focusout", '#editProcessName', function (e) {
      $(this).css("display", "none");
      var val = $(this).val();
      if (val.length > 3) {
        var prop = {}
        prop.id = Utility.getParamFromUrl('process_name')
        prop.processName = val;

            
    
      $.ajax({
       url: urlGl + "api/post/srv/serviceTmupdateProcessApi",
       type: "POST",
       data: JSON.stringify(prop),
       contentType: "application/json",
       crossDomain: true,
       async: true,
       success: function (res) {
       
       
        genProccesListCore(data.id);
        $('#projectListSwimlaneInside').change();
        },
       error: function () {
         Toaster.showError(('somethingww'));
       }
     });
       
      }
    })
    $(document).on("keypress", '#editProcessName', function (e) {
      if (e.which == 13) {

        $(this).focusout();
      }

    })
    $(document).on("click", '#editNameProcess', function (e) {
      $('.editNameProcessDiv h4').dblclick();
    })
    $(document).on("dblclick", '.editNameProcessDiv h4', function (e) {

      var val = $(this).text();
      $('#editProcessName').toggle();
      $('#editProcessName').focus();
      $('#editProcessName').val(val)
    })

    $(document).on("click", '#deleteProcessName', function (e) {


      
      var prop ={}
      prop.id = Utility.getParamFromUrl('process_name');
      $.ajax({
       url: urlGl + "api/post/srv/serviceTmdeleteProcessApi",
       type: "POST",
       data: JSON.stringify(prop),
       contentType: "application/json",
       crossDomain: true,
       async: true,
       success: function (res) {
       
        genProccesListCore();

        $("#projectListSwimlaneInside").change();
        },
       error: function () {
         Toaster.showError(('somethingww'));
       }
     });
     

    })





    $(document).on('dragover', ".Content", function (e) {

      e.preventDefault();
      e.stopPropagation();
    });


    $(document).on("dragstart", ".contentArrow", function (e) {


      is_line_dragged2 = true;

      e.originalEvent.dataTransfer.setData("getCardZoneId", $(this).parent().attr("id"));

      e.stopPropagation();
    });


    $(document).on('drop', ".Content", function (e) {



      var data1 = e.originalEvent.dataTransfer.getData("getCardZoneId");
      is_line_dragged2 = false;
      var data2 = $(this).attr("id");
      //removeLine(data1,data2);
      var oldTop = $('#gui_component_main_view').scrollTop();
      var oldLeft = $('#gui_component_main_view').scrollLeft();
      $('#gui_component_main_view').scrollTop(0);
      $('#gui_component_main_view').scrollLeft(0);
      var dataText = "T"
        var fkProcessId = Utility.getParamFromUrl('process_name');
      genLeadeLine(data1, data2, typLine, lineColor, dataText);

      leadLineAddApi(data1, data2, dataText, lineColor, typLine,fkProcessId);

      $('#gui_component_main_view').scrollTop(oldTop);
      $('#gui_component_main_view').scrollLeft(oldLeft);
      e.stopPropagation();


    });




    /// rename lane

    $(document).on("dblclick", ".laneHeaderName", function () {

      var alreadyname = $(this).find("span").text();

      $(this).find(".LaneheaderRenameInput").css("visibility", "visible");
      $(this).find(".LaneheaderRenameInput").val(alreadyname);
      $(this).find(".LaneheaderRenameInput").focus();

    })

    $(document).on("focusout", ".LaneheaderRenameInput", function () {
      var thisVal = $(this).val();
      var idep = $(this).parents('.laneColumnDiv').attr('id');

      if (thisVal.trim().length > 0) {

        $(this).parent().find('span').text(thisVal);

        $(this).css("visibility", "hidden");

        laneUpdateApi(idep)

      }

    })


    // lane show hide 
    $(document).on("click", "#LaneHideBtn", function () {
      var nameLane = $(this).parents("th").find(".laneHeaderName span").text()
      $(this).parents(".laneColumnDiv").css("width", "40px");
      $(this).parents(".laneColumnDiv").css("overflow", "hidden");
      $(this).parents(".laneColumnDiv").css("pointer-events", "none");
      $(this).parents(".laneColumnDiv").find(".ShowLaneBtnSect").css("display", "block")
      $(this).parents(".laneColumnDiv").find(".laneHeaderName").css("display", "none")
      $(this).parents(".laneColumnDiv").find(".HideNameLine span").text(nameLane)

    })
    $(document).on("click", ".close-modal-act-ipo", function () {

      $('.trigger-leaderline-id').attr('id', "gui_component_main_view");
      readLeadLineApi();
    })


    $(document).on("click", ".ShowLaneBtn", function () {

     var ls = $(this).parents(".laneColumnDiv").css("order");
     $(this).parents(".laneColumnDiv").removeAttr("style");
     $(this).parents(".laneColumnDiv").css("order",ls);
      $(this).parents(".ShowLaneBtnSect").css("display", "none")
      $(this).parents(".laneColumnDiv").find(".laneHeaderName").css("display", "block")

    })





    //resize lane btn 
    $(document).on("click", "#LaneWidthAddBtn", function () {


      var ela = $("<tr>")
      var countsltd2 = 30;
      for (var i = 0; i < countsltd2; i++) {


        $(ela).append('<td></td>');



      }
      $(ela).find('td').append(genusAdderPopupopenedSl())
      $(this).parents(".laneColumnDiv").find("tbody").append(ela);

      LaneRepair();
      var idsss = $(this).parents(".laneColumnDiv").attr("id");
      laneUpdateApiColumn(idsss);
      var items = document.querySelectorAll('.Graphtable td');
      items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
      });

    })
    //resize lane btn 
    $(document).on("click", "#lineEditableInput", function () {


      if($(this).is(':checked')){

         $("#gui_component_main_view").removeClass('trigger-leaderline-id');
       }else{
        $("#gui_component_main_view").addClass('trigger-leaderline-id');
       }
    })
    $(document).on("click", "#AddRightColmn", function () {

      var ela = $("<tr>")
      var countsltd2 = 30;
      for (var i = 0; i < countsltd2; i++) {


        $(ela).append('<td></td>');



      }
      $(ela).find('td').append(genusAdderPopupopenedSl())
      $(this).parents("tr").after(ela);

      LaneRepair();
      var idsss = $(this).parents(".laneColumnDiv").attr("id");
      laneUpdateApiColumn(idsss);


      var alk = $(this).parents('tbody').find('.Content')

      for (let index = 0; index < alk.length; index++) {
        var kl = $(alk[index]).attr('id')

        updateFigureCore(kl)

      }



    })


    $(document).on("click", "#AddLeftColmn", function () {


      var ela = $("<tr>")
      var countsltd2 = 30;
      for (var i = 0; i < countsltd2; i++) {


        $(ela).append('<td></td>');



      }
      $(ela).find('td').append(genusAdderPopupopenedSl())
      $(this).parents("tr").before(ela);

      LaneRepair();
      var idsss = $(this).parents(".laneColumnDiv").attr("id");
      laneUpdateApiColumn(idsss);

      var alk = $(this).parents('tbody').find('.Content')

      for (let index = 0; index < alk.length; index++) {
        var kl = $(alk[index]).attr('id')

        updateFigureCore(kl)

      }

    })



    $(document).on("click", "#LaneWidthRemoveBtn", function () {

      $(this).parents(".laneColumnDiv").find("tbody tr:last-child").remove();


      LaneRepair();
      var idsss = $(this).parents(".laneColumnDiv").attr("id");
      laneUpdateApiColumn(idsss);
    })

    $(document).on("click", "#LaneRemoveBTn", function () {

      //if(confirm("Are You Sure Delete Lane?!!!!")){

      var ids = $(this).parents(".laneColumnDiv").attr("id");
     
    
      var prop ={}
      prop.id = ids;
      $.ajax({
       url: urlGl + "api/post/srv/serviceTmdeleteLaneApi",
       type: "POST",
       data: JSON.stringify(prop),
       contentType: "application/json",
       crossDomain: true,
       async: true,
       success: function (res) {
       

        
      if (!dt.length > 0) {
        $(this).parents(".laneColumnDiv").remove();
        
      }
        LaneRepair();
        },
       error: function () {
         Toaster.showError(('somethingww'));
       }
     });




    })




    $(document).on("click", ".tdAdderSwimlaneOpenedbtn", function () {

      $(this).parents("td").append(genusAdderPopUpTdSl());
      $(this).parents(".tdAdderSwimlaneOpened").remove();
      $(".selectedColorPickerswfg").removeClass("selectedColorPickerswfg");
      $(".selectedfigureswfg").removeClass("selectedfigureswfg");

      $('[data-bgcolorspan="'+addFgColor+'"]').addClass("selectedColorPickerswfg")
      $('[data-figurnum="'+addFgFigure+'"]').addClass("selectedfigureswfg")


    })
    $(document).on("click", "dfhdh", function (e) {

     
      const options = {
        margin: 0.3,
        filename: 'filename.pdf',
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2 
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
         
        }
      }
      var element  = $('#gui_component_main_view').html()
      html2pdf().from(element).set(options).outputPdf().save();


    })
    $(document).on("click", "#printgraphTable", function (e) {

     
      printDiv($('#gui_component_main_view'))


    })

    $(document).on("click", "#CancelSlpopup", function () {

      $(this).parents("td").append(genusAdderPopupopenedSl());
      $(this).parents(".tdAdderSwimlane").remove();


    })

    $(document).on("click", ".ColopickerSpan", function () {

      $(this).parent().find(".selectedColorPickerswfg").removeClass("selectedColorPickerswfg");
      $(this).addClass("selectedColorPickerswfg")
      addFgColor = $(this).attr('data-bgcolorspan');
    })


    $(document).on("click", ".figureFromspansw", function () {

      $(this).parent().find(".selectedfigureswfg").removeClass("selectedfigureswfg");
      $(this).addClass("selectedfigureswfg");
      addFgFigure = $(this).attr('data-figurnum')

    })

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<----Figre Adderr  ---->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    $(document).on("click", "#tdAdderslAccept", function () {



      var figureAdder = $(this).parents("td").find(".selectedfigureswfg").attr("data-figurnum");

      var fogureColorbg = $(this).parents("td").find(".selectedColorPickerswfg").attr("data-bgcolorspan");
      var on = $(this).parents("td").index();
      var col = $(this).parents("tr").index();
      var lId = $(this).parents(".laneColumnDiv").attr('id');
      figureAddApi(this, fogureColorbg, figureAdder, "", on, lId, col)
      LaneRepair()



    })


    $(document).on("dblclick", ".figureFromspansw", function () {

      var figureAdder = $(this).attr("data-figurnum");

      var fogureColorbg = $(this).parents("td").find(".selectedColorPickerswfg").attr("data-bgcolorspan");
      var on = $(this).parents("td").index();
      var col = $(this).parents("tr").index();
      var lId = $(this).parents(".laneColumnDiv").attr('id');
      figureAddApi(this, fogureColorbg, figureAdder, "", on, lId, col)
      LaneRepair();



    })






    $(document).on("click", "#AddBottomColmn", function () {


      $(this).parents("td").after(genusReadyTdSl());
      // $(this).parents("tr ").find("td:last-child").remove();


      LaneRepair();
      var alk = $(this).parents('tbody').find('.Content')

      for (let index = 0; index < alk.length; index++) {
        var kl = $(alk[index]).attr('id')

        updateFigureCore(kl)

      }
    })

    $(document).on("click", "#AddTopColmn", function () {


      $(this).parents("td").before(genusReadyTdSl());
      // $(this).parents("tr ").find("td:last-child").remove();

      LaneRepair();
      var alk = $(this).parents('tbody').find('.Content')

      for (let index = 0; index < alk.length; index++) {
        var kl = $(alk[index]).attr('id')

        updateFigureCore(kl)

      }
    })




    $(document).on("click", "#FigureIndexUp", function () {


      $(this).parents("td").find(".Content").css("z-index", "500");


    })

    $(document).on("click", "#FigureIndexDown", function () {


      $(this).parents("td").find(".Content").css("z-index", "1");



    })

    $(document).on("click", "#FigureRemoveBTn", function () {


            var ids = $(this).parents("td").find(".Content").attr('id')
    


      var prop ={}
      prop.id = ids;
      $.ajax({
       url: urlGl + "api/post/srv/serviceTmdeleteFigureInside",
       type: "POST",
       data: JSON.stringify(prop),
       contentType: "application/json",
       crossDomain: true,
       async: true,
       success: function (res) {
       

        if (!dt.length > 0) {
          $(this).parents("td").find(".resizeFigure").remove();
          $(this).parents("td").append(genusAdderPopupopenedSl());
          $(this).parents(".contentDropEDit").remove();
      
    }
      LaneRepair();
        },
       error: function () {
         Toaster.showError(('somethingww'));
       }
     });

     

      


    })

    $(document).on("click", ".ExitCardswim", function () {

      var hastxt = $(document).find('[data-text="TextVal"]').find(".UserRectBody").attr("data-hastxt");


      if (hastxt == 1) {

        $(document).find('[data-text="TextVal"]').parent().append(genusAdderPopupopenedSl());
        $(document).find('[data-text="TextVal"]').parent().find(".contentDropEDit").remove();
        $(document).find('[data-text="TextVal"]').remove();
      }
      $(".CardSwimAdd").css("display", "none")
      $(".Content").removeAttr("data-text")
    })
    $(document).on("click", ".lines-block-act .geItem", function () {

      $('.geItem').removeClass('gactive');
      $(this).addClass('gactive');
      typLine = $(this).attr('data-tylp');

    })
    $(document).on("click", ".ColopickerSpanLine", function () {
     /*  $(".ColopickerSpanLine").removeClass('gactive');
      $(this).addClass('gactive');
      lineColor = $(this).attr('data-bgcolorspan'); */

    })

    $(document).on("click", ".SwimBackG", function () {

      var hastxt = $(document).find('[data-text="TextVal"]').find(".UserRectBody").attr("data-hastxt");


      if (hastxt == 1) {

        $(document).find('[data-text="TextVal"]').parent().append(genusAdderPopupopenedSl());
        $(document).find('[data-text="TextVal"]').parent().find(".contentDropEDit").remove();
        $(document).find('[data-text="TextVal"]').remove();
      }

      $(".CardSwimAdd").css("display", "none")
      $(".Content").removeAttr("data-text")
    })

    $(document).on("change", "#select-text", function () {


      var textVal = $(this).val();
      var idFigure = $(document).find('[data-text="TextVal"]').attr("id");

      $(document).find('[data-text="TextVal"]').find(".ContentBody").find("span").remove();

      $(document).find('[data-text="TextVal"]').find(".ContentBody").append('<span>' + textVal + '</span>');




      var fb = {
        "kv": {
          "updatedField": "id,figureText",
          "id": idFigure,
          "figureText": textVal,

        }
      }

      figureUpdateApi(fb)


    })


    $(document).on("change", ".procces_List_activity", function () {

      var idt = $(this).val();
      var textVal = $(".procces_List_activity option:selected").text();

      if (idt.length > 0) {

        $(document).find('[data-text="TextVal"]').find(".UserRectBody").find("span").remove();
        $(document).find('[data-text="TextVal"]').attr("data-sed-id", idt);
        var id1 = $(document).find('[data-text="TextVal"]').attr("id");
        $(document).find('[data-text="TextVal"]').find(".UserRectBody").append('<span>' + textVal + '</span>');
        $(document).find('[data-text="TextVal"]').find(".UserRectBody").attr("data-hastxt", "4");


        var fb = {
          "kv": {
            "updatedField": "id,storyCardId,figureText",
            "id": id1,
            "figureText": textVal,
            "storyCardId": idt,

          }
        }

        figureUpdateApi(fb)


      }

    })
    $(document).on("change", ".storyCardListSelectBox1", function () {

      var idt = $(this).val();
      var textVal = $(".storyCardListSelectBox1 option:selected").text();

      if (idt.length > 0) {

        $(document).find('[data-text="TextVal"]').find(".UserRectBody").find("span").remove();
        $(document).find('[data-text="TextVal"]').attr("data-sed-id", idt);
        var id1 = $(document).find('[data-text="TextVal"]').attr("id");
        $(document).find('[data-text="TextVal"]').find(".UserRectBody").append('<span>' + textVal + '</span>');
        $(document).find('[data-text="TextVal"]').find(".UserRectBody").attr("data-hastxt", "2");


        var fb = {
          "kv": {
            "updatedField": "id,storyCardId,figureText",
            "id": id1,
            "figureText": textVal,
            "storyCardId": idt,

          }
        }

        figureUpdateApi(fb)


      }

    })


    var color;


    $(document).on("click", ".figureFromspansChange", function () {

      var fbg = $(this).attr("data-figurnum");
      var dot = $('[data-text="TextVal"]');
      dot.removeClass();
      if (fbg == 10) {
        dot.addClass("Content stickManFigure");
        dot.find("img").attr('src', 'resource/img/lg3.png');
      }
      if (fbg == 12) {
        dot.addClass("Content circle");
        dot.find("img").attr('src', 'resource/img/lg1.png');
      }
      if (fbg == 14) {
        dot.addClass("Content square");
        dot.find("img").attr('src', 'resource/img/lg10.png');

      }
      if (fbg == 16) {
        dot.addClass("Content diamond");
        dot.find("img").attr('src', 'resource/img/lg5.png');
      }
      if (fbg == 18) {

        dot.addClass("Content hexagon");
        dot.find("img").attr('src', 'resource/img/lg6.png');
      }
      if (fbg == 20) {
        dot.addClass("Content triangle");
        dot.find("img").attr('src', 'resource/img/lg2.png');
      }
      if (fbg == 22) {
        dot.addClass("Content cardfg");
        dot.find("img").attr('src', 'resource/img/lg9.png');
      }
      if (fbg == 24) {
        dot.addClass("Content rhomb");
        dot.find("img").attr('src', 'resource/img/lg4.png');

      }
      if (fbg == 26) {
        dot.addClass("Content ellipse");
        dot.find("img").attr('src', 'resource/img/lg8.png');

      }
      if (fbg == 28) {
        dot.addClass("Content DocumentFg");
        dot.find("img").attr('src', 'resource/img/lg7.png');
      }

    })

    $(document).on("click", ".Colorchangespan", function () {

      var fbg = $(this).attr("data-bgcolorspan");

      $('[data-text="TextVal"]').removeAttr("style");
      var id1 = $('[data-text="TextVal"]').attr("id");
      $('[data-text="TextVal"]').attr("style", "background-color:" + fbg + ";");

      var fb = {
        "kv": {

          "id": id1,
          "figureColor": fbg,
          "updatedField": "id,figureColor"

        }
      }

      figureUpdateApi(fb)


    })

    $(document).on("change", "#selecttextfontSize", function () {

      var fbg = $(this).val();

      $('[data-text="TextVal"]').find(".ContentBody").removeAttr("style");
      var id1 = $('[data-text="TextVal"]').attr("id");
      $('[data-text="TextVal"]').find(".ContentBody").attr("style", "font-size:" + fbg + ";");
      $('[data-text="TextVal"]').find(".UserRectBody").removeAttr("style");
      $('[data-text="TextVal"]').find(".UserRectBody").attr("style", "font-size:" + fbg + ";");


      var fb = {
        "kv": {

          "id": id1,
          "fontSizeNew": fbg.trim(),
          "updatedField": "id,fontSizeNew",

        }
      }

      figureUpdateApi(fb)


    })


    $(document).on("click", "#CancelFigureInsideText", function () {


      $(".CardSwimAdd").css("display", "none")
      $(".Content").removeAttr("data-text")
    })

    $(document).on("dblclick", ".Content", function () {
      $('.Content').removeAttr('data-text');
      $(this).attr("data-text", "TextVal")
      var CstmFig = $('[data-text="TextVal"]').attr("data-colorcst");
    
      if (CstmFig == 1 || CstmFig == 2 || CstmFig == 3 || CstmFig == 4) {
        $(".CardSwimAdd").css("display", "Block");
        color = $('[data-text="TextVal"]').css("backgroundColor");
        var ftsize = $('[data-text="TextVal"]').find('.ContentBody ').css("font-size");
        var text = $('[data-text="TextVal"]').find(".ContentBody span").text();
        $("#select-text").val(text)
        var dataHtml = $('[data-text="TextVal"]').parents(".resizeFigure").clone();

        $(".ContentCopyDiv").html(dataHtml)

        $(".ChangeFigur").css("display", "block");
        $(".Forgeneralfigure").css("display", "block");
        $(".ForUSerStFigure").css("display", "none");

      }
      if (CstmFig == 5) {


        $("#select-text").val(text);
        var dataHtml = $('[data-text="TextVal"]').clone();
        var ftsize = $('[data-text="TextVal"]').find('.UserRectBody ').css("font-size");
      
        $(".ContentCopyDiv").html(dataHtml);

        $(".CardSwimAdd").css("display", "Block");
        $(".ChangeFigur").css("display", "none");
        $(".Forgeneralfigure").css("display", "none");
        $(".ForUSerStFigure").css("display", "flex");
        $(".ForProcesstFigure").css("display", "none");

      }
      if (CstmFig == 6) {


        $("#select-text").val(text);
        var dataHtml = $('[data-text="TextVal"]').clone();
        var ftsize = $('[data-text="TextVal"]').find('.UserRectBody ').css("font-size");
        $(".ContentCopyDiv").html(dataHtml);
        var valId = $('[data-text="TextVal"]').attr("data-sed-id");
        $(".CardSwimAdd").css("display", "Block");
        $(".ChangeFigur").css("display", "none");
        $(".Forgeneralfigure").css("display", "none");
        $(".ForUSerStFigure").css("display", "none");
        $(".ForProcesstFigure").css("display", "flex");
        genProccesListCoreFigur(valId);
      }

      $('#selecttextfontSize').val(ftsize)

    })


    $(document).on("change", "#FigureWitdh", function () {

      var width = $(this).val();

      $('[data-text="TextVal"]').css("width", width + "%");
      $('[data-text="TextVal"]').css("height", height + "%");
      $("#FigureHeight").val(width);
    })
  

    $(document).on("mouseover", "textPath", function (e) {
      e.stopPropagation();
  
      var oldTop = $('#gui_component_main_view').scrollTop();
      var oldLeft = $('#gui_component_main_view').scrollLeft();
      $('#gui_component_main_view').scrollTop(0);
      $('#gui_component_main_view').scrollLeft(0);
      $("#dataText").removeAttr("id");
      $(this).attr("id", "dataText");

      var Cordn = $("#dataText").position();
      $(".addtextLine").css("display", "block");
      $(".addtextLine").css("top", Cordn.top + "px");
      $(".addtextLine").css("left", Cordn.left + "px");
     // $(".addtextLine").css('transform', 'translate(-50%, -50%)');



      var textLine = $("#dataText").text();
      $("#addTextInput").val(textLine);
      $('#gui_component_main_view').scrollTop(oldTop);
      $('#gui_component_main_view').scrollLeft(oldLeft);

    });

    //remove line 
    $(document).on("click", "#lineRemovebtn", function (e) {

     var dta = $("#dataText").parents("svg").attr("id");

     var prop ={}
         prop.id = dta;
         $.ajax({
          url: urlGl + "api/post/srv/serviceTmdeleteLeaderLine",
          type: "POST",
          data: JSON.stringify(prop),
          contentType: "application/json",
          crossDomain: true,
          async: true,
          success: function (res) {
            $(this).parent().css("display", "none");
      
            LaneRepair();
           },
          error: function () {
            Toaster.showError(('somethingww'));
          }
        });

        
    })




    //Text Add 

    $(document).on("click", "#lineEditPopupOpened", function (e) {
      $("#addTextInput").focus();


    });


    //text edit none
    $(document).on("mouseleave", ".addtextLine", function () {


      var Textval = $("#addTextInput").val();

      if (Textval.trim().length > 1) {
        $("#dataText").text(Textval);
        var dta = $("#dataText").parents("svg").attr("id");
        var fb1 = {
          "kv": {
            "updatedField": "id,text",
            "id": dta,
            "text": Textval,
          
          }
        }
       
        LaneUpdateApi(fb1);
      }



      $(".addtextLine").css("display", "none");



    });
    $(document).on("click", ".ChangeLineColor", function (e) {

      e.preventDefault();
      e.stopPropagation();
    })

    $(document).on("click", ".ColorchangeLinespan", function (e) {

      var colorline = $(this).attr("data-bgcolorspan")

      $("#dataText").parents("text").css("fill", colorline)
      $("#dataText").parents("svg").find("use").css("stroke", colorline)
      $("#dataText").parents("svg").find("use").css("fill", colorline);
      var dta = $("#dataText").parents("svg").attr("id");
      var fb1 = {
        "kv": {
          "updatedField": "id,color",
          "id": dta,
          "color": colorline,
        
        }
      }
     
      LaneUpdateApi(fb1);
    })










    $(document).on("click", "#LaneAddBtn", function () {

    
      var on = $(".Graphtable .laneColumnDiv").last().index();
      on= parseFloat(on)+2
      
      addLaneApi(on);


    })




    $(".Graphtable .laneColumnDiv").arrangeable({

      dragSelector: ".dragLaneClass",



    })



  });



  var items = document.querySelectorAll('.Graphtable td');
  items.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });




  var dragSrcEl = null;

  function handleDragStart(e) {



    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');

  }

  function handleDrop(e) {

    if (is_line_dragged2 === true) {
      return;
    }

    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
      var id = $(dragSrcEl).find('.Content').attr('id');
      var on = $(dragSrcEl).index();
      var lid = $(dragSrcEl).parents(".laneColumnDiv").attr('id');
      var x = $(dragSrcEl).parents("tr").index();
      var id1 = $(this).find('.Content').attr('id');
      var on1 = $(this).index();
      var lid1 = $(this).parents(".laneColumnDiv").attr('id');
      var x1 = $(this).parents("tr").index();


      var fb = {
        "kv": {
          "updatedField": "id,orderNo,fkLineId,columnNo",
          "id": id,
          "orderNo": on,
          "columnNo": x,
          "fkLineId": lid
        }
      }
      var fb1 = {
        "kv": {
          "updatedField": "id,orderNo,fkLineId,columnNo",
          "id": id1,
          "orderNo": on1,
          "columnNo": x1,
          "fkLineId": lid1
        }
      }

      figureUpdateApi(fb)
      figureUpdateApi(fb1)

    }

    LaneRepair();
    $(".over").removeClass('over')
    return false;
  }

  function handleDragEnd(e) {

    if (is_line_dragged2 === true) {
      return;
    }


    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }