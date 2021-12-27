var global_var_new = {
    "backlog_json": ""
}
var Carrier_Events = {

    inputsUpdate: function (key, value, id) {
        var ids = id ? id : global_var.current_us_input_id;
        SAInput.Inputs[ids][key] = value;
    }

}
var Prototype = {

    Init: function () {
        // genProject list combo box
        //loadProjectList2SelectboxByClass('projectList_liveprototype');
        //SACore.FillAllSelectBox();
        /// $('#show_ipo_toggle').prop("checked", true) //show input list
        /// showNavBar();
        //callLivePrototype();
        //commmonOnloadAction(this);
        //   getGuiClassList();
        //        getJsCodeByProject();
        //        getInputActionRelByProjectMAnual2();
        this.getProjectList();
        genToolbarStatus();
        //        loadLivePrototypeCore(this);


    },
    loadStoryCardByProject4oIpo: function (e) {
        var pid = $(e).val();
        global_var.current_project_id = pid;

        Utility.addParamToUrl('current_project_id', global_var.current_project_id);
        this.BacklogContainer.Init(pid);
        this.ApiContainer.Init(pid);
        this.JsContainer.Init(pid);
        this.BacklogContainer.getBacklogFile(pid);
        this.CssContainer.getGuiClassList();
    },
    getProjectList: function () {
        var cmd = $('select.projectList_liveprototype');
        cmd.html('');

        var f = true;

        var pid = SACore.GetProjectKeys();
        for (var n = 0; n < pid.length; n++) {
            var pname = SACore.GetProjectName(pid[n]);
            var o = $('<option></option')
                    .attr('value', pid[n])
                    .text(pname);
            if (f) {
                o.attr("selected", true);
                f = false;
            }

            if (pid[n] === global_var.current_project_id) {
                o.attr("selected", true);
            }
            cmd.append(o);
        }

        //    cmd.val(global_var.current_project_id);
        sortSelectBoxByElement(cmd);
        cmd.selectpicker('refresh');
        cmd.change();

    },
    ApiContainer: {
        Init: function (fkProjectId) {
            var pid = (fkProjectId) ? fkProjectId : global_var.current_project_id;
            this.getApiList(pid);
        },
        getApiList: function (fkProjectId) {
            var pid = (fkProjectId) ? fkProjectId : global_var.current_project_id;

            var json = initJSON();
            json.kv.fkProjectId = pid;
            json.kv.isApi = '1';
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetBacklogList4Combo",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.genTableApiListSideBar(res, pid);
                    that.genActionReltionComboOrThen(res);
                    that.genRelatedApiCombo(res);
                    that.genRelatedUSApiCombo(res);
                }
            });
        },
        genTableApiListSideBar: function (res, pid) {
            var tbl = $('#api_list_side_bar');
            tbl.html('');

            var obj = res.tbl[0].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (o.isApi === '1') {
                    var td = $('<tr>')
                            .append($('<td>')
                                    .append($('<a>')
                                            .text(o.backlogName)
                                            .attr("href", "#")
                                            .attr("pid", pid)
                                            .attr("bid", o.id)
                                            .attr('is_api', '1')
                                            .attr('onclick', 'callStoryCard("' + o.id + '")')
                                            ))
                    tbl.append(td);
                }

            }
        },
        genActionReltionComboOrThen: function (res) {
            var cls = 'ipo-tab-setting-animation'
            var obj = res.tbl[0].r;
            var select = $('#' + cls).find('select.input_event_related_api');
            var select1 = $('#' + cls).find('select.liveProActionTypeToggleItemIfElseThenApiListClass');

            if (!cls) {
                select = $('#' + cls).find('select.input_event_related_api');
            }

            select.html('');
            select1.html('');


            for (var i in obj) {
                var o = obj[i];
                if (o.isApi === '1') {
                    select.append($('<option>')
                            .val(o.id)
                            .text(o.backlogName));
                    select1.append($('<option>')
                            .val(o.id)
                            .text(o.backlogName));

                }
            }

            sortSelectBoxWithEl(select);
            sortSelectBoxWithEl(select1);
            select.selectpicker('refresh');
            select1.selectpicker('refresh');
        },
        genRelatedApiCombo: function (res) {
            var cmd = $("#addRelatedApiModal-api")
            var obj = res.tbl[0].r;
            cmd.html('');
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (o.isApi === '1') {
                    var pname = o.backlogName;
                    var op = $('<option></option>').attr('value', o.id).text(pname);
                    if (o === global_var.last_select_from_us_id) {
                        op.attr("selected", true);
                    }
                    cmd.append(op);


                }

            }
            sortSelectBoxByElement(cmd);
            cmd.selectpicker('refresh');
        },
        genRelatedUSApiCombo: function (res) {
            var cmd = $("#us-related-apis")
            var obj = res.tbl[0].r;
            cmd.html('');
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (o.isApi === '1') {
                    var pname = o.backlogName;
                    var op = $('<option></option>').attr('value', o.id).text(pname);
                    if (o === global_var.last_select_from_us_id) {
                        op.attr("selected", true);
                    }
                    cmd.append(op);

                }

            }
            sortSelectBoxByElement(cmd);
            $(cmd).prepend($("<option class='text-danger align-items-center'>").attr("data-icon", 'far fa-plus-square ').val('-2').append(('New Api')))

            cmd.selectpicker('refresh');
        }
    },
    BacklogContainer: {
        Init: function (fkProjectId) {
            var pid = (fkProjectId) ? fkProjectId : global_var.current_project_id;
            this.getBacklogList(pid);
        },
        getBacklogFile: function (projectId) {
            /*   $('#kelbetin2').after($('<script>').attr('src', urlGl + 'api/get/script/js/' + global_var.current_domain + "/" + projectId + ''))
             $('#kelbetin').after($('<link>')
             .attr('rel', 'stylesheet')
             .attr('href', urlGl + 'api/get/script/css/' + global_var.current_domain + "/" + projectId + '.css'))
             */
            /*  $.get(urlGl + 'api/get/script/js/' + global_var.current_domain + "/" + projectId + '.js', function (html_string) {
             
             console.log(html_string);
             
             }); */

        },
        getBacklogList: function (fkProjectId) {
            var pid = (fkProjectId) ? fkProjectId : global_var.current_project_id;

            var json = initJSON();
            json.kv.fkProjectId = pid;
            json.kv.isApi = 'NE%1';
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetBacklogList4Combo",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {

                    new UserStory().setUSLists(res);
                    that.GenComboStoryCardList(res)
                    that.GenComboRealtedStoryCardList(res)
                    that.GenComboInSectionStoryCardList(res)



                }
            });
        },
        GenComboRealtedStoryCardList: function (res) {
            var cmd = $(".animation-block-for-find select.us-gui-component-rel-sus-id")
            var obj = res.tbl[0].r;
            cmd.html('');
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (o.isApi !== '1') {
                    var pname = o.backlogName;
                    var op = $('<option></option>').attr('value', o.id).text(pname);
                    if (o.id !== global_var.current_backlog_id) {
                        cmd.append(op);
                    }


                }

            }
            sortSelectBoxByElement(cmd);
            cmd.selectpicker('refresh');
        },
        GenComboInSectionStoryCardList: function (res) {
            var cmd = $(".animation-block-for-find select.us-gui-component-rel-sus-id-section")
            var obj = res.tbl[0].r;
            cmd.html('');
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (o.isApi !== '1') {
                    var pname = o.backlogName;
                    var op = $('<option></option>').attr('value', o.id).text(pname);

                    cmd.append(op);

                }

            }
            sortSelectBoxByElement(cmd);
            cmd.selectpicker('refresh');
        },
        GenComboStoryCardList: function (res) {

            var cmd = $('#storyCardListSelectBox');
            cmd.html('');
            var obj = res.tbl[0].r;
            for (var n = 0; n < obj.length; n++) {
                var o = obj[n];
                if (o.isApi !== '1') {
                    var pname = o.backlogName;
                    var op = $('<option></option>').attr('value', o.id).text(pname);

                    if (o.id === global_var.current_backlog_id) {
                        op.attr("selected", true);
                    }
                    cmd.append(op);
                }
            }


            sortSelectBoxByElement(cmd);
            cmd.val(global_var.current_backlog_id);
            cmd.selectpicker('refresh');
            cmd.change();
        },
    },
    CssContainer: {
        getGuiClassList: function (resid) {
            if (!global_var.current_project_id) {
                return;
            }

            var json = initJSON();
            json.kv.fkProjectId = global_var.current_project_id;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetGuiClassListByProject4Combo",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: false,
                success: function (res) {
                    try {
                        that.getGuiClassListDetails(res, resid);
                        that.getGuiClassListDetails4Container(res, resid);

                    } catch (ee) {
                    }
                }
            });
        },
        getGuiClassListDetails: function (res, resid) {
            var select = $('#gui_prop_in_gui_class_list');
            select.html('');

            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                select.append($('<option>').val(o.id).text(o.className))
            }

            sortSelectBox('gui_prop_in_gui_class_list');

            select.selectpicker();
            select.val(resid);
            select.selectpicker('refresh');

        },
        getGuiClassListDetails4Container: function (res, resid) {

            var select = $('#gui_prop_cn_gui_class_list');

            select.html('');
            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                select.append($('<option>').val(o.id).text(o.className))
            }

            sortSelectBox('gui_prop_cn_gui_class_list');
            select.selectpicker();
            select.val(resid);
            select.selectpicker('refresh');

        },

    },
    JsContainer: {
        Init: function (pid) {

            initZadShey(pid);

        },
    },
    InputContainer: {
        Init: function (params) {

        },
        setRelatedSUS: function (obj) {
            try {
                //            $('#relatedSUSOutputName').text(obj.dependenceInputName);
                var depName = SAInput.GetCurrentDependenceBacklogName();
                var outInputName = (depName.length > 0) ? SAInput.GetCurrentDependenceInputName() : "";
                $('.relatedSUSOutputName').text(outInputName);
                if (depName) {
                    $('.relatedUserStory').html('(<a href="#" onclick="new UserStory().redirectUserStoryCore(\'' +
                            SAInput.GetCurrentDependenceId() + '\')">'
                            + replaceTags(depName) + '</a>)');
                    $('.deleteRelatedSUSOutput').show();
                } else {
                    $('.relatedUserStory').html('');
                    $('.deleteRelatedSUSOutput').hide();

                }
            } catch (e) {
            }
        },
        AddnewInputWithToolbar: function (typ, nm, clNo, id) {
            var iname = $('#us-ipo-inputname').val();
            var json = {
                kv: {}
            };
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }
            json.kv.fkBacklogId = global_var.current_backlog_id;
            json.kv.fkProjectId = global_var.current_project_id;
            json.kv.tableName = $('#us-ipo-inputname-table').val();
            json.kv.inputName = nm;
            json.kv.cellNo = clNo;
            json.kv.orderNo = global_var.input_insert_orderno;
            json.kv.inputType = "IN";
            json.kv.componentType = typ;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmInsertNewInput4Select",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    SAInput.addInputByRes(res);
                    SACore.updateBacklogByRes(res);
                    //                SACore.addInputToBacklog(res.kv.fkBacklogId, res.kv.id);
                    loadCurrentBacklogProdDetails();

                    var el = $("#" + id);
                    var dt = res.kv;
                    el.attr("pid", dt.id);
                    el.attr("onclick", "Prototype.InputContainer.setInputByGUIComponent('" + dt.id + "')");
                    el.find(".tool_element_edit").attr("comp-id", dt.id)
                    el.find(".tool_element_edit").find(".delete-btn-inp").attr("comp-id", "new UserStory().deleteInputFromUSList(this,'" + dt.id + "')")
                    el.find(".component-input-class").attr("pdid", dt.id).attr("id", "comp_id_" + dt.id);
                    el.find(".box-loader").remove();
                    el.attr("id", dt.id);

                    $('#us-ipo-inputname').val('');
                    $('#us-ipo-input-id').val('');
                    $('#us-ipo-inputname').focus();

                    global_var.input_insert_cellno = "";
                    global_var.input_insert_orderno = "";
                    global_var.input_insert_component = "";

                },
                error: function () {
                    Toaster.showError("Input '" + iname + '" isn\'t inserted successfully! ')
                }
            });

            $('#us-ipo-inputname').val('');
            $('#us-ipo-input-id').val('');
            $('#us-ipo-inputname').focus();
        },
        setInputByGUIComponent: function (id) {

            $('.active-inputs-selected').removeClass('active-inputs-selected');

            $('#' + id).addClass("active-inputs-selected"); //selected Component

            $('.us-input-list-item-check-box-class').each(function () {
                if ($(this).is(':checked')) {
                    var id1 = $(this).attr('pid');
                    $('#' + id1).addClass('active-inputs-selected');
                }
            });

            this.showInputDetails(id);
        },
        showInputDetails: function (id) {
            global_var.current_us_input_id = id;
            Utility.addParamToUrl('current_us_input_id', global_var.current_us_input_id);
            //  $('.inputdesc').attr('style', ' pointer-events: block;opacity: 1;')
            // new UserStory().genIPOInputDescList4Select();
            this.setGUIComponentValues4Select();
            this.getInputAttributeList(id);
            this.getInputCompClassList();
            this.getInputActionRelList();
            this.getInputContainerClassListCore();
            this.getInputAttributeList4Container();
            this.setRelatedSUS();
        },
        setGUIComponentValues4Select: function () {
            $('#us-related-sus').val('');
            $('#sus-output-id').val('');
            $('#us-gui-component-id').val('');
            $('.us-gui-component-rel-sus-div-class').attr('style', "display: none;padding:0px 1px;");
            var inputId = global_var.current_us_input_id;
            if (inputId.length === 0) {
                return;
            }

            var res = SAInput.toCurrentInputJSON();
            this.setGUIComponentValues4Selec(res);
        },
        setGUIComponentValues4Selec: function (res) {
            try {
                $('#gui_input_content').val((res.tbl[0].r[0].inputContent)); //Content load
                $('#gui_input_css_style_container').val((res.tbl[0].r[0].param2)); //Load Conatiner Css textarea
                $('#gui_input_css_style').val((res.tbl[0].r[0].param3)); //Load Input Css textarea
                $('#u_userstory_input_id').val((res.tbl[0].r[0].id)); //set id input 
                ComponentDesign.read();
                ContainerDesign.read();
                var val24 = res.tbl[0].r[0].sectionType;
                $('#us-gui-component-id').val(res.tbl[0].r[0].componentType);

                $('.us-gui-component-rel-sus-div-class').show();
                $('select.us-gui-component-rel-sus-id').val(res.tbl[0].r[0].param1);
                $('select.us-gui-component-rel-sus-id').selectpicker('refresh');
                $('.us-gui-component-event').val(res.tbl[0].r[0].inputEvent);
                $('.us-gui-component-action').val(res.tbl[0].r[0].action);
                $('.input_event_type').val(res.tbl[0].r[0].actionType ? res.tbl[0].r[0].actionType : "");

                $('#liveProActionType').val(val24 ? val24 : "");
                $('#liveProSendApiType').val(res.tbl[0].r[0].sendApiType);
                $('.liveProActionTypeAll').hide();

                if (val24 === 'api' || !val24) {
                    $('.liveProActionTypeApi').show();
                } else if (val24 === 'toggle') {
                    $('.liveProActionTypeToggle').show();
                } else if (val24 === 'manual') {
                    $('.liveProActionTypeManual').show();
                } else if (val24 === 'direct') {
                    $('select.input_event_related_api').val(res.tbl[0].r[0].fkDependentBacklogId);
                    $('select.input_event_related_api').selectpicker('refresh');

                    $('.liveProActionTypeDirect').show();
                }
                $('#liveProActionTypeToggleItemIfKey').val(res.tbl[0].r[0].ifKey);
                $('#liveProActionTypeToggleItemIfOperation').val(res.tbl[0].r[0].ifOperation);
                $('#liveProActionTypeToggleItemIfValue').val(res.tbl[0].r[0].ifValue);
                $('#liveProActionTypeToggleItemIfActionOperation').val(res.tbl[0].r[0].thenAction);
                var val22 = res.tbl[0].r[0].thenAction;
                if (val22 === 'callapi') {
                    $('#liveProActionTypeToggleItemIfThenApiList').show();
                    $('#liveProActionTypeToggleItemIfThenClassname').hide();
                } else {
                    $('#liveProActionTypeToggleItemIfThenApiList').hide();
                    $('#liveProActionTypeToggleItemIfThenClassname').show();
                }
                $('#liveProActionTypeToggleItemIfThenClassname').val(res.tbl[0].r[0].thenClassname);
                $('#liveProActionTypeToggleItemIfThenApiList').val(res.tbl[0].r[0].thenApiId);
                $('#liveProActionTypeToggleItemIfElseActionOperation').val(res.tbl[0].r[0].elseAction);
                window.editorEvent.setValue(res.tbl[0].r[0].manualJs)
                //$('#eventActionType4ManualJs').val();

                var val33 = res.tbl[0].r[0].elseAction;
                if (val33 === 'callapi') {
                    $('#liveProActionTypeToggleItemIfElseThenApiList').show();
                    $('#liveProActionTypeToggleItemIfElseThenClassname').hide();
                } else {
                    $('#liveProActionTypeToggleItemIfElseThenApiList').hide();
                    $('#liveProActionTypeToggleItemIfElseThenClassname').show();
                }
                $('#liveProActionTypeToggleItemIfElseThenClassname').val(res.tbl[0].r[0].elseClassname);
                $('#liveProActionTypeToggleItemIfElseThenApiList').val(res.tbl[0].r[0].elseApiId);

                new UserStory().toggleSectionAndRelUS();
                new UserStory().toggleGUIComponentSelection();
                $('#us-gui-component-order-no').val(res.tbl[0].r[0].orderNo);
                $('#us-gui-component-cell-no').val(res.tbl[0].r[0].cellNo);

                var selcl = $('select.us-gui-component-rel-sus-id-section');
                selcl.val(res.tbl[0].r[0].fkBacklogSectionId);
                selcl.selectpicker('refresh');
                selcl.change();

                $('.us-gui-component-in-section').val(res.tbl[0].r[0].section);
            } catch (err) {
            }
        },
        getInputAttributeList: function (inputId) {
            if (!inputId) {
                return;
            }

            var json = {
                kv: {}
            };
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkInputId = inputId;
            json.kv.attrType = "comp";

            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetInputAttributeList",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.genInputAttrList(res);
                }
            });
        },
        getInputActionRelList: function () {
            if (!global_var.current_project_id)
                return;

            var json = initJSON();
            json.kv.fkInputId = global_var.current_us_input_id;
            var that = this;
            var data = JSON.stringify(json);

            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetInputActionRelList",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    var body = $('.input_event_related_api_table_list_body');
                    body.html('');

                    try {
                        var obj = res.tbl[0].r;
                        for (var i in obj) {
                            var o = obj[i];
                            var tr = $('<tr>')
                                    .append($('<td>').text(o.actionType))
                                    .append($('<td>')
                                            .append($('<a>')
                                                    .attr('href', '#')
                                                    .attr("bid", o.fkApiId)
                                                    .attr('pid', global_var.current_project_id)
                                                    .attr('onclick', "showBacklogHistoryClick(this)")
                                                    .text(SACore.GetBacklogname(o.fkApiId))))
                                    .append($('<td>').append($("<i>")
                                            .addClass('fa fa-trash')
                                            .attr('onclick', "deleteInputActionRel('" + o.id + "')")))
                            body.append(tr);
                        }
                    } catch (err) {
                    }
                }
            });
        },
        getInputCompClassList: function () {
            var inputId = global_var.current_us_input_id;
            if (!inputId) {
                return
            }
            ;
            var json = initJSON();
            json.kv.fkInputId = inputId;
            json.kv.relType = "comp";
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetInputCompClassList",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.genInputClassListTable(res);
                }
            });
        },
        genInputClassListTable: function (res) {
            var table = $('.input_class_list_in_component');
            table.html('');
            try {
                var obj = res.tbl[0].r;
                for (var i = 0; i < obj.length; i++) {
                    var o = obj[i];
                    var tr = $("<tr>")
                            .append($('<td>')
                                    .append($('<a>')
                                            .attr("href", "#")
                                            .attr("onclick", "showClassDetails('" + o.fkClassId + "')")
                                            .attr("title", o.classBody)
                                            .text(o.className)
                                            .append((o.classBody) ? $('<span>')
                                                    .css("color", "red")
                                                    .text("*") : ""))
                                    )
                            .append($('<td>').append($('<i>')
                                    .css("cursor", "pointer")
                                    .attr('onclick', 'removeInputClassRel(this,"' + o.id + '")')
                                    .addClass("fa fa-trash")));

                    table.append(tr);
                }
            } catch (err) {

            }
        },
        genInputAttrList: function (res) {
            var table = $('.input_attributes_list_in_component');
            table.html('');

            try {
                var obj = res.tbl[0].r;
                for (var i = 0; i < obj.length; i++) {
                    var o = obj[i];
                    var temsp = o.attrValue.split(",");
                    var tr = $("<tr>").attr('onclick', 'setInputAttributesReverse4Component(this)')
                            .attr('data-rmv-id', o.id);

                    tr.append($('<td>').addClass('attr-name').text(o.attrName));
                    var td = $('<td>').addClass('attr-value');
                    for (var c = 0; c < temsp.length; c++) {

                        td.append($('<span>')
                                .addClass('cstm_spn_attr')
                                .attr('data-rmvc', '0')
                                .text(temsp[c])
                                .append('<i  class="removeAttrSingle fas fa-times"></i>'));
                    }
                    tr.append(td);
                    tr.append($('<td>').append($('<i>')
                            .css("cursor", "pointer")
                            .attr('onclick', 'removeInputAttribute(this,"' + o.id + '")')
                            .addClass("fa fa-trash attr_rmv_sabtn")));
                    table.append(tr);

                }
            } catch (err) {
            }
        },
        getInputContainerClassListCore: function () {
            var inputId = global_var.current_us_input_id;
            if (!inputId)
                return;
            var json = initJSON();
            json.kv.fkInputId = inputId;
            json.kv.relType = "cont";
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetInputCompClassList",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.getInputContainerClassListCoreDetailes(res);
                }
            });
        },
        getInputContainerClassListCoreDetailes: function (res) {
            var table = $('#input_class_list_cn_component');
            table.html('');
            try {
                var obj = res.tbl[0].r;
                for (var i = 0; i < obj.length; i++) {
                    var o = obj[i];
                    var tr = $("<tr>")
                            .append($('<td>')
                                    .append($('<a>')
                                            .attr("href", "#")
                                            .attr("onclick", "showClassDetails('" + o.fkClassId + "')")
                                            .attr("title", o.classBody)
                                            .text(o.className)))
                            .append($('<td>').append($('<i>')
                                    .css("cursor", "pointer")
                                    .attr('onclick', 'removeInputClassRel(this,"' + o.id + '")')
                                    .addClass("fa fa-trash")));

                    table.append(tr);
                }
            } catch (err) {

            }
        },
        getInputAttributeList4Container: function () {
            var inputId = global_var.current_us_input_id;
            if (!inputId) {
                return;
            }

            var json = {
                kv: {}
            };
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }

            json.kv.fkInputId = inputId;
            json.kv.attrType = "cont";

            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmGetInputAttributeList",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    that.getInputAttributeListDetails4Container(res);
                }
            });
        },
        getInputAttributeListDetails4Container: function (res) {
            var table = $('#input_attributes_list_cn_component');
            table.html('');
            try {
                var obj = res.tbl[0].r;
                for (var i = 0; i < obj.length; i++) {
                    var o = obj[i];
                    var tr = $("<tr>")
                            .append($('<td>').text(o.attrName))
                            .append($('<td>').text(o.attrValue))
                            .append($('<td>').append($('<i>')
                                    .css("cursor", "pointer")
                                    .attr('onclick', 'removeInputAttribute(this,"' + o.id + '")')
                                    .addClass("fa fa-trash")));

                    table.append(tr);
                }
            } catch (err) {

            }
        },
        inputDelete: function (id) {
            if (!confirm("Are you sure?")) {
                return;
            }

            this.inputDeleteCore()
        },
        inputDeleteCore: function (id) {
            if (!confirm("Are you sure?")) {
                return;
            }
            if (!id) {
                return;
            }

            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }
            json.kv.id = id;
            json.kv.fkBacklogId = global_var.current_backlog_id;

            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmDeleteInput",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: false,
                success: function (res) {
                    try {
                        SAInput.addInputTableByRes(res);
                    } catch (err) {
                        console.log(err)
                    }
                    SAInput.deleteInput(id);
                    SACore.updateBacklogByRes(res);

                    var st = that.getHtmlGenIPOInputList(res);
                    $('#tblIPOList > tbody').html(st);
                    highlightTheSameSelectedFieldsInInputList();

                    that.addSourcedIconToUserStory(res);

                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
        }

    },

}


// Add new Input with toolbar 

$(document).keydown(function (event) {
    if (event.which == "17")
        cntrlIsPressed = true;
});

var cntrlIsPressed = false;



var idggdd = 4868347683787384609;

$(document).on("mouseenter", "#SUS_IPO_GUI_Design >.hover-prototype-selector", function () {
    var trg = $(this).find(".tool_element_edit").first();

    var id = $(this).attr("id");
    var cellNo = $(this).attr("cellNo");
    var orderNo = $(this).attr("orderno");
    var select = $("<select>").addClass('light-selectbox-custom')
            .attr("id", "gui-cell-selectbox-changed")
            .append('<option  value="1">1</option>')
            .append('<option  value="2">2</option>')
            .append('<option  value="3">3</option>')
            .append('<option  value="4">4</option>')
            .append('<option  value="5">5</option>')
            .append('<option  value="6">6</option>')
            .append('<option  value="7">7</option>')
            .append('<option  value="8">8</option>')
            .append('<option  value="9">9</option>')
            .append('<option  value="10">10</option>')
            .append('<option  value="11">11</option>')
            .append('<option  value="12">12</option>')
    select.val(cellNo);
    var html = $("<div>").addClass("tool_element_edit").attr("comp-Id", id)
            .append('<span class="figureAddbtn component-container-button" ><i class="fas fa-bars"></i></span>')
            .append('<span class="figureAddbtn component-develop-button" ><i class="fas fa-code"></i></span>')
            .append('<span class="figureAddbtn component-class-button" ><i class="far fa-plus-square"></i></span>')
            .append($("<input>")
                    .css("max-width", '25px')
                    .addClass("light-selectbox-custom mw-5")
                    .attr("id", 'change-orderno-input-short')
                    .val(orderNo))
            .append(select)
            .append($("<span>").attr("onclick", 'new UserStory().deleteInputFromUSList(this,"' + id + '")').addClass("figureAddbtn delete-btn-inp").css("color", "red").append("<i class='fas fa-trash-alt'></i>"))
    if (trg.length > 0) {
        trg.find('#gui-cell-selectbox-changed').val(cellNo);

    } else {
        $(this).append(html);
    }


})
$(document).on("click", ".cf li .inptadd", function () {


    if (cntrlIsPressed === false) {
        idggdd++
        let valin = $(this).parent().attr('value');
        let nm = $(this).parent().attr('title');

        var comp = new ComponentInfo();

        comp.id = idggdd;
        comp.inputType = "IN";
        comp.cellNo = "6";
        comp.componentType = valin;
        comp.label = nm;
        comp.description = "";

        var st = Component.GetComponentHtmlNew(comp);
        var ldoa = `<div class="box-loader shimmer"></div>`

        $("#SUS_IPO_GUI_Design .empty-message-block").remove();
        $("#SUS_IPO_GUI_Design").append(st);
        $("#" + idggdd).append(ldoa);
        Prototype.InputContainer.AddnewInputWithToolbar(valin, nm, "6", idggdd);


    } else {
        let valin = $(this).parent().attr('value');



        addInputAsInput();


        setTimeout(function () {
            $('#addNewComponentModal').find('#exampleModal-new-input-name').focus();

        }, 700);
        $('#addNewComponentModal').find('#exampleModal-new-component-type').val(valin);
    }
    $('.component-class').arrangeable({
        dragSelector: '.drag-areas-comp'
    });

})

$(document).on('dblclick', '.component-class', function (evt) {
    if (!$('#ipo-tab-setting-input-description-general').hasClass('active')) {
        $('#ipo-tab-setting-input-description-general').click();
    }

});
$(document).on('click', '.component-class', function (evt) {
    if (global_var.current_modal !== 'loadLivePrototype') {
        return;
    }
    openComponentPropertiesModal(this);


});
$(document).on("click", ".component-container-button", function () {
    clearBtnClickTool();
    $('#ipo-tab-setting-input-description-general').click();

})
$(document).on("click", ".component-class-button", function () {
    clearBtnClickTool();
    $('#currentAll-btn-icon a').click();

})
$(document).on("click", ".component-develop-button", function () {
    clearBtnClickTool();
    $('#dragCheckbox a').click();

})

function openComponentPropertiesModal(el) {
    if (global_var.current_modal !== 'loadLivePrototype') {
        return;
    }
    var id = $(el).attr('id')
    var tbid = $(el).closest(".component-container-dashed").attr("id");
    $('#exampleModal-input-componentid').val('comp_id_' + (id !== undefined ? id : tbid));

    $('#exampleModal-input-name').val(SAInput.GetInputName(global_var.current_us_input_id));
    $('#exampleModal-input-name').attr("pid", global_var.current_us_input_id);

}
$(document).on("keyup", "#search-function-gui-modal-js", function () {

    searchFilterTable(this, "jsCodeModal_fnlist")

})
function clearBtnClickTool() {
    ch = 0,
            ch2 = 0,
            ch3 = 0,
            ch4 = 0,
            ch5 = 0,
            ch6 = 0;
    ch7 = 0;
    ch8 = 0;
}
$(document).on("click", "#add-new-apidirect-relation-add", function () {

    addApiModal();
    $("#addApiPopupModal-userstoryname").attr("data-trig-rel", 'true');

})

$(document).on("click", "#add-new-apidirect-relation-show", function () {
    var id = $('select.input_event_related_api').val();
    callStoryCard(id);

})



$(document).on("change", "#change-orderno-input-short", function () {

    new UserStory().setGUIComponentOrderNo(this)

})


function manualCodeListGenBAcklog(id) {
    getBacklogJSBodyById(id);
    getBacklogCSSBodyById(id);
}

function getBacklogJSBodyById(bid) {

    var pid = bid ? bid : global_var.current_backlog_id;

    var json = initJSON();
    json.kv.fkBacklogId = pid;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetBacklogJsCode",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            console.log(res.tbl[0].r[0].fnBody);
            window.editorJSnew.setValue(res.tbl[0].r[0].fnBody)
            insertJSmanualBybacklogId(res.tbl[0].r[0].fnBody);
        

        }
    });
}
function getBacklogCSSBodyById(bid) {
    var pid = bid ? bid : global_var.current_backlog_id;

    var json = initJSON();
    json.kv.fkBacklogId = pid;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetBacklogCssCode",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            window.editorCSSnew.setValue(res.tbl[0].r[0].classBody);
                    
            insertCssmanualBybacklogId(res.tbl[0].r[0].classBody);
            
        }
    });
}
