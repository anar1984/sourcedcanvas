
var FromTo2 = {
    pear2: [
    ]
};


var is_line_dragged = false;

function laneRepait() {
//    console.log("lanerepeat")
//    $(".leader-line").remove()
//    var list = FromTo2.pear2;
//    for (var i = 0; i < list.length; i++) {
//        var id = list[i];
//        var k = Object.keys(id);
//
//        new LeaderLine(document.getElementById(id[0]), document.getElementById(id[1]), {
//            dash: {animation: true},
//            size: 2
//entityDatabaseList
//        })
//    }

}



$(document).ready(function () {
// Data base Name  ----->>>>>>>


    $(document).on("click", ".Field_AddFieldsAsLine", function () {
        var tableId = $(this).closest('td.tdSeqment').attr("pid");
        $('#insertFieldAsLineModal').modal('show');
        $('#insertFieldAsLineModal_id').val(tableId);

    });

   

    $(document).on("dblclick", ".DatabaseNameH4", function () {

        let databaseName = $(this).text();

        $(this).parent().find(".tableRename").css("display", "block");

        $(this).parent().find(".tableRename").val(databaseName);
        $(this).parent().find(".tableRename").focus();
    });


    $(document).on("focusout", ".tableRename", function () {

        var baseinput = $(this).val();

        if (baseinput.trim().length > 0) {
            $(this).css("display", "none");
            $(this).parent().find(".DatabaseNameH4").text(baseinput);
        }

    });


    $(document).on("click", "#RenamedataBaseBtn", function () {

        let databaseName = $(this).parents(".topMenuDataBAseSection").find(".DatabaseNameH4").text();

        $(this).parents(".topMenuDataBAseSection").find(".tableRename").css("display", "block");

        $(this).parents(".topMenuDataBAseSection").find(".tableRename").val(databaseName);
        $(this).parents(".topMenuDataBAseSection").find(".tableRename").focus();

    });

    $(document).on("click", ".deletePopupBackGround", function () {

        $(this).parent().toggle("fast")

    });

    $(document).on("click", ".cancelRemove", function () {

        $(this).parents(".deletePopUp").toggle("fast")

    });

    $(document).on("click", ".AcceptTableRemove", function () {

        if (confirm("Are you sure?!!")) {

            $(".tdSeqment").empty();

            $(".tdSeqment").append($("<div>").addClass("TableAdder")
                    .append('<button class="btn tdOpenedBtn"><i class="fas fa-plus"></i></button>'));

            $(this).parents(".deletePopUp").toggle("fast");
        } else {
            return
        }

    });



// Add new table section ------>>>>>
    function genUSpopUp() {

        var divpop = $("<div>")
                .addClass("popUpTable")
                .append('<input  type="text" id="inputTableName" placeholder="New Table" class="form-control">')
                .append($("<div>")
                        .addClass("Accpet_seqmentTable")
                        .append('<button id="AcceptTableNew" class="btn newtableBtn"><i class="fas fa-check"></i></button>')
                        .append('<button id="CancelTableNew" class="btn newtableBtn"><i class="fas fa-times"></i></button>'))
        return divpop
    }
    ;




    $(document).on("click", ".tdOpenedBtn", function () {

        $(this).parents(".tdSeqment").append(genUSpopUp())
        $(this).parent().css("display", "none")
        $(this).parents(".tdSeqment").find("#inputTableName").focus()
    });

    $(document).on("click", "#CancelTableNew", function () {

        $(this).parents(".tdSeqment").find(".TableAdder").css("display", "block")
        $(this).parents(".popUpTable").remove()

    });

    $(document).on("change", "#inputTableName", function (e) {


        var tableName = $(this).parents(".popUpTable").find("#inputTableName").val()
        var orderNo = $(this).closest(".tdSeqment").attr("order"); //ar

        if (tableName.trim().length > 0) {
            addNewTable(tableName, orderNo, this);

            $(this).parents(".tdSeqment").append(genUsTableNew(tableName))
            $(this).parents(".tdSeqment").find(".TableAdder").css("display", "none")

            $(this).parents(".popUpTable").remove()
        }


    });


    $(document).on("click", ".DeleteTableCont", function () {//AR
        if (!confirm("Are you sure?")) {
            return;
        }


        var id = $(this).closest('.tdSeqment').attr('pid') //teyin edilmelidir.

        if (!id || id.length === 0) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.id = id;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmDeleteDbTable",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                var tabname = $(that).parents("tdHeader").find("h5").text();
                $(that).parents(".tdSeqment").find(".TableAdder").css("display", "block");
                $(that).parents(".TdInsideTable").remove();
                $(this).closest('.tdSeqment').removeAttr('pid')
                $(this).closest('.tdSeqment').addClass('table-segment-idle')
                getFieldRel4Select();

            },
            error: function () {
                Toaster.showError("Table is not deleted");
            }
        });

    });


    $(document).on("click", ".CreateTableOnServer", function () {//AR



        var id = $(this).closest('.tdSeqment').attr('pid') //teyin edilmelidir.

        if (!id || id.length === 0) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.tableId = id;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmCreateTableOnServer",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                if (res.kv.err) {
                    Toaster.showError(res.kv.err);
                    return;
                }
                Toaster.showMessage("Table created on server side successfully");
            },
            error: function () {
                Toaster.showError("Table is not created on server");
            }
        });

    });



    $(document).on("change", "#inputTableName", function () {

        $(this).closest('div.popUpTable').find('div.newtableBtn').click();


    })

    $(document).on("click", "#AcceptTableNew", function () {
        var tableName = $(this).parents(".popUpTable").find("#inputTableName").val()
        var orderNo = $(this).closest(".tdSeqment").attr("order"); //ar

        if (tableName.trim().length > 0) {
            addNewTable(tableName, orderNo);    //AR
            $(this).parents(".tdSeqment").append(genUsTableNew(tableName));
            $(this).parents(".tdSeqment").find(".TableAdder").css("display", "none");
            $(this).parents(".popUpTable").remove();
        }
    })


    $(document).on("click", ".EditTableName", function () {


        var nameValue = $(this).parents(".tdHeader").find("h5").text()
        $(this).parents(".tdHeader").find(".tableNameEditInput").css("display", "block")
        $(this).parents(".tdHeader").find(".tableNameEditInput").focus()
        $(this).parents(".tdHeader").find(".tableNameEditInput").val(nameValue)



    })


    $(document).on("dblclick", ".tdHeader", function () {
        var nameValue = $(this).find(".TableNameH5").text();
        $(this).find(".tableNameEditInput").css("display", "block")
        $(this).find(".tableNameEditInput").focus()
        $(this).find(".tableNameEditInput").val(nameValue)
    })


    $(document).on("change", ".tableNameEditInput", function () {
        var renameVal = $(this).val();
        $(this).parent().find(".TableNameH5").text(renameVal);
        $(this).css("display", "none");
        var pid = $(this).closest('.tdSeqment').attr("pid"); //ar

        if (!pid)
            return;

        updateDbtable(pid, renameVal);


    })


    /*
     $(document).on("focusout", "#inputTableName", function (e) {
     
     setTimeout(function(){ 
     
     
     $(".TableAdder").css("display", "block")
     $(".popUpTable").remove()
     
     }, 500)
     
     
     
     
     })
     $(document).on("focusout", "#inputFAildName", function (e) {
     
     $(this).parents(".tdBody").append('<span  class="feildSection"> <button class="btn Addfiledbtn"><i class="fas fa-plus"></i>Add Feild</button></span>')
     $(this).parents(".popUpFeild").remove()
     
     
     
     })
     */







    // feild Section   ---->>>>>>

    function genUSpopUpFeild() {

        var divpop = $("<div>")
                .addClass("popUpFeild")
                .append('<input  type="text" id="inputFAildName" placeholder="New Field" class="form-control">')
                .append($("<div>")
                        .addClass("Accpet_seqmentTable")
                        .append('<button id="AcceptFeildNew" class="btn newtableBtn"><i class="fas fa-check"></i></button>')
                        .append('<button id="CancelFeildNew" class="btn newtableBtn"><i class="fas fa-times"></i></button>'))
        return divpop
    }

    let idGena = 12986745
    $(document).on("click", ".Addfiledbtn", function () {

        $(this).parents(".tdBody").append(genUSpopUpFeild())
        $(this).parents(".tdSeqment").find("#inputFAildName").focus()
        $(this).parent().remove()
        idGena++


    })

    $(document).on("click", "#AcceptFeildNew", function () {
        $(this).closest('.popUpFeild').find('#inputFAildName').change();
//        var feildName = $(this).parents(".popUpFeild").find("#inputFAildName").val()
//        if (feildName.trim().length > 0) {
//            $(this).parents(".tdBody").append(genUsFeild(idGena, feildName))
//            $(this).parents(".tdBody").append('<span  class="feildSection"> <button class="btn Addfiledbtn"><i class="fas fa-plus"></i>Add Feild</button></span>')
//            $(this).parent().parent().remove()
//            idGena++
//        }
    })


    $(document).on("click", ".Field_ShowDetails", function (e) {
        $('#tableFieldDetailsModal').modal("show");
        var tableId = $(this).closest('td.tdSeqment').attr("pid");
        $('#tableFieldDetailsModal_id').val(tableId);


        if (!tableId) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.tableId = tableId;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetFieldByTableId",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                $('#tableFieldDetailsModal_tabledesc').val(res.kv.tableDescription);
                genTableFieldDetails(res);
            }
        });

    })

    function genTableFieldDetails(res) {
        var table = $('<table>').addClass('table table-hover');

        var obj = res.tbl[0].r;
        var tr = $('<tr>')
                .append($('<td>').append('Field'))
                .append($('<td>').append('Type'))
                .append($('<td>').append('Length'))
                .append($('<td>').append('Extra Param'))
                .append($('<td>').append('Description'))
                .append($('<td>').append(' '))
                .append($('<td>').append(' '))

        table.append(tr)
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            var tr = $('<tr>')
                    .append($('<td>')
                            .append($('<input>')
                                    .addClass("form-control table-field-update")
                                    .attr("pid", o.id)
                                    .attr("data-type", "fieldName")
                                    .val(o.fieldName)))
                    .append($('<td>')
                            .append($('<input>')
                                    .attr("list", "typelist")
                                    .addClass("form-control table-field-update")
                                    .attr("pid", o.id)
                                    .attr("data-type", "fieldType")
                                    .val(o.fieldType))
//                            .append($('<data-list>')
//                                    .attr("id", "typelist")
//                                    .append($("<option>")
//                                            .append("kelbetin")))
                            )
                    .append($('<td>')
                            .append($('<input>')
                                    .addClass("form-control table-field-update")
                                    .attr("pid", o.id)
                                    .attr("data-type", "fieldLength")
                                    .val(o.fieldLength)))
                    .append($('<td>')
                            .append($('<input>')
                                    .addClass("form-control table-field-update")
                                    .attr("pid", o.id)
                                    .attr("data-type", "extraParam")
                                    .val(o.extraParam)))
                    .append($('<td>')
                            .append($('<textarea>')
                                    .attr("rows", "2")
                                    .attr("pid", o.id)
                                    .addClass("form-control table-field-update")
                                    .attr("data-type", "description")
                                    .append(o.description)))
                    .append($('<td>')
                            .append($('<button>')
                                    .attr("pid", o.id)
                                    .addClass("form-control btn-primary table-field-add-to-server")
                                    .attr("onclick", "addFieldToServer(this)")
                                    .attr("data-type", "description")
                                    .append("Add to Server")))
                    .append($('<td>')
                            .append($('<button>')
                                    .attr("pid", o.id)
                                    .addClass("form-control btn-primary table-field-add-to-server")
                                    .attr("onclick", "alterFieldOnServer(this)")
                                    .attr("data-type", "description")
                                    .append("Alter Field on Server")))

            table.append(tr)
        }
        $('#tableFieldDetailsModal_body').html(table);
    }

    $(document).on("change", ".table-field-update", function () {
        var tableId = $(this).attr('pid');
        var type = $(this).attr("data-type");
        var val = $(this).val();
        updateField4Short(val, type, tableId);
    })



    function updateField4Short(val, ustype, id) {

        try {

            if (!id || ustype.lentgh === 0 || val.lentgh === 0) {
                return;
            }
        } catch (e) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.id = id;
        json.kv.type = ustype;
        json.kv.value = val;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmUpdateTableField4Short",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
            },
            error: function () {
                Toaster.showError(('somethingww'));
            }
        });
    }

    $('#tableFieldDetailsModal').on('hidden.bs.modal', function () {
        $('#entityDatabaseList').change();
    });

    $(document).on("click", ".addTableFieldsAsLine", function (e) {
        var val = $('#insertFieldAsLineModal_fields').val();
        var tableId = $('#insertFieldAsLineModal_id').val();
        var db = $('#entityDatabaseList').val();

        if (!val || tableId.length < 3 || db.length < 3) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.dbid = db;
        json.kv.tableId = tableId;
        json.kv.fieldName = val;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmAddTableFieldsAsLine",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                $('#insertFieldAsLineModal_fields').text('')
                $('#insertFieldAsLineModal').modal('hide')
                $('#entityDatabaseList').change();
            }
        });

        $(".dragFeildSection").arrangeable({dragSelector: ".dargFeildBtn"})
    })

    $(document).on("change", "#inputFAildName", function (e) {

        var field = $(this).val();
        var table = $(this).closest('.tdSeqment').attr('pid');
        var db = $('#entityDatabaseList').val();

        if (!field || table.length < 3 || db.length < 3) {
            return;
        }

        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.dbid = db;
        json.kv.tableId = table;
        json.kv.fieldName = field;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmInsertNewField",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) {
                SAEntity.updateFieldByRes(res);

                $(that).parents(".tdBody").append(genUsFeild(res.kv.id, field, res.kv.orderNo));
                $(that).parents(".tdBody").append(genUSpopUpFeild());
                $(that).parents(".tdBody").find(".popUpFeild").last().find("#inputFAildName").focus();
                $(that).parent().remove();

            }
        });

        $(".dragFeildSection").arrangeable({dragSelector: ".dargFeildBtn"})


    })




    $(document).on("click", "#CancelFeildNew", function () {
        $(this).parents(".tdBody").append('<span  class="feildSection"> <button class="btn Addfiledbtn"><i class="fas fa-plus"></i>Add Field</button></span>')
        $(this).parents(".popUpFeild").remove()
    })


    $(document).on("click", ".deleteFeildSection", function () {
        if (!confirm("Are You Sure??!!!")) { //ar
            return;
        }

        var id = $(this).closest('.feildSection').attr("id");
        $(this).parents(".feildSection").remove();
        deleteDbField(id);
    })

    $(document).on("click", ".editFeildName", function () {

        var nameValue = $(this).parents(".feildSection").find(".feildNamespan").text()
        $(this).parents(".feildSection").find(".feildNamespan").css("display", "none")

        $(this).parents(".feildSection").find(".feildEditInput").css("display", "block")
        $(this).parents(".feildSection").find(".feildEditInput").focus()

        $(this).parents(".feildSection").find(".feildEditInput").val(nameValue)

    })


    // feild Rename section
    $(document).on("dblclick", ".Feild-child", function () {

        var nameValue = $(this).find(".feildNamespan").text()
        $(this).find(".feildNamespan").css("display", "none")

        $(this).find(".feildEditInput").css("display", "block")
        $(this).find(".feildEditInput").focus()

        $(this).find(".feildEditInput").val(nameValue)

    })


    $(document).on("change", ".feildEditInput", function () {
        var renameVal = $(this).val()
        var id = $(this).closest('.feildSection').attr('id');

        updateDbField(id, renameVal);

        $(this).parent().find(".feildNamespan").css("display", "block")
        $(this).parent().find(".feildNamespan").text(renameVal)
        $(this).css("display", "none")

    })


    let clickAr = true
    $(document).on("click", ".faildEditOpenBtn", function () {

        if (clickAr) {

            $(this).parent().find(".feildEditMenu").css("display", "flex")
            clickAr = false
        } else {
            $(this).parent().find(".feildEditMenu").css("display", "none")
            clickAr = true
        }



    })






    // drag drop section ----->>>>>>






    $(document).on('dragover', ".feildSection", function (e) {
        e.preventDefault();



    });


    $(document).on("dragstart", ".tdConnectArrow", function (e) {
        is_line_dragged = true;
        e.stopPropagation();

        e.originalEvent.dataTransfer.setData("getCardZoneId", $(this).parent().attr("id"));


    });


    $(document).on('drop', ".feildSection", function (e) {

        var data1 = e.originalEvent.dataTransfer.getData("getCardZoneId");
        is_line_dragged = false;

        var data2 = $(this).attr("id");
        //removeLine(data1,data2);

        var zm = $('#sadMainPage').css('zoom');
        $('#sadMainPage').css('zoom', '');

        try {
            new LeaderLine(document.getElementById(data1), document.getElementById(data2),
                    {
                        color: 'rgb(41,146,210)',
                        startPlug: 'square',
                        endPlug: 'arrow',
                        dash: {animation: true},
                        size: 4,
                    })
        } catch (err) {
        }


        $('#sadMainPage').css('zoom', zm);

        addFieldRel($('#entityDatabaseList').val(), data1, data2)


    });



    /*    $(document).on("click", ".leader-line", function (e) {
     
     
     $(".selectedLine").removeClass("selectedLine");
     $(this).addClass("selectedLine");
     
     e.stopPropagation()
     
     }); */
//    $(document).click(function () {
//
//
//        $(".selectedLine").removeClass("selectedLine");
//
//
//
//
//    });
//    $(document).keydown(function () {
//
//
//        const key = event.key;
//        if (key === "Delete") {
//
//            if (!confirm("Are you sure?!")) {
//                $(".selectedLine").remove();
//            }
//
//        }
//
//
//
//    });


    entityDiagramInit();


})

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
    if (is_line_dragged === true) {
        return;
    }

    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    var from_id = $(this).closest('.tdSeqment').attr('pid');
    var from_order = $(this).closest('.tdSeqment').attr('order');
    var to_id = $(dragSrcEl).closest('.tdSeqment').attr('pid');
    var to_order = $(dragSrcEl).closest('.tdSeqment').attr('order');


    try {
        updateDbtableOrderNo(from_id, to_order);
    } catch (err) {
    }
    try {
        updateDbtableOrderNo(to_id, from_order);
    } catch (err) {
    }
//    console.log('to id ==>',from_id," ",from_order);
//    console.log('from id===>',to_id," ",to_order);

    return false;
}

function handleDragEnd(e) {
    laneRepait();

//    items.forEach(function (item) {
//        item.classList.remove('over');
//    });
}

function entityDiagramInit() {
    let items = document.querySelectorAll('.tdSeqment');
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
}





// zoom section ------->>>>>>>>>>>>
function zoomDbIn() {
//    event.preventDefault();
//    global_var.doc_actual_zoom = (parseInt(global_var.doc_actual_zoom) + 6);
//    setDbZoom();
//    laneRepait();
}

function zoomDbOut() {
//    event.preventDefault();
//    global_var.doc_actual_zoom = (parseInt(global_var.doc_actual_zoom) - 6);
//    if (global_var.doc_actual_zoom <= 20) {
//        global_var.doc_actual_zoom = 20;
//    }
//    setDbZoom();
//    laneRepait();
}


function zoomDbReset() {
//    global_var.doc_actual_zoom = 100;
//    setDbZoom();
//    laneRepait()
}
function documentOnwhile(event) {

//    if (global_var.is_body_ctrl_pressed === '1') {
//        event.preventDefault();
//        if (event.deltaY < 0)
//        {
//            zoomDbIn();
//        } else if (event.deltaY > 0)
//        {
//            zoomDbOut();
//        }
//    }
//    laneRepait()

}
function setDbZoom() {
//    $('#tablePreview').css('zoom', global_var.doc_actual_zoom + "%");
}

//ar
function genUsTableNew(genText) {
    return $("<div>")
            .addClass("TdInsideTable")
            .append($("<div>")
                    .attr("draggable", "true")
                    .addClass("tdHeader")
                    .append($("<div>")
                            .addClass("tabledragButton")
                            .append('<i class="fas fa-arrows-alt"></i>'))
                    .append($("<h6>").text(genText)      //ar
                            .addClass("TableNameH5"))
                    .append('<input type="text" class="tableNameEditInput">')
                    .append($("<div>")
                            .addClass("TableEditSection")
                            .append($("<div>")
                                    .addClass("dropdown")
                                    .append('<button class="btn"  type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="fas fa-ellipsis-v"></i> </button>')
                                    .append($("<div>")
                                            .addClass("dropdown-menu")
                                            .attr("aria-labelledby", "dropdownMenuButton")
                                            .append('<a class="dropdown-item Field_AddFieldsAsLine">Add Field as Line</a>')
                                            .append('<a class="dropdown-item Field_ShowDetails">Details</a>')
                                            .append('<a class="dropdown-item EditTableName">Edit</a>')
                                            .append('<a class="dropdown-item CreateTableOnServer">Create Table in Server</a>')
//                                            .append('<a class="dropdown-item">Move</a>')
//                                            .append('<a class="dropdown-item">Copy</a>')
                                            .append('<a class="dropdown-item ShowTableDataEntry">Show Data Entry</a>')
                                            .append('<a class="dropdown-item ShowApiRelations">Show API Relations</a>')
                                            .append('<a class="dropdown-item DeleteTableCont">Delete</a>')))))
            .append($("<div>")
                    .addClass("tdBody")
                    .append(' <span class="feildSection"> <button class="btn Addfiledbtn"><i class="fas fa-plus"></i>Add Field</button></span>'))

}


//ar
function genUsFeild(fieldId, fieldName, order) {
    return $("<div>")
            .addClass("feildSection dragFeildSection")
            .attr("id", fieldId)
            .attr('order', order)
            .append($("<div>")
                    .addClass("tdConnectArrow")
                    .attr("draggable", "true")
                    .append('<i class="far fa-arrow-alt-circle-right"></i>'))
            .append($("<div>")

                    .addClass("Feild-child")
                    .append($("<input>")
                            .addClass("feildEditInput")
                            .attr("type", "text"))
                    .append($("<span>")
                            .text(fieldName)
                            .addClass("feildNamespan")))
            .append($("<div>")
                    .addClass("FeildEditSection")
                    .append($("<div>")
                            .addClass("btn faildEditOpenBtn")
                            .attr("type", "button")
                            .append('<i class="fas fa-ellipsis-v"></i>'))
                    .append($("<div>")
                            .addClass('feildEditMenu')
                            .append('<span class="editBtnFeild dargFeildBtn " title="Move Field" ><i class="fa fa-arrows-alt"></i></span>')
                            .append('<span class="editBtnFeild editFeildName" title="Edit Field Name"  ><i class="fa fa-edit"></i></span>')
                            .append('<span class="editBtnFeild removeFieldLink"  title="Remove Links" ><i class="fa fa-link"></i></span>')
                            .append('<span class="editBtnFeild deleteFeildSection" title="Delete Field" ><i class="fa fa-trash-alt"></i></span>')
                            .append('<span class="editBtnFeild ShowApiFieldRelations" title="Show API Relation" ><i class="fa fa-box"></i></span>')
                            ))


}

function addFieldToServer(el) {


    if (!$(el).attr("pid")) {
        return;
    }


    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = $(el).attr("pid");
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddFieldToServer",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            if (res.kv.err) {
                Toaster.showError(res.kv.err)
                return;
            }

            Toaster.showMessage('Field added successfully!');

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


function alterFieldOnServer(el) {
    if (!$(el).attr("pid")) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = $(el).attr("pid");
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAlterFieldOnServer",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            if (res.kv.err) {
                Toaster.showError(res.kv.err)
                return;
            }

            Toaster.showMessage('Field added successfully!');
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function loadDatabaseList2Comboİmport(res) {

    $('#DB_list_for_export').empty();
    try {
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            $('#DB_list_for_export')
                    .append($('<option>').val(o.id)
                            .append(o.dbName))
        }


    } catch (err) {

    }
    $('#DB_list_for_export').selectpicker('refresh').change();



}



$(document).on("change", "#DB_list_for_export", function () {
    getDbTablesList4CodeDashExpo(this)

});
$(document).on('click', '#inportexport-file-btn-db', function (event) {

    var dtnm = $(this).closest('.modal-body');
    dtnm.find('.progress-bar').remove();
    dtnm.find(' .cs-succsess-msg').remove();
    dtnm.find(' .download-e-file').remove();
    var json = initJSON();
    json.kv.fkDbId = $('#DB_list_for_export').val();
    json.kv.dbName = $('#DB_list_for_export').find('option:selected').text();
    json.kv.listFkTableIds = getMultiSelectpickerValueByElementName('Table_list_for_export');
    // json.kv.filename = zipfilename;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsExportDatabaseByTable",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            //  var dataurl = urlGl + 'api/get/files/' + res.kv.filename;


            if ($("#DB_list_for_export option:selected").length) {

                dtnm.find('.cs-err-msg').remove();

                dtnm.append('<span class="cs-succsess-msg">File Successfully Exported!</span>');

                dtnm.append("<a class='download-e-file'><span><i class='fas fa-download'></i></span> Download</a>");
                dtnm.find('.download-e-file').attr('href', urlGl + 'api/get/filed/' + res.kv.filename);
                dtnm.find('.download-e-file').attr('download', +res.kv.filename);
            } else {
                dtnm.find('.progress').remove();
                dtnm.find('.cs-succsess-msg').remove();
                dtnm.find('.download-e-file').remove();
                dtnm.html('<span class="cs-err-msg">Select any Data Base!</span>');
            }
        },
        error: function () {
            Toaster.showError(('Export error'));

        }
    });

});

$(document).on('click', '#upload_data_file_btn_db', function (event) {
    var elm = $("#DbTableUploadZipData");
    if ($(elm).val().trim().length > 0) {
        uploadFile4IpoImportDB($(elm).attr('id'));
        $('#ImportBoxDB').modal("hide");
    }

});
function getDbTablesList4CodeDashExpo(el) {
    var dbid = $(el).val();

    if (!dbid) {
        return;
    }

    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.dbId = dbid;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetDBTableList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $('#Table_list_for_export').html('');

            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                $('#Table_list_for_export')
                        .append($('<option>').val(obj[i].id)
                                .append(obj[i].tableName))
            }

            $('#Table_list_for_export').selectpicker('refresh').change();

        }
    });

}


function uploadFile4IpoImportDB(id) {
    var r = "";
    var that = this;
    var files = document.getElementById(id).files;
    var file_count = files.length;
    var st = "";
    var trc = 0;

    var pbDiv = $('#' + id).closest('div').find('#progress_bar_new');
    pbDiv.html('');

    $('#' + id).attr('fname', '');

    for (var i = 0, f; f = files[i]; i++) {
        //            var file = files[0];
        var file = f;
        var fileext = file['name'].split('.').pop();
        var fname = file['name'].split('.')[0];
        //            console.log('fname=' + fname);
        if (files && file) {
            var reader = new FileReader();
            reader.fileName = fname;
            reader.fileExt = fileext;
            reader.fileNo = i;
            reader.onload = function (readerEvt) {
                trc++;
                var fname1 = readerEvt.target.fileName;
                var fileext1 = readerEvt.target.fileExt;
                var fileNo = readerEvt.target.fileNo;
                //                    console.log('trc no=' + trc);
                var binaryString = readerEvt.target.result;
                uploadFile4IpoCoreImportDB(fileext1, btoa(binaryString), fname1, id);

            };
            reader.readAsBinaryString(file, fname);
        }
    }
}

function uploadFile4IpoCoreImportDB(fileext, file_base_64, file_name, id) {
    var pbDiv = $('#' + id).closest('div').find('#progress_bar_new');

    var idx = makeId(10);

    var d = new Object();
    d.file_base_64 = file_base_64;
    d.file_extension = fileext;
    d.file_type = "general";
    d.file_name = file_name;
    conf = JSON.parse('{"kv":{}}');
    conf['kv'] = d;
    conf.kv.cookie = getToken();
    var dat = JSON.stringify(conf);
    var finalname = "";
    $.ajax({
        url: urlGl + "api/post/upload",
        type: "POST",
        data: dat,
        contentType: "application/json",
        async: true,
        beforeSend: function () {
            pbDiv.append('<br>').append($('<span>')
                    .attr('id', 'pro_zad_span' + idx)
                    .text(file_name)
                    .append($('<img>')
                            .attr('id', 'pro_zad_' + idx)
                            .attr('src', 'resource/img/loader.gif'))
                    )
        },
        uploadProgress: function (event, position, total, percentComplete) {
            //            console.log('test')
            var percentVal = percentComplete + '%';
            pbDiv.text(percentVal);
        },
        success: function (data) {
            finalname = data.kv.uploaded_file_name;

            $('#pro_zad_' + idx).remove();
            $('#pro_zad_span' + idx)
                    .after($('<i class="fa fa-times">')
                            .attr('pid', idx)
                            .attr('onclick', 'removeFilenameFromZad(this,\'' + finalname + '\')'));



            var st = $('#' + id).attr('fname');
            st = (st && st !== 'undefined') ? st : '';
            st += (st) ? global_var.vertical_seperator + finalname :
                    finalname;

            $('#' + id).attr('fname', st);
            console.log(finalname);
            importSendNameApiDB(finalname)
        },
        error: function () {}
    });
    return finalname;
}


function importSendNameApiDB(filNm) {
    var json = {
        kv: {}
    };
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fileName = filNm;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsUnzipDatabaseAndImport",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {


        },
        error: function () {
            Toaster.showGeneralError();
        }
    });
}