var currentClickedServiceGroupId4Update = "";
var currentClickedService4Process = "";
var currentClickedServiceGroupId = "";
var currentClickedServiceId = "";
var currentClickedServiceProcessId = "";

// Tree View PopUp


$(document).on("change", '#addStoryCard4ProcessModal_storycard', function (e) {
    if ($(this).val() === '-2') {
        $('.create-new-storycard-4-process').show();
    } else {
        $('.create-new-storycard-4-process').hide();
    }
})



$(document).on("click", '.story-card-level', function (e) {
    var projectId = $(this).attr('projectId');
    var backlogId = $(this).attr('backlogId');

    $('#service-main-business-case-main').removeClass('d-flex');
    var name = $(this).find('.thridName').html();
    $('#base-service-title-name').html(name)

    callStoryCard4Service(projectId, backlogId)
})


function callStoryCard4Service(projectId, backlogId, backlogName) {
    var divId = "business_service_main_div_body";
    showProgressAlternative();

    $.get("resource/child/storycard.html", function (html_string)
    {
        if (!projectId || !backlogId || backlogId === '-1') {
            return;
        }

        global_var.current_backlog_id = backlogId;
        $('#smb-details-generalview-us-story-mgmt').html(html_string); // this is not Working
        $("#" + divId).html(html_string);
        $('.header-userName').hide();

        global_var.current_project_id = projectId;
        new UserStory().refreshBacklog4Bug();

        new UserStory().toggleSubmenuStoryCard();
        loadUsersAsOwner();
        setStoryCardOwner();
         setStoryCardCreatedBy();
        hideProgressAlternative();

    });
}

$(document).on("click", '.businessIcon', function (e) {
    var id = $(this).attr('pid');
    loadStoryCardsByProcess(id)
})


$(document).on("click", '.arrow-tree', function (e) {
    $('.treePopup').toggle(function () {
        $(this).css({"visibility": "visible"});
    })

})
$(document).on("click", '.treePopup', function (e) {
    $('.treePopup').css('visibility', 'hidden')
})

$(document).on("click", '.liSelect', function (e) {
    $(this).toggleClass("li_selected")
})

$(document).on("click", '.liSelectNew', function (e) {
    $(this).closest('li').find('ul.collapse').toggle(500);
})


$(document).on("click", '.secondName', function (e) {
    var pid = $(this).attr('pid');

    $('#service-main-business-case-main').removeClass('d-flex');
    $('#business_service_main_div_body').html(getProcessDiv(pid));
    new FroalaEditor('textarea#proess-body-main-id');

    currentClickedServiceProcessId = $(this).attr('pid');
//    getCaseListByService();
    var name = $(this).html();
    $('#base-service-title-name').html(name)

    getServiceProcessBody(pid);
})

function getProcessDiv(procId) {
    var body = $('<div>')
            .append($('<div class="col-12 text-right">')
                    .css("padding", "10px 10px")
                    .append($('<button>')
                            .attr("pid", procId)
                            .attr('id', "proc_body_save")
                            .addClass("btn btn-primary")
                            .attr("onclick", "addServiceProcessBody(this)")
                            .append("Save")))
            .append($('<textarea>')
                    .attr("id", "proess-body-main-id")
                    .addClass("process-body-froala"));
    return body;
}

$(document).on("click", '.main-service-section-div', function (e) {
    $('#business_service_main_div_body').html(getEmptyMessage4ServiceBody());
    currentClickedServiceId = $(this).attr('pid');
    getCaseListByService();
    var name = $(this).html();
    $('#base-service-title-name').html(name)
    $('#service-main-business-case-main').addClass('d-flex');


});

// Business Select box

function BusinessSelectFn() {
    $('.businessCardPopup').toggle()
}
function DiagramSelectFn() {
    $('.diagramPopup').toggle()
}
function DiagramCardSelectFn() {
    $('.diagramCardPopup').toggle()
}



// ADD SERVICE NAME MODAL
function ServiceNameAdd() {

    var newServ = $('#addServiceName');
    var s = $('<table>').addClass('table').addClass('serviceDropListStyle')
            .append($('<tr>')
                    .append($('<td>').append($('<input>').attr('type', 'checkbox')))
                    .append($('<td colspan=4 >').append('Servive 1'))
                    .append($('<td>').append($('<i>').addClass('fa fa-edit')))
                    .append($('<td>').append($('<i>').addClass('fa fa-trash'))))

    newServ.append(s);

}




// Exercutive Summary select
//$(document).on("click", '#baudrate li a', function (e) {
//    baudrate = $(this).parent().find('input').val();
//    document.getElementById('exercutiveInsertDiv').innerHTML = baudrate;
//
//});

$(document).on("click", '.bcase-list-for-service', function (e) {
    baudrate = $(this).parent().find('input').val();
    var pid = $(this).attr('pid');
    $('#exercutiveInsertDiv').html(baudrate);
    setBCBody(pid, baudrate);
});

function setBCBody(id, caseName) {
    loadBusinessCaseBodyFull(id, caseName);

//    var body = $('#business_service_main_div_body');
//    body.html("kelbetin")
}



function loadBusinessCaseBodyFull(id, caseName) {
    activeBCId = id;
    var f = 'bcase';
    $.get("resource/child/" + f + ".html", function (html_string)
    {
        $('#business_service_main_div_body').html(html_string);
//        getNewExecutiveTable();
        loadMainBusinesCaseBody(caseName);
        $('.external-hidden-part').hide();
        $('.ExecutiveSummaryBodyStyle').removeClass('col-9').addClass('col-12')
    });
}




//var id = Math.floor(Math.random() * 9999999);




function addServiceProcessAndBacklogAction(el) {
    var fkServiceProcessId = currentClickedServiceProcessId;
    var fkProjectId = $('#addStoryCard4ProcessModal_project').val();
    var fkBacklogId = $('#addStoryCard4ProcessModal_storycard').val()


    if (!fkServiceProcessId || !fkProjectId || !fkBacklogId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkServiceProcessId = fkServiceProcessId;
    json.kv.fkProjectId = fkProjectId;
    json.kv.fkBacklogId = fkBacklogId;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewServiceProcessAndBacklog",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $('#addStoryCard4ProcessModal').modal('hide')
            loadStoryCardsByProcess(fkServiceProcessId);
        }
    });

}


function loadStoryCardsByProcess(fkServiceProcessId) {

    if (!fkServiceProcessId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkServiceProcessId = fkServiceProcessId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetServiceProcessAndBacklogList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var sub_12 = $('#businessUl' + fkServiceProcessId);
            sub_12.html('')
            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                var name = replaceTags(o.backlogName) + " (" + replaceTags(o.projectName) + ")";
                addStoryCardDiv2ProcessTree(fkServiceProcessId, name, o.id, o.fkProjectId, o.fkBacklogId)
            }
        }
    });

}

function addServiceProcessBody(el) {
    var srvId = $(el).attr('pid');
    var body = $('#business_service_main_div_body').find('.fr-element').html();

    if (!srvId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = srvId;
    json.kv.processBody = body;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddServiceProcessBody",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            Toaster.showMessage("Process Description Saved!");
        }
    });

}


function getServiceProcessBody(processId) {

    if (!processId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = processId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetServiceProcessBody",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            new FroalaEditor('textarea#proess-body-main-id');
            $('#business_service_main_div_body').find('.fr-element').html(res.kv.processBody);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getCaseListByService(el) {
    var srvId = currentClickedServiceId;


    if (!srvId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkServiceId = srvId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseListByService",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var ul = $('#baudrate');
            ul.html('');
            $('#exercutiveInsertDiv').html('');

            try {
                var obj = res.tbl[0].r;
                for (var i = 0; i < obj.length; i++) {
                    var o = obj[i];
                    ul.append($('<li>')
                            .append($('<input type="hidden">').val(replaceTags(o.caseName)))
                            .append($('<a href="#">')
                                    .attr("pid", o.id)
                                    .css("margin", "5px 10px;")
                                    .addClass('bcase-list-for-service').html(replaceTags(o.caseName))))
                }
            } catch (err) {
            }

            ul.append($('<li>').append("<hr>"))
            ul.append($('<li>')
                    .css('padding-bottom', "10px")
                    .append($('<a href="#">').attr('onclick', "addNewBusinessCase4Service(this)").html("+ Add New Business Case")))

            $('.bcase-list-for-service').first().click();
        }
    });
}

function addNewBusinessCase4Service(el) {
    $('#addBusinessCase4ServiceModal').modal('show');
}

function addBusinessCase4ServiceAction() {
    var caseName = $('#addBusinessCase4ServiceModal_casename').val();
    if (!(caseName))
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.caseName = caseName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBusinessCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            $('#addBusinessCase4ServiceModal_casename').val('')
            $('#addBusinessCase4ServiceModal').modal('hide');
            addBusinessServiceRel4Service(res.kv.id);
        }
    });
    $('#addBusinessCase4ServiceModal_casename').val('')
}


function addBusinessServiceRel4Service(activeBCId) {
    var serviceId = currentClickedServiceId;
    var groupId = currentClickedServiceGroupId;

    if (!activeBCId || !serviceId || serviceId === '-2' || !groupId || groupId === '-2')
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = activeBCId;
    json.kv.fkServiceId = serviceId;
    json.kv.fkServiceGroupId = groupId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddBcServiceRelation",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getCaseListByService();
        }
    });
}

function updateServiceProcessName(el, id) {
    var val = $(el).val();
    var elId = $(el).parent().attr("pid");

    if (!val || !elId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = elId;
    json.kv.processName = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateServiceProcessName",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $(el).parent().html(val);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function updateBusinessService(el) {
    var srvGroupId = currentClickedServiceGroupId;
    var val = $(el).val();
    var elId = $(el).parent().attr("pid");

    if (!srvGroupId || !val || !elId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = elId;
    json.kv.fkServiceGroupId = srvGroupId;
    json.kv.serviceName = val;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseService",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            $(el).parent().html(val);

        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function deleteBusinessService(elId) {
    if (!elId) {
        return;
    }

    if (!confirm("Are you sure?")) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = elId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCaseService",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadBCService4BS();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function loadBCService4BS() {
    var srvGroupId = currentClickedServiceGroupId;

    if (!srvGroupId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkServiceGroupId = srvGroupId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseServiceList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadBCService4BSDetails(res);
            loadBCService4BSDetails4Process(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function loadBCService4BSDetails4Process(res) {
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        if (o.processId.length > 3) {
            var ids = o.processId.split(',');
            var names = o.processName.split(',');
            var storyCardCount = o.storyCardCount.split(',');
            for (var j in ids) {
                var idMain = ids[j].trim();
                addServiceProcess(o.id, names[j], idMain, storyCardCount[j]);
            }
        }
    }
}

function loadBCService4BSDetails(res) {
    var sub_1 = $('#sub');
    sub_1.html(getEmptyMessage4ServiceList());

    var div = $('<div class="easy-tree">');
    var ul = $('<ul id="sub_old_1">');


    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];

        var processCount = "";
        try {
            if (o.processId.length > 0 && o.processId.split(',').length > 0) {
                processCount = ' <span style="font-size:9px;background-color:gray;color:white;padding:1px 3px;border-radius:45px;">'
                        + o.processId.split(',').length + "</span>";
            }
        } catch (err) {
        }


        var s = $('<li>')
                .attr('pid', o.id)
                .addClass('liSelect')
                .append($('<span>')
                        .addClass('mainSubmenuDiv')
                        .css("cursor", "pointer")
                        .append($('<span>').addClass('firstSpanMain')
                                .append($('<span>').addClass('generalIcon')

                                        .attr('data-toggle', 'collapse')
                                        .attr('href', '#sub2' + o.id).attr('aria-hidden', 'true'))
                                .append($('<p>')
                                        .addClass('main-service-section-div')
                                        .addClass('firstName')
                                        .attr("pid", o.id)
                                        .append(replaceTags(o.serviceName))
                                        .append(processCount)
                                        .dblclick(function () {
                                            if ($(this).html().includes('updateBusinessService')) {
                                                return;
                                            }
                                            var inp = $('<input type="text">')
                                                    .css("width", "90%")
                                                    .css('border', 'none')
                                                    .attr('class', 'focus-hover')
                                                    .attr("onchange", "updateBusinessService(this,'" + o.id + "')")
                                                    .val($(this).html());

                                            $(this).html(inp);
                                        })
                                        )
                                .append($('<div>').addClass('menuSub')
                                        .append($('<input>').attr('type', 'checkbox')
                                                .addClass('menu-openSub').addClass('menu-openSub')
                                                .attr('id', 'menu-openSub' + o.id))
                                        .append($('<label>').addClass('menu-open-buttonSub').attr('for', 'menu-openSub' + o.id)
                                                .append($('<span>').addClass('hamburgerSub hamburger-1Sub'))
                                                .append($('<span>').addClass('hamburgerSub hamburger-2Sub'))
                                                .append($('<span>').addClass('hamburgerSub hamburger-3Sub')))

                                        .append($('<a>').addClass('menu-itemSub').append($('<i>')
                                                .attr('title', 'Business Prosess')
                                                .addClass('fa fa-briefcase'))
                                                .attr('onclick', 'SubMenu_Business("' + o.id + '")'))
//                                .append($('<a>').addClass('menu-itemSub')
//                                        .append($('<i>').attr('title', 'Exercutive Summary')
//                                                .addClass('fa fa-usd'))
//                                        .attr('onclick', 'SubMenu_diagram()'))
                                        .append($('<a>').addClass('menu-itemSub')
                                                .append($('<i>')
                                                        .attr("onclick", "deleteBusinessService('" + o.id + "')")
                                                        .attr('title', 'Remove')
                                                        .addClass('fa fa-trash-o')))
                                        )
                                ))
                .append($('<ul>').attr('id', 'sub2' + o.id).addClass('in collapse'));
        ul.append(s);
    }

    div.append(ul);
    sub_1.html(div);
    $('.main-service-section-div').first().click();

}


function SubMenu_Business(serviceId) {
    $('#addServiceProcessModal').modal('show');
    currentClickedService4Process = serviceId;
}

function addServiceProcessAction() {
    var processName = $('#addServiceProcessModal_processname').val();
    var serviceId = currentClickedService4Process;
    var groupId = currentClickedServiceGroupId;

    if ((processName.trim().length === 0) || !groupId || !serviceId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.processName = processName;
    json.kv.fkServiceGroupId = groupId;
    json.kv.fkServiceId = serviceId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewServiceProcess",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
//            loadBCService();
//            $('#serviceModal_service').val(res.kv.id);
            getServiceProcessList(serviceId);
            $('#addServiceProcessModal').modal('hide');
            $('#addServiceProcessModal_processname').val('');

        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getServiceProcessList(serviceId) {

    if (!serviceId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkServiceId = serviceId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetServiceProcessList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            getServiceProcessListDetails(res);

        }
    });
}

function  getServiceProcessListDetails(res) {


    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        $('#sub2' + o.fkServiceId).html('');
    }


    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        addServiceProcess(o.fkServiceId, o.processName, o.id);
    }
}


function addServiceProcess(serviceId, processName, procId, storyCardCount) {
    var count = "";
    try {
        if ((storyCardCount) && parseInt(storyCardCount) > 0) {
            count = ' <span style="font-size:9px;background-color:#f19a91;color:white;padding:1px 3px;border-radius:45px;">'
                    + storyCardCount + "</span>";
        }
    } catch (err) {
    }

    $('.liSelect')
            .addClass('parent_li')
            ;

    var sub_11 = $('#sub2' + serviceId);
    var s1 = $('<li>').addClass('liSelect2')
            .addClass("liSelectNew1")
            .css("cursor", "pointer")
            .append($('<span>')
                    .addClass('firstSpan')
                    .append($('<span>')
                            .attr("pid", procId)
                            .addClass('businessIcon')
                            .addClass('liSelectNew')
                            .attr('aria-hidden', 'true'))
                    .append($('<p>').addClass('secondName')
                            .css("cursor", "pointer")
                            .attr('id', 'editName_a' + procId)
                            .append(replaceTags(processName))
                            .append(count)
                            .attr("pid", procId)
                            .dblclick(function () {
                                if ($(this).html().includes('updateServiceProcessName')) {
                                    return;
                                }
                                var inp = $('<input type="text">')
                                        .css("width", "90%")
                                        .css('border', 'none')
                                        .attr('class', 'focus-hover')
                                        .attr("onchange", "updateServiceProcessName(this,'" + procId + "')")
                                        .val($(this).html());

                                $(this).html(inp);
                            })
//                    .attr('ondblclick', 'new UserStory().username_editable(this,event)')
                            )

                    .append($('<div>').addClass('menuSub')
                            .append($('<input>')
                                    .attr('type', 'checkbox')
                                    .addClass('menu-openSub')
                                    .addClass('menu-openSub')
                                    .attr('id', 'menu-openSub_a' + procId))
                            .append($('<label>')
                                    .addClass('menu-open-buttonSub')
                                    .attr('for', 'menu-openSub_a' + procId)
                                    .append($('<span>').addClass('hamburgerSub hamburger-1Sub'))
                                    .append($('<span>').addClass('hamburgerSub hamburger-2Sub'))
                                    .append($('<span>').addClass('hamburgerSub hamburger-3Sub')))

                            .append($('<a>')

                                    .addClass('menu-itemSub')
                                    .append($('<i>')
                                            .attr('title', 'User Story')
                                            .addClass('fa fa-user')
                                            .attr('onclick', 'SubMenuStoryCardsBusiness("' + procId + '")')))
//                    .append($('<a>')
//                            .addClass('menu-itemSub')
//                            .append($('<i>')
//                                    .attr('title', 'Edit')
//                                    .addClass('fa fa-pencil-square-o'))
//                            .attr('onclick', 'editUserStoryName(this)'))
                            .append($('<a>')
                                    .attr('onclick', 'deleteServiceProcess("' + serviceId + '","' + procId + '")')
                                    .addClass('menu-itemSub')
                                    .append($('<i>')
                                            .attr('title', 'Remove')
                                            .addClass('fa fa-trash-o')))
                            ))


            .append($('<ul>').attr('id', 'businessUl' + procId).addClass('in collapse'))
    sub_11.append(s1);
}

function deleteServiceProcess(serviceId, procId) {
    if (!confirm("Are you sure?")) {
        return;
    }

    if (!procId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = procId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteServiceProcess",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            getServiceProcessList(serviceId);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function SubMenuStoryCardsBusiness(procId) {
    currentClickedServiceProcessId = procId;
    $('#addStoryCard4ProcessModal').modal('show');
    loadProjects4Process();
}


function loadProjects4Process() {
    var select = $('#addStoryCard4ProcessModal_project');
    var keys = Object.keys(SACore.Project);
    select.append($("<option>")
            .val("")
            .text(" "))
    for (var id in keys) {
        var pid = keys[id];
        select.append($("<option>")
                .val(pid)
                .text(SACore.Project[pid]))
    }
}

function addNewStoryCard4Process() {
    var val = $('#addStoryCard4ProcessModal_storycardnew').val();
    var projectId = $('#addStoryCard4ProcessModal_project').val();
    if (!val || !projectId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv['backlogName'] = val;
    json.kv['fkProjectId'] = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogShort",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            SACore.addBacklogByRes(res);
            SACore.SetBacklogNo(res.kv.backlogNo, res.kv.id);
            $('#addStoryCard4ProcessModal_project').change();
            $('#addStoryCard4ProcessModal_storycard').val(res.kv.id)
            $('#addStoryCard4ProcessModal_storycardnew').val('');
        },
        error: function () {
            Toaster.showGeneralError();
        }
    });
}

function loadStoryCardByProject4Service(el) {
    $('#addStoryCard4ProcessModal_storycard').html('')
    var projectId = $(el).val();
    if (!projectId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = projectId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmLoadStoryCardByProject",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadStoryCardByProject4ServiceDetails(res);

        }
    });
}


function loadStoryCardByProject4ServiceDetails(res) {
    try {
        var el = $('#addStoryCard4ProcessModal_storycard');
        el.html('');
        el.append($('<option>').val('').text(''));
        el.append($('<option>').val('-2').text("New"));
        el.append($('<option disabled>').val('').text(''));
        var obj = res.tbl[0].r;
        for (var i in obj) {
            var o = obj[i];
            el.append($('<option>')
                    .val(o.id)
                    .text(o.backlogName));
        }
        el.change();
    } catch (err) {

    }

}

function addStoryCardDiv2ProcessTree(procId, storyCardName, relId, projectId, backlogId) {
    var sub_12 = $('#businessUl' + procId);
    var s2 = $('<li>').addClass('liSelect2')
            .attr("projectId", projectId)
            .attr("backlogId", backlogId)
            .addClass("story-card-level")
            .append($('<span>').addClass('firstSpan')
                    .append($('<span>').addClass('userIcon').attr('aria-hidden', 'true'))
                    .append($('<span>').addClass('sr-only').append('collapse'))
                    .append($('<p>')
//                    .attr('onclick', 'BusinessSelectFn()')
                            .addClass('thridName')
                            .append(replaceTags(storyCardName)))

                    .append($('<div>').addClass('businessCardPopup')
                            .append($('<input>').addClass('form-control input-select-style'))
                            .append($('<button>').addClass('btn btn-light').append('Add').addClass('treeNameAdd'))
                            .append($('<select>').addClass('form-control treeSelect')
                                    .append($('<option>').append('first'))
                                    .append($('<option>').append('second'))
                                    .append($('<option>').append('thrid'))

                                    ))

                    .append($('<div>').addClass('menuSub')
                            .append($('<input>')
                                    .attr('type', 'checkbox')
                                    .addClass('menu-openSub')
                                    .addClass('menu-openSub')
                                    .attr('id', 'menu-openSub_c' + relId))
                            .append($('<label>')
                                    .addClass('menu-open-buttonSub')
                                    .attr('for', 'menu-openSub_c' + relId)
                                    .append($('<span>')
                                            .addClass('hamburgerSub hamburger-1Sub'))
                                    .append($('<span>')
                                            .addClass('hamburgerSub hamburger-2Sub'))
                                    .append($('<span>')
                                            .addClass('hamburgerSub hamburger-3Sub')))
                            .append($('<a>')
                                    .attr("onclick", "deleteProcessAndStoryCard('" + procId + "','" + relId + "')")
                                    .addClass('menu-itemSub')
                                    .append($('<i>')
                                            .attr('title', 'Remove')
                                            .addClass('fa fa-trash-o')))
                            )
                    )
    sub_12.append(s2);
}

function deleteProcessAndStoryCard(procId, relId) {
    if (!confirm("Are you sure?")) {
        return;
    }

    if (!relId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = relId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteServiceProcessAndBacklog",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadStoryCardsByProcess(procId);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function SubMenu_diagram() {

    $('.liSelect').addClass('parent_li');

    var sub_12 = $('#sub2' + id);
    var s2 = $('<li>')
            .addClass('liSelect2')
            .addClass("liSelectNew")
            .append($('<span>').addClass('firstSpan')
                    .append($('<span>').addClass('diagramIcon').attr('aria-hidden', 'true'))

                    .append($('<p>').addClass('secondName').append('Activity Diagram').attr('onclick', 'DiagramSelectFn()'))

                    .append($('<div>').addClass('diagramPopup')
                            .append($('<input>').addClass('form-control input-select-style'))
                            .append($('<button>').addClass('btn btn-light').append('Add').addClass('treeNameAdd'))
                            .append($('<select>').addClass('form-control treeSelect')
                                    .append($('<option>').append('first'))
                                    .append($('<option>').append('second'))
                                    .append($('<option>').append('thrid'))

                                    ))


                    .append($('<div>').addClass('menuSub')
                            .append($('<input>').attr('type', 'checkbox').addClass('menu-openSub').addClass('menu-openSub').attr('id', 'menu-openSub_b' + id))
                            .append($('<label>').addClass('menu-open-buttonSub').attr('for', 'menu-openSub_b' + id)
                                    .append($('<span>').addClass('hamburgerSub hamburger-1Sub'))
                                    .append($('<span>').addClass('hamburgerSub hamburger-2Sub'))
                                    .append($('<span>').addClass('hamburgerSub hamburger-3Sub')))

                            .append($('<a>').addClass('menu-itemSub').append($('<i>').attr('title', 'User Story').addClass('fa fa-user').attr('onclick', 'SubMenuStoryCardsDiagram()')))
                            .append($('<a>').addClass('menu-itemSub').append($('<i>').attr('title', 'Remove').addClass('fa fa-trash-o')))
                            ))


            .append($('<ul>').attr('id', 'exercutiveUl' + id))
    sub_12.append(s2);


}


function SubMenuStoryCardsDiagram() {

    var sub_12 = $('#exercutiveUl' + id);
    var s2 = $('<li>').addClass('liSelect2').append($('<span>').addClass('firstSpan')
            .append($('<span>').addClass('userIcon').attr('aria-hidden', 'true'))
            .append($('<span>').addClass('sr-only').append('collapse'))
            .append($('<p>').addClass('thridName').attr('onclick', 'DiagramCardSelectFn()').append('Diagram Story Card'))

            .append($('<div>').addClass('diagramCardPopup')
                    .append($('<input>').addClass('form-control input-select-style'))
                    .append($('<button>').addClass('btn btn-light').append('Add').addClass('treeNameAdd'))
                    .append($('<select>').addClass('form-control treeSelect')
                            .append($('<option>').append('first'))
                            .append($('<option>').append('second'))
                            .append($('<option>').append('thrid'))

                            ))

            .append($('<div>').addClass('menuSub')
                    .append($('<input>').attr('type', 'checkbox').addClass('menu-openSub').addClass('menu-openSub').attr('id', 'menu-openSub_c' + id))
                    .append($('<label>').addClass('menu-open-buttonSub').attr('for', 'menu-openSub_c' + id)
                            .append($('<span>').addClass('hamburgerSub hamburger-1Sub'))
                            .append($('<span>').addClass('hamburgerSub hamburger-2Sub'))
                            .append($('<span>').addClass('hamburgerSub hamburger-3Sub')))

                    .append($('<a>').addClass('menu-itemSub').append($('<i>').attr('title', 'Remove').addClass('fa fa-trash-o')))
                    )
            )
    sub_12.append(s2);


}



// SPILITTER


function spiltterCodeFn() {
    function dragElement(element, direction) {
        if ($('#rightSplitter').width() < 250) {
            $('#rightSplitter').css('overflow', 'hidden')
        } else {
            $('#rightSplitter').css('overflow', 'visible')
        }

        if ($('#leftSplitter').width() < 250) {
            $('#leftSplitter').css('overflow', 'hidden')
        } else {
            $('#leftSplitter').css('overflow', 'visible')
        }

        var md; // remember mouse down info
        const first = document.getElementById("rightSplitter");
        const second = document.getElementById("leftSplitter");

        element.onmousedown = onMouseDown;

        function onMouseDown(e) {
            md = {e,
                offsetLeft: element.offsetLeft,
                offsetTop: element.offsetTop,
                firstWidth: first.offsetWidth,
                secondWidth: second.offsetWidth};
            document.onmousemove = onMouseMove;
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }
        }

        function onMouseMove(e)
        {
            var delta = {x: e.clientX - md.e.clientX,
                y: e.clientY - md.e.clientY};

            if (direction === "H") // Horizontal
            {
                delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                        md.secondWidth);

                element.style.left = md.offsetLeft + delta.x + "px";
                first.style.width = (md.firstWidth + delta.x) + "px";
                second.style.width = (md.secondWidth - delta.x) + "px";
            }
        }
    }
    

    dragElement(document.getElementById("separator"), "H");
}
function spiltterCodeFn1() {
    function dragElement1(element, direction)
    {
        var   md; // remember mouse down info
        const first  = document.getElementById("panelFirst1");
        const second = document.getElementById("panelSecond1");
    
        element.onmousedown = onMouseDown;
    
        function onMouseDown(e)
        {
            //console.log("mouse down: " + e.clientX);
            md = {e,
                  offsetLeft:  element.offsetLeft,
                  offsetTop:   element.offsetTop,
                  firstWidth:  first.offsetWidth,
                  secondWidth: second.offsetWidth
                 };
    
            document.onmousemove = onMouseMove;
            document.onmouseup = () => {
                //console.log("mouse up");
                document.onmousemove = document.onmouseup = null;
            }
        }
    
        function onMouseMove(e)
        {
            //console.log("mouse move: " + e.clientX);
            var delta = {x: e.clientX - md.e.clientX,
                         y: e.clientY - md.e.clientY};
    
            if (direction === "H" ) // Horizontal
            {
                // Prevent negative-sized elements
                delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                           md.secondWidth);
    
                element.style.left = md.offsetLeft + delta.x + "px";
                first.style.width = (md.firstWidth + delta.x) + "px";
                second.style.width = (md.secondWidth - delta.x) + "px";
            }
        }
    }
    
    
    dragElement1( document.getElementById("panelSplit1"), "H" );
}



$(document).ready(function(){


    spiltterCodeFn1();
})






function addOnlyBusinessService() {
    var serviceName = $('#addServiceNameModalNewTrueModal_servicename').val();
    var groupId = currentClickedServiceGroupId;

    if ((serviceName.trim().length === 0) || !groupId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.serviceName = serviceName;
    json.kv.fkServiceGroupId = groupId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewCaseService",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
//            loadBCService();
//            $('#serviceModal_service').val(res.kv.id);
            loadBCService4BS();
            $('#addServiceNameModalNewTrueModal').modal('hide');
            $('#addServiceNameModalNewTrueModal_servicename').val('');

        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getEmptyMessage4ServiceList() {
    return `<div class="col-12 defaultPage" style="padding:30px;text-align:center;">
      <h5><i class="fa fa-cubes" style="font-size:30px" aria-hidden="true"></i></h5>
      <h5> No Service have been found or created on this Service Group</h5>
      <p>All Services created on this Service Group will appear here</p>
    </div>`

}

function getEmptyMessage4ServiceBody() {
    return `<div class="col-12 defaultPage" style="padding:30px;text-align:center;">
      <h5><i class="fa fa-cubes" style="font-size:30px" aria-hidden="true"></i></h5>
      <h5> No Business Case have been found or created on this Service</h5>
      <p>All Business Case created on this Service will appear here</p>
    </div>`

}


function addBusinessService() {
    var groupname = $('#serviceAddModal_servicegroupnew').val();
    if ((groupname.trim().length === 0))
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.currentId = currentClickedServiceGroupId4Update;
    json.kv.groupName = groupname;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewCaseServiceGroup",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            currentClickedServiceGroupId = "";
            loadBCServiceGroup4BS();
//            $('#serviceModal_servicegroup').val(res.kv.id);
            $('#serviceAddModal').modal("hide");
            $('#serviceAddModal_servicegroupnew').val('');
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function loadBCServiceGroup4BS() {
    currentClickedServiceGroupId4Update = "";
    currentClickedService4Process = "";
    currentClickedServiceGroupId = "";
    currentClickedServiceId = "";
    currentClickedServiceProcessId = "";

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseServiceGroupList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadBCServiceGroup4BSDetails(res);
            $('.core-bsg-tr').first().click();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}



function deleteCaseServiceGroup(id) {

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
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCaseServiceGroup",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            loadBCServiceGroup4BS();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function editServiceGroupModal(el, id) {
    if (!id)
        return;
    var name = $(el).closest("tr").find('.core-td').html();
    $('#serviceAddModal_servicegroupnew').val(name);
    $('#serviceAddModal').modal("show");
    currentClickedServiceGroupId4Update = id;
}

$(document).on("click", '.core-bsg-tr', function (e) {
    $('#sub').html(getEmptyMessage4ServiceList());
    var name = $(this).find('.core-td').first().html();
    $('#selectServiceGroup').html(name);
    currentClickedServiceGroupId = $(this).attr("pid");
    loadBCService4BS();
})

function loadBCServiceGroup4BSDetails(res) {

    var newServ = $('#addServiceName');
    newServ.html('');
    var s = $('<table>').addClass('table table-split').addClass('serviceDropListStyle')

    var obj = res.tbl[0].r;
    for (var i in obj) {
        var o = obj[i];
        var tr = $('<tr>')
                .attr("pid", o.id)
                .addClass("core-bsg-tr")
                .css("cursor", "pointer")
                .append($('<td class="core-td">').append(o.groupName))
                .append($('<td style="width:1%">')
                        .append($('<i class="fa fa-edit">')
                                .attr("onclick", "editServiceGroupModal(this,'" + o.id + "')")))
                .append($('<td style="width:1%">')
                        .append($('<i>')
                                .attr("onclick", "deleteCaseServiceGroup('" + o.id + "')")
                                .addClass('fa fa-trash'))
                        )
        s.append(tr);
    }
    newServ.append(s);
}