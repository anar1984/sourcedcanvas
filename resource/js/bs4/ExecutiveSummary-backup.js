//floara

var apiRelOwnerId = "";
var apiRelBacklogId = "";
var apiRelType = "";

var activeBCId = "";
var lastSelectedGroupId = "";

// 4__________________Provided Services as a Solution(s)--- PLUS Button to Click________________
function loadDocEditor4BusinessCase(id) {
    new FroalaEditor('textarea' + id,{
        toolbarInline: true
    }
//            , {
//                events: {
//                    'contentChanged': function () {
//                        var el =  this.html;
//                        console.log(el )
////
////                        var id = this.html.get().closest("div.bc-section-main-div").attr("pid");
////                        $('#btn_section_' + id).removeAttr("style").html("Save");
////                        $('#btn_section_' + id).show();
//                    }
//                }
//            }
            );
}








//$(document).on("input", '.fr-element', function (e) {
//    var id = $(this).closest("div.bc-section-main-div").attr("pid");
//    $('#btn_section_' + id).removeAttr("style").html("Save");
//    $('#btn_section_' + id).show();
//})

function getBCSectionsBody(bcId, sectionId) {

    if (!bcId || !sectionId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = bcId;
    json.kv.fkBcSectionId = sectionId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBcSectionRel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {

            $('#section_div_' + sectionId).find(".fr-element").html(res.kv.sectionBody);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getBusinessServiceRelDetails(res) {

    var body = $('#addSerciveTbody');
    body.html('');
    var obj = res.tbl[0].r;
    var idx = 1;
    for (var i in obj) {
        var o = obj[i];

        var t = $('<tr>')
                .addClass("bc-tr")
                .addClass('testCaseListborder')
                .append($('<td>').append(idx++))
                .append($('<td>').append(o.groupName))
                .append($('<td>').append(o.serviceName))
                .append($('<td>').addClass('tdCenter')
                        .append($('<a>')
                                .attr("onclick", "deleteBusinessServiceRel('" + o.id + "')")
                                .append($('<i>')
                                        .addClass('fa fa-trash')
                                        .attr('aria-hidden', 'true')
                                        .addClass('summ-icon'))))
        body.append(t);
    }
}

function getBCSectionsList(id) {

    if (!activeBCId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseSection",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            generateSectionDiv(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function generateSectionDiv(res) {
    var div = $('#caseSectionDivPart');
    div.html('');


    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var el = getCaseSectionDivElement(o);
        div.append(el);
        var id = '#section_' + o.id;
        loadDocEditor4BusinessCase(id);
    }

    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        getBCSectionsBody(o.fkBcId, o.id);
    }



}



function getCaseSectionDivElement(obj) {
    var div = $('<div>')
            .attr("pid", obj.id)
            .attr("id", "section_div_" + obj.id)
            .addClass("bc-section-main-div")
            .addClass("col-" + obj.gridNo)
            .append("<br><br>")
            .append($('<div class="row">')
                    .append($('<div class="col-9">')
                            .append($("<h4>")
                                    .css('padding-bottom', '10px')
                                    .text(replaceTags(obj.sectionName))))
                    .append($('<div class="col-3 text-right">')
                            .append($("<button>")
                                    .attr('id', "btn_section_" + obj.id)
                                    .addClass("btn btn-primary")
//                                    .css("display", "none")
                                    .attr("onclick", "saveSection(this)")
                                    .append('Save'))))
            .append($('<div class="bc-section-main-div-insection">')
                    .attr("id", "anar")
                    .append($('<textarea>')
                            .attr("id", "section_" + obj.id)
                            .attr("pid", obj.id)
                            .addClass("form-control")
                            .attr("onchange", "saveBCSectionBody(this)")
                            .css("width", "100%")
                            .addClass("floaraTextarea")
                            .attr("rows", "20")));
    return div;
}

function saveSection(el) {
    $(el).css("background-color", "greenyellow").html("Saving");
    var bcId = activeBCId;
    var sectionId = $(el).closest('div.bc-section-main-div').attr("pid");
    var sectionBody = $(el).closest('div.bc-section-main-div').find(".fr-element").html();

    if (!bcId || !sectionId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = bcId;
    json.kv.fkBcSectionId = sectionId;
    json.kv.sectionBody = sectionBody;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddBcSectionRel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).removeAttr("style").html("Save");

        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });

}

function saveBCSectionBody(el) {
    var bcId = activeBCId;
    var sectionId = $(el).attr("pid");

    if (!bcId || !sectionId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = bcId;
    json.kv.fkBcSectionId = sectionId;
    json.kv.sectionBody = $(el).val();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddBcSectionRel",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });

}

function deleteBusinessServiceRel(id) {

    if (!id)
        return;


    if (!confirm("Are you sure?")) {
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
        url: urlGl + "api/post/srv/serviceTmDeleteBcServiceRelation",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getBusinessServiceRel();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getBusinessServiceRel() {
    if (!activeBCId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = activeBCId;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBcServiceRelation",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            try {
                getBusinessServiceRelDetails(res);
            } catch (err) {
            }
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function addNewBusinessServiceModal() {
    $('#serviceModal').modal('show');
    loadBCServiceGroup();
}

function addBusinessServiceRel() {
    var serviceId = $('#serviceModal_service').val();
    var groupId = $('#serviceModal_servicegroup').val();

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
            $('#serviceModal').modal("hide");
            getBusinessServiceRel();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}
function addNewBCService() {
    var serviceName = $('#serviceModal_newservice').val();
    var groupId = $('#serviceModal_servicegroup').val();

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
            loadBCService();
            $('#serviceModal_service').val(res.kv.id);

            $('.new-bc-service').hide();
            $('#serviceModal_newservice').val('');

        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function addNewCaseSection() {

    var sectionName = $('#newSummaryModal_newsection').val();
    var bcId = activeBCId;

    if ((sectionName.trim().length === 0) || !bcId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.sectionName = sectionName;
    json.kv.fkBcId = bcId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddBcSection",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            loadBCSection();

//            $('#newSummaryModal').modal('hide');
            $('#newSummaryModal_newsection').val('');

        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function newSectionModal() {
    $('#newSummaryModal').modal('show');
    loadBCSection();
}

function loadBCSection() {
    var bcId = activeBCId;

    if (!bcId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = bcId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseSection",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            loadBCSectionDetails(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function sectionDetailsGridNos(selectedNo, elId) {
    var t = $('<select>').addClass('form-control');
    t.attr('pid', elId).attr('ptype', 'gridNo')
    t.change(function (e) {
        updateCaseSection4Short(this);
    })
    for (var i = 3; i <= 12; i++) {
        var o = $('<option>').append(i);
        try {
            if (i === parseInt(selectedNo))
                o.attr("selected", "selected");
        } catch (err) {
        }
        t.append(o);
    }
    return t;
}

function loadBCSectionDetails(res) {
    var table = $('#newSummDiv');
    table.html('');
    table.addClass('table').addClass('table-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<tr>')
                .addClass('bc-tr')
//                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>')
                        .attr("pid", o.id)
                        .append(replaceTags(o.sectionName))
                        .dblclick(function (e) {
                            if ($(this).html().includes("updateCaseSection4ShortDesc")) {
                                return;
                            }

                            var caseId = $(this).attr('pid');
                            var caseName = $(this).html();
                            var edLine = $('<input>')
                                    .attr('pid', caseId)
                                    .attr('ptype', 'sectionName')
                                    .attr('onchange', 'updateCaseSection4ShortDesc(this)')
                                    .css('width', "100%")
                                    .attr("id", caseId)
                                    .attr('value', caseName)
                            $(this).html(edLine);
                        }))
                .append($('<td>')
                        .attr("pid", o.id)
                        .dblclick(function (e) {
                            if ($(this).html().includes("updateCaseSection4ShortDesc")) {
                                return;
                            }

                            var caseId = $(this).attr('pid');
                            var caseName = $(this).html();
                            var edLine = $('<input>')
                                    .attr("rows", "2")
                                    .attr('pid', caseId)
                                    .attr('ptype', 'description')
                                    .attr('onchange', 'updateCaseSection4ShortDesc(this)')
                                    .css('width', "100%")
                                    .attr("id", caseId)
                                    .attr('value', caseName);
                            $(this).html(edLine);
                        })
                        .append(replaceTags(o.description)))
                .append($('<td>')
                        .attr("pid", o.id)
                        .dblclick(function (e) {
                            if ($(this).html().includes("updateCaseSection4ShortDesc")) {
                                return;
                            }

                            var caseId = $(this).attr('pid');
                            var caseName = $(this).html();
                            var edLine = $('<input>')
                                    .attr('type', 'number')
                                    .attr("rows", "2")
                                    .attr('pid', caseId)
                                    .attr('ptype', 'orderNo')
                                    .attr('onchange', 'updateCaseSection4ShortDesc(this)')
                                    .css('width', "100%")
                                    .attr("id", caseId)
                                    .attr('value', caseName);
                            $(this).html(edLine);
                        })
                        .append(o.orderNo))
                .append($('<td>')
                        .attr("pid", o.id)
                        .attr("ptype", "gridNo")

                        .append(sectionDetailsGridNos(o.gridNo, o.id)))

                .append($('<td>')
                        .addClass('tdCenter')
                        .append($('<a>')
                                .attr("onclick", "deleteBCSection(this,'" + o.id + "')")
                                .append($('<i>')
                                        .addClass('fa fa-trash')
                                        .attr('aria-hidden', 'true')
                                        .addClass('summ-icon'))))

        table.append(t);
    }
}

function addNewBCServiceGroup() {
    var groupname = $('#serviceModal_newservicegroup').val();
    if ((groupname.trim().length === 0))
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
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
            loadBCServiceGroup();
            $('#serviceModal_servicegroup').val(res.kv.id);
            $('#serviceModal_servicegroup').change();
            $('#serviceModal_service').val('-2');
            $('#serviceModal_service').change();

            $('.new-bc-service-group').hide();
            $('#serviceModal_newservicegroup').val('');
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function loadBCServiceGroup() {
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
            loadBCServiceGroupDetails(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function loadBCServiceGroupDetails(res) {
    var el = $('#serviceModal_servicegroup');
    el.html("");
    el.append($('<option>').val("").text(""))
    el.append($('<option>').val("-2").text("New"))
    el.append($('<option disabled>').val("").text(""))


    var obj = res.tbl[0].r;
    for (var i in obj) {
        var o = obj[i];
        el.append($('<option>').val(o.id).text(o.groupName))
    }
    el.val(lastSelectedGroupId);
    el.change();

}


$(document).on("change", '#serviceModal_service', function (e) {
    var val = $(this).val();
    if (val === '-2') {
        $('.new-bc-service').show();
    } else {
        $('.new-bc-service').hide();
    }
})

$(document).on("change", '#serviceModal_servicegroup', function (e) {
    var val = $(this).val();
    if (val === '-2') {
        $('.new-bc-service-group').show();
    } else {
        $('.new-bc-service-group').hide();
        loadBCService();
        lastSelectedGroupId = val;
    }
})


function loadBCService() {
    var srvGroupId = $('#serviceModal_servicegroup').val();

    if (!srvGroupId || srvGroupId === '-2') {
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
            loadBCServiceDetails(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function loadBCServiceDetails(res) {
    var el = $('#serviceModal_service');
    el.html("");
    el.append($('<option>').val("").text(""))
    el.append($('<option>').val("-2").text("New"))
    el.append($('<option disabled>').val("").text(""))

    var obj = res.tbl[0].r;
    for (var i in obj) {
        var o = obj[i];
        el.append($('<option>').val(o.id).text(o.serviceName))
    }
}


$(document).on("click", '.main-bc-btn', function (e) {
    activeBCId = $(this).attr("id");
    var caseName = $(this).find('.main-bc-name').html();
    loadMainBusinesCaseBody(caseName)
})

function loadMainBusinesCaseBody(caseName){
     $('#business_case_heading').html(caseName)
//     $('#business_case_description').text("asdfasd")
    getProblemStatList();
    getBusinessServiceRel();
    getKeyPartner();
    getKeyResource();
    getBCSectionsList();
}

$(document).on("click", '.bc-tr', function (e) {
    $(this).closest('table').find('.bc-tr').removeClass("active");
    $(this).toggleClass("active")

})


function showApiRelSettingModal(ownerId, apiId, relType) {
    if (!ownerId || !apiId || !relType)
        return;

    apiRelOwnerId = ownerId;
    apiRelBacklogId = apiId;
    apiRelType = relType;

    $('#apiRelationSettingModal').modal('show')

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkOwnerId = ownerId;
    json.kv.fkBacklogId = apiId;
    json.kv.relType = relType;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetApiRelSetting",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            showApiRelSettingModalDetails(res);

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}





function showApiRelSettingModalDetails(res) {
    $('#apiRelationSettingModal_requestbody').val(res.kv.requestBody);
    $('#apiRelationSettingModal_responsebody').val(res.kv.responseBody);
    $('#apiRelationSettingModal_errorbody').val(res.kv.errorBody);
    $('#apiRelationSettingModal_queryparam').val(res.kv.queryParam);
}

function addAPIRelSetting() {
    if (!apiRelOwnerId || !apiRelBacklogId || !apiRelType)
        return;

    $('#apiRelationSettingModal').modal('show');

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkOwnerId = apiRelOwnerId;
    json.kv.fkBacklogId = apiRelBacklogId;
    json.kv.relType = apiRelType;
    json.kv.fkProjectId = global_var.current_project_id;
    json.kv.requestBody = $('#apiRelationSettingModal_requestbody').val();
    json.kv.responseBody = $('#apiRelationSettingModal_responsebody').val();
    json.kv.errorBody = $('#apiRelationSettingModal_errorbody').val();
    json.kv.queryParam = $('#apiRelationSettingModal_queryparam').val();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddAPIRelSetting",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            showApiRelSettingModalDetails(res);
            $('#apiRelationSettingModal').modal('hide');

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

$(document).on("click", function () {
    new FroalaEditor(".exercusiveEditor", {
        enter: FroalaEditor.ENTER_P,
        height: 150,
        toolbarInline: true
    })

})

// list-group-item add active class

$(document).on("click", '.list-group-item', function (e) {
    $('.list-group-item').removeClass("active");
    $(this).toggleClass("active")
})

// arrow up-Down
$(document).on("click", '.rotate-icon', function (e) {
    $(this).toggleClass("down");
})

// 1 Executive Summary
function insertNewBusinessCase(el) {
    var caseName = $('#newBusinessCaseName').val();
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
            getNewExecutiveTable()
            $('#newBusinessCaseName').val('')

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#newBusinessCaseName').val('')
}

// 2 E.S_______________________________________________________________  

function ExecutiveSummaryTable(res) {
    var table = $('#executiveInsert');
    table.html('');
    var t = table.addClass('table')
            .addClass('table-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<tr>')
                .css("cursor", "pointer")
                .addClass('main-bc-btn')
                .addClass('bc-tr')
                .attr("id", o.id)
//                .addClass('bug-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>')
                        .addClass("main-bc-name")
                        .attr('ondblclick', 'updateLineCaseName(this,"' + o.id + '")')
                        .css("padding", "15px 10px")
                        .append(replaceTags(o.caseName)))
                .append($('<td>').append((o.caseNo)))

        table.append(t);
    }
    $('.main-bc-btn').first().click();
}

function updateLineCaseName(el, caseId) {
    if ($(el).html().includes("updateCaseName")) {
        return;
    }

    var edLine = caseUpdateLine(caseId, $(el).html())
    $(el).html(edLine);
}

function updateCaseDesc(el) {
    
    var caseDesc = $(el).val();
    if (!(caseDesc) || !activeBCId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = activeBCId;
    json.kv.caseDescription = caseDesc;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateBusinessCaseDesc",
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

function updateCaseName(el, caseId) {
    var caseName = $(el).val();
    if (!(caseName) || !caseId)
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = caseId;
    json.kv.caseName = caseName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateBusinessCaseName",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).closest('td').html(caseName);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#newBusinessCaseName').val('')
}

function caseUpdateLine(caseId, caseName) {
    return $('<input>')
            .attr('onchange', 'updateCaseName(this,"' + caseId + '")')
            .css('width', "100%")
            .attr("id", caseId)
            .attr('value', caseName)
}



function deleteBCSection(el, id) {
    if (!confirm("Are you sure?")) {
        return;
    }

    if (!(id))
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCaseSection",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            loadBCSection();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#newBusinessCaseName').val('')
}


function deleteBusinessCase() {
    if (!confirm("Are you sure?")) {
        return;
    }

    var caseId = activeBCId;

    if (!(caseId))
        return;

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.id = caseId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteBusinessCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getNewExecutiveTable();
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#newBusinessCaseName').val('')
}

//3  E.S_______________________________________________________________  
function getNewExecutiveTable(e) {
    $('#executiveInsert').html('');
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetBusinessCaseList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            ExecutiveSummaryTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function addKeyResourceNew() {

    var partnerName = $('#keyResourceNew').val();
    if (!(activeBCId) || !partnerName)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBcId = activeBCId;
    json.kv.partnerName = partnerName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddCaseKeyResource",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getKeyResource();
            $('#keyResourceNew').val('')
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#keyResourceNew').val('')
}


function deleteKeyResource(id) {
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
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCaseKeyResource",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getKeyResource();
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });

}


function addKeyPartnerNew() {

    var partnerName = $('#keyPartnerNew').val();
    if (!(activeBCId) || !partnerName)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBcId = activeBCId;
    json.kv.partnerName = partnerName;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmAddCaseKeyPartner",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getKeyPartner();
            $('#keyPartnerNew').val('')
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#keyPartnerNew').val('')
}
function deleteKeyPartner(id) {
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
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCaseKeyPartner",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getKeyPartner();
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });

}


function getKeyResource() {


    if (!(activeBCId))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseKeyResource",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            try {
                getKeyResourceDetails(res);
            } catch (err) {
            }

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });

}

function getKeyResourceDetails(res) {
    var table = $('#keyResourceDiv');
    table.html('');
    var t = table.addClass('table')
            .addClass('table-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<tr>')
                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>')
                        .attr("ondblclick", "keyResourcenameHtml2TextArea(this,'" + o.id + "')")
                        .append(replaceTags(o.resourceName)))
                .append($('<td>')
                        .attr("ondblclick", "keyResourceDescHtml2TextArea(this,'" + o.id + "')")
                        .append(replaceTags(o.description)))

                .append($('<td>').addClass('tdCenter')
                        .append($('<a>')
                                .attr('onclick', "deleteKeyResource('" + o.id + "')")
                                .append($('<i class="fa fa-trash">')
//                                        .css("color", "blue")
                                        .attr('aria-hidden', 'true')
                                        .addClass('summ-icon')))
                        .css("custor", "pointer"))

        table.append(t);
    }
}


function getKeyPartner() {

    if (!(activeBCId))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseKeyPartner",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            try {
                getKeyPartnerDetails(res);
            } catch (err) {
            }

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });

}

function getKeyPartnerDetails(res) {
    var table = $('#keyPartnerDiv');
    table.html('');
    var t = table.addClass('table')
            .addClass('table-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<tr>')
                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>')
                        .attr("ondblclick", "keyPartnernameHtml2TextArea(this,'" + o.id + "')")
                        .append(replaceTags(o.partnerName)))
                .append($('<td>')
                        .attr("ondblclick", "keyPartnerDescHtml2TextArea(this,'" + o.id + "')")
                        .append(replaceTags(o.description)))

                .append($('<td>').addClass('tdCenter')
                        .append($('<a>')
                                .attr('onclick', "deleteKeyPartner('" + o.id + "')")
                                .append($('<i class="fa fa-trash">')
//                                        .css("color", "blue")
                                        .attr('aria-hidden', 'true')
                                        .addClass('summ-icon')))
                        .css("custor", "pointer"))

        table.append(t);
    }
}


// ***********************
// Problem Statement
// ************************
function addProblemStat() {

    var statDesc = $('#problemStatAddNew').val();
    if (!(activeBCId) || !statDesc)
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }

    json.kv.fkBcId = activeBCId;
    json.kv.problemDesc = statDesc;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewCaseProblemStatement",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getProblemStatList()
            $('#problemStatAddNew').val('')

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#problemStatAddNew').val('')
}

// 2 P.S_______________________________________________________________  

function problemStatTable(res) {
    var table = $('#problemStat');
    table.html('');
    var t = table.addClass('table')
            .addClass('table-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        console.log(obj[i])
        var t = $('<tr>')
                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>')
                        .attr("ondblclick", "probStatHtml2TextArea(this,'" + o.id + "')")
                        .append(replaceTags(o.problemDesc)))
                .append($('<td>')
                        .append($('<input type="number">')
                                .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                .attr("pid", o.id)
                                .attr("ptype", "countPotentialCustomer")
                                .addClass('bc-probdesc-counts')
                                .val(o.countPotentialCustomer)))
                .append($('<td>')
                        .append($('<input type="number">')
                                .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                .attr("pid", o.id)
                                .attr("ptype", "countRealCustomer")
                                .addClass('bc-probdesc-counts')
                                .val(o.countRealCustomer)))
                .append($('<td>').addClass('tdCenter')
                        .append($('<a>')
                                .attr('onclick', "deleteProbStat('" + o.id + "')")
                                .append($('<i class="fa fa-trash">')
//                                        .css("color", "blue")
                                        .attr('aria-hidden', 'true')
                                        .addClass('summ-icon')))
                        .css("custor", "pointer"))

        table.append(t);
    }
}

function deleteProbStat(id) {

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
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCaseProblemStatement",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getProblemStatList();
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

function updateLineKeyPartnerName(id, body) {
    return $('<input>')
            .attr('onchange', 'updateLineKeyPartnerName(this)')
            .css('width', "100%")
            .attr("pid", id)
            .attr("ptype", "problemDesc")
            .attr("id", id)
            .text(body)

}

function updateCaseKeyPartnerDesc(el) {
    var id = $(el).attr('pid');
    var val = $(el).val();

    if (!id || !val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.desc = val;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseKeyPartnerDesc",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).closest("td").html($(el).val());
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

function updateCaseKeyResourceDesc(el) {
    var id = $(el).attr('pid');
    var val = $(el).val();

    if (!id || !val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.desc = val;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseKeyResourceDesc",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).closest("td").html($(el).val());
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

function updateCaseKeyPartner(el) {
    var id = $(el).attr('pid');
    var val = $(el).val();

    if (!id || !val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.partnerName = val;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseKeyPartnerName",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).closest("td").html($(el).val());
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

function updateCaseKeyResource(el) {
    var id = $(el).attr('pid');
    var val = $(el).val();

    if (!id || !val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.partnerName = val;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseKeyResourceName",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).closest("td").html($(el).val());
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

function updateLineKeyResourceDesc(id, body) {
    return $('<textarea>')
            .attr('onchange', 'updateCaseKeyResourceDesc(this)')
            .css('width', "100%")
            .attr("pid", id)
            .attr("ptype", "problemDesc")
            .attr("id", id)
            .text(body)

}

function updateLineKeyPartnerDesc(id, body) {
    return $('<textarea>')
            .attr('onchange', 'updateCaseKeyPartnerDesc(this)')
            .css('width', "100%")
            .attr("pid", id)
            .attr("ptype", "problemDesc")
            .attr("id", id)
            .text(body)

}

function updateLineKeyResourceName(id, body) {
    return $('<textarea>')
            .attr('onchange', 'updateCaseKeyResource(this)')
            .css('width', "100%")
            .attr("pid", id)
            .attr("ptype", "problemDesc")
            .attr("id", id)
            .text(body)

}

function updateLineKeyPartnerName(id, body) {
    return $('<textarea>')
            .attr('onchange', 'updateCaseKeyPartner(this)')
            .css('width', "100%")
            .attr("pid", id)
            .attr("ptype", "problemDesc")
            .attr("id", id)
            .text(body)

}

function updateLineProbStat(id, body) {
    return $('<textarea>')
            .attr('onchange', 'updateCaseProblemStat4ShortDesc(this)')
            .css('width', "100%")
            .attr("pid", id)
            .attr("ptype", "problemDesc")
            .attr("id", id)
            .text(body)

}

//function updateLineProbStat(id, body) {
//    return $('<textarea>')
//            .attr('onchange', 'updateCaseKeyPartner(this)')
//            .css('width', "100%")
//            .attr("pid", id)
//            .attr("ptype", "problemDesc")
//            .attr("id", id)
//            .text(body)
//
//}

function probStatHtml2TextArea(el, caseProbStatId) {
    if ($(el).html().includes("updateCaseProblemStat4ShortDesc")) {
        return;
    }
    var edLine = updateLineProbStat(caseProbStatId, $(el).html())
    $(el).html(edLine);
}

function keyResourceDescHtml2TextArea(el, caseProbStatId) {
    if ($(el).html().includes("updateCaseKeyResourceDesc")) {
        return;
    }
    var edLine = updateLineKeyResourceDesc(caseProbStatId, $(el).html())
    $(el).html(edLine);
}


function keyPartnerDescHtml2TextArea(el, caseProbStatId) {
    if ($(el).html().includes("updateCaseKeyPartnerDesc")) {
        return;
    }
    var edLine = updateLineKeyPartnerDesc(caseProbStatId, $(el).html())
    $(el).html(edLine);
}

function keyPartnernameHtml2TextArea(el, caseProbStatId) {
    if ($(el).html().includes("updateCaseKeyPartner")) {
        return;
    }
    var edLine = updateLineKeyPartnerName(caseProbStatId, $(el).html())
    $(el).html(edLine);
}

function keyResourcenameHtml2TextArea(el, caseProbStatId) {
    if ($(el).html().includes("updateCaseKeyResource")) {
        return;
    }
    var edLine = updateLineKeyResourceName(caseProbStatId, $(el).html())
    $(el).html(edLine);
}

function updateCaseSection4ShortDesc(el) {
    updateCaseSection4Short(el);
    $(el).closest("td").html($(el).val());
}

function updateCaseProblemStat4ShortDesc(el) {
    updateCaseProblemStat4Short(el);
    $(el).closest("td").html($(el).val());
}

function updateCaseSection4Short(el) {
    var id = $(el).attr('pid');
    var type = $(el).attr('ptype');
    var val = $(el).val();

    if (!id || !type || !val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.type = type;
    json.kv.value = val;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseSection4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}


function updateCaseProblemStat4Short(el) {
    var id = $(el).attr('pid');
    var type = $(el).attr('ptype');
    var val = $(el).val();

    if (!id || !type || !val) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.type = type;
    json.kv.value = val;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmUpdateCaseProblemStat4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

//3  P.S_______________________________________________________________  
function getProblemStatList(e) {
    if (!activeBCId) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseProblemStatementList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            try {
                $('#business_case_description').text(res.kv.caseDesc)
                problemStatTable(res);
            } catch (err) {
            }
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}


// / ************************
// Provided Services as a Solution(s)
// ************************
function addNewService(backlogId, assgineeId, taskStatus) {
    $('#serviceAdd').keypress(function (e, bugDesc) {

        var key = e.which;
        if (key == 13) {
            var bugDesc = $('#serviceAdd').val();
            if (!(bugDesc))
                return;
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }
            backlogId = (backlogId) ? backlogId : "-1";
            assgineeId = (assgineeId) ? assgineeId : "-1";
            taskStatus = (taskStatus) ? taskStatus : "new";
            json.kv['fkProjectId'] = global_var.current_project_id;
            json.kv['fkBacklogId'] = backlogId;
            json.kv['fkAssigneeId'] = assgineeId;
            json.kv.taskName = bugDesc;
            json.kv.taskStatus = taskStatus;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    getnewService()
                    $('#serviceAdd').val('')

                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
            $('#serviceAdd').val('')
        }
    });
}

// 2 P.S_______________________________________________________________  
function newServiceTable(res) {
    var table = $('#collapse11');
    var obj = res.tbl[0].r;
    for (var i = 0; i < 1; i++) {
        var o = obj[i];
        var t = $('<ul>').addClass('list-group').addClass('serviseListGroup')
                .append($('<div>').addClass('panelList').append($('<b>').append('GROUP Name'))
                        .append($('<li>').addClass('list-group-item').append(o.taskName))
                        .append($('<li>').addClass('list-group-item').append(o.taskName)))

        table.append(t);
    }

}

//3  P.S_______________________________________________________________  
function getnewService(e) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            newServiceTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}







// *********************
// Key Partners
// *******************

function addKeyPartner(backlogId, assgineeId, taskStatus) {

    var action_1 = $('#actionName').val();
    // var action_2 = $('#actionDesc').val();

    if (!(action_1))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    backlogId = (backlogId) ? backlogId : "-1";
    assgineeId = (assgineeId) ? assgineeId : "-1";
    taskStatus = (taskStatus) ? taskStatus : "new";
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkBacklogId'] = backlogId;
    json.kv['fkAssigneeId'] = assgineeId;
    json.kv.taskName = action_1;
    json.kv.taskStatus = taskStatus;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getNewkeyPartner()
            $('#actionName').val('')
            // $('#actionDesc').val('')

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

// 2 K.P_______________________________________________________________  

function keyPartnerTable(res) {
    var table = $('#collapse12');
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<ul>').addClass('list-group').addClass('keyPartListGroup')
                .append($('<div>').addClass('panelList').append($('<b>').append('GROUP Name'))
                        .append($('<li>').addClass('list-group-item').append(o.taskName))
                        .append($('<li>').addClass('list-group-item').append(o.taskName + ' next')))
        table.append(t);
    }

}


//3  K.P_______________________________________________________________  
function getNewkeyPartner(e) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            keyPartnerTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}
// 4___________Key Partners plus btn to insert________________________

function addKeyPartnersNameTableİnsert() {

    if ($('.keyPartListGroup .list-group-item').hasClass('active')) {
        var a = $('.list-group-item.active').html();
        var table = $('#keyPartnerDiv');
        for (var i = 0; i < 1; i++) {
            var t = $('<tr>')
                    .addClass('bc-tr')
                    .addClass('testCaseListborder')
                    .append($('<td>').append(i + 1))
                    .append($('<td>').append(a))
                    .append($('<td>').append(a))
                    .append($('<td>').addClass('tdCenter').append($('<a>')
                            .append($('<i>').addClass('fa fa-trash').attr('aria-hidden', 'true').addClass('summ-icon'))))
            table.append(t);
        }

    }
}


// *******************
// Key Human Resources
// ******************
function addKeyHuman(backlogId, assgineeId, taskStatus) {
    var bugDesc = $('#actionName2').val();
    if (!(bugDesc))
        return;
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    backlogId = (backlogId) ? backlogId : "-1";
    assgineeId = (assgineeId) ? assgineeId : "-1";
    taskStatus = (taskStatus) ? taskStatus : "new";
    json.kv['fkProjectId'] = global_var.current_project_id;
    json.kv['fkBacklogId'] = backlogId;
    json.kv['fkAssigneeId'] = assgineeId;
    json.kv.taskName = bugDesc;
    json.kv.taskStatus = taskStatus;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getNewkeyHuman()
            $('#actionName2').val('')

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

// 2 K.H.R_______________________________________________________________  

function keyHumanTable(res) {
    var table = $('#collapse13');
    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<ul>').addClass('list-group').addClass('keyHumanListGroup')
                .append($('<div>').addClass('panelList').append($('<b>').append('GROUP Name'))
                        .append($('<li>').addClass('list-group-item').append(o.taskName))
                        .append($('<li>').addClass('list-group-item').append(o.taskName + ' next')))

        table.append(t);
    }
}



//3  K.H.R_______________________________________________________________  
function getNewkeyHuman(e) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            keyHumanTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

// 4___________Key Human - plus btn to insert________________________

function addKeyHumanNameTableİnsert() {

    if ($('.keyHumanListGroup .list-group-item').hasClass('active')) {
        var a = $('.list-group-item.active').html();
        var table = $('#keyHumanDiv');
        for (var i = 0; i < 1; i++) {
            var t = $('<tr>')
                    .addClass('bc-tr')
                    .addClass('testCaseListborder')
                    .append($('<td>').append(i + 1))
                    .append($('<td>').append(a))
                    .append($('<td>').append(a))
                    .append($('<td>').addClass('tdCenter').append($('<a>')
                            .append($('<i>').addClass('fa fa-trash').attr('aria-hidden', 'true').addClass('summ-icon'))))
            table.append(t);
        }

    }
}







// *******************
// Key Resources
// ******************
function addKeyResourced(backlogId, assgineeId, taskStatus) {
    $('#keyResAdd').keypress(function (e, bugDesc) {

        var key = e.which;
        if (key == 13) {
            var bugDesc = $('#keyResAdd').val();
            if (!(bugDesc))
                return;
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }
            backlogId = (backlogId) ? backlogId : "-1";
            assgineeId = (assgineeId) ? assgineeId : "-1";
            taskStatus = (taskStatus) ? taskStatus : "new";
            json.kv['fkProjectId'] = global_var.current_project_id;
            json.kv['fkBacklogId'] = backlogId;
            json.kv['fkAssigneeId'] = assgineeId;
            json.kv.taskName = bugDesc;
            json.kv.taskStatus = taskStatus;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    getNewkeyResourced()
                    $('#keyResAdd').val('')

                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
            $('#keyResAdd').val('')
        }
    });
}

// 2 K.R_______________________________________________________________  

function keyResTable(res) {
    var table = $('#keyResDiv');
    var t = table.addClass('table')
            .addClass('table-hover')

    // var obj = res.tbl[0].r;
    for (var i = 0; i < 1; i++) {
// var o = obj[i];
        var t = $('<tr>')
                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>').append('ATM'))
                .append($('<td>').append('desc'))
                .append($('<td>').addClass('tdCenter').append($('<a>')
                        .append($('<i>').addClass('fa fa-trash').attr('aria-hidden', 'true').addClass('summ-icon'))))

        table.append(t);
    }
}



//3  K.R_______________________________________________________________  
function getNewkeyResourced(e) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            keyResTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}





// ***********************
//  modal Floara add
// ***********************
function addNewSumm(backlogId, assgineeId, taskStatus) {
    $('#newSummAdd').keypress(function (e, bugDesc) {

        var key = e.which;
        if (key == 13) {
            var bugDesc = $('#newSummAdd').val();
            if (!(bugDesc))
                return;
            var json = {kv: {}};
            try {
                json.kv.cookie = getToken();
            } catch (err) {
            }
            backlogId = (backlogId) ? backlogId : "-1";
            assgineeId = (assgineeId) ? assgineeId : "-1";
            taskStatus = (taskStatus) ? taskStatus : "new";
            json.kv['fkProjectId'] = global_var.current_project_id;
            json.kv['fkBacklogId'] = backlogId;
            json.kv['fkAssigneeId'] = assgineeId;
            json.kv.taskName = bugDesc;
            json.kv.taskStatus = taskStatus;
            var that = this;
            var data = JSON.stringify(json);
            $.ajax({
                url: urlGl + "api/post/srv/serviceTmInsertNewBacklogTask4Short",
                type: "POST",
                data: data,
                contentType: "application/json",
                crossDomain: true,
                async: true,
                success: function (res) {
                    getNewSummary()
                    $('#newSummAdd').val('')

                },
                error: function () {
                    Toaster.showError(('somethingww'));
                }
            });
            $('#newSummAdd').val('')
        }
    });
}

// 2 K.R_______________________________________________________________  

function newSummaryTable(res) {
    var table = $('#newSummDiv');
    var table2 = $('#newSummDivTextarea')

    var t = table.addClass('table')
            .addClass('table-hover')

    // var obj = res.tbl[0].r;
    for (var i = 0; i < 1; i++) {
// var o = obj[i];
        var t = $('<tr>')
                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>').append('AA'))
                .append($('<td>').append('DD'))
                .append($('<td>').append(i + 5))
                .append($('<td>').append($('<select>').addClass('form-control')
                        .append($('<option>').append('1'))
                        .append($('<option>').append('2'))
                        .append($('<option>').append('3'))
                        .append($('<option>').append('4'))
                        .append($('<option>').append('5'))
                        .append($('<option>').append('6'))
                        .append($('<option>').append('7'))
                        .append($('<option>').append('8'))
                        .append($('<option>').append('9'))
                        .append($('<option>').append('10'))))

                .append($('<td>').addClass('tdCenter').append($('<a>')
                        .append($('<i>').addClass('fa fa-trash').attr('aria-hidden', 'true').addClass('summ-icon'))))

        table.append(t);
    }


// var obj = res.tbl[0].r;
    for (var i = 0; i < 1; i++) {
// var o = obj[i];
        var f = $('<label>').append($('<h6>').append('DescName'))
                .append($('<div class="exercusiveEditor">  <div class="exercusiveedit"> </div> </div>'))

        table2.append(f);
    }
}



//3  K.R_______________________________________________________________  
function getNewSummary(e) {
    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.fkProjectId = global_var.current_project_id;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetTaskList4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            newSummaryTable(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}



























