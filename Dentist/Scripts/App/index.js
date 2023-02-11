var Index = (function () {
    var data = null;
    var requirementListId = 1;
    var init = function() {
        
        Index.getAppData();
    };

    var getAppData = function() {
        $.ajax({
            url: '/Home/GetAppData',
            type: 'GET',
            success: function (response) {
                Index.data = response;

                Index.fillData();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    var fillData = function () {


        Index.createRequirementRadioButtons();

        Index.bindPageEvents();
    }


    var createRequirementRadioButtons = function() {
        var html = "";

        for (var i = 0; i < Index.data.RequirementList.length; i++) {
            var text = Index.data.RequirementList[i];
            html = html + "<input type='radio' id='radio" + (i + 1) + "' name='radioReq' value='" + text+"'>";
            html = html + " <label for='radio"+(i+1)+"'>" + text+"</label>";
            //html = html + "<br>";
        }

        $(".radio-toolbar").append(html);

    }


    var bindPageEvents = function() {
        $("#addReq").on("click",
            function () {
                $("#modal-window-requirement").modal('show');
                Index.unCheckAllRequirementList();
            });

        $('input[type=radio][name=radioReq]').change(function () {
            $("#modal-window-requirement").modal('hide');
            Index.addRequirement(this.value);
        });

        $("#patient-name-input").on("input",
            function() {
                $("#patient-name").text($("#patient-name-input").val());
            });

        $("#date").on("change",
            function () {
                $("#patient-date").text($("#date").val());
            });


        document.getElementById('date').valueAsDate = new Date();

        $("#patient-date").text($("#date").val());
    }

    var unCheckAllRequirementList = function() {
        for (var i = 1; i <= 3; i++) {
            $("#radio" + i).prop('checked', false);
        }
    }
    
    var addRequirement = function(text) {

        var html = "";
        html = html + "<label>" + text + "</label><br>";
        html = html + "<button id='add-row-" + requirementListId+"'>Add Row</button><br>";

        $("#requirements-list").append(html);

        Index.bindAddRowButton(requirementListId);

        requirementListId = requirementListId + 1;
    };

    var bindAddRowButton = function(id) {
        $("#add-row-" + id).on("click",
            function() {
                $("#modal-window").modal('show');
            });
    }

    var bindRequirementEvent = function(id) {
        $("#" + id).on("change", function () {
            debugger;
            Index.insertAddRowButton(id);
            Index.addRequirement();
        });
    };

    return {
        init: init,
        addRequirement: addRequirement,
        bindRequirementEvent: bindRequirementEvent,
        bindAddRowButton: bindAddRowButton,
        bindPageEvents: bindPageEvents,
        unCheckAllRequirementList: unCheckAllRequirementList,
        createRequirementRadioButtons: createRequirementRadioButtons,
        getAppData: getAppData,
        fillData: fillData,
        data: data
    }
})();


$(document).ready(function() {
    Index.init();
});