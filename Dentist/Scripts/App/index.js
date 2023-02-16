var Index = (function () {
    var data = null;
    var requirementListId = 1;
    var rows = [];
    var changeReqRowId = null;
    var rowId = 1;
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
        Index.fillRowModalData();

        Index.bindPageEvents();
    }


    var fillRowModalData = function() {

        var rightHeaderOptionHtml = "";
        var CenterHeaderOptionHtml = "";
        var ArealistOptionHtml = "";
        var treatmentCategoryOptionHtml = "";
        var notesOptionHtml = "";

        for (var i = 0; i < Index.data.AlignRightHeader.length; i++) {
            rightHeaderOptionHtml = rightHeaderOptionHtml + "<option value='" + Index.data.AlignRightHeader[i]+"'>" + Index.data.AlignRightHeader[i]+"</option>";
        }

        for (var i = 0; i < Index.data.CenterHeader.length; i++) {
            CenterHeaderOptionHtml = CenterHeaderOptionHtml + "<option value='" + Index.data.CenterHeader[i] + "'>" + Index.data.CenterHeader[i] + "</option>";
        }

        for (var i = 0; i < Index.data.AlignRightHeader.length; i++) {
            ArealistOptionHtml = ArealistOptionHtml + "<option value='" + Index.data.AreaList[i] + "'>" + Index.data.AreaList[i] + "</option>";
        }

        for (var i = 0; i < Index.data.TreatmentCategory.length; i++) {
            treatmentCategoryOptionHtml = treatmentCategoryOptionHtml + "<option value='" + Index.data.TreatmentCategory[i].Name + "'>" + Index.data.TreatmentCategory[i].Name + "</option>";
        }

        for (var i = 0; i < Index.data.Notes.length; i++) {
            notesOptionHtml = notesOptionHtml + "<option value='" + Index.data.Notes[i] + "'>" + Index.data.Notes[i] + "</option>";
        }

        $("#rightHeader").append(rightHeaderOptionHtml);
        $("#centerHeader").append(CenterHeaderOptionHtml);
        $("#araList").append(ArealistOptionHtml);
        $("#treatmentCategory").append(treatmentCategoryOptionHtml);
        $("#notes").append(notesOptionHtml);

        $("#araList").on("change",
            function() {
                Index.populateRowViewerData();
            });

        $("#tooth1").on("input",
            function() {
                Index.populateRowViewerData();
            });

        $("#tooth2").on("input",
            function () {
                Index.populateRowViewerData();
            });

        $("#notes").on("change",
            function() {
                $("#notesArea").val(this.value);
            });

        $("#treatmentCategory").on("change",
            function () {
                var treatmentList = Index.data.TreatmentCategory.filter(x => x.Name === this.value)[0].TreatmentDetails;

                var treatmentListHtml = "";
                for (var i = 0; i < treatmentList.length; i++) {
                    treatmentListHtml = treatmentListHtml + "<option value='" + treatmentList[i].Name + "'>" + treatmentList[i].Name + "</option>";
                }
                $("#treatmentList").html(treatmentListHtml);
                Index.setPrice();
                Index.populateRowViewerData();
            });

        $("#treatmentList").on("change",
            function () {
                Index.setPrice();

                Index.populateRowViewerData();
            });
    }

    var setPrice = function() {
        var treatementCost = Index.data.TreatmentList.filter(x => x.Name === $("#treatmentList").val())[0].Cost;

        $("#price").val(treatementCost);
    }

    var populateRowViewerData = function() {
        var areaList = $("#araList").val();
        var tooth1 = $("#tooth1").val();
        var tooth2 = $("#tooth2").val();
        var treatmentList = $("#treatmentList").val();

        var toothText = '';
        if (tooth1) {
            if (tooth2) {
                toothText = tooth1 + " - " + tooth2 + " שן";
            } else {
                toothText = tooth1  + " שן";
            }
        }

        $("#final-row-text").text("( " + treatmentList + " " + toothText + areaList+" )");
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

            if (changeReqRowId) {
                var row = rows.filter(x => x.id === changeReqRowId)[0];
                row.reqName = this.value;
                changeReqRowId = null;
                Index.drawPerscription();
            } else {
                Index.addRequirement(this.value);
            }
            
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

        $("#saveRow").on("click",
            function () {
                Index.addRow();
            });


        $("#print").on("click",
            function() {
                Index.printDocument();
            });
    }

    var printDocument = function() {

        var printContents = document.getElementById("print-data").innerHTML;
        var myWindow = window.open('', '', 'width=1500,height=800');

        var cssUrl = window.location.origin + "/Content/print.css";

        var html = "";
        html = html + "<html>";
        html = html + "<head>";
        html = html +
            "<link rel='stylesheet' href='" + cssUrl + "' type='text/css' />";
        html = html + "</head>";
        html = html + "<body>";
        html = html + "<div class='left_sec_print'>";
        html = html + printContents;
        html = html + "</div>";
        html = html + "</body>";
        html = html + "</html>";


        myWindow.document.write(html);

        myWindow.document.close(); //missing code

        myWindow.focus();
        myWindow.print();
    };

    var unCheckAllRequirementList = function() {
        for (var i = 1; i <= 3; i++) {
            $("#radio" + i).prop('checked', false);
        }
    }
    
    var addRequirement = function(text) {

        var html = "";
        html = html + "<label>" + text + "</label>";
        html = html + "<button class='add-row-btn btn-primary' id='add-row-" + requirementListId+"'>Add Row</button><br>";

        $("#requirements-list").append(html);

        Index.bindAddRowButton(requirementListId);

        requirementListId = requirementListId + 1;

        Index.addRow(text);
    };

    var bindAddRowButton = function(id) {
        $("#add-row-" + id).on("click",
            function() {
                $("#modal-window").modal('show');
            });
    }

    var bindRequirementEvent = function(id) {
        $("#" + id).on("change", function () {
            Index.insertAddRowButton(id);
            Index.addRequirement();
        });
    };


    var addRow = function(reqName) {
        var isReq = false;
        if (reqName) {
            isReq = true;
        }

        var tooth1 = $("#tooth1").val();
        var tooth2 = $("#tooth2").val();
        var treatmentList = $("#treatmentList").val();
        var category = $("#treatmentCategory").val();
        var price = $("#price").val();
        var notes = $("#notesArea").val();

        if (changeReqRowId) {

            var row = rows.filter(x => x.id === changeReqRowId)[0];

            row.areaList = $("#araList").val();
            changeReqRowId = null;
        } else {
            rows.push({
                id: rowId,
                isReq: isReq,
                reqName: reqName,
                areaList: $("#araList").val(),
                tooth1: tooth1,
                tooth2: tooth2,
                treatment: treatmentList,
                category: category,
                price: price,
                notes: notes
        });

            rowId = rowId + 1;
        }

        Index.drawPerscription();
    }

    var drawPerscription = function () {

        $("#perscription").html('');

        for (var i = 0; i < rows.length; i++) {

            if (rows[i].isReq) {
                var reqHtml = "";

                reqHtml = reqHtml + "<div class='left_title_sec'>";
                reqHtml = reqHtml + " <h3 onClick='Index.changeReq(" + rows[i].id +")' class='pointer-hover'>" + rows[i].reqName +"</h3>";
                reqHtml = reqHtml + " </div>";

                $("#perscription").append(reqHtml);
            }

            if (rows[i].areaList) {
                var areaListHtml = "";

                areaListHtml = areaListHtml + " <div  class='left_list'>";
                areaListHtml = areaListHtml + "<h3 onClick='Index.changeRow(" + rows[i].id +")' class='pointer-hover'>" + rows[i].areaList +"</h3> <ul id='req-list-1'></ul>";
                areaListHtml = areaListHtml + "</div>";

                $("#perscription").append(areaListHtml);
                    
            }

            var treatmentText = '';

            if (rows[i].tooth1) {
                treatmentText = treatmentText + rows[i].tooth1 + "שן";
            }

            if (rows[i].tooth2) {
                treatmentText = treatmentText + rows[i].tooth2 + "שן";
            }

            if (rows[i].treatment) {
                treatmentText = treatmentText + rows[i].treatment;
            }

            if (treatmentText) {
                var rowHtml = "";
                rowHtml = rowHtml + "<li>";
                rowHtml = rowHtml + " <p lang='he' dir='rtl'>";
                rowHtml = rowHtml + rows[i].price + "ש'ח";
                rowHtml = rowHtml + " </p>";
                rowHtml = rowHtml + "<p onClick='Index.changeRow(" + rows[i].id +")' class='pointer-hover' lang='he' dir='rtl'>";
                rowHtml = rowHtml + treatmentText;
                rowHtml = rowHtml + "</li>";

                var notes = rows[i].notes;
                if (notes) {
                    rowHtml = rowHtml + "<li>";
                    rowHtml = rowHtml + " </p>";
                    rowHtml = rowHtml + "<p class='notes'>" + rows[i].notes + "</p>";
                    rowHtml = rowHtml + "</li>";
                }

                $("#req-list-1").append(rowHtml);
            }
           
        }

        Index.resetDialog();
    }

    var resetDialog = function () {
        $("#final-row-text").text('');
        $("#araList").val('');
    }

    var changeReq = function (rowId) {
        Index.unCheckAllRequirementList();
        changeReqRowId = rowId;

        $("#modal-window-requirement").modal('show');
    }

    var changeRow = function (rowId) {
        changeReqRowId = rowId;

        var row = rows.filter(x => x.id === rowId)[0];

        if (row.areaList) {
            $("#araList").val(row.areaList);
        }
        $("#final-row-text").text("( " + row.areaList + " )");
        $("#modal-window").modal('show');
    }

    return {
        init: init,
        addRequirement: addRequirement,
        bindRequirementEvent: bindRequirementEvent,
        bindAddRowButton: bindAddRowButton,
        bindPageEvents: bindPageEvents,
        unCheckAllRequirementList: unCheckAllRequirementList,
        createRequirementRadioButtons: createRequirementRadioButtons,
        addRow: addRow,
        changeReq: changeReq,
        changeRow: changeRow,
        getAppData: getAppData,
        fillData: fillData,
        fillRowModalData: fillRowModalData,
        drawPerscription: drawPerscription,
        populateRowViewerData: populateRowViewerData,
        resetDialog: resetDialog,
        printDocument: printDocument,
        setPrice: setPrice,
        data: data
    }
})();


$(document).ready(function() {
    Index.init();
});