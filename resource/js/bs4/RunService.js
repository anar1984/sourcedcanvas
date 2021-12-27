
function loadDocEditorRunService() {
    getRunServiceList();
    $('#run_service_project_name').selectpicker('refresh');
    setProjectListByID('run_service_project_name');
    $('#run_service_project_name').change();

    $('#run_service_name').selectpicker('refresh');
    $('#run_service_intensive_select').selectpicker('refresh');
    $('#run_service_repeat_select').selectpicker('refresh');
    $('#run_service_status_select').selectpicker('refresh');
    $('#run_service_weekday_select').selectpicker('refresh');
    $('#sdofm_day_of_Month_select').selectpicker('refresh');
    $('#swofm_fl_action_select').selectpicker('refresh');
    $('#swofm_weekday_select').selectpicker('refresh');

    $( "#runServiceStartDate" ).daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true
    });
    $( "#runServiceEndDate" ).daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true
    }); 
    $('#runServiceTime').datetimepicker({
        format: 'HH:mm'
        // sideBySide: true
    });
    $('#runServiceExecutiveDate').daterangepicker({
        format: 'YYYY/MM/DD',
        singleDatePicker: true,
        drops: 'up'
    });
    $('.hr_spa').hide();
    
$(document).ready(function() {

        $("#notification-email").keyup(function(){

            var email = $("#notification-email").val();

            if(email != 0)
            {
                if(isValidEmailAddress(email))
                {
                    $("#notification-email").css({
                        "border": "1px solid green", "background": "rgb(59 255 0 / 9%)"
                    });
                } else {
                    $("#notification-email").css({
                        "border": "1px solid red", "background": "rgb(255 0 0 / 9%)"
                    });
                }
            } else {
                $('#notification-email').removeAttr('style');        
            }

        });

        $("#days_before_last_day_of_month").keyup(function(){
            if($('#before_last_day_of_month').is(':checked')) {
                var elm_param = $("#days_before_last_day_of_month").val();
                $('#hide_actions_param').val(elm_param);
                }
        });
        

  });

    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }

    $(document).on("change", "#runServiceExecutiveDate", function (e) {
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');
        var runSEDate = $(this).val();
        $('#hide_actions_param').val(runSEDate);
    });

      $(document).on("change",'#sendnotification',function () { 
          
            if($(this).is(':checked')) {
                $(this).val('1');
            }else{
                $(this).val('0');
            }
       
       })
   
}

$(document).on("change", "#run_service_intensive_select", function (e) {
    $('#hide_actions').val();
    $('#hide_actions_param').val();
    var run_intensive = $('#run_service_intensive_select').val();
    run_action = run_intensive;
    switch (run_action) {
            case 'weekly':
                run_enabled = 'run-enabled';
            break;
            case 'monthly':
                run_enabled = 'run-enabled';
            break;
            case 'yearly':
                run_enabled = 'run-enabled';
            break;
        }
        if (run_enabled){
            $('.run-intensive').removeClass('run-enabled');
            $('.' + run_intensive + '-actions').addClass(run_enabled);
        }
        if (run_intensive == 'yearly'){
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');           
        }
        if (run_intensive == 'weekly'){
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');
            var run_sw_select = $('#run_service_weekday_select').val();
            $('#hide_actions_param').val(run_sw_select);
        }
        if (run_intensive == 'monthly'){
            $('#hide_actions').val('');
            $('#hide_actions_param').val('');
            
            if($('#first_day_of_month').is(':checked')) {
                $('#hide_actions').val('');
                $('#hide_actions_param').val('');      
                $('#hide_actions').val('first_day_of_month');
            }
            if($('#last_day_of_month').is(':checked')) {
                $('#hide_actions').val('');
                $('#hide_actions_param').val('');
                $('#hide_actions').val('last_day_of_month');
            }

            if($('#specific_day_of_month').is(':checked')) {
                $('.run_spa').removeClass('spa_enable');
                $('.hr_spa').hide();
                $('.hr_spa').show();

                $('.spa_sdofm_day_of_Month_select').addClass('spa_enable');
                $('#hide_actions').val('specific_day_of_month');
                var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select').val();
                $('#hide_actions_param').val(sdofm_day_of_Month_select);
            }
            if($('#before_last_day_of_month').is(':checked')) {
                $('#hide_actions').val('');
                $('#hide_actions_param').val('');

                $('#hide_actions').val('before_last_day_of_month');
                var days_before_last_day_of_month = $('#days_before_last_day_of_month').val();
                $('#hide_actions_param').val(days_before_last_day_of_month);
            }
            if($('#specific_weekday_of_month').is(':checked')) {
                $('#hide_actions').val('');
                $('#hide_actions_param').val('');
                
                $('#hide_actions').val('specific_weekday_of_month');
                var swofm_a1 = $('#swofm_fl_action_select').val();
                var swofm_a2 = $('#swofm_weekday_select').val();
                $('#hide_actions_param').val(swofm_a1);
                $('#hide_actions_param_2').val(swofm_a2);
            }
  
        }
        
});
//  var runServiceIS = $('#run_service_intensive_select').val();
// $("#runServiceExecutiveDate").keyup(function(){
//     if (runServiceIS == 'yearly'){
//         var vrun_sw_select = $('#runServiceExecutiveDate').val();
//         $('#hide_actions_param').val(vrun_sw_select);
//     }
// });
$(document).on("change", "#swofm_fl_action_select, #swofm_weekday_select", function (e) {
    $('#hide_actions_param').val('');
    var swofm_a1 = $('#swofm_fl_action_select').val();
    var swofm_a2 = $('#swofm_weekday_select').val();
    $('#hide_actions_param').val(swofm_a1);
    $('#hide_actions_param_2').val(swofm_a2);
});

$(document).on("change", "#run_service_weekday_select", function (e) {
    $('#hide_actions').val('');
    $('#hide_actions_param').val('');
    var run_service_weekday_select = $('#run_service_weekday_select').val();
    $('#hide_actions_param').val(run_service_weekday_select);

    if ($('#run_service_weekday_select').val()== 0){
        $('[data-id="run_service_weekday_select"]').css('border', '1px solid red').css('background', 'red').css('box-shadow','0px 0px 10px rgb(255 0 0 / 35%)');
        return false;
    }else{
        $('[data-id="run_service_weekday_select"]').removeAttr('style');
    }
});

$(document).on("change", "#sdofm_day_of_Month_select", function (e) {
    $('#hide_actions_param').val();
    var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select').val();
    $('#hide_actions_param').val(sdofm_day_of_Month_select);
});

$(document).on("change", ".checkcontainer input[type='radio']", function (e) {
    if($('#first_day_of_month').is(':checked')) {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();

        $('#hide_actions').val('');      
        $('#hide_actions').val('first_day_of_month');
        $('#hide_actions_param').val('');
    }
    if($('#last_day_of_month').is(':checked')) {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();

        $('#hide_actions').val('');
        $('#hide_actions_param').val('');

        $('#hide_actions').val('last_day_of_month');
    }
});

$(document).on("change", ".checkcontainer.spa input[type='radio']", function (e) {
    if($('#specific_day_of_month').is(':checked')) {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('.hr_spa').show();
        $('.spa_sdofm_day_of_Month_select').addClass('spa_enable');

        $('#hide_actions').val('');
        $('#hide_actions_param').val('');

        $('#hide_actions').val('specific_day_of_month');
        var sdofm_day_of_Month_select = $('#sdofm_day_of_Month_select').val();
        $('#hide_actions_param').val(sdofm_day_of_Month_select);
    }
    if($('#before_last_day_of_month').is(':checked')) {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('.hr_spa').show();
        $('.spa_days_before_last_day_of_month').addClass('spa_enable');
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');

        $('#hide_actions').val('before_last_day_of_month');
        var days_before_last_day_of_month = $('#days_before_last_day_of_month').val();
        $('#hide_actions_param').val(days_before_last_day_of_month);
    }
    if($('#specific_weekday_of_month').is(':checked')) {
        $('.run_spa').removeClass('spa_enable');
        $('.hr_spa').hide();
        $('.hr_spa').show();
        $('.spa_swofm_fl_action_select').addClass('spa_enable');
        $('.spa_swofm_weekday_select').addClass('spa_enable');
        $('#hide_actions').val('');
        $('#hide_actions_param').val('');      
        $('#hide_actions').val('specific_weekday_of_month');
        var swofm_a1 = $('#swofm_fl_action_select').val();
        var swofm_a2 = $('#swofm_weekday_select').val();
        $('#hide_actions_param').val(swofm_a1);
        $('#hide_actions_param_2').val(swofm_a2);
    }
});

function run_service_valid(){
    var em = $.trim($('input:required').val());
    if( $('#sendnotification').is(':checked')) {
        if ($.trim($('#notification-email').val()).length == 0){
            $('#notification-email').css('border', '1px solid red');
            if(em.length < 5){
                msgError = 'Please enter email';
                Toaster.showError(msgError);
                return false;
            }
        }else{
            $('#notification-email').removeAttr('style');
        }
    }else{
        $('#notification-email').removeAttr('style');
    }

    if ($.trim($('input:required#run_service_title').val()).length == 0){
        $('input:required#run_service_title').css('border', '1px solid red');
        return false;
    }else{
        $('#run_service_title').removeAttr('style');
    }

    if ($('#run_service_name').val()=='-1'){
        $('[data-id="run_service_name"]').css('border', '1px solid red').css('background', 'red').css('box-shadow','0px 0px 10px rgb(255 0 0 / 35%)');
        return false;
    }else{
        $('[data-id="run_service_name"]').removeAttr('style');
    }

    if ($.trim($('input:required#runServiceStartDate').val()).length == 0){
        $('input:required#runServiceStartDate').css('border', '1px solid red');
        return false;
    }else{
        $('#runServiceStartDate').removeAttr('style');
    }

    if ($.trim($('input:required#runServiceEndDate').val()).length == 0){
        $('input:required#runServiceEndDate').css('border', '1px solid red');
        return false;
    }else{
        $('#runServiceEndDate').removeAttr('style');
    }

    if ($.trim($('input:required#runServiceTime').val()).length == 0){
        $('input:required#runServiceTime').css('border', '1px solid red');
        return false;
    }else{
        $('#runServiceTime').removeAttr('style');
    }

    var val_sw_select = $('#run_service_intensive_select').val();
    if (val_sw_select == 'weekly'){
        if ($('#run_service_weekday_select').val()== 0){
            $('[data-id="run_service_weekday_select"]').css('border', '1px solid red').css('background', 'red').css('box-shadow','0px 0px 10px rgb(255 0 0 / 35%)');
            return false;
        }else{
            $('[data-id="run_service_weekday_select"]').removeAttr('style');
        }
    }

    if ($('#run_service_intensive_select').val()=='monthly'){
        if($('#before_last_day_of_month').is(':checked')) {
            if ($.trim($('input:required#days_before_last_day_of_month').val()).length == 0){
                $('input:required#days_before_last_day_of_month').css('border', '1px solid red');
                return false;
            }else{
                $('#days_before_last_day_of_month').removeAttr('style');
            }
        }
    }
    
    if ($('#run_service_intensive_select').val()=='yearly'){
        
        if ($.trim($('input:required#runServiceExecutiveDate').val()).length == 0){
            $('input:required#runServiceExecutiveDate').css('border', '1px solid red');
            return false;
        }else{
            $('#runServiceExecutiveDate').removeAttr('style');
        }
    }
    
    return true;
}

$(document).on('change', '#run_service_project_name', function (event) {
    var elm = $("#run_service_name").selectpicker('refresh');
    var val = $(this).val();
    getBacklogListByProject4Element(val, elm);
});
function converDatePicker(val) {
    try {
        val = val.split('/')
        stTime = val[2].trim() +"-"+ val[0].trim() +"-"+ val[1].trim();
            return stTime
    } catch (error) {
        return
    }
  
}
function reconverDatePicker(val) {
    try {
        val = val.split('-')
        stTime = val[2].trim() +"/"+ val[0].trim() +"/"+ val[1].trim();
            return stTime
    } catch (error) {
        return
    }
  
}

function createdRunServiceData() {
    var json = initJSON();
    json.kv.title = $('#run_service_title').val();
    json.kv.projectId = $('#run_service_project_name').val();
    json.kv.projectName = $('#run_service_project_name option:selected').text();
    json.kv.apiId = $('#run_service_name').val();
    json.kv.serviceName = $('#run_service_name option:selected').text();
    json.kv.json = $('#RunServiceJsonTextarea').val();
    json.kv.startDate = converDatePicker($('#runServiceStartDate').val());
    json.kv.endDate = converDatePicker($('#runServiceEndDate').val());
    json.kv.runTime =$('#runServiceTime').val();
    json.kv.intensive = $('#run_service_intensive_select').val();
    json.kv.repeatInterval = $('#run_service_repeat_select').val();
    json.kv.scheduleStatus = $('#run_service_status_select').val();
    json.kv.description = $('#RunServiceDescTextarea').val();
    json.kv.sendNotification = $('#sendnotification').val();
    json.kv.notificationMail = $('#notification-email').val();

    json.kv.action = $('#hide_actions').val();
    json.kv.actionParam = $('#hide_actions_param').val();
    json.kv.actionParam2 = $('#hide_actions_param_2').val();

    // json.kv.filename = zipfilename;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsCreateSchedule",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            //  var dataurl = urlGl + 'api/get/files/' + res.kv.filename;
            try {
               var err=  res.err.message;
               if(err){
                Toaster.showError(err);
               }

            } catch (error) {
                msgMessage = 'API successfully saved!';
                Toaster.showMessage(msgMessage);
            }
          
        },
        error: function () {
            Toaster.showError(('API error'));

        }
    });
}

function resetRunServiceList() {
    var table = $('.RunServicesTblStyle');
    var tbody = table.find("tbody#RunServiceTrlist");
    tbody.html("")
}
function resetRunServicePopUp() {
    $('#newRunBbusinessServiceBox select').val('');
    $('#newRunBbusinessServiceBox input').val('');
}

$(document).on("click", "#newRunBbusinessServiceSaveBtn", function (e) {

    if(run_service_valid()){
        resetRunServiceList();
        createdRunServiceData();
        getRunServiceList();
        msgMessage = 'Gool!!!!';
        Toaster.showMessage(msgMessage);
    }
    else{
        msgError = 'Fill in the required fields';
        Toaster.showError(msgError);
    }
    
});


function getRunServiceList() {
    var json = initJSON();
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsGetScheduleList",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
           TablelistRunServiceData(res);
        },
        error: function () {
            Toaster.showError(('Something Went Wrong list).'));
        }
    });
}

function TablelistRunServiceData(res) {
    var table = $('.RunServicesTblStyle');
 
    // var thead = table.find("thead"); 
    //     thead.html("")
    var tbody = table.find("tbody#RunServiceTrlist");
         tbody.html("")

    var obj = res.tbl[0].r;
    var idx = 1;
   
    for (var i = 0; i < obj.length; i++) {
        var o = obj[i];
        tbody.append($('<tr>')
            .append($('<td>')
                .append(idx++)
            )
            .append($('<td>').addClass('RunServiceTitleName')
                .append($('<span>').text(o.title))
            )
            .append($('<td>').addClass('RunServiceProjectName')
                .append($('<span>').text(o.projectName))
            )
            .append($('<td>').addClass('RunServiceName')
                .append($('<span>').text(o.serviceName))
            )
            .append($('<td>').addClass('RunServiceJson')
                .append($('<span>').text(o.json))
            )
            .append($('<td>').addClass('StartEndDates')
                .append($('<span>').text(o.startDate))
                .append($('<span>').text(o.endDate))
            )
            .append($('<td>').addClass('intensive')
                .append($('<span>').text(o.intensive))
            )
            .append($('<td>').addClass('repeat')
                .append($('<span>').text(o.repeatInterval))
            )
            .append($('<td>').addClass('RunTime')
                .append($('<span>').text(o.runTime))
            )
            .append($('<td>').addClass('Status cs-' + o.scheduleStatus)
                .append($('<span>').text(o.scheduleStatus))
            )
            .append($('<td>').addClass('tdCenter bcr-EditRemove')
                .append($('<a>').addClass('color-green mr-2')
                .css('color','green')
                .attr('data-toggle','modal')
                .attr('data-target', '#newRunBbusinessServiceBox')
                .attr('data-updated', + o.id)
                .attr('onclick', 'editRunBusinessServace("'+ o.id +'")')
                .append('<i class="fas fa-edit"></i>')
                )
                .append($('<a>').addClass('color-primary')
                .attr('onclick', 'deleteRunBusinessServace("'+ o.id +'")')
                .append('<i class="fas fa-trash"></i>')
                )
            )
        )
       
    }
}

function deleteRunBusinessServace(id) {
    if (!confirm("Are you sure?")) {
        return;
    }

    if (!(id))
        return;

    var json = initJSON();

    json.kv.id = id;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsDeleteSchedule",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            getRunServiceList(res);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

function detailRunBusinessServace() {
    //  $('#newRunBbusinessServiceBox').addClass('detailRBS-');
}

function editRunBusinessServace(id) {

    var json = initJSON();

    json.kv.id = id;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsGetScheduleById",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            var obj = res.tbl[0].r[0];

            $('#newRunServiceModalTitle').text('');
            $('#newRunServiceModalTitle').text('Update Auto Run Service');
       
            $('#run_service_title').val(obj.title);
            $('#run_service_title').change();

            $('#run_service_project_name').val(obj.projectId);
            $('#run_service_project_name').change();

            $('#run_service_name').val(obj.apiId);
            $('#run_service_name').change();

            $('#RunServiceJsonTextarea').val(obj.json);
            $('#RunServiceJsonTextarea').change();

            $('#runServiceStartDate').val(reconverDatePicker(obj.startDate));
            $('#runServiceStartDate').change();

            $('#runServiceEndDate').val(reconverDatePicker(obj.endDate));
            $('#runServiceEndDate').change();

            $('#runServiceTime').val(obj.runTime);
            $('#runServiceTime').change();

            $('#run_service_intensive_select').val(obj.intensive);
            $('#run_service_intensive_select').change();

            $('#run_service_repeat_select').val(obj.repeatInterval);
            $('#run_service_repeat_select').change();

            $('#run_service_status_select').val(obj.scheduleStatus);
            $('#run_service_status_select').change();

            $('#RunServiceDescTextarea').val(obj.description);
            $('#RunServiceDescTextarea').change();

             $("#"+obj.action).prop("checked",true);
             $("#"+obj.action).change();
                var tm = obj.actionParam;
                   try {
                       tm =  tm.split(",")
                   } catch (error) {}
             $("#run_service_weekday_select").val(tm);
             $("#run_service_weekday_select").change();
             
             $("#sdofm_day_of_Month_select").val(obj.actionParam);
             $("#sdofm_day_of_Month_select").change();

             $("#days_before_last_day_of_month").val(obj.actionParam);
             $("#days_before_last_day_of_month").change();

             $("#runServiceExecutiveDate").val(reconverDatePicker(obj.actionParam));
             $("#runServiceExecutiveDate").change();
             
             $("#swofm_fl_action_select").val(obj.actionParam);
             $("#swofm_fl_action_select").change();

             $("#swofm_weekday_select").val(obj.actionParam2);
             $("#swofm_weekday_select").change();
             
             if((obj.sendNotification) == '1') {
                $("#sendnotification").prop('checked', true);
                $("#sendnotification").change();
              }
             $('#notification-email').val(obj.notificationMail);
             $('#notification-email').change();
             
             $('.newRunBbusinessServiceSaveBtn').prop('id','newRunBbusinessServiceUpdateBtn');
             $('.newRunBbusinessServiceSaveBtn').text('Update');
             $('#newRunBbusinessServiceBox').attr('detail-runid', obj.id);
        },
        error: function () {
            Toaster.showError(('somethingww'));
        }
    });
}

$(document).on("click", "#newRunBbusinessServiceUpdateBtn", function (e) {

    if(run_service_valid()){
        updatedRunServiceData();
        resetRunServiceList();
        getRunServiceList();
        msgMessage = 'Gool!!!!';
        Toaster.showMessage(msgMessage);

        resetRunServicePopUp();
    }
    else{
        msgError = 'Fill in the required fields';
        Toaster.showError(msgError);
    }


});

function updatedRunServiceData(id) {
    var json = initJSON();
    json.kv.id = $('#newRunBbusinessServiceBox').attr('detail-runid');
    json.kv.title = $('#run_service_title').val();
    json.kv.projectId = $('#run_service_project_name').val();
    json.kv.projectName = $('#run_service_project_name option:selected').text();
    json.kv.apiId = $('#run_service_name').val();
    json.kv.serviceName = $('#run_service_name option:selected').text();
    json.kv.json = $('#RunServiceJsonTextarea').val();
    json.kv.startDate = converDatePicker($('#runServiceStartDate').val());
    json.kv.endDate = converDatePicker($('#runServiceEndDate').val());
    json.kv.runTime =$('#runServiceTime').val();
    json.kv.intensive = $('#run_service_intensive_select').val();
    json.kv.repeatInterval = $('#run_service_repeat_select').val();
    json.kv.scheduleStatus = $('#run_service_status_select').val();
    json.kv.description = $('#RunServiceDescTextarea').val();
    json.kv.sendNotification = $('#sendnotification').val();
    json.kv.notificationMail = $('#notification-email').val();

    json.kv.action = $('#hide_actions').val();
    json.kv.actionParam = $('#hide_actions_param').val();
    json.kv.actionParam2 = $('#hide_actions_param_2').val();

    // json.kv.filename = zipfilename;
    var data = JSON.stringify(json);
    $.ajax({
        url: urlGl + "api/post/srv/serviceRsUpdateSchedule",
        type: "POST",
        data: data,
        contentType: "application/json",
        crossDomain: true,
        async: true,
        success: function (res) {
            //  var dataurl = urlGl + 'api/get/files/' + res.kv.filename;
            try {
               var err=  res.err.message;
               if(err){
                Toaster.showError(err);
               }

            } catch (error) {
                msgMessage = 'API successfully saved!';
                Toaster.showMessage(msgMessage);
            }
          
        },
        error: function () {
            Toaster.showError(('API error'));

        }
    });
}