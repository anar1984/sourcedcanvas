
var activeContaierName = "storyCard";
var ent_tableFiels = {};
var ent_selectFields = {};
var ent_saveToFields = {};
var ent_inputDesc = {};
var ent_coreFields = {};
var ent_SelectFieldInputs = {};
var ent_SaveFieldInputs = {};
var ent_FieldInputDesc = {};



$(document).ready(function () {
    loadDocEditor();
    $.fn.hummingbird.defaults.checkboxesGroups = "enabled";

    $("#treeview").hummingbird();


    $("#filter").keyup(function () {

        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;
        $("#no-count").text('');
        // Loop through the comment list
        $("#treeview li label").each(function () {

            // If the list item does not contain the text phrase fade it out
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();

                // Show the list item if the phrase matches and increase the count by 1
            } else {
                $(this).show();
                count++;
            }
        });

        // Update the count
        var numberItems = count;
        $("#filter-count").text("Result:" + count);
        if (count < 1) {
            $("#no-count").text('No result');
        } else {
            $("#no-count").text('');
        }

    });




})

function loadDocEditor() {
    new FroalaEditor('textarea#editor', {
        tableStyles: {
            class1: 'Dashed',
            class2: 'None',
        },

        quickInsertButtons: ['table', 'ol', 'ul', 'image', "video"],
        toolbarInline: true,
        charCounterCount: false,
        fileUpload: false,
        pastePlain: false,
        toolbarButtons: {
            'moreText': {
                'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
            },
            'moreParagraph': {
                'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            },
            'moreRich': {
                'buttons': ['insertVideo', 'insertImage', 'insertLink', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly']
            },
            'moreMisc': {
                'buttons': ['undo', 'redo', 'selectAll', 'html', ],
                'align': 'right',
                'buttonsVisible': 2
            }
        }
    }
    )
}

$(document).ready(function () {

//image uplader 
    function readFile(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var htmlPreview =
                        '<img width="100%" id="imgDrag" src="' + e.target.result + '" />';
                var wrapperZone = $(input).parent();
                var previewZone = $(input).parent().parent().find('.preview-zone');
                var boxZone = $(input).parent().parent().find('.preview-zone').find('.box').find('.box-body');

                wrapperZone.removeClass('dragover');
                previewZone.removeClass('hidden');
                boxZone.empty();
                boxZone.append(htmlPreview);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    function reset(e) {
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
    }

    $(".dropzone").change(function () {
        readFile(this);
        $(".dropzone-wrapper").css("display", "none")

        $(".box-body").css("display", "block")

    });

    $('.dropzone-wrapper').on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    });

    $('.dropzone-wrapper').on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    });

    $('.remove-preview').on('click', function () {
        var boxZone = $(this).parents('.preview-zone').find('.box-body');
        var previewZone = $(this).parents('.preview-zone');
        var dropzone = $(this).parents('.form-group').find('.dropzone');
        boxZone.empty();
        previewZone.addClass('hidden');
        reset(dropzone);
        $(".dropzone-wrapper").css("display", "")

        $(".box-body").css("display", "")
    });
    $(document).on("mouseover", ".box-body", function () {
        $(".box-tools").css("display", "block")
    })
    $(document).on("mouseleave", ".box-body", function () {
        $(".box-tools").css("display", "none")
    })
    $(document).on("click", "#ImageMinimzeButton", function () {
        $("#imgDrag").css("width", "744px")
        $(".Activebtn").removeClass().addClass("btn CustomButton")
        $(this).addClass("btn CustomButton Activebtn")
    })
    $(document).on("click", "#ImageMaximizeButton", function () {
        $("#imgDrag").css("width", "")
        $(".Activebtn").removeClass().addClass("btn CustomButton")
        $(this).addClass("btn CustomButton Activebtn")
    })


//image uploader closed and open


    $(document).on("click", ".imageFiledisabled", function () {


        $(".imagefileUpload").css("display", "none")
        $(".imagefileuploadOpen").css("display", "block")
    })

    $(document).on("click", ".imagefileupEnabled", function () {


        $(".imagefileUpload").css("display", "block")
        $(".imagefileuploadOpen").css("display", "none")
    })
//gen us passage paragraph
    function genusContentPassage(id) {
        return $("<div>")
                .addClass("contentComment")
                .append($("<div>").addClass("RightFloat Commands")
                        .append('<button id="ToolBarRightOpened"><i class="fas fa-ellipsis-h"></i></button>')
                        .append($("<div>")
                                .addClass("ToolBarRightFloat").attr("contenteditable", "false")
                                .append('<button class="dragButton HeaderChangedH1" >H1</button>')
                                .append('<button class="dragButton HeaderChangedH2" >H2</button>')
                                .append('<button class="dragButton HeaderChangedH3" >H3</button>')
                                .append('<button class="dragButton HeaderChangedH4" >H4</button>')
                                .append('<button class="dragButton HeaderChangedH5" >H5</button>')
                                .append('<button class="dragButton HeaderChangedH6" >H6</button>')
                                .append('<button class="dragButton specialDragButton" value="up" ><i class="fas fa-arrow-up"></i></button>')
                                .append('<button class="dragButton ContentRemoveButton"  ><i class="fas fa-times"></i></button>')
                                .append('<button class="dragButton specialDragButton" value="down" ><i class="fas fa-arrow-down"></i></button>')
                                ))
                .append('<div contenteditable="true" id=' + id + ' class="contentHeaderClass" ><h3>HeadLine Passage</h3></div>')
                .append('<textarea name="" id="editor" cols="30" rows="10"></textarea>')
                .append($("<div>")
                        .addClass("contentComment-Seqment")
                        .append('<div class="comment-seqment-body"></div>'))
    }
// gen us comment item

    function itemComment(com) {
        var itemCom = `<div class="itemComment">
  <div class="itemCommentHeader">
  <img src="img/rev.png" id="itemCommentimg" alt="">
  <p class="nameAndDate">
    <span class="nameCommentPart">Revan</span><br>
    <span class="dateCommentPart">12.04.1997</span>
   </p>
  </div>
  <div class="itemCommentBody">
        ${com}
  </div>
 </div>`

        return itemComı
    }

//search  user story car container
    function test18() {
        $("#testPage").css("height", "auto")
        var pageWidth = $("#testPage").height()
        var test2 = Math.ceil(pageWidth / 1122)
        if (pageWidth > 1122.54) {
            var divide = 1122 * test2
            $("#testPage").css("height", divide + "px")
        }
    }

    function pageLanegen() {
        $(".hr-sect").remove()
        var d = 1122.54;
        var divhH = $('#testPage').height();
        var pc = Math.abs(parseInt(divhH / d), 5)

        for (var i = 1; i <= pc; i++) {
            var div = $('<div>')
                    .addClass("hr-sect")
                    .append(i + '/' + pc)
            var det = (d * i) + 30
            div.css("top", det + "px")
            $('#testPage').append(div)

        }
    }


    // comment seqment opened
    $(document).on("focusin", ".contentHeaderClass", function () {
        var csstop = $(this).offset()

        $(".commentAddArticle").css("display", "block")
        $(".commentAddArticle").css("top", csstop.top + "px")
        $(".DataComment").removeClass("DataComment")
        $(this).parent().addClass("DataComment")


        console.log(csstop);
    })

    $(document).on("focusout", ".contentHeaderClass", function () {

        $(".commentAddArticle").css("display", "")
        $(this).parents(".contentComment").css("border", "none")


    })
    //add comment function

    $(document).on("click", "#commentAddArticleButton", function () {


        var commentText = $(this).parent().find("#commentWriteInputarticle").val()
        console.log(commentText);


        $(".DataComment").find(".comment-seqment-body").append(itemComment(commentText))

        $(this).parent().find("#commentWriteInputarticle").val("")


    })

// add passage content
    var ContentIdPassage = 1284

    $(document).on("click", "#addPassage", function () {



        $(".fr-element").append(genusContentPassage(ContentIdPassage))
        new FroalaEditor('textarea#editor', {
            tableStyles: {
                class1: 'Dashed',
                class2: 'None',
            },

            quickInsertButtons: ['table', 'ol', 'ul', 'image', "video"],
            toolbarInline: true,
            charCounterCount: false,
            fileUpload: false,
            pastePlain: false,
            toolbarButtons: {
                'moreText': {
                    'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
                },
                'moreParagraph': {
                    'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
                },
                'moreRich': {
                    'buttons': ['insertVideo', 'insertImage', 'insertLink', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly']
                },
                'moreMisc': {
                    'buttons': ['undo', 'redo', 'selectAll', 'html', ],
                    'align': 'right',
                    'buttonsVisible': 2
                }
            }
        }
        )
        $("#" + ContentIdPassage).focus()

        ContentIdPassage = ContentIdPassage + 10
        test18()
        dragandDrop()
        contentRemove()
    })

// add userstory container
    $(document).on("click", "#addStoryContainer", function () {
        activeContaierName = 'storyCard';
        loadProjectListToEditor();
        $(".Choose-userstory-popUp").css("display", "block")
        $("#treeview").hummingbird();
        test18();
        dragandDrop();
        contentRemove();
    })



    $(document).on("click", "#addEntityContainer", function () {
        activeContaierName = 'entity';
        getDBStructure4Document();
        $(".Choose-userstory-popUp").css("display", "block")
        $("#treeview").hummingbird();
        test18();
        dragandDrop();
        contentRemove();
    })


    function getDBStructure4Document() {
        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }

        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetDBStructure4Select",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: true,
            success: function (res) {
                var ls = $('#editor-container-pr-list');
                ls.html('');
                var obj = res.tbl[0].r;
                for (var i = 0; i < obj.length; i++) {
                    var o = obj[i];
                    ls.append($('<option>').val(o.id).text(o.dbName))
                }
                ls.change();
            }
        });
    }
    var userArr = {content: [
            {name: "yoxlama1",
                text: "sdhsdhshshdvsssfsfsffsdfsfsdfsfsdfs dfsfs fsd fsd fdf sd f f s df sdf sdf sdf  sdf sd fsf"
            },
            {name: "yoxlama 2",
                text: "sdhssdfsd dhsh ilet df sd fsf"
            }
        ]

    }




    var checkARr = {name: []}

    $(document).on('change', '.test181', function () {
        var checkbox = $(this); // Selected or current checkbox
        value = checkbox.val(); // Value of checkbox
        var nameLab = $(this).parent().text()
        if (checkbox.is(':checked'))
        {

            var ka = {}
            ka = [$.trim(nameLab)]
            checkARr.name.push(ka)
            console.log(checkARr);
        } else
        {

            var d8 = $.trim(nameLab)
            var kv = checkARr.name
            for (var i = 0; i < kv.length; i++) {

                var id = kv[i];


                if (id[0] === d8) {

                    checkARr.name.splice(name[i]);

                }

            }


        }
    });

    function genusTreeLabel(id, name) {
        return  $("<li>")
                .append($("<label>")
                        .append('<input class="test181" id="xnode-0-1" data-id="custom-0-1" type="checkbox" />'))

    }

    function genusUserContainer(id, backlogName, text) {

        return $("<div>")
                .addClass("doc-ed-us-containter")
                .attr("id", "us_" + id)
                .attr("pid", id)
                .attr("bname", backlogName)
                .append("<span>" + text + "</span>")
    }


    var idgen = "label" + 1897;

    $(document).on("click", "#addUserStoryCont", function () {
        if (activeContaierName === 'storyCard') {
            loadStoryCardBody4Editor();
        } else if (activeContaierName === 'entity') {
            loadEntityBody4Editor();
        }
        $('.Choose-userstory-popUp').hide();


    })

    function loadEntityBody4Editor() {
        var idLines = "";
        var idList = {};
        var idDescList = {};
        $('.test181').each(function () {
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                idLines += (id) ? id + "%IN%" : "";
                idList[id] = $(this).attr('pname');
                idDescList[id] = $(this).attr('pdesc');
            }
        })
        loadFullEntityBody4Editor(idLines, idList, idDescList);

    }

    function loadFullEntityBody4Editor(idLines, idList, idDescList) {
        getFieldInfos4Editor(idLines);
        FieldContainer_Main(idList, idDescList);
    }

    function clearVariable() {
        this.ent_tableFiels = {};
        this.ent_selectFields = {};
        this.ent_saveToFields = {};
        this.ent_inputDesc = {};
        this.ent_coreFields = {};
        this.ent_SelectFieldInputs = {};
        this.ent_SaveFieldInputs = {};
        this.ent_FieldInputDesc = {};
    }

    function FieldContainer_Main(idList, idDescList) {
       

        var keys = Object.keys(idList);
        for (var i  in keys) {
            var id = keys[i];
            var val = idList[id];
            var div = $('<div>')
                    .addClass('doc-ed-entity-containter')
                    .attr("pid", id)
                    .attr("id", "ent_" + id)
                    .css('padding', '30px 10px 0px 0px')
                    .attr('bname', replaceTags(val))
                    .append($('<h4>').append(val))
            $('.fr-element')
                    .append(div)
                    .append($('<p>').text(idDescList[id]))
                    .append(FieldContainer_GetTableInputDetails(id));

        }
    }

    function FieldContainer_GetTableInputDetails(tableId) {
        try {
            var fields = ent_tableFiels[tableId].split(',')
            var table = $('<table>')
                    .addClass('table table-bordered')
                    .css('border', '1px solid black')
                    .css("width", "100%")

            var th = $('<tr>')
                    .append($('<th>').css('border', '1px solid black').css("padding", "2px 5px").text('#'))
                    .append($('<th>').css('border', '1px solid black').css("padding", "2px 5px").text('Field'))
                    .append($('<th>').css('border', '1px solid black').css("padding", "2px 5px").text('Type'))
                    .append($('<th>').css('border', '1px solid black').css("padding", "2px 5px").text('Description'));
            table.append(th)

            table.append(tr);
            var idx = 1;
            for (var i  in fields) {
                try {
                    var fid = fields[i];
                    var type = replaceTags(ent_coreFields[fid].fieldType);
                    type += (ent_coreFields[fid].fieldLength)
                            ? " (" + ent_coreFields[fid].fieldLength + ")"
                            : ""

                    var descCore = (ent_coreFields[fid].description) ?
                            replaceTags(ent_coreFields[fid].description)
                            : "";
                    var selectFields = FieldContainer_GetSelectFromDetails(fid);
                    var savetoFields = FieldContainer_GetSendToDetails(fid);

                    var hr = (descCore) ? $('<hr>') : "";
                    hr = (selectFields || savetoFields) ? hr : "";

                    var tr = $('<tr>')
                            .append($('<td>')
                                    .css('border', '1px solid black')
                                    .css("padding", "2px 5px")
                                    .text(idx++))
                            .append($('<td>')
                                    .css('border', '1px solid black')
                                    .css("padding", "2px 5px")
                                    .text(replaceTags(ent_coreFields[fid].fieldName)))
                            .append($('<td>')
                                    .css('border', '1px solid black')
                                    .css("padding", "2px 5px")
                                    .text(type))
                            .append($('<td>')
                                    .css('border', '1px solid black')
                                    .css("padding", "2px 5px")
                                    .text(descCore)
                                    .append(hr)
                                    .append(selectFields)
                                    .append(savetoFields)
                                    )
                    table.append(tr);
                } catch (err) {
                }
            }
            return table;
        } catch (err) {
        }
    }

    function FieldContainer_GetSelectFromDetails(fieldId) {
        try {
            var div = $('<div>');
            var inputs = ent_SelectFieldInputs[fieldId].split(',');
            for (var i in inputs) {
                try {
                    var inputId = inputs[i];
                    var sp = $('<i>')
                            .append(replaceTags(ent_selectFields[inputId].projectName))
                            .append(" -> ")
                            .append(replaceTags(ent_selectFields[inputId].backlogName))
                            .append(" -> ")
                            .append(replaceTags(ent_selectFields[inputId].inputName))
                            .append("<br>");

                    div.append('<b>Page</b>: ');
                    div.append(sp);
                    div.append(FieldContainer_GetInputDescDetails(inputId));
                } catch (err) {
                }

            }
            return div;
        } catch (err) {
        }
    }

    function FieldContainer_GetInputDescDetails(inputId) {
        try {
            var div = $('<div>');
            var descs = ent_FieldInputDesc[inputId].split(',');
            for (var i in descs) {
                try {
                    var descId = descs[i];
                    var sp = $('<span>')
                            .append(" - " + replaceTags(fnline2Text(ent_inputDesc[descId].description)))
                            .append("<br>")
                    div.append(sp)
                } catch (err) {
                }
            }
            div.append("<br>")
            return div;
        } catch (err) {
        }
    }




    function FieldContainer_GetSendToDetails(fieldId) {
        try {
            var div = $('<div>');
            var inputs = ent_SaveFieldInputs[fieldId].split(',');
            for (var i in inputs) {
                try {
                    var inputId = inputs[i];

                    var sp = $('<i>')
                            .append(replaceTags(ent_saveToFields[inputId].projectName))
                            .append(" -> ")
                            .append(replaceTags(ent_saveToFields[inputId].backlogName))
                            .append(" -> ")
                            .append(replaceTags(ent_saveToFields[inputId].inputName))
                            .append("<br>")

                    div.append('<b>Page</b>: ');
                    div.append(sp);
                    div.append(FieldContainer_GetInputDescDetails(inputId));
                } catch (err) {
                }

            }
            return div;
        } catch (err) {
        }
    }

    function getFieldInfos4Editor(idLines, idList) {
        var json = {kv: {}};
        try {
            json.kv.cookie = getToken();
        } catch (err) {
        }
        json.kv.tableId = idLines;
        var that = this;
        var data = JSON.stringify(json);
        $.ajax({
            url: urlGl + "api/post/srv/serviceTmGetFieldsByTableId",
            type: "POST",
            data: data,
            contentType: "application/json",
            crossDomain: true,
            async: false,
            success: function (res) { 
                clearVariable();
                
                var idx1 = getIndexOfTable(res, "coreFields");
                var objFrom = res.tbl[idx1].r;
                for (var i in objFrom) {
                    var o = objFrom[i];
                    ent_coreFields[o.id] = o;
                    ent_tableFiels[o.fkTableId] = ent_tableFiels[o.fkTableId] + "," + o.id;
                }

                var idx1 = getIndexOfTable(res, "selectFields");
                var objFrom = res.tbl[idx1].r;
                for (var i in objFrom) {
                    var o = objFrom[i];
                    ent_selectFields[o.id] = o;
                    ent_SelectFieldInputs[o.selectFromFieldId] = ent_SelectFieldInputs[o.selectFromFieldId] + "," + o.id;
                }

                var idx1 = getIndexOfTable(res, "saveToFields");
                var objFrom = res.tbl[idx1].r;
                for (var i in objFrom) {
                    var o = objFrom[i];
                    ent_saveToFields[o.id] = o;
                    ent_SaveFieldInputs[o.sendToFieldId] = ent_SaveFieldInputs[o.sendToFieldId] + "," + o.id;
                }

                var idx1 = getIndexOfTable(res, "inputDesc");
                var objFrom = res.tbl[idx1].r;
                for (var i in objFrom) {
                    var o = objFrom[i];
                    ent_inputDesc[o.id] = o;
                    ent_FieldInputDesc[o.fkInputId] = ent_FieldInputDesc[o.fkInputId] + "," + o.id;
                }
            }
        });
    }

    function loadSingleEntityBody4Editor(res) {
        var ls = $('#editor-container-pr-list');
        ls.html('');
        var obj = res.tbl[0].r;
        for (var i = 0; i < obj.length; i++) {
            var o = obj[i];
            ls.append($('<option>').val(o.id).text(o.dbName))
        }
    }

    function loadStoryCardBody4Editor() {
        $('.test181').each(function () {
            
            if ($(this).is(":checked")) {
                var id = $(this).attr("id");
                var bname = SACore.GetBacklogname(id);
                setTimeout(function(){
                    if (id) {
                        var inHTML = StoryCard.Get(id, "false");
                        var div = $('<div>')
                                .append($('<div>')
                                        .css("padding", "5px 40px")
                                        .append(inHTML));
                        $(".fr-element").append(genusUserContainer(id, bname, div.html()));
                        idgen++;
                    }
                }, 200);
              
            }
        })
    }

// choose user story closed


    $(document).on("click", ".Choose-userstory-popUpClosed", function () {



        $(".Choose-userstory-popUp").css("display", "none")
        $("#treeview").hummingbird("uncheckAll");
        $("#treeview").hummingbird("collapseAll");

    })

    $(document).on("click", ".UpdateAllpopUpClosed", function () {



        $(".Update-all-userstoryPopup").css("display", "none")


    })

    $(document).on("click", "#CancelUpdatePopUp", function () {

        $(".Update-all-userstoryPopup").css("display", "none")




    })
    $(document).on("click", "#CancelChooseUser", function () {

        $(".Choose-userstory-popUp").css("display", "none")

        $("#treeview").hummingbird("uncheckAll");
        $("#treeview").hummingbird("collapseAll");


    })


    $(document).on("click", "#UptadeUserCard", function () {
        $('.editor-update-container').each(function () {
            if ($(this).is(":checked")) {
                var id = $(this).val();
                var inHTML = StoryCard.Get(id, "false");
                var div = $('<div>')
                        .append($('<div>')
                                .css("padding", "5px 40px")
                                .append(inHTML));
                $('#us_' + id).html(div);
            }
        })

        $('.Update-all-userstoryPopup').hide();

    })


    $(document).on("click", "#updateAllbtn", function () {
        $(".Update-all-userstoryPopup").css("display", "block")

        var div = $('.ContentPopUpBody');
        div.html('');
        var idx = 0;
        $('.doc-ed-us-containter').each(function () {
            var id = $(this).attr('pid');
            var bname = $(this).attr("bname");
            var d = $('<div class="contentUserCardUptade">').
                    append($('<input type="checkbox">')
                            .addClass("editor-update-container")
                            .attr("checked", true)
                            .val(id))
                    .append($('<span>').append(" " + bname))
            div.append(d);
            idx++;
        })

        if (idx === 0) {
            div.append("No Container Found!")
        }
    })

    $(document).on("click", ".userStoryPopUpBackG", function () {


        $(this).parent().css("display", "none")
        $("#treeview").hummingbird("uncheckAll");
        $("#treeview").hummingbird("collapseAll");

    })

    let checkAll = true
    $(document).on("click", "#btncheckAll", function () {


        if (checkAll) {


            $("#treeview").hummingbird("checkAll");
            checkAll = false
        } else {


            $("#treeview").hummingbird("uncheckAll");
            checkAll = true
        }


    })


    $(document).on("click", "#btnUncheckAll", function () {




    })

    var colpase = true
    $(document).on("click", "#btncollapseAll", function () {


        if (colpase) {

            $(this).text("ExpandAll")
            $("#treeview").hummingbird("expandAll");
            colpase = false
        } else {

            $(this).text("CollapseAl")
            $("#treeview").hummingbird("collapseAll");
            colpase = true
        }




    })





//header edit section

    let tolbarClicker = true
    $(document).on("click", "#ToolBarRightOpened", function () {
        if (tolbarClicker) {

            $(this).parent().find(".ToolBarRightFloat").css("display", "flex")
            $(this).parents(".contentComment").css("border", "1px dashed grey")

            tolbarClicker = false
        } else {

            $(this).parent().find(".ToolBarRightFloat").css("display", "none")
            $(this).parents(".contentComment").css("border", "none")

            tolbarClicker = true
        }




    })

    $(document).on("focusin", ".contentHeaderClass", function () {


        $(this).parents(".contentComment").css("border", "1px dashed grey")

    })
    $(document).on("focusout", ".contentHeaderClass", function () {

        $(this).parents(".contentComment").css("border", "none")


    })
    $(document).on("focusin", ".fr-element", function () {


        $(this).parents(".contentComment").css("border", "1px dashed grey")

    })
    $(document).on("focusout", ".fr-element", function () {

        $(this).parents(".contentComment").css("border", "none")


    })


    $(document).on("click", ".HeaderChangedH1", function () {

        var rect = $(this).parent().parent().parent().find(".contentHeaderClass").children().text()

        $(this).parent().parent().parent().find(".contentHeaderClass").empty()
        $(this).parent().parent().parent().find(".contentHeaderClass").append('<h1>' + rect + '</h1>')


    })
    $(document).on("click", ".HeaderChangedH2", function () {

        var rect = $(this).parent().parent().parent().find(".contentHeaderClass").children().text()

        $(this).parent().parent().parent().find(".contentHeaderClass").empty()
        $(this).parent().parent().parent().find(".contentHeaderClass").append('<h2>' + rect + '</h2>')


    })
    $(document).on("click", ".HeaderChangedH3", function () {

        var rect = $(this).parent().parent().parent().find(".contentHeaderClass").children().text()

        $(this).parent().parent().parent().find(".contentHeaderClass").empty()
        $(this).parent().parent().parent().find(".contentHeaderClass").append('<h3>' + rect + '</h3>')


    })
    $(document).on("click", ".HeaderChangedH4", function () {

        var rect = $(this).parent().parent().parent().find(".contentHeaderClass").children().text()

        $(this).parent().parent().parent().find(".contentHeaderClass").empty()
        $(this).parent().parent().parent().find(".contentHeaderClass").append('<h4>' + rect + '</h4>')


    })
    $(document).on("click", ".HeaderChangedH5", function () {

        var rect = $(this).parent().parent().parent().find(".contentHeaderClass").children().text()

        $(this).parent().parent().parent().find(".contentHeaderClass").empty()
        $(this).parent().parent().parent().find(".contentHeaderClass").append('<h5>' + rect + '</h5>')


    })

    $(document).on("click", ".HeaderChangedH6", function () {

        var rect = $(this).parent().parent().parent().find(".contentHeaderClass").children().text()

        $(this).parent().parent().parent().find(".contentHeaderClass").empty()
        $(this).parent().parent().parent().find(".contentHeaderClass").append('<h6>' + rect + '</h6>')


    })
    function contentRemove() {

        $(".ContentRemoveButton").click(function () {

            if (confirm("Are you Sure?!")) {
                $(this).parent().parent().parent().remove()
            } else {

            }

        });

    }
    contentRemove()

// page print
    /* var cssArr = [
     "/v7/resource/css/bs4/bootstrap.min.css",
     "/v7/resource/css/bs4/font-awesome.min.css",
     "/v7/resource/froala/css/froala_editor.pkgd.min.css",
     "/v7/resource/froala/css/froala_editor.css",
     "/v7/resource/css/bs4/bs4-custom.css",
     "/v7/resource/css/bs4/writeArticle.css",
     ]; */

    $(document).on("click", "#printPage", function () {


        printDiv("fr-element")


    })




    function printDiv(elem) {


        var divTemp = $('<div >');
        var div = $('<page size="A4">')
                .html($("." + elem).html());

        divTemp.append(div);

        var mywindow = window.open('', 'my div', 'height=1000px,width=1200px');
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('<link rel="stylesheet" href="resource/css/bs4/bootstrap.min.css">');
        mywindow.document.write('<link rel="stylesheet" href="resource/css/bs4/font-awesome.min.css">');
        mywindow.document.write('<link rel="stylesheet" href="resource/css/bs4/bs4-custom.css">');
        mywindow.document.write('<link rel="stylesheet" href="resource/froala/css/froala_editor.pkgd.min.css">  ');
        mywindow.document.write('<link rel="stylesheet" type="text/css" href="resource/froala/css/froala_editor.css"> ');
        mywindow.document.write('<link rel="stylesheet" href="resource/css/bs4/print.css">');
        mywindow.document.write('</head><body>');
        mywindow.document.write(divTemp.html());
        //        mywindow.document.write($('.fr-element').html());

        mywindow.document.write('</body></html>');
        window.setTimeout(function () {
            // do whatever you want to do    
            mywindow.print();


        }, 700);
    }

    //        mywindow.print();
    ////        mywindow.document.close();
    //        mywindow.document.close();
    //        mywindow.print();
    //        mywindow.close();




//user story sontainer float open
    var floatOpenedClickker = true
    $(document).on("click", ".FloatRightUserStoryCont-openBtn", function () {


        if (floatOpenedClickker) {

            $(this).parent().parent().find(".FloatRightUserStoryCont").css("display", "block")
            $(this).parent().parent().find(".FloatRightUserStoryCont").css("z-index", "10000")

            floatOpenedClickker = false
        } else {
            $(this).parent().parent().find(".FloatRightUserStoryCont").css("display", "none")
            floatOpenedClickker = true
        }


    })




    $(document).on("keypress", ".fr-box", function () {

        test18()
        pageLanegen()
    })
    $(document).on("input", ".fr-box", function () {

        test18()
        pageLanegen()
    })
    $(document).on("change", ".fr-box", function () {

        test18()
        pageLanegen()
    })
    $(document).on("input", "#testPage", function () {

        test18()
        pageLanegen()
    })
    $(document).on("keypress", "#testPage", function () {

        test18()
        pageLanegen()
    })

    $(document).on("keypress", ".fr-element", function () {
        LastUpdateFunction()
        test18()
        pageLanegen()
    })
    $(document).on("mouseover", "#testPage", function () {

        test18()
        pageLanegen()
    })


//Save an Load section

    var documetnArr = []
    $(document).on("click", "#saveAspopUpCanacel", function () {


        $(".SaveAsPopUp").toggle("slow")
        $("#documentNameInput").val("")
    })
    $(document).on("click", "#removeDocument", function () {
        var docName = $(this).parent().text()

        if (confirm("Are you sure " + docName + "Remove?!")) {
            $(this).parent().remove()

        } else {
            return false
        }


    })
    $(document).on("click", "#saveAspopUpSaveDoc", function () {

        var documentName = $("#documentNameInput").val()



        if (documentName.trim().length > 0) {

            $(".documentsSeqment").append('<div class="dropdown-item" >' + documentName + ' <button type="button" id="removeDocument" class="btn btn-outline-secondary"><i class="fas fa-trash-alt"></i></button></div>')
            $(".SaveAsPopUp").toggle("slow")

            $("#documentNameInput").val("")
        }




    })
    $(document).on("click", ".saveAsPopUpBackG", function () {


        $(this).parent().toggle("slow")
        $("#documentNameInput").val("")

    })
    $(document).on("click", "#SaveAsPage", function () {


        $(".SaveAsPopUp").css("display", "block")

    })


//rename document 
    $(document).on("click", ".docs-title-input-label-inner", function () {

        var witdh = $(this).width() + 20
        var name = $(this).text()
        $(this).css("visibility", "hidden")
        $(this).parent().find(".docs-title-input").css("visibility", "visible")
        $(this).parent().find(".docs-title-input").css("width", witdh + "px")
        $(this).parent().find(".docs-title-input").val(name)
        $(this).parent().find(".docs-title-input").focus()


    })
    $(document).on("change", ".docs-title-input", function () {

        var name = $(this).val()
        $(this).css("visibility", "hidden")
        $(this).parent().find(".docs-title-input-label-inner").css("visibility", "visible")

        $(this).parent().find(".docs-title-input-label-inner").text("")
        $(this).parent().find(".docs-title-input-label-inner").text(name);
        saveDocument();
    })



    function dragandDrop() {
        function moveUp(item) {
            var prev = item.prev();
            if (prev.length == 0)
                return;
            prev.css('z-index', 999).css('position', 'relative').animate({top: item.height()}, 50);
            item.css('z-index', 1000).css('position', 'relative').animate({top: '-' + prev.height()}, 100, function () {
                prev.css('z-index', '').css('top', '').css('position', '');
                item.css('z-index', '').css('top', '').css('position', '');
                item.insertBefore(prev);
            });
        }
        function moveDown(item) {
            var next = item.next();
            if (next.length == 0)
                return;
            next.css('z-index', 999).css('position', 'relative').animate({top: '-' + item.height()}, 50);
            item.css('z-index', 1000).css('position', 'relative').animate({top: next.height()}, 100, function () {
                next.css('z-index', '').css('top', '').css('position', '');
                item.css('z-index', '').css('top', '').css('position', '');
                item.insertAfter(next);
            });
        }




        $('.specialDragButton').click(function () {
            var btn = $(this);
            var val = btn.val();
            if (val == 'up')
                moveUp(btn.parents('.contentComment'));
            else
                moveDown(btn.parents('.contentComment'));
        })
    }
    dragandDrop()











});

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function lastModified() {
    var modiDate = new Date(document.lastModified);
    var showAs = modiDate.getDate() + "-" + (modiDate.getMonth() + 1) + "-" + modiDate.getFullYear();
    return showAs
}

function GetTime() {
    var modiDate = new Date();
    var Seconds

    if (modiDate.getSeconds() < 10) {
        Seconds = "0" + modiDate.getSeconds();
    } else {
        Seconds = modiDate.getSeconds();
    }

    var modiDate = new Date();
    var CurTime = modiDate.getHours() + ":" + modiDate.getMinutes() + ":" + Seconds
    return CurTime
}

function LastUpdateFunction() {

    $(".lastUpdateTimeSection").text("Last update " + lastModified() + " " + GetTime())

}



/* 
 var max_pages = 100;
 var page_count = 0;
 
 function snipMe() {
 page_count++;
 if (page_count > max_pages) {
 return;
 }
 var long = $(this)[0].scrollHeight - Math.ceil($(this).innerHeight());
 var children = $(this).children().toArray();
 var removed = [];
 while (long > 0 && children.length > 0) {
 var child = children.pop();
 $(child).detach();
 removed.unshift(child);
 long = $(this)[0].scrollHeight - Math.ceil($(this).innerHeight());
 }
 if (removed.length > 0) {
 var a4 = $('<div class="A4"></div>');
 a4.append(removed);
 $(this).after(a4);
 snipMe.call(a4[0]);
 }
 }
 
 $(document).ready(function() {
 
 
 $('.A4').keypress(function() {
 snipMe.call(this);
 });
 
 
 $(document).on("click","#previewPage",function() {
 var test20 = $("#testPage").html();
 
 console.log(test20);
 $('#printPreview').append(test20);
 //snipMe();
 
 $('.A4').each(function() {
 snipMe.call(this);
 });
 
 $('.A4').css("display","block")
 $("#testPage").css("display","none")  
 
 });
 
 
 
 
 
 
 
 });  */




/* function LicenseRemove(){
 
 $(".fr-wrapper").find('[style="z-index:9999;width:100%;position:relative;"]').remove()
 
 }
 
 LicenseRemove()
 function LicenseRemove(){
 
 $(".fr-wrapper div").first().remove()
 
 } */
