
function loadDocEditorRunService() {
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
        singleDatePicker: true
    });
    $( "#runServiceEndDate" ).daterangepicker({
        singleDatePicker: true
    }); 
    $('#runServiceTime').datetimepicker({
        format: 'HH:mm'
        // sideBySide: true
    });
    $('#runServiceExecutiveDate').daterangepicker({
        singleDatePicker: true
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

  });

    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }

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
            if($('#las_day_of_month').is(':checked')) {
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
  
        }
        
});

$(document).on("change", "#run_service_weekday_select", function (e) {
    $('#hide_actions').val('');
    $('#hide_actions_param').val('');
    var run_service_weekday_select = $('#run_service_weekday_select').val();
    $('#hide_actions_param').val(run_service_weekday_select);
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

function createdRunServiceData() {
    var json = initJSON();
    json.kv.title = $('#run_service_title').val();
    json.kv.projectId = $('#run_service_project_name').val();
    json.kv.serviceName = $('#run_service_name option:selected').text();
    json.kv.json = $('#RunServiceJsonTextarea').val();
    json.kv.startDate = $('#runServiceStartDate').val();
    json.kv.endDate = $('#runServiceEndDate').val();
    json.kv.runTime = $('#runServiceTime').val();
    json.kv.intensive = $('#run_service_intensive_select').val();
    json.kv.repeatInterval = $('#run_service_repeat_select').val();
    json.kv.scheduleStatus = $('#run_service_status_select').val();
    json.kv.description = $('#RunServiceDescTextarea').val();
    json.kv.sendNotification = $('#sendNotification').val();
    json.kv.notificationMail = $('#notification-email').val();

    json.kv.action = $('#hide_actions').val();
    json.kv.actionParam = $('#hide_actions_param').val();

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

$(document).on("click", "#newRunBbusinessServiceSaveBtn", function (e) {

    if(run_service_valid()){

        createdRunServiceData();
        
        msgMessage = 'Cool!!!!';
        Toaster.showMessage(msgMessage);
    }
    else{
        msgError = 'Fill in the required fields';
        Toaster.showError(msgError);
    }
});


// $(document).on("click", "#newRunBbusinessServiceBox", function (e) {

// });

