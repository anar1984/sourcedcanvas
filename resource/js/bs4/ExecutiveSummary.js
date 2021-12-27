//floara

var apiRelOwnerId = "";
var apiRelBacklogId = "";
var apiRelType = "";

var activeBCId = "";
var lastSelectedGroupId = "";

// 4__________________Provided Services as a Solution(s)--- PLUS Button to Click________________
function loadDocEditor4BusinessCase(id) {

    tinymce.init({
        selector: id,
        height: 150,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        convert_urls: false,

        toolbar: 'undo redo | link image | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | fullscreen code',
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        /* and here's our custom image picker*/
        file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function () {
                var file = this.files[0];

                var reader = new FileReader();
                reader.onload = function () {
                    /*
                     Note: Now we need to register the blob in TinyMCEs image blob
                     registry. In the next release this part hopefully won't be
                     necessary, as we are looking to handle it internally.
                     */
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), {title: file.name});
                };
                reader.readAsDataURL(file);
            };

            input.click();
        },
        setup:function(ed) {
            //    var idl = id.split("_");
            ed.on('change', function(e) {

                var sectionId = $(id).attr("pid");
                      
                var tinyBCSBody = tinyMCE.get('section_' + sectionId).getContent();
                       
                var bcId = activeBCId;
                // var sectionId = $(idl[1]);
            
                if (!bcId || !sectionId)
                    return;
            
                var json = {kv: {}};
                try {
                    json.kv.cookie = getToken();
                } catch (err) {
                }
                json.kv.fkBcId = bcId;
                json.kv.fkBcSectionId = sectionId;
                json.kv.sectionBody = tinyBCSBody;
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

            });
        },


        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    });
   
}



//$(document).on("input", '.fr-element', function (e) {
//    var id = $(this).closest("div.bc-section-main-div").attr("pid");
//    $('#btn_section_' + id).removeAttr("style").html("Save");
//    $('#btn_section_' + id).show();
//})


$(document).on("dblclick", '.convertedTextAreaLines', function (e) {
    $(this).closest('.hasTextAreaConverstion')
            .find('.figureTextarea')
            .focus()
            .show();

    $(this).hide();
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box label.expander').addClass('active');
    $(this).closest('.hasTextAreaConverstion')
            .find('.figureTextarea')
            .first()
            .focus();
});

$(document).on("click", '.addFinancialProjectionRevenueLine', function (e) {
    createFinancialProjectionSectionLine(this, 'revenue');
});

$(document).on("click", '.addFinancialProjectionExpenseLine', function (e) {
    createFinancialProjectionSectionLine(this, 'expense');
});

$(document).on("click", '.convertedTextAreaLinesShey', function (e) {
    $(this).closest('.hasTextAreaConverstion')
            .find('.figureTextarea')

            .show();

    $(this).closest('.convertedTextAreaLines').hide();
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box label.expander').addClass('active');
    $(this).closest('.hasTextAreaConverstion')
            .find('.figureTextarea')
            .first()
            .focus();
});
$(document).on("click", '.figureTextarea-box label.expander', function (e) {
    $(this).closest('.hasTextAreaConverstion').find('.textarea-full-blure-bg').toggleClass('textarea-blure-toggle');
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea').show();
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box').toggleClass('textarea-full');
    $(this).closest('.convertedTextAreaLines').hide();
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box label.expander').addClass('active');
    $(this).closest('.hasTextAreaConverstion')
            .find('.figureTextarea')
            .first()
            .focus();
});
$(document).on("click", '.figureTextarea-box label.expander.active', function (e) {
    // $(this).closest('.hasTextAreaConverstion').find('.textarea-full-blure-bg.textarea-blure-toggle').removeClass('textarea-blure-toggle');
    //$(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box textarea-full').removeClass('textarea-full');
});


var mouse_is_inside = false;

$(document).ready(function ()
{
    $(document).on("mousedown", 'label.expander', function (e) {
        return false
    });

});

$(document).on("focusout", '.figureTextarea', function (e) {
    $(this).closest('.hasTextAreaConverstion')
            .find('.convertedTextAreaLines')
            .remove();
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box').removeClass('textarea-full');
    $(this).closest('.hasTextAreaConverstion').find('.figureTextarea-box label.expander').removeClass('active');
    $(this).closest('.hasTextAreaConverstion').find('.textarea-full-blure-bg.textarea-blure-toggle').removeClass('textarea-blure-toggle');
    $(this).hide();
    var type = $(this).attr('data-type');
    var el = '';
    if (type === 'textarea') {
        el = convertTextAreaToTdSectionBullet($(this).val());
    } else if (type === 'editbox') {
        el = convertTextAreaToTdSectionBulletEditbox($(this).val())
    } else if (type === 'item') {
        el = convertTextAreaToTdSectionBulletItem($(this).val())
    }
    $(this).closest('.hasTextAreaConverstion').prepend(el);
});

$(document).on("click", '.addFinancialProjectionPeriod', function (e) {

    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmcreateSingleFinancialProjectionZone",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getFinancialProjectionZoneList();
        }
    });
});


function getFinancialProjectionSectionList(financeId) {

    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBcId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetFinancialProjectionSectionList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            var table = getFinancialProjectionSectionListDetails(res);
            $('.financialSectionDivZad[pid=' + financeId + ']').first().html(table);

//           financialSectionDivZad
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getFinancialProjectionSectionListDetails(res) {
    var table = $('<table>');
    table.html('');
    table.addClass('table').addClass('table-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];

        table.append($('<tr>')
                .append($('<th>').attr("pid", o.id)
                        .text(o.sectionName)
                        .append($('<a>')
                                .attr("onclick", "deleteFinancialSection(this,'" + o.id + "')")
                                .append($('<i>')
                                        .addClass('fa fa-trash')
                                        .attr('aria-hidden', 'true')
                                        .addClass('summ-icon')))
                        ))
                .append($('<tr>')
                        .append($('<td>').attr("pid", o.id)
                                .append($('<textarea>')
                                        .addClass("financialSectionBodyText")
                                        .attr("pid", o.id)
                                        .text(o.sectionBody))
                                ))
                ;
    }
    table.append($('<tr>')
            .append($('<th>')
                    .append($('<a>')
                            .attr("onclick", "createFinancialProjectionSectionLine(this,'" + o.id + "')")
                            .append($('<i>')
                                    .addClass('fa fa-plus')
                                    .attr('aria-hidden', 'true')
                                    .addClass('summ-icon')))
                    ))
            ;
    return table;
}



function createFinancialProjectionSectionLine(el, sectionType) {
    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    json.kv.sectionType = sectionType;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmcreateFinancialProjectionSectionLine",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getFinancialProjectionZoneList();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

$(document).on("click", '.problemServiceListSingleDelete', function (e) {
    if (!confirm("Are you sure?")) {
        return;
    }

    var problemId = $(this).attr('problemId');
    var serviceId = $(this).attr('serviceId');

    if (!problemId || !serviceId)
        return;

    var json = initJSON();
    json.kv.serviceId = serviceId;
    json.kv.problemId = problemId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteServiceFromCaseProblem",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getProblemStatList();
        }
    });
})

function getBCSectionsBody(bcId, sectionId) {

    if (!bcId || !sectionId)
        return;

    var json = initJSON();
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

            //$('#section_div_' + sectionId).find(".fr-element").html(res.kv.sectionBody);
            tinyMCE.get('section_' + sectionId).setContent(res.kv.sectionBody);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function convertProblemServicesToCircleFormatForCompetitors(addFeatures, arg, competitorId, serviceId) {
    var div = $('<div>');
    try {
        var srvList = arg.split(/\r*\n/);

        for (var kk in srvList) {
            var srv = srvList[kk];
            if (srv.length === 0) {
                continue;
            }

            var input = $("<input type='checkbox'>")
                    .attr('competitorId', competitorId)
                    .attr('serviceid', serviceId)
                    .attr('id', serviceId)
                    .attr('feature', srv)
                    .attr('name', serviceId)
                    .addClass('competitorFeatureAddRemove');
            //var label = $('<label>').attr('for',serviceId).text(srv);

            if (addFeatures[serviceId]) {
                var srvT = srv.trim();
                var zad = addFeatures[serviceId];
                if (zad.split('%IN%').includes(srvT)) {
                    input.attr('checked', 'true');
                }
            }

            var span = $('<span>')
                    .css('padding', '3px 7px')
                    .css('margin-bottom', '6px')
                    .addClass('problemServiceListSingle')
                    .append($('<label>')
                            .append(input)
                            .append(srv)
                            )
            //.append(label)
            // .append(srv)

            if (addFeatures[serviceId]) {
                var srvT = srv.trim();
                var zad = addFeatures[serviceId];
                if (zad.split("%IN%").includes(srvT)) {
                    span.css({'background-color': 'greenyellow', 'color': '#525596'});
                } else {
                    span.css({'color': '#fff'});
                }
            }

            div.append(span);
        }
    } catch (err) {
    }

    return div;
}

function convertProblemServicesToCircleFormat(res, arg, problemId) {
    var div = $('<div>');
    try {
        var index = getIndexOfTable(res, 'serviceList');
        var srvList = arg.split(',');

        for (var kk in srvList) {
            var srv = srvList[kk];
            if (srv.length === 0) {
                continue;
            }

            var obj = res.tbl[index].r;
            for (let i = 0; i < obj.length; i++) {
                var o = obj[i];
                if (o.id !== srv) {
                    continue;
                }
                div.append($('<span>')
                        .attr("style", "border-radius: 5px;line-height: 15px;background-color: rgb(50, 160, 134);color:#fff !important;")
                        /*  .css('border-radius', '5px')
                         .css('line-height', '25px')
                         .css('background-color', '#32a086')
                         .css('color', 'red') */
                        .addClass('problemServiceListSingle')
                        .text(o.serviceName)
                        .append($('<a href="#">')
                                .attr('problemid', problemId)
                                .attr('serviceid', o.id)
                                .addClass('problemServiceListSingleDelete')
                                .html('<i class="far fa-times-circle"></i>'))
                        )
            }
        }
    } catch (err) {
    }

    return div;
}

function getBusinessServiceRelDetails4Problem(res) {

    var body = $('#addServiceToProblemStatementModal_body');
    body.html('');
    var obj = res.tbl[0].r;
    var idx = 1;
    for (var i in obj) {
        var o = obj[i];

        var t = $('<tr>')
                .addClass("bc-tr")
                .addClass('testCaseListborder')
                .append($('<td>').append(idx++))
                .append($('<td>')
                        .append($('<input type="checkbox">')
                                .attr("pid", o.id)
                                .addClass('serviceListCheckbox')))
                .append($('<td>').text(o.serviceName))
        body.append(t);
    }
}


function getBusinessServiceRelDetails(res) {

    var body = $('#providedServicesListTable');
    body.html('');
    var obj = res.tbl[0].r;
    var idx = 1;
    for (var i in obj) {
        var o = obj[i];

        var t = $('<tr>')
                .addClass("bc-tr")
                .addClass('testCaseListborder')
                .append($('<td>').append(idx++))
                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(o.serviceName))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'editbox')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('key', 'serviceName')
                                        .attr("onchange", "updateProvidedServices4Short(this)")
                                        .text(o.serviceName))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )

                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.advantage))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'textarea')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('key', 'advantage')
                                        .attr("onchange", "updateProvidedServices4Short(this)")
                                        .text(o.advantage))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )

                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.technicalAdvantage))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'textarea')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('key', 'technicalAdvantage')
                                        .attr("onchange", "updateProvidedServices4Short(this)")
                                        .text(o.technicalAdvantage))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )

                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.valueProposition))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'textarea')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('key', 'valueProposition')
                                        .attr("onchange", "updateProvidedServices4Short(this)")
                                        .text(o.valueProposition))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )

                        )

                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.feature))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'textarea')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('key', 'feature')
                                        .attr("onchange", "updateProvidedServices4Short(this)")
                                        .text(o.feature))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )

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



function getFinancialProjectionZoneList() {
    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetFinancialProjectionZoneList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            try {
                getFinancialProjectionZoneListDetails(res);
            } catch (err) {
                console.log(err)
            }
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getFinancialProjectionZoneListDetails(res) {
    var table = $('#financialProjectionTable');
    table.html('');
    table.addClass('table').addClass('table-hover')

    var obj = res.tbl[0].r;
    var is_header_loaded = false;
    var tbody = $('<tbody>');
    var thead = $('<thead>');
    var trHead = $('<tr>').append($('<th>').text('#'));
    var trCurrency = $('<tr>').append($('<th>').text('Currency'));
    var trCustomer = $('<tr>').append($('<th>').text('Assumtion # of Customer'));
    var DetailRevenue = $('<tr>').addClass('fp-detail-table-boxes');
    var trRevenue = $('<tr>').addClass('tr-revenue').append($('<th>').text('Revenue').append($('<div>').addClass('fpd-revenue fbdetailtabs').html('Details <i class="fas ' + revenue_tab + '"></i>')));
    var trExpences = $('<tr>').addClass('tr-expences').append($('<th>').text('Expenses').append($('<div>').addClass('fpd-expenses fbdetailtabs').html('Details <i class="fas ' + expense_tab + '"></i>')));
    var trGrossProfit = $('<tr>').css('color', 'red').addClass('csGrossProfite').append($('<th>').text('Gross Profit'));

    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        trHead.append(FinancialSectionPeriodName(o.periodName, o.id));
        trCurrency.append(FinancialSectionFixedTd(o.currency, o.id, 'currency'));
        trCustomer.append(FinancialSectionFixedTd(o.customerCount, o.id, 'customerCount'));
        trRevenue.append(FinancialSectionFixedTd(o.totalRevenue, o.id, 'totalRevenue'));
        trExpences.append(FinancialSectionFixedTd(o.totalExpence, o.id, 'totalExpence'));
        trGrossProfit.append(FinancialSectionFixedTd(o.grossProfit, o.id, 'grossProfit'));
    }


    trHead.append($('<th>')
            .addClass('hasTextAreaConverstion')
            .append($('<a>').addClass('addFinancialProjectionPeriod addFinancialProjectionCol')
                    .html('<i class="fas fa-plus-square"></i>')
                    )
            );

    thead.append(trHead);
    tbody.append(trCurrency);
    tbody.append(trCustomer);
    tbody.append(trRevenue);
    AddRevenueSectionList(tbody, res);
    tbody.append(trExpences);
    AddExpenseSectionList(tbody, res);
    tbody.append(trGrossProfit);
//    tbody.append(trSection);

    AddCommonFinancialSections(tbody, res);

    table.append(thead);
    table.append(tbody)
    $('.tr-revenue').after($(DetailRevenue));
    // DRTable.append($('<div>').addClass('close-fp-detail-btn-box').append($('<i class="fas fa-times"></i>')));
    getFinancialSectionDetailList();

}

function FinancialSectionPeriodName(periodName, id) {
    return $('<th>')
            .addClass('hasTextAreaConverstion')
            .append(convertTextAreaToTdSectionBulletEditbox(periodName))
            .append($('<div>')
                    .addClass('figureTextarea-box')
                    .append($('<textarea>')
                            .addClass("figureTextarea")
                            .css("display", "none")
                            .attr('data-type', 'editbox')
                            .addClass("providedServicesTextareaZad")
                            .attr('pid', id)
                            .attr('key', 'periodName')
                            .attr("onchange", "updateFinancialProjectionInfo4Short(this)")
                            .text(periodName))
                    .append($('<label>')
                            .addClass('expander')
                            )
                    )
            .append($('<div>')
                    .addClass('textarea-full-blure-bg')
                    )
            .append($('<div class="removeColFinancialProjectBox">')
                    .append($('<a href="#">')
                            .addClass('removeColFinancialProject')
                            .html('<i class="fa fa-trash"></i> Trash')
                            ))

}

function AddCommonFinancialSections(tbody, res) {
    var idx1 = getIndexOfTable(res, "sectionList");
    try {
        var obj1 = res.tbl[idx1].r;
        for (var i = 0; i < obj1.length; i++) {
            var o1 = obj1[i];

            var trSec = $('<tr>').append($('<th>')
                    .addClass('hasTextAreaConverstion')
                    .append(convertTextAreaToTdSectionBulletEditbox(o1.sectionName))
                    .append($('<div>')
                            .addClass('figureTextarea-box')
                            .append($('<textarea>')
                                    .addClass("figureTextarea")
                                    .css("display", "none")
                                    .attr('data-type', 'editbox')
                                    .addClass("providedServicesTextareaZad")
                                    .attr('pid', o1.id)
                                    .attr('key', 'sectionName')
                                    .attr("onchange", "updateFinancialProjectionSectionInfo4Short(this)")
                                    .text(o1.sectionName)
                                    )
                            .append($('<label>')
                                    .addClass('expander')
                                    )
                            )
                    .append($('<div>')
                            .addClass('textarea-full-blure-bg')
                            )
                    );
            var obj = res.tbl[0].r;
            for (var j = 0; j < obj.length; j++) {
                var o = obj[j];
                trSec.append($('<td>')
                        .addClass("hasFiancialSectionBodyList")
                        .attr('sectionId', o.id)
                        .attr('projectionId', o1.id)
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletItem(''))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'item')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('sectionid', o.id)
                                        .attr('projectionid', o1.id)
                                        .attr('key', 'sectionBody')
                                        .attr("onchange", "addFinancialSectionDetails(this)")
                                        .text('')
                                        )
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        );
            }
            tbody.append(trSec);
            trSec.append($('<td>')
                    .addClass('tdCenter')
                    .append($('<a>')
                            .attr('onclick', "deleteBcFinancialSection('" + o1.id + "')")
                            .html('<i class="fa fa-trash summ-icon" aria-hidden="true"></i>')
                            )
                    );
        }


// DetailRevenue and DetailExpences END



       
        tbody.append(trSection);
    } catch (err) {
    }
}

function FinancialSectionFixedTd(text, id, key) {
    return $('<td>')
            .addClass('hasTextAreaConverstion')
            .append(convertTextAreaToTdSectionBulletEditbox(text))
            .append($('<div>')
                    .addClass('figureTextarea-box')
                    .append($('<textarea>')
                            .addClass("figureTextarea")
                            .css("display", "none")
                            .attr('data-type', 'editbox')
                            .addClass("providedServicesTextareaZad")
                            .attr('pid', id)
                            .attr('key', key)
                            .attr("onchange", "updateFinancialProjectionInfo4Short(this)")
                            .text(text)
                            )
                    .append($('<label>')
                            .addClass('expander')
                            )
                    )
            .append($('<div>')
                    .addClass('textarea-full-blure-bg')
                    )

}

function AddRevenueSectionList(tbody, res) {
    var idx1 = getIndexOfTable(res, "sectionRevenueList");
    try {
        var obj1 = res.tbl[idx1].r;
        for (var i = 0; i < obj1.length; i++) {
            var o1 = obj1[i];

            var trSec = $('<tr>')
                    .css("background-color", "#d8effb")
                    .css("display", (revenue_tab === 'fa-chevron-up') ? "" : "none")
                    .css("border", "2px white solid")
                    .addClass('revenueSectionListDetailsZadShey')
                    .append($('<th>')
                            .addClass('hasTextAreaConverstion')
                            .append(convertTextAreaToTdSectionBulletEditbox(o1.sectionName))
                            .append($('<div>')
                                    .addClass('figureTextarea-box')
                                    .append($('<textarea>')
                                            .addClass("figureTextarea")
                                            .css("display", "none")
                                            .attr('data-type', 'editbox')
                                            .addClass("providedServicesTextareaZad")
                                            .attr('pid', o1.id)
                                            .attr('key', 'sectionName')
                                            .attr("onchange", "updateFinancialProjectionSectionInfo4Short(this)")
                                            .text(o1.sectionName)
                                            )
                                    .append($('<label>')
                                            .addClass('expander')
                                            )
                                    )
                            .append($('<div>')
                                    .addClass('textarea-full-blure-bg')
                                    )
                            );
            var obj = res.tbl[0].r;
            for (var j = 0; j < obj.length; j++) {
                var o = obj[j];
                trSec.append($('<td>')
                        .addClass("hasNoFiancialSectionBodyList")
                        .attr('sectionId', o.id)
                        .attr('projectionId', o1.id)
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(''))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'editbox')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('sectionid', o.id)
                                        .attr('projectionid', o1.id)
                                        .attr('key', 'sectionBody')
                                        .attr("onchange", "addFinancialSectionDetails(this)")
                                        .text('')
                                        )
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        );
            }

            trSec.append($('<td>')
                    .addClass('tdCenter')
                    .append($('<a>')
                            .attr('onclick', "deleteBcFinancialSection('" + o1.id + "')")
                            .html('<i class="fa fa-trash summ-icon" aria-hidden="true"></i>')
                            )
                    );

            tbody.append(trSec);

        }
    } catch (err) {
    }
    tbody.append($('<tr>')
            .addClass('revenueSectionListDetailsZadShey')
            .css("display", (revenue_tab === 'fa-chevron-up') ? "" : "none")
            .css('text-align','right')
            .append($('<th>').css('color','#525596')
            .append('<a href="#" class="addFinancialProjectionRevenueLine" title="Add Period"  style="color: rgb(82, 85, 150);" >Add row <i class="fas fa-plus-square" style="color:green" aria-hidden="true"></i></a>')
                )
                
            )
}

function AddExpenseSectionList(tbody, res) {
    var idx1 = getIndexOfTable(res, "sectionExpenseList");
    try {
        var obj1 = res.tbl[idx1].r;
        for (var i = 0; i < obj1.length; i++) {
            var o1 = obj1[i];

            var trSec = $('<tr>')
                    .css("background-color", "#ffe0e0")
                    .css("display", (expense_tab === 'fa-chevron-up') ? "" : "none")
                    .css("border", "2px white solid")
                    .addClass('expenseSectionListDetailsZadShey')
                    .append($('<th>')
                            .addClass('hasTextAreaConverstion')
                            .append(convertTextAreaToTdSectionBulletEditbox(o1.sectionName))
                            .append($('<div>')
                                    .addClass('figureTextarea-box')
                                    .append($('<textarea>')
                                            .addClass("figureTextarea")
                                            .css("display", "none")
                                            .attr('data-type', 'editbox')
                                            .addClass("providedServicesTextareaZad")
                                            .attr('pid', o1.id)
                                            .attr('key', 'sectionName')
                                            .attr("onchange", "updateFinancialProjectionSectionInfo4Short(this)")
                                            .text(o1.sectionName)
                                            )
                                    .append($('<label>')
                                            .addClass('expander')
                                            )
                                    )
                            .append($('<div>')
                                    .addClass('textarea-full-blure-bg')
                                    )
                            );
            var obj = res.tbl[0].r;
            for (var j = 0; j < obj.length; j++) {
                var o = obj[j];
                trSec.append($('<td>')
                        .addClass("hasNoFiancialSectionBodyList")
                        .attr('sectionId', o.id)
                        .attr('projectionId', o1.id)
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(''))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'editbox')

                                        .addClass("providedServicesTextareaZad")
                                        .attr('pid', o.id)
                                        .attr('sectionid', o.id)
                                        .attr('projectionid', o1.id)
                                        .attr('key', 'sectionBody')
                                        .attr("onchange", "addFinancialSectionDetails(this)")
                                        .text('')
                                        )
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        );
            }

            trSec.append($('<td>')
                    .addClass('tdCenter')
                    .append($('<a>')
                            .attr('onclick', "deleteBcFinancialSection('" + o1.id + "')")
                            .html('<i class="fa fa-trash summ-icon" aria-hidden="true"></i>')
                            )
                    );

            tbody.append(trSec);

        }
    } catch (err) {
    }
    tbody.append($('<tr>')
            .css("display", (expense_tab === 'fa-chevron-up') ? "" : "none")
            .css('text-align','right')
            .addClass('expenseSectionListDetailsZadShey')
                .append($('<th>')
                .css('color','#525596')
                    .append('<a href="#" class="addFinancialProjectionExpenseLine" title="Add Period" style="color: rgb(82, 85, 150);">Add row <i class="fas fa-plus-square" style="color:green" aria-hidden="true"></i></a>')
                )
        )
}


function deleteBcFinancialSection(sectionId) {


    if (!activeBCId || !sectionId)
        return;


    if (!confirm("Are you sure?")) {
        return;
    }

    var json = initJSON();
    json.kv.id = sectionId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmdeleteBcFinancialSection",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getFinancialProjectionZoneList();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getFinancialSectionDetailList() {
    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetFinancialSectionDetailList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            var obj = res.tbl[0].r;
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                var sectionId = o.fkFinancialSectionId;
                var projectionId = o.fkFinancialProjectionId;

                $('.hasFiancialSectionBodyList[sectionid=' + sectionId + '][projectionid=' + projectionId + ']')
                        .each(function () {

                            $(this).html('')
                                    .append(convertTextAreaToTdSectionBulletItem(o.sectionBody))
                                    .append($('<div>')
                                            .addClass('figureTextarea-box')
                                            .append($('<textarea>')
                                                    .addClass("figureTextarea")
                                                    .css("display", "none")
                                                    .attr('data-type', 'item')

                                                    .addClass("providedServicesTextareaZad")
                                                    .attr('pid', o.id)
                                                    .attr('sectionid', sectionId)
                                                    .attr('projectionid', projectionId)
                                                    .attr('key', 'sectionBody')
                                                    .attr("onchange", "addFinancialSectionDetails(this)")
                                                    .text(o.sectionBody))
                                            .append($('<label>')
                                                    .addClass('expander')
                                                    )
                                            )
                                    .append($('<div>')
                                            .addClass('textarea-full-blure-bg')
                                            )

                        })

                $('.hasNoFiancialSectionBodyList[sectionid=' + sectionId + '][projectionid=' + projectionId + ']')
                        .each(function () {

                            $(this).html('')
                                    .append(convertTextAreaToTdSectionBulletEditbox(o.sectionBody))
                                    .append($('<div>')
                                            .addClass('figureTextarea-box')
                                            .append($('<textarea>')
                                                    .addClass("figureTextarea")
                                                    .css("display", "none")
                                                    .attr('data-type', 'editbox')

                                                    .addClass("providedServicesTextareaZad")
                                                    .attr('pid', o.id)
                                                    .attr('sectionid', sectionId)
                                                    .attr('projectionid', projectionId)
                                                    .attr('key', 'sectionBody')
                                                    .attr("onchange", "addFinancialSectionDetails(this)")
                                                    .text(o.sectionBody))
                                            .append($('<label>')
                                                    .addClass('expander')
                                                    )
                                            )
                                    .append($('<div>')
                                            .addClass('textarea-full-blure-bg')
                                            )

                        })

            }
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function addFinancialSectionDetails(el) {
    var sectionid = $(el).attr('sectionid'),
            projectiondId = $(el).attr('projectionid');

    if (!activeBCId || !sectionid || !projectiondId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    json.kv.fkFinancialProjectionId = projectiondId;
    json.kv.fkFinancialSectionId = sectionid;
    json.kv.sectionBody = $(el).val();
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmaddFinancialSectionDetails",
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

function convertTextAreaToTdSectionBulletEditbox(txt) {
    var ul = $('<div>')
            .css('line-height', '25px')
            .css('list-style-type', 'none')
            .addClass('convertedTextAreaLines');
    try {

        ul.append($('<span>')

                .css('border-radius', '5px')
                .css('padding', '2px 5px')
                .css('margin', '2px 5px')
//                .css('background-color', 'yellow')
                .addClass('convertedTextAreaLinesItem')
                .text(txt)
//                .prepend($('<i class="fa fa-check">')
//                        .css('font-size', '15px')
//                        .css('color', 'red'))
                .prepend(' ')
                )
        ul.append($('<a href="#">')
                .addClass('convertedTextAreaLinesShey')
                .html('<i class="fas fa-edit"></i>'))
    } catch (err) {
    }
    return ul;
}

function convertTextAreaToTdSectionBulletItem(txt) {
    var ul = $('<div>')
            .css('line-height', '25px')
            .css('list-style-type', 'none')
            .addClass('convertedTextAreaLines');
    try {
        var r = txt.split(/\r*\n/);
        for (var i = 0; i < r.length; i++) {
            var ln = r[i];
            if (!ln.trim()) {
                continue;
            }
            ul.append($('<span>')

                    .css('border-radius', '5px')
                    .css('background-color', '#ffd1d1')
                    .css('border', '1px solid rgb(247 168 168)')
                    .css('color', '#e14545')
                    .css('padding', '3px 7px 3px 7px')
                    .css('margin-bottom', '6px')
                    .addClass('convertedTextAreaLinesItem')
                    .text(ln)
                    .append('<br>')
                    .prepend($('<i class="fa fa-check">')
                            .css('font-size', '15px')
                            .css('margin-right', '10px')
                            .css('color', '#e14545'))
                    .prepend('')

                    )
        }
        ul.append($('<a href="#">')
                .addClass('convertedTextAreaLinesShey')
                .html('<i class="fas fa-edit"></i>'))
    } catch (err) {
    }
    return ul;
}


function convertTextAreaToTdSectionBullet(txt) {
    var ul = $('<div>')
            .css('line-height', '25px')
            .css('list-style-type', 'none')
            .addClass('convertedTextAreaLines ProvidedServicesasaSolution');
    try {
        var r = txt.split(/\r*\n/);
        for (var i = 0; i < r.length; i++) {
            var ln = r[i];
            if (!ln.trim()) {
                continue;
            }
            ul.append($('<span>')

                    .css('border-radius', '5px')
                    .css('background-color', '#e2fb55')
                    .css('border', '1px solid rgb(160 181 46 / 50%)')
                    .css('color', '#525596')
                    .addClass('convertedTextAreaLinesItem')
                    .text(ln)
                    .prepend($('<i class="fa fa-check">')
                            .css('font-size', '15px')
                            .css('color', '#6a7a11'))
                    .prepend(' ')
                    )
        }
        ul.append($('<a href="#">')
                .addClass('convertedTextAreaLinesShey')
                .html('<i class="fas fa-edit"></i>'))
    } catch (err) {
    }
    return ul;
}

function createSingleFinancialProjectionZone() {
    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmcreateSingleFinancialProjectionZone",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
//            generateSectionDiv(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function deleteCompetitor(competitorId) {
    if (!confirm("Are you sure?")) {
        return;
    }

    if (!competitorId)
        return;

    var json = initJSON();
    json.kv.competitorId = competitorId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmDeleteCompetitor",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            generateCompetitorFeatureMatrix();
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
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
                    .append($('<div class="col-12">')
            //         <div class="cs-headline-by-content">
            //     <h5>General Description</h5>
            // </div>
                    .append($('<div>')
                            .addClass('cs-headline-by-content')
                                .append($("<h5>")
                                    .css('padding-bottom', '10px')
                                    .text(replaceTags(obj.sectionName))
                                )
                            )
                        )
                )
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

function insertNewProvidedService() {
    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTminsertNewProvidedService",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            try {
                getBusinessProvidedServiceList();
            } catch (err) {
            }
        },
        error: function () {
            Toaster.showError(('Something Went Wrong.'));
        }
    });
}

function getBusinessProvidedServiceList() {
    if (!activeBCId)
        return;

    var json = initJSON();
    json.kv.fkBcId = activeBCId;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetProvidedServiceList",
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

function getBusinessServiceRel() {
    if (!activeBCId)
        return;

    var json = initJSON();
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



$(document).on("change", '.competitorFeatureAddRemove', function (e) {
    var competitorId = $(this).attr('competitorId'),
            serviceId = $(this).attr('serviceId'),
            feature = $(this).attr('feature');
    if ($(this).is(':checked')) {
        $(this).closest('span').css({'background-color': 'greenyellow', 'color': '#525596'});
        insertNewBsCompetitorFeature(competitorId, serviceId, feature);
    } else {
        $(this).closest('span').css('background-color', '')
        removeBsCompetitorFeature(competitorId, serviceId, feature);
    }
})


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

function insertNewBsCompetitorFeature(competitorId, serviceId, feature) {


    if (!(activeBCId) || !competitorId || !serviceId || !feature)
        return;
    var json = initJSON();

    json.kv.fkBcId = activeBCId;
    json.kv.competitorId = competitorId;
    json.kv.serviceId = serviceId;
    json.kv.feature = feature;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTminsertNewBsCompetitorFeature",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            AJAXCallFeedback(res);
        },
        error: function () {
            Toaster.showError(('Something went wrong!!!'));
        }
    });
}

function removeBsCompetitorFeature(competitorId, serviceId, feature) {


    if (!(activeBCId) || !competitorId || !serviceId || !feature)
        return;
    var json = initJSON();

    json.kv.fkBcId = activeBCId;
    json.kv.competitorId = competitorId;
    json.kv.serviceId = serviceId;
    json.kv.feature = feature;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmremoveBsCompetitorFeature",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            AJAXCallFeedback(res);
        },
        error: function () {
            Toaster.showError(('Something went wrong!!!'));
        }
    });
}

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


$(document).on("click", '.main-bc-tr', function (e) {
    activeBCId = $(this).attr("id");
    var caseName = $(this).find('.main-bc-name').html();
    loadMainBusinesCaseBody(caseName)
})

function loadMainBusinesCaseBody(caseName) {
    $('#business_case_heading').html(caseName)
    $('#business_case_description').text("asdfasd")
    getProblemStatList();
    getBusinessProvidedServiceList();
    generateCompetitorFeatureMatrix();
    getFinancialProjectionZoneList();
//    getKeyPartner();
//    getKeyResource();
    getBCSectionsList();

}

$(document).on("click", '.bc-tr', function (e) {
    $(this).closest('.dropdown-menu').find('.bc-tr').removeClass("active");
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

// $(document).on("click", function () {
//     new FroalaEditor(".exercusiveEditor", {
//         enter: FroalaEditor.ENTER_P,
//         height: 150,
//         toolbarInline: true
//     })

// })

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
    insertNewBusinessCaseDetails(caseName);   
    $('#newBusinessCaseName').val('');
}


function insertNewBusinessCaseDetails(caseName,isAsync,status) {
   
    if (!(caseName))
        return;
    
    var stat = (status) ? status : "A"
    
    var sync = (isAsync) ? isAsync : true;

    var json = initJSON();
      json.kv.caseName = caseName;
      json.kv.status=stat;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBusinessCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: sync,
        success: function (res) {
            getNewExecutiveTable();
            $('#newBusinessCaseName').val('')

        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    $('#newBusinessCaseName').val('')
}


function insertNewBusinessCaseDetailsForTraining(caseName) {
   
    if (!(caseName))
        return;
    
    var res1  = "";

    var json = initJSON();
    json.kv.caseName = caseName;
    json.kv.status='L';
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmInsertNewBusinessCase",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            res1 = res;
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
    return res1;
}

// 2 E.S_______________________________________________________________  

function ExecutiveSummaryTable(res) {
    var dropdown = $('#executiveInsert');
    dropdown.html('');
    var t = dropdown.addClass('cs-et-hover')

    var obj = res.tbl[0].r;
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        var t = $('<a>')
                .addClass('dropdown-item')
                .addClass('main-bc-tr')
                .addClass('bc-tr')
                .attr("id", o.id)
                .attr('ondblclick', 'updateLineCaseName(this,"' + o.id + '")')
                .addClass('testCaseListborder')
                .append($('<span>')
                        .addClass("main-bc-name")
                        .append(replaceTags(o.caseName))
                        )
                .append($('<span>').append((o.caseNo)))

        dropdown.append(t);
    }
    $('.main-bc-tr').first().click();
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

    var json = initJSON();

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
    if (!(activeBCId))
        return;
    var json = initJSON();

    json.kv.fkBcId = activeBCId;
    json.kv.problemDesc = "";
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
        var serviceDiv = convertProblemServicesToCircleFormat(res, o.fkBcServiceId, o.id);
        var t = $('<tr>')
                .addClass('bc-tr')
                .addClass('testCaseListborder')
                .append($('<td>').append(i + 1))
                .append($('<td>')
                        .attr("sa-bc-pr-key", "problemDesc")
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(o.segment))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .attr('data-type', 'editbox')
                                        .addClass("figureTextarea")
                                        .css("display", "none")

                                        .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                        .attr("pid", o.id)
                                        .attr("ptype", "segment")
                                        .addClass('bc-probdesc-textarea')
                                        .val(o.segment))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )
                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(o.problemDesc))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .attr('data-type', 'editbox')
                                        .addClass("figureTextarea")
                                        .css("display", "none")

                                        .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                        .attr("pid", o.id)
                                        .attr("ptype", "problemDesc")
                                        .addClass('bc-probdesc-textarea')
                                        .val(o.problemDesc))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )
                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(o.countPotentialCustomer))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .attr('data-type', 'editbox')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                        .attr("pid", o.id)
                                        .attr("ptype", "countPotentialCustomer")
                                        .addClass('bc-probdesc-counts')
                                        .val(o.countPotentialCustomer))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )
                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(o.countRealCustomer))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .attr('data-type', 'editbox')
                                        .addClass("figureTextarea")
                                        .css("display", "none")


                                        .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                        .attr("pid", o.id)
                                        .attr("ptype", "countRealCustomer")
                                        .addClass('bc-probdesc-counts')
                                        .val(o.countRealCustomer))

                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )
                .append($('<td>')
                        .append(serviceDiv)
//                        .append("<br>")
                        .append($('<a href="#">')
                                .attr('pid', o.id)
                                .css("color", "#525596")
                                .addClass("newProblemStateService")
                                .html('<i class="fas fa-user-cog"></i> Add Service')))
                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.fkBcKeyResourceId))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'textarea')

                                        .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                        .attr("pid", o.id)
                                        .attr("ptype", "fkBcKeyResourceId")
                                        .addClass('bc-probdesc-textarea')
                                        .val(o.fkBcKeyResourceId))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )

                .append($('<td>')
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.fkBcKeyPartnerId))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .css("display", "none")
                                        .addClass("figureTextarea")
                                        .attr('data-type', 'textarea')

                                        .attr('onchange', 'updateCaseProblemStat4ShortDesc(this,"' + o.id + '")')
                                        .attr("pid", o.id)
                                        .attr("ptype", "fkBcKeyPartnerId")
                                        .addClass('bc-probdesc-textarea')
                                        .val(o.fkBcKeyPartnerId))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )

                        )
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

$(document).on('click', '.newProblemStateService', function (ev) {
    var pid = $(this).attr('pid');
    addServiceToProblemStatementModal(pid);
});

var problemStatementId4Adding = '';

function generateCompetitorFeatureMatrix() {
    try {
        var competitorList = generateCompetitorFeatureMatrix_CompetitorList();
        var serviceList = generateCompetitorFeatureMatrix_ServiceList();
        generateCompetitorFeatureMatrixBinderHeader(competitorList, serviceList);
        generateCompetitorFeatureMatrixBinder(competitorList, serviceList);
    } catch (err) {
    }
}

function generateCompetitorFeatureMatrixBinderHeader(compList, serviceList) {

    var header = $('#competitorServicesListHeader');
    header.empty();

    var tr = $('<tr>')
            .append($("<th>").text('#'))
            .append($("<th>").text('Competitor'))
            .append($("<th>").text('Competitor Description'))

    try {
        var obj = serviceList.tbl[0].r;
        for (let i = 0; i < obj.length; i++) {
            var o = obj[i];
            tr.append($("<th>").text(o.serviceName))
        }
    } catch (eee) {

    }
    tr.append($("<th>").text(''));
    header.append(tr);


}

function getCompetitorFeatureList(competitorId) {


    if (!competitorId)
        return;
    var list = {};

    var json = initJSON();
    json.kv.fkCompetitorId = competitorId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetCompetitorFeatureList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {
            var obj = res.tbl[0].r;
            for (let i = 0; i < obj.length; i++) {
                var o = obj[i];
                list[o.fkServiceId] = o.feature;
            }

        }
    });
    return list;
}

function generateCompetitorFeatureMatrixBinder(compList, serviceList) {
//    var header = $('#competitorServicesListHeader');
    var body = $('#competitorServicesFeature');
    body.empty();
//    header.empty();

    var obj = compList.tbl[0].r;
    for (let i = 0; i < obj.length; i++) {
        var o = obj[i];
        var competitorFeatureList = getCompetitorFeatureList(o.id);
        var tr = $('<tr>')
                .append($("<td>").text(i + 1))
                .append($("<td>")
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBulletEditbox(o.competitorName))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'editbox')

                                        .attr('pid', o.id)
                                        .attr("key", "competitorName")
                                        .attr('onchange', 'updateCompetitorInfo4Short(this)')
                                        .val(o.competitorName))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )
                .append($("<td>")
                        .addClass('hasTextAreaConverstion')
                        .append(convertTextAreaToTdSectionBullet(o.competitorDescription))
                        .append($('<div>')
                                .addClass('figureTextarea-box')
                                .append($('<textarea>')
                                        .addClass("figureTextarea")
                                        .css("display", "none")
                                        .attr('data-type', 'textarea')

                                        .attr('pid', o.id)
                                        .attr("key", "competitorDescription")
                                        .attr('onchange', 'updateCompetitorInfo4Short(this)')
                                        .val(o.competitorDescription))
                                .append($('<label>')
                                        .addClass('expander')
                                        )
                                )
                        .append($('<div>')
                                .addClass('textarea-full-blure-bg')
                                )
                        )

        try {
            var obj2 = serviceList.tbl[0].r;
            for (let j = 0; j < obj2.length; j++) {
                var oo = obj2[j];
                var features = convertProblemServicesToCircleFormatForCompetitors(competitorFeatureList, oo.feature, o.id, oo.id)
                tr.append($("<td>").append(features))
            }
        } catch (err) {
        }

        tr.append($('<td>').addClass('tdCenter')
                .append($('<a>')
                        .attr('onclick', "deleteCompetitor('" + o.id + "')")
                        .append($('<i class="fa fa-trash">')
//                                        .css("color", "blue")
                                .attr('aria-hidden', 'true')
                                .addClass('summ-icon')))
                .css("custor", "pointer"))
        body.append(tr);
    }

}

function updateCompetitorInfo4Short(el) {
    var id = $(el).attr("pid"),
            key = $(el).attr('key'),
            value = $(el).val();

    if (!id || !key || !value)
        return;

    var json = initJSON();
    json.kv.id = id;
    json.kv.key = key;
    json.kv.value = value;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmupdateCompetitorInfo4Short",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

        }
    });
}

function generateCompetitorFeatureMatrix_ServiceList() {
    if (!activeBCId)
        return;
    var list = [];
    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmgetProvidedServiceList4Combo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

            list = res;
        }
    });
    return list;
}


function generateCompetitorFeatureMatrix_CompetitorList() {
    if (!activeBCId)
        return;
    var list = [];
    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCompetitorList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: false,
        success: function (res) {

            list = res;
        }
    });
    return list;
}



function insertNewCompetitor(el) {
    if (!activeBCId)
        return;

    var val = $(el).val();

    if (!val.trim()) {
        return;
    }

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    json.kv.competitorName = val;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTminsertNewCompetitor",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            $(el).val('');
            try {
                generateCompetitorFeatureMatrix();
            } catch (err) {
            }
        }
    });

}

function addServiceToProblemStatementModal(problemStatementId) {
    if (!activeBCId || !problemStatementId)
        return;

    problemStatementId4Adding = problemStatementId;
    $('#addServiceToProblemStatementModal').modal('show');

    var json = initJSON();
    json.kv.fkBcId = activeBCId;

    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetProvidedServiceList4Combo",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            try {
                getBusinessServiceRelDetails4Problem(res);
            } catch (err) {
            }
        }
    });


}


function addServiceToProblemStatementAction(el) {
    var val = "";
    $('.serviceListCheckbox').each(function () {
        val += $(this).is(':checked') ? $(this).attr('pid') + ',' : "";
    })

    addServiceToBusinessCaseProblem(problemStatementId4Adding, val);



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
    // $(el).closest("td").html($(el).val());
}




function updateProvidedServices4Short(el) {
    var id = $(el).attr('pid'),
            key = $(el).attr('key'),
            value = $(el).val();

    if (!id || !key || !value) {
        return;
    }

    var json = {kv: {}};
    try {
        json.kv.cookie = getToken();
    } catch (err) {
    }
    json.kv.id = id;
    json.kv.key = key;
    json.kv.value = value;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmupdateProvidedServices4Short",
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


function addServiceToBusinessCaseProblem(problemId, serviceId) {
    if (!problemId || !serviceId) {
        return;
    }


    var json = initJSON();
    json.kv.problemId = problemId;
    json.kv.serviceId = serviceId;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmaddServiceToBusinessCaseProblem",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getProblemStatList();
            $('#addServiceToProblemStatementModal').modal('hide');
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}

function updateCaseProblemStat4ShortDetails(id, type, val, isAsync) {
    if (!id || !type || !val) {
        return;
    }

    var syncType = (isAsync) ? isAsync : true;

    var json = initJSON();
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
        async: syncType,
        success: function (res) {
        },
        error: function () {
            Toaster.showError(('Something Happened'));
        }
    });
}


function updateFinancialProjectionSectionInfo4Short(el) {
    var id = $(el).attr('pid'),
            key = $(el).attr('key'),
            value = $(el).val();

    if (!id || !key || !value) {
        return;
    }

    var json = initJSON();
    json.kv.id = id;
    json.kv.key = key;
    json.kv.value = value;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmupdateFinancialProjectionSectionInfo4Short",
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




function updateFinancialProjectionInfo4Short(el) {
    var id = $(el).attr('pid'),
            key = $(el).attr('key'),
            value = $(el).val();

    if (!id || !key || !value) {
        return;
    }

    var json = initJSON();
    json.kv.id = id;
    json.kv.key = key;
    json.kv.value = value;
    var that = true;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmupdateFinancialProjectionInfo4Short",
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

    updateCaseProblemStat4ShortDetails(id, type, val)
}

 
//3  P.S_______________________________________________________________  
function getProblemStatList(e) {
    if (!activeBCId) {
        return;
    }

    var json = initJSON();
    json.kv.fkBcId = activeBCId;
    var that = this;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceTmGetCaseProblemStatementList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
             try {
                 businessCaseDesc  = res.kv.caseDesc;
                tinyMCE.get('business_case_description').setContent(res.kv.caseDesc);
                 
            } catch (err) {
            }
            try {
                
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

$(document).on("click", '.newBusinessCase', function (e) {
    $('.nbc-input-box').show();
});

$(document).on("change", '.nbc-input-box input', function (e) {
    $('.nbc-input-box').hide();
});

var revenue_tab = 'fa-chevron-down';
var expense_tab = 'fa-chevron-down';

$(document).on("click", '.fbdetailtabs', function (e) {
    var ls = $(this).find('.fas');
    ls.toggleClass('fa-chevron-up fa-chevron-down');

    if (ls.hasClass('fa-chevron-up')) {
        if ($(this).hasClass('fpd-revenue')) {
            $('.revenueSectionListDetailsZadShey').show();
            revenue_tab = 'fa-chevron-up';
        }

        if ($(this).hasClass('fpd-expenses')) {
            $('.expenseSectionListDetailsZadShey').show();
            expense_tab = 'fa-chevron-up';
        }
    }

    if (ls.hasClass('fa-chevron-down')) {
        if ($(this).hasClass('fpd-revenue')) {
            $('.revenueSectionListDetailsZadShey').hide();
            revenue_tab = 'fa-chevron-down';
        }

        if ($(this).hasClass('fpd-expenses')) {
            $('.expenseSectionListDetailsZadShey').hide();
            expense_tab = 'fa-chevron-down';

        }
    }


});

function setBCasescripts() {

    tinymce.init({
        selector: '#business_case_description',
        height: 200,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        convert_urls: false,

        toolbar: 'undo redo | link image | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | fullscreen code',
        /* enable title field in the Image dialog*/
        image_title: true,
        /* enable automatic uploads of images represented by blob or data URIs*/
        automatic_uploads: true,
        /*
         URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
         images_upload_url: 'postAcceptor.php',
         here we add custom filepicker only to Image dialog
         */
        file_picker_types: 'image',
        /* and here's our custom image picker*/
        file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            /*
             Note: In modern browsers input[type="file"] is functional without
             even adding it to the DOM, but that might not be the case in some older
             or quirky browsers like IE, so you might want to add it to the DOM
             just in case, and visually hide it. And do not forget do remove it
             once you do not need it anymore.
             */

            input.onchange = function () {
                var file = this.files[0];

                var reader = new FileReader();
                reader.onload = function () {
                    /*
                     Note: Now we need to register the blob in TinyMCEs image blob
                     registry. In the next release this part hopefully won't be
                     necessary, as we are looking to handle it internally.
                     */
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri(), {title: file.name});
                };
                reader.readAsDataURL(file);
            };

            input.click();
        },
        setup:function(ed) {
            ed.on('change', function(e) {
                var caseDesc = tinyMCE.get('business_case_description').getContent();
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
            });
        },


        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    });
        
}