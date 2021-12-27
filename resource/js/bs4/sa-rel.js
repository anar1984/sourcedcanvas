
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




SADebug = {
    "BacklogId": "",
    LoadedBacklogsFromPart: [],
    LoadedBacklogsToPart: [],
    Lines: [],
    LoadedApi: [],
    LoadedGui: [],
    SetDrawLine: function (fromId, toId, relType, inputId) {
        var kv = {};
        kv.fromId = fromId;
        kv.toId = toId;
//        kv.title = title;
        kv.actionId = inputId;
        kv.desc = SAInput.GetInputName(inputId);
        kv.relationType = relType;
        kv.active = '1';
        SADebug.Lines.push(kv);
    },
    DrawSelectedFieldLines: function () {
        $('#SUS_IPO_GUI_Design').find('[sa-selectedfield]').each(function (e) {

            var selectedFields = $(this).attr('sa-selectedfield').split(',');
            for (var i in selectedFields) {
                var field = selectedFields[i].trim();
                if (field.length > 0) {
                    var fromId = $(this).attr("id");
                    console.log(fromId, ' - >', field);
                    var toId = '';
                    $('.api-io-list-zad[idx=' + field + ']').each(function () {
                        toId = $(this).attr('id');
                        console.log(toId);
                    })

                    SADebug.JustLine4SelecedField(fromId, toId);
                }
            }
        })
    },
    JustLine4SelecedField: function (fromId, toId, title) {
        try {
            new LeaderLine(
                    document.getElementById(fromId),
                    document.getElementById(toId),
                    {color: 'red',
                        size: 1,
                        dash: true,
                        middleLabel: LeaderLine.pathLabel(title),
                        endLabel: LeaderLine.pathLabel(title),
                        startLabel: LeaderLine.pathLabel(title),

                    });
        } catch (err) {
        }
    },
    SetDrawLine4Gui: function (fromId, toId, relType, guiId) {
        var kv = {};
        kv.fromId = fromId;
        kv.toId = toId;
        kv.actionId = guiId;
        kv.desc = SACore.GetBacklogname(guiId);
        kv.relationType = relType;
        kv.active = '1';
        SADebug.Lines.push(kv);
    },
    RemoveAllDrawLine: function () {
        $(".leader-line").remove();
//        $('.customLineZad').remove();
    },
    DrawLines_old: function () {
        for (var i = 0; i < SADebug.Lines.length; i++) {
            try {
                var from = SADebug.Lines[i].fromId;
                var to = SADebug.Lines[i].toId;
                var fromDiv = document.getElementById(from);
                var toDiv = document.getElementById(to);
                SADebug.Connect(fromDiv, toDiv, "#0F0", 5);
            } catch (err) {
            }



        }
    },
    DrawLines: function () {
        $('#modal-prototypye .modal-header').css('display', 'none');
//        var hiddedAPis = [];
        for (var i = 0; i < SADebug.Lines.length; i++) {
            try {
                var obj = SADebug.Lines[i];
                var active = obj.active;
                var from = obj.fromId;
                var to = obj.toId;
                if (active === '0') {
                    if (obj.relationType === 'gui_gui') {
                        $('#' + to).closest('div.sa-gui-esas').hide();
                    } else {
                        $('#' + to).closest('div.sa-api-esas').hide();
                    }
                    continue;
                } else {
                    if (obj.relationType === 'gui_gui') {
                        $('#' + to).closest('div.sa-gui-esas').show();
                        $('#' + to).closest('div.sa-gui-esas').find('.sa-gui-esas').show();
                    } else {
                        $('#' + to).closest('div.sa-api-esas').show();
                        $('#' + to).closest('div.sa-api-esas').find('.sa-api-esas').show();
                    }
                }

                if ($(from).closest('div.sa-api-esas').css('dosplay') === 'none'
                        || $(to).closest('div.sa-api-esas').css('dosplay') === 'none') {
                    continue;
                }

                $('#' + to).show();
                $('#' + from).show();
                var oldTop = $('#gui_component_main_view').scrollTop();
                var oldLeft = $('#gui_component_main_view').scrollLeft();
                $('#gui_component_main_view').scrollTop(0);
                $('#gui_component_main_view').scrollLeft(0);

                SADebug.IllustrateDrawLine(from, to, obj.relationType);

                $('#gui_component_main_view').scrollTop(oldTop);
                $('#gui_component_main_view').scrollLeft(oldLeft);
                //  SADebug.GetLineDivId4Drawing(from, to,'right','left');

            } catch (err) {
            }
        }
        $('#modal-prototypye .modal-header').css('display', 'block');
    },
    IllustrateDrawLine: function (from, to, relationType) {
        if (relationType === 'api_api_async') {
            new LeaderLine(
                    document.getElementById(from),
                    document.getElementById(to),
                    {
                        color: 'rgb(41,146,210)',
                        size: 2,
                        startSocket: 'right',
                        endSocket: 'left',

                    });
        } else {
            new LeaderLine(
                    document.getElementById(from),
                    document.getElementById(to),
                    {
                        color: 'rgb(41,146,210)',
                        size: 2

                    });
        }
    },
    CallGUI: function (backlogId) {
        if (backlogId.length < 3)
            return;
        SADebug.Lines = [];
        SADebug.LoadedBacklogsFromPart = [];
        SADebug.LoadedBacklogsToPart = [];
        SADebug.GUIFunction.GenerateApiRelation(backlogId);
        //SADebug.GUIFunction.GenerateGuiRelation(backlogId);
        SADebug.RemoveAllDrawLine();
        SADebug.DrawLines();
//        SADebug.DrawSelectedFieldLines();
    },
    CallGUIIntern: function (backlogId) {
        if (backlogId.length < 3)
            return;
        SADebug.GUIFunction.Generate(backlogId);
        SADebug.RemoveAllDrawLine();
        SADebug.DrawLines();
    },
    DrawLineOnZoom: function () {
//        SADebug.RemoveAllDrawLine();
//        SADebug.DrawLines();
    },
    CallApi: function (apiId, parentDivId) {
        if (apiId.length < 3) {
            return;
        }

        var extApiList = (cr_project_desc_by_backlog[apiId])
                ? cr_project_desc_by_backlog[apiId]
                : [];
        for (var i in  extApiList) {
            var extId = extApiList[i];
            var o = cr_project_desc[extId];

            if (o.commentType === 'comment') {
                continue;
            }

            if (o.fkRelatedApiId) {
                SADebug.APIFunction.RelatedApi(o.id, o.fkRelatedApiId, parentDivId);
            } else if (SAFN.IsCommandCallApi(o.description)) {
                var apiIdZad = SAFN.GetCommandArgument(o.description);
                if (apiIdZad) {
                    apiIdZad = apiIdZad.trim();
                    SADebug.APIFunction.RelatedApi(o.id, apiIdZad, parentDivId);
                }

            } else if (SAFN.IsCommandIf(o.description) || SAFN.IsCommandFor(o.description)) {
                var apiList = getCallApiListFromProcessDescriptionLine(o.description);
                for (var j = 0; j < apiList.length; j++) {
                    var apiIdZad = apiList[j];
                    if (apiIdZad) {
                        apiIdZad = apiIdZad.trim();
                        SADebug.APIFunction.RelatedApi(o.id, apiIdZad, parentDivId);
                    }
                }
            }
        }

        var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
        for (var i in outputList) {
            try {
                var oid = outputList[i].trim();
                var newApiId = SAInput.getInputObject(oid).sendToBacklogId;
                if (newApiId) {
                    SADebug.APIFunction.RelatedApi(newApiId, parentDivId);
                }
            } catch (err) {
            }
        }
    },
    GetGuiDesign: function (backlogId) {
        if (backlogId.length < 3)
            return;
        var jsonZad = SAInput.toJSONByBacklog(backlogId);
        var canvasCSS = Component.ReplaceCSS(SACore.GetBacklogDetails(backlogId, 'param1'));
        var guiDesign = new UserStory().getGUIDesignHTMLPure(jsonZad);
        return guiDesign;
    },
    APIFunction: {
        SendToBacklogId: function (apiId, parentDivId) {
            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId, dyncId);
            var div3 = $("<div class='sa-cwr'>").append(body);
            $("#" + parentDivId).closest('div.sa-api-esas').find('.sa-dept-rww').first().append(div3);
            SADebug.SetDrawLine(parentDivId, dyncId, 'api_api_async');
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
        RelatedApi: function (descriptionId, apiId, parentDivId) {
            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId, dyncId);
            var div3 = $("<div class='sa-cwr'>").append(body);
//                $("#core_api_" + apiId).closest('div.sa-api-esas').find('.sa-dept-rww').first().append(div3);
            $("#" + parentDivId).closest('div.sa-api-esas').find('.sa-dept-rww').first().append(div3);
            SADebug.SetDrawLine("core_api_desc_" + parentDivId + '_' + descriptionId, dyncId, 'api_api');
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
    },
    GUIFunction: {
        SelectFromBacklogId: function (inputId, apiId, backlogId) {
            if (SADebug.LoadedBacklogsFromPart.includes(apiId)) {
                SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_select_from', inputId);
                Toaster.showError("There's a loop: " + apiId);
                return;
            }

            SADebug.LoadedBacklogsFromPart.push(apiId)

            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId, dyncId);
            $("#core_gui_" + backlogId).closest('div.sa-gui-rw').find('.sa-c1').append(body);
//            SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_select_from');
            SADebug.SetDrawLine("comp_id_" + inputId, dyncId, 'gui_select_from', inputId);
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
        GetFkDependentBacklogId: function (inputId, apiId, backlogId) {

            if (SADebug.LoadedBacklogsFromPart.includes(apiId)) {
                SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_select_from'), inputId;
                Toaster.showError("There's a loop: " + apiId);
                return;
            }

            SADebug.LoadedBacklogsFromPart.push(apiId);
            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId, dyncId);
            $("#core_gui_" + backlogId).closest('div.sa-gui-rw').find('.sa-c1').append(body);
//            SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_select_from');
            SADebug.SetDrawLine("comp_id_" + inputId, dyncId, 'gui_select_from', inputId);
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
        SendToBacklogId: function (inputId, apiId, backlogId) {
            if (SADebug.LoadedBacklogsToPart.includes(apiId)) {
                SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_send_to', inputId);
                Toaster.showError("There's a loop: " + apiId);
                return;
            }

            SADebug.LoadedBacklogsToPart.push(apiId);
            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId);
            $("#core_gui_" + backlogId).closest('div.sa-gui-rw').find('.sa-c3').append(body);
//            SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_send_to');
            SADebug.SetDrawLine("comp_id_" + inputId, dyncId, 'gui_send_to', inputId);
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
        GenerateInputActionRelation4Read: function (inputId, apiId, backlogId) {
            if (SADebug.LoadedBacklogsFromPart.includes(apiId)) {
                SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_select_from', inputId);
                Toaster.showError("There's a loop: " + apiId);
                return;
            }
            SADebug.LoadedBacklogsFromPart.push(apiId);
            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId, dyncId);
            $("#core_gui_" + backlogId).closest('div.sa-gui-rw').find('.sa-c1').append(body);
//            SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_select_from');
            SADebug.SetDrawLine("comp_id_" + inputId, dyncId, 'gui_select_from', inputId);
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
        GenerateInputActionRelation4CUD: function (inputId, apiId, backlogId) {
            if (SADebug.LoadedBacklogsToPart.includes(apiId)) {
                SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_send_to', inputId);
                Toaster.showError("There's a loop: " + apiId);
                return;
            }
            SADebug.LoadedBacklogsToPart.push(apiId);
            var dyncId = makeId(10);
            var body = SADebug.Pattern.API.GetPattern(apiId, dyncId);
            $("#core_gui_" + backlogId).closest('div.sa-gui-rw').find('.sa-c3').append(body);
            SADebug.SetDrawLine("comp_id_" + inputId, "core_api_" + apiId, 'gui_send_to', inputId);
            SADebug.SetDrawLine("comp_id_" + inputId, dyncId, 'gui_send_to', inputId);
            var apiCallId = apiId;
            SADebug.CallApiThread(apiCallId, dyncId);
        },
        GenerateInputActionRelation: function (inputId, backlogId) {
            try {
                var eventList = cr_input_action_rel[inputId];
                for (var i = 0; i < eventList.length; i++) {
                    var relId = eventList[i];
                    var obj = cr_input_action_rel_list[relId];
                    var apiId = obj.fkApiId;
                    if (apiId) {
                        var apiAction = SACore.GetBacklogDetails(apiId, "apiAction");
                        if (apiAction === 'R') {
                            SADebug.GUIFunction.GenerateInputActionRelation4Read(inputId, apiId, backlogId);
                        } else if (apiAction !== 'R' && !SADebug.LoadedBacklogsToPart.includes(apiId)) {
                            SADebug.GUIFunction.GenerateInputActionRelation4CUD(inputId, apiId, backlogId);
                        }
                    }
                }
            } catch (err) {
            }
        },
        CallGuiThread: function (guiId) {
            var carrier = new Carrier();
            carrier.setBacklogId(guiId);
            if (!ifBacklogInputs4LoaderExistById(guiId)) {
                showProgress5();
                carrier.setExecwarder("_CallBacklogInputListIfNotExistAndForward");
                carrier.setApplier("SADebug.GUIFunction._FillGuiDivBody");
                carrier.I_am_Requirer();
            } else {
                carrier.setApplier("SADebug.GUIFunction._FillGuiDivBody");
                carrier.I_am_Execwarder();
            }

            SourcedDispatcher.Exec(carrier);
        },
        _FillGuiDivBody: function (carrier) {
            var guiId = carrier.getBacklogId();
            var guiDesign = SADebug.GetGuiDesign(guiId);
            $('#core_gui_' + guiId).closest('div.sa-gui-esas').find('.progressLoader').first().remove();
            $('#core_gui_' + guiId).closest('div.sa-gui-esas').find('.sa-gui-esas-body').html(guiDesign);
            SADebug.SADebug.GUIFunction.GenerateGuiRelation(guiId);
        },
        GenerateDependentGui: function (guiId, backlogId, inputId) {
            var guiDesign = ''; //SADebug.GetGuiDesign(guiId);

            var div3 = $("<div class='sa-cwr'>")
                    .append($('<div class="sa-gui-esas">')
                            .append($('<div class="progressLoader loaderTable">'))
                            .append($('<div class="sa-gui-rw sa-rw row">')
                                    .append($('<div class="sa-c1">'))
                                    .append($('<div class="sa-c2">')
                                            .attr("id", "core_gui_" + guiId)
                                            .append($('<div>')
                                                    .addClass("sa-gui-esas-body")
                                                    .append(guiDesign)
                                                    .addClass('row redirectClass gui-design')))
                                    .append($('<div class="sa-c3">'))
                                    )
                            .append($('<div class="sa-gui-dept-rw sa-rw">'))
                            )
                    ;
            $("#core_gui_" + backlogId).closest('div.sa-gui-esas').find('.sa-gui-dept-rw').first().append(div3);
            SADebug.GUIFunction.CallGuiThread(guiId);
//            SADebug.CallGUI(guiId);  


            SADebug.SetDrawLine4Gui("core_gui_" + backlogId, "core_gui_" + guiId, 'gui_gui', guiId);
//                        $('#SUS_IPO_GUI_Design').html(st);
//                        $('#SUS_IPO_GUI_Design').attr('bid', guiId);
//                        $('#SUS_IPO_GUI_Design').attr('bcode', makeId(10));

//                        $('.sa-main-c2').attr("id", "core_gui_" + SACore.GetCurrentBacklogId());
            //get element
//                        var elm = document.getElementById('SUS_IPO_GUI_Design');

            //fill selectbox after GUI Design
            //loadSelectBoxesAfterGUIDesign(elm);

            //init onload click and change events
            // initOnloadActionOnGUIDesign4OnClick(elm);
            // initOnloadActionOnGUIDesign4Onchange(elm);
        },
        GenerateApiRelation: function (backlogId) {


            var outputList = SACore.GetBacklogDetails(backlogId, "inputIds").split(',');
            for (var i in outputList) {
                try {
                    var oid = outputList[i];
                    oid = oid.trim();
                    var inputObj = SAInput.getInputObject(oid);
                    if (inputObj.selectFromBacklogId) {
                        SADebug.GUIFunction.SelectFromBacklogId(inputObj.id, inputObj.selectFromBacklogId, backlogId);
                    }

                    if (inputObj.fkDependentBacklogId) {
                        SADebug.GUIFunction.GetFkDependentBacklogId(inputObj.id, inputObj.fkDependentBacklogId, backlogId);
                    }


                    if (inputObj.sendToBacklogId) {
                        SADebug.GUIFunction.SendToBacklogId(inputObj.id, inputObj.sendToBacklogId, backlogId);
                    }

                    SADebug.GUIFunction.GenerateInputActionRelation(inputObj.id, backlogId);
//                    //action = ,redirect,fill, popup
//                    var guiId = inputObj.param1;
//                    if (guiId) {
//                        SADebug.GUIFunction.GenerateDependentGui(guiId, backlogId);
//                    }
                } catch (err) {

                }
            }

        },
        GenerateGuiRelation: function (backlogId) {
            var outputList = SACore.GetBacklogDetails(backlogId, "inputIds").split(',');
            for (var i in outputList) {
                try {
                    var oid = outputList[i];
                    oid = oid.trim();
                    var inputObj = SAInput.getInputObject(oid);
                    //action = ,redirect,fill, popup
                    var guiId = inputObj.param1;
                    if (guiId) {
//                        if (inputObj.componentType==='sctn'){
//                            SADebug.CallGUI(guiId);
//                        }

                        SADebug.GUIFunction.GenerateDependentGui(guiId, backlogId, inputObj.id);
                    }


                } catch (err) {

                }
            }

        }
    },
    GenerateApiDependences: function (inputObj, backlogId) {
        if (inputObj.selectFromBacklogId) {
            SADebug.GUIFunction.SelectFromBacklogId(inputObj.id, inputObj.selectFromBacklogId, backlogId);
        }

        if (inputObj.fkDependentBacklogId) {
            SADebug.GUIFunction.GetFkDependentBacklogId(inputObj.id, inputObj.fkDependentBacklogId, backlogId);
        }


        if (inputObj.sendToBacklogId) {
            SADebug.GUIFunction.SendToBacklogId(inputObj.id, inputObj.sendToBacklogId, backlogId);
        }

        SADebug.GUIFunction.GenerateInputActionRelation(inputObj.id, backlogId);
    },
    GetSelectFromApi: function (backlogId) {


    },
    CallApiThread: function (apiId, divId) {
        var carrier = new Carrier();
        carrier.setBacklogId(apiId);
        carrier.set("divId", divId);
//        $('#core_api_' + apiId).closest("div.sa-api-esas").prepend($('<div class="progressLoader loaderTable">'))
        $('#' + divId).closest("div.sa-api-esas").prepend($('<div class="progressLoader loaderTable">'))

        if (!ifBacklogInputs4LoaderExistById(apiId)) {
            showProgress5();
            carrier.setExecwarder("_CallBacklogInputListIfNotExistAndForward");
            carrier.setApplier("SADebug._FillApiDivBody");
            carrier.I_am_Requirer();
        } else {
            carrier.setApplier("SADebug._FillApiDivBody");
            carrier.I_am_Execwarder();
        }

        SourcedDispatcher.Exec(carrier);
    },
    _FillApiDivBody: function (carrier) {
        var apiId = carrier.getBacklogId();
        var apiName = SACore.GetBacklogDetails(apiId, 'backlogName');
        var divId = carrier.get("divId");
//        var finalId = '#core_api_' + apiId;
        var finalId = '#' + divId;
        
        var requestType = SACore.GetBacklogDetails(apiId, 'apiSyncRequest');
        var color  =(requestType==='async') ? "white" : "black";
        var bg_color  = (requestType==='async') ? "green" : "yellow";
        var body = $('<div>')
                .append($('<span>').text(apiName))
                .append(" ")
                .append($('<span>')
                        .css("border-radius", "15px")
                        .css("padding", "2px 8px")
                        .css("background-color", "orange")
                        .text(GetApiActionTypeText(SACore.GetBacklogDetails(apiId, 'apiAction'))
                                )
                        )
                .append($('<span>')
                        .css("border-radius", "15px")
                        .css("padding", "2px 8px")
                        .css("background-color", bg_color)
                        .css("color",color)
                        .text(MapApiCallAsyncType(requestType)))



        $(finalId)
                .closest("div.sa-api-esas")
                .find('.api-body')
                .first().html(body);
        $(finalId)
                .closest("div.sa-api-esas")
                .find('.api-input-list')
                .first().html(SADebug.Pattern.API.GetInputList(apiId));
        $(finalId)
                .closest("div.sa-api-esas")
                .find('.api-desc-list')
                .first().html(SADebug.Pattern.API.GetProcessDescriptionList(apiId, divId));
        $(finalId)
                .closest("div.sa-api-esas")
                .find('.api-output-list')
                .first().html(SADebug.Pattern.API.GetOutputList(apiId));
        $(finalId).closest("div.sa-api-esas").find('.progressLoader').remove();
        SADebug.CallApi(apiId, divId);
    },
    Pattern: {
        API: {
            GetPattern: function (apiId, divId) {
                if (!apiId)
                    return "";
                //loadBacklogDetailsByIdIfNotExist(apiId);

                //var body = SACore.GetBacklogDetails(apiId, 'backlogName');

                var div = $('<div class="sa-api-esas">')
                        .append($('<div class="sa-rww">')
                                .append($('<div>')
                                        .addClass('sa-cw1')
                                        .append('<span class="input-title-btn data-title-btn" >INPUT</span>')
                                        .append('<div class="sa-api-cw1-block data-block-popUp" ></div>'))

                                .append($('<div>')
                                        .addClass("sa-cw2 row")
                                        .attr("pid", "core_api_" + apiId)
                                        .attr('id', divId)
                                        .append($('<span class="btn btn-secondary api_larged_block"><i class="fas fa-expand" aria-hidden="true"></i></span>'))
                                        .append($('<h6>')
                                                .addClass("api-body")
                                                .css("cursor", "pointer")
                                                .attr("is_api", "1")
                                                .attr('onclick', "new UserStory().getStoryInfo('" + apiId + "',this)")
                                                .append('')
                                                .addClass(''))
                                        .append($('<div>')
                                                .addClass('row-fixed-width')
                                                .addClass('api-input-list')
                                                .append("<h6>Input(s)</h6>")
                                                .append(''))
                                        .append($("<div>")
                                                .addClass('row-fixed-width2')
                                                .addClass('api-desc-list')
                                                .append("<h6>Description(s)</h6>")
                                                .append(''))
                                        .append($("<div>")
                                                .addClass('row-fixed-width')
                                                .addClass('api-output-list')
                                                .append("<h6>Output(s)<h6>")
                                                .append(''))
                                        )
                                .append($('<div>')
                                        .addClass('sa-cw3')
                                        .append('<span class="output-title-btn data-title-btn" >OUTPUT</span>')
                                        .append('<div class="sa-api-cw3-block data-block-popUp" ></div>'))
                                )
                        .append($('<div class="sa-dept-rww">'))
                        ;
                return div;
            },
            GetPattern_old: function (apiId, dyncId) {
                if (!apiId)
                    return "";
                loadBacklogDetailsByIdIfNotExist(apiId);
                var body = SACore.GetBacklogDetails(apiId, 'backlogName');
                var div = $('<div class="sa-api-esas">')
                        .append($('<div class="sa-rww">')
                                .append($('<div class="sa-cw1" data-content="Popover with data-trigger" rel="popover" data-placement="bottom" data-original-title="Input" data-trigger="click"><i class="fas fa-info-circle"></i></div>'))
                                .append($('<span class="btn btn-secondary api_larged_block"><i class="fas fa-expand" aria-hidden="true"></i></span>'))
                                .append($('<div>')
                                        .addClass("sa-cw2 row")
                                        .attr("id", "core_api_" + apiId)
                                        //.append($('<br>').append('------------------------'))
                                        .append($('<h5>')
                                                .append(body)
                                                .addClass(''))
                                        .append($('<div>')
                                                .addClass('row-fixed-width input-text')
                                                .append("<h6>Input(s)</h6>")
                                                .append(SADebug.Pattern.API.GetInputList(apiId)))
                                        .append($("<div>")
                                                .addClass('row-fixed-width2')
                                                .append("<h6>Description(s)</h6>")
                                                .append(SADebug.Pattern.API.GetProcessDescriptionList(apiId)))
                                        .append($("<div>")
                                                .addClass('row-fixed-width output-text')
                                                .append("<h6>Output(s)<h6>")
                                                .append(SADebug.Pattern.API.GetOutputList(apiId)))
                                        )
                                .append($('<div>')
                                        .addClass('sa-cw3')
                                        .append('<span class="output-title-btn" >INOUT</span>')
                                        .append('<div class="sa-api-cw3-block" ></div>')
                                        )
                                )
                        .append($('<div class="sa-dept-rww">'))
                        ;
                return div;
            },
            GetInputList: function (apiId) {
                var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
                var div = $('<div>');
                for (var i in outputList) {
                    try {
                        var oid = outputList[i];
                        oid = oid.trim();
                        var inputObj = SAInput.getInputObject(oid);
                        if (inputObj.inputType !== 'IN')
                            continue;
                        div.append($('<span>')
                                .addClass('api-io-list-zad')
                                .attr('id', makeId(6))
                                .attr('idx', inputObj.inputName)
                                .text(inputObj.inputName))
                                .append("<br>");
                    } catch (err) {

                    }
                }
                return div;
            },
            GetOutputList: function (apiId) {
                var outputList = SACore.GetBacklogDetails(apiId, "inputIds").split(',');
                var div = $('<div>');
                for (var i in outputList) {
                    try {
                        var oid = outputList[i];
                        oid = oid.trim();
                        var inputObj = SAInput.getInputObject(oid);
                        if (inputObj.inputType !== 'OUT')
                            continue;
                        var inputDBInfo = "";
                        var inputDBInfoSend = "";
                        if (inputObj.selectFromFieldId) {
                            var txt = SAEntity.Databases[inputObj.selectFromDbId].dbName + "." +
                                    SAEntity.Tables[inputObj.selectFromTableId].tableName + "." +
                                    SAEntity.Fields[inputObj.selectFromFieldId].fieldName;
                            inputDBInfo = $('<span>')
                                    .attr("title", "Select from DB")
//                                    .append($('<span>')
//                                            .css('padding', '2px 5px')
//                                            .css("border-radius", "15px")
//                                            .css("background-color", "yellow")
//                                            .text(" << "))
                                    .append(" ")
                                    .append($('<span>')
                                            .css('padding', '2px 5px')
                                            .css("border-radius", "15px")
                                            .css("background-color", "yellow")
                                            .text(txt))
                        }
                        if (inputObj.sendToFieldId) {
                            var txt = SAEntity.Databases[inputObj.sendToDbId].dbName + "." +
                                    SAEntity.Tables[inputObj.sendToTableId].tableName + "." +
                                    SAEntity.Fields[inputObj.sendToFieldId].fieldName;
                            inputDBInfoSend = $('<span>')
                                    .attr("title", "Send to DB")
//                                    .append($('<span>')
//                                            .css('padding', '2px 5px')
//                                            .css("border-radius", "15px")
//                                            .css("background-color", "orange")
//                                            .text(" >> "))
                                    .append(" ")
                                    .append($('<span>')
                                            .css('padding', '2px 5px')
                                            .css("border-radius", "15px")
                                            .css('padding', '2px 5px')
                                            .css("background-color", "orange")
                                            .text(txt))
                        }




                        div.append($('<span>')
                                .addClass('api-io-list-zad')
                                .attr('idx', inputObj.inputName)
                                .attr('id', makeId(6))
                                .text(inputObj.inputName))
                                .append(" ")
                                .append(inputDBInfo)
                                .append(" ")
                                .append(inputDBInfoSend)
                                .append("<br>");
                    } catch (err) {

                    }
                }
                return div;
            },
            GetProcessDescriptionList: function (apiId, parentDivId) {

                var div = $("<div>")
                        .addClass('sa-desc-block');
                var extApiList = (cr_project_desc_by_backlog[apiId])
                        ? cr_project_desc_by_backlog[apiId]
                        : [];
                var idx = 1;
                for (var i in  extApiList) {
//                try {
                    var divZad = $('<div class="sa-desc-item">')
                            .append($('<div>')
                                    .addClass('description-data-block-in')
                                    .append('<h5 class="input-descrp-btn data-title-btn" >IN</h5>')
                                    .append('<div class="sa-api-cw1-block data-block-popUp" ></div>'))
                            .append($('<div>')
                                    .addClass('description-data-block-out')
                                    .append('<h5 class="output-descrp-btn data-title-btn" >OUT</h5>')
                                    .append('<div class="sa-api-cw3-block data-block-popUp" ></div>'));
                    ;
                    var extId = extApiList[i];
                    var o = cr_project_desc[extId];
                    if (SAFN.IsCommand(o.description)) {
                        divZad.append($("<span class='sa-desc-item-no'>").text(idx++));
                        divZad.append($('<div class="sa-desc-item-body">')

                                .attr("pid", "core_api_desc_" + o.id)
                                .attr("id", "core_api_desc_" + parentDivId + "_" + o.id)
                                .append(o.description)
//                                .append(" (command)")
                                .append("<br>"));
                        div.append(divZad);
//                        SADebug.SetDrawLine("core_api_desc_" + o.id, "core_api_" + apiId, 'api_desc_send_to');
//                    
                    } else {
                        if (o.fkRelatedScId) {
                            var fnType = cr_js_list[o.fkRelatedScId].fnType;
                            var fnName = cr_js_list[o.fkRelatedScId].fnCoreName;
                            if (fnType === 'core') {
                                divZad.append($("<span class='sa-desc-item-no'>").text(idx++));
                                divZad.append($('<div class="sa-desc-item-body">')
                                        .attr("pid", "core_api_desc_" + o.id)
                                        .attr("id", "core_api_desc_" + parentDivId + "_" + o.id)
                                        .append(o.description)
                                        .append(" (JavaScript)")
                                        .append("<br>"));
                                div.append(divZad);
//                                SADebug.SetDrawLine("core_api_desc_" + o.id, "core_api_" + apiId, 'api_desc_send_to');

                            } else if (fnType === 'java') {
                                divZad.append($("<span class='sa-desc-item-no'>").text(idx++));
                                divZad.append($('<div class="sa-desc-item-body">')
                                        .attr("pid", "core_api_desc_" + o.id)
                                        .attr("id", "core_api_desc_" + parentDivId + "_" + o.id)
                                        .append(o.description)
                                        .append(" (Java)")
                                        .append("<br>"));
                                div.append(divZad);
//                                SADebug.SetDrawLine("core_api_desc_" + o.id, "core_api_" + apiId, 'api_desc_send_to');
                            }
                        }
                        if (o.fkRelatedApiId) {
                            divZad.append($("<span class='sa-desc-item-no'>").text(idx++));
                            divZad.append($('<div class="sa-desc-item-body">')
                                    .attr("pid", "core_api_desc_" + o.id)
                                    .attr("id", "core_api_desc_" + parentDivId + "_" + o.id)
                                    .append(o.description)
//                                    .append(" (API)")
                                    .append("<br>"));
                            div.append(divZad);
//                            SADebug.SetDrawLine("core_api_desc_" + o.id, "core_api_" + apiId, 'api_desc_send_to');
//                            SADebug.SetDrawLine("core_api_desc_" + o.id, parentDivId, 'api_desc_send_to');

//                            SADebug.SetDrawLine("core_api_desc_" + o.id, "core_api_" + o.fkRelatedApiId, 'api_desc_send_to');

                        }
                    }
                }
//                alert(JSON.stringify(div.html()))
                return div;
            }
        },
        GUI: {}
    },
    GetLineDivId4Drawing: function (childBacklodId, parentBacklogId, strtSckt, edSckt) {
        var userStory = 'this.userStories[childBacklodId]';
        var parentUserStory = 'this.parentUserStories[parentBacklogId]';
        var titlePure = userStory + " -  " + parentUserStory;
        var title = userStory + " - <br>" + parentUserStory;
        var id = makeId(10);
        var line = $('<div>')
                .attr('id', id)
                .attr('title', titlePure)
                .addClass('line_class')
                .attr('data-toggle', "tooltip", )
                .attr('data-placement', "bottom")
                .attr('title', 'fromId[' + childBacklodId + '] toId[' + parentBacklogId + ']')
//                .append(title)
                ;
        $('#SUS_IPO_GUI_Design1').append(line);
        var from = document.getElementById(childBacklodId);
        var to = document.getElementById(parentBacklogId);
        SADebug.AdjustLine(from, to, line[0], strtSckt, edSckt);
        $('[data-toggle="tooltip"]').tooltip()
        return id;
    },
    AdjustLine: function (from, to, line, strtSckt, edSckt) {
        var endSocket = edSckt;
        var startSocket = strtSckt;
        console.log(endSocket, startSocket)
//        var t = 100;
        var t = 0;
        var dfT = $('#zzddff').offset().top;
        var dWidht = $(from).width() / 2 + $(to).width() / 2


        if (endSocket === 'left') {
            var tL = $(to).offset().left; // + to.offsetWidth / 2;
            var tT = $(to).offset().top - dfT + to.offsetHeight / 2;
        }
        if (endSocket === 'right') {
            var tL = $(to).offset().left + $(to).width()// + to.offsetWidth / 2;
            var tT = $(to).offset().top - dfT + to.offsetHeight / 2;
        }
        if (endSocket === 'top') {
            var tL = ($(to).offset().left) + $(to).width() / 2; // + to.offsetWidth / 2;
            var tT = $(to).offset().top - dfT;
        }
        if (endSocket === 'bottom') {
            var tL = ($(to).offset().left) + $(to).width() / 2; // + to.offsetWidth / 2;
            var tT = $(to).offset().top - dfT + to.offsetHeight;
        }


        if (startSocket === 'left') {

            var fL = ($(from).offset().left)// + to.offsetWidth / 2;
            var fT = $(from).offset().top - dfT + from.offsetHeight / 2;
        }
        if (startSocket == 'right') {
            var fL = ($(from).offset().left) + $(from).width();
            ; // + to.offsetWidth / 2;
            var fT = $(from).offset().top - dfT + from.offsetHeight / 2;
        }
        if (startSocket === 'top') {
            var fL = ($(from).offset().left + 40) + $(from).width() / 2; // + to.offsetWidth / 2;
            var fT = $(from).offset().top - dfT;
        }

        if (startSocket === 'bottom') {
            var fL = ($(from).offset().left + 40) + $(from).width() / 2; // + to.offsetWidth / 2;
            var fT = $(from).offset().top - dfT + from.offsetHeight;
        }


        fL = fL + 15;
        tL = tL + 45;
        var CA = Math.abs(tT - fT);
        var CO = Math.abs(tL - fL);
        var H = Math.sqrt(CA * CA + CO * CO);
        var ANG = 180 / Math.PI * Math.acos(CA / H);
        if (tT > fT) {
            var top = (tT - fT) / 2 + fT;
        } else {
            var top = (fT - tT) / 2 + tT;
        }
        if (tL > fL) {
            var left = (tL - fL) / 2 + fL;
        } else {
            var left = (fL - tL) / 2 + tL;
        }

        if ((fT < tT && fL < tL) || (tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)) {
            ANG *= -1;
        }
        top -= H / 2;
        line.style["-webkit-transform"] = 'rotate(' + ANG + 'deg)';
        line.style["-moz-transform"] = 'rotate(' + ANG + 'deg)';
        line.style["-ms-transform"] = 'rotate(' + ANG + 'deg)';
        line.style["-o-transform"] = 'rotate(' + ANG + 'deg)';
        line.style["-transform"] = 'rotate(' + ANG + 'deg)';
        line.style.top = top + 'px';
        line.style.left = left + 'px';
        line.style.height = (H) + 'px';
    },
    Connect: function (div1, div2, color, thickness) {
        var off1 = SADebug.GetOffset(div1);
        var off2 = SADebug.GetOffset(div2);
        // bottom right
        var x1 = off1.left + off1.width;
        var y1 = off1.top + off1.height;
        // top right
        var x2 = off2.left + off2.width;
        var y2 = off2.top;
        // distance
        var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
        // center
        var cx = ((x1 + x2) / 2) - (length / 2);
        var cy = ((y1 + y2) / 2) - (thickness / 2);
        // angle
        var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
        // make hr
        var htmlLine = "<div class='customLineZad' id='" + makeId(5) + "'style='padding:0px; margin:0px; height:" + thickness +
                "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx +
                "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" +
                angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" +
                angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle +
                "deg);' />";
        //
//        alert(htmlLine);
        $('#SUS_IPO_GUI_Design1').append(htmlLine);
    },
    GetOffset: function (el) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    },
}

