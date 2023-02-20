var Index = (function () {
    var data = null;
    var requirementListId = 1;
    var rows = [];
    var areaListData = [];
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
            $("#del-req").hide();
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

        $("#cancelRow").on("click",
            function () {

            });

        $("#print").on("click",
            function() {
                Index.printDocument();
            });

        $("#del-req").on("click",
            function() {
                Index.deleteRow(changeReqRowId);
                changeReqRowId = null;
                $("#modal-window-requirement").modal('hide');
                $("#del-req").hide();
            });
    }

    var deleteRow = function(rowId) {
        rows = rows.filter(x => x.id !== rowId);
        Index.drawPerscription();
    };

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

        requirementListId = requirementListId + 1;

        Index.addRow(text);
    };


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
        var areaList = $("#araList").val();

        if (!areaList) {
            areaList = "_" + rowId;
        }

        if (areaListData.filter(x => x === areaList).length === 0) {
            areaListData.push(areaList);
        }
        

        if (changeReqRowId) {

            var row = rows.filter(x => x.id === changeReqRowId)[0];

            row.areaList = $("#araList").val();
            changeReqRowId = null;
        } else {
            rows.push({
                id: rowId,
                isReq: isReq,
                reqName: reqName,
                areaList: areaList,
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

    var drawPerscription = function() {

        $("#perscription").html('');

        var reqRows = rows.filter(x => x.isReq === true);
        var dataRows = rows.filter(x => x.isReq === false)


        for (var j = 0; j < reqRows.length; j++) {
            var reqHtml = "";

            reqHtml = reqHtml + "<div class='left_title_sec'>";
            reqHtml = reqHtml +
                " <h3 onClick='Index.changeReq(" +
                reqRows[j].id +
                ")' class='pointer-hover'>" +
                reqRows[j].reqName +
                "</h3>";
            reqHtml = reqHtml + " </div>";

            $("#perscription").append(reqHtml);
        }

        dataRows = Index.groupBy(dataRows, "areaList");

        for (var k = 0; k < areaListData.length; k++) {
            var data = dataRows[areaListData[k]];

            var areaListHtml = "";

            var areaListTitle = areaListData[k];
            if (areaListData[k][0] === "_") {
                areaListTitle = "";
            }

            var areaListId = "area-list-" + k;

            areaListHtml = areaListHtml + " <div  class='left_list'>";
            if (areaListTitle) {
                areaListHtml =
                    areaListHtml +
                    "<h3  class='pointer-hover'>" +
                    areaListTitle +
                    "</h3> <ul id='" +
                    areaListId +
                    "'></ul>";
            } else {
                areaListHtml =
                    areaListHtml + "<ul class='margin-less' id='" + areaListId + "'></ul>";
            }
           
            areaListHtml = areaListHtml + "</div>";
            //"<h3 onClick='Index.changeRow(" + dataRows[i].id + ")' class='pointer-hover'>" + dataRows[i].areaList +"</h3> <ul id='req-list-1'></ul>";
            $("#perscription").append(areaListHtml);
            if (data) {
                for (var d = 0; d < data.length; d++) {
                    var treatmentText = '';

                    if (data[d].tooth1) {
                        treatmentText = treatmentText + data[d].tooth1 + "שן";
                    }

                    if (data[d].tooth2) {
                        treatmentText = treatmentText + data[d].tooth2 + "שן";
                    }

                    if (data[d].treatment) {
                        treatmentText = treatmentText + data[d].treatment;
                    }

                    if (treatmentText) {
                        var rowHtml = "";
                        rowHtml = rowHtml + "<li>";
                        rowHtml = rowHtml + " <p lang='he' dir='rtl'>";
                        rowHtml = rowHtml + data[d].price + "ש'ח";
                        rowHtml = rowHtml + " </p>";
                        rowHtml = rowHtml +
                            "<p onClick='Index.changeRow(" +
                            data[d].id +
                            ")' class='pointer-hover' lang='he' dir='rtl'>";
                        rowHtml = rowHtml + treatmentText;
                        rowHtml = rowHtml + "</li>";

                        var notes = data[d].notes;
                        if (notes) {
                            rowHtml = rowHtml + "<li>";
                            rowHtml = rowHtml + " </p>";
                            rowHtml = rowHtml + "<p class='notes'>" + data[d].notes + "</p>";
                            rowHtml = rowHtml + "</li>";
                        }

                        $("#" + areaListId).append(rowHtml);
                    }

                }
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
        $("#del-req").show();
        $("#modal-window-requirement").modal('show');
    }

    var changeRow = function (rowId) {
        changeReqRowId = rowId;

        var row = rows.filter(x => x.id === rowId)[0];

        if (row.areaList) {
            $("#araList").val(row.areaList);
        }
        $("#final-row-text").text("( " + row.areaList + " )");

    }

    var groupBy = function(array, key) {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    return {
        init: init,
        addRequirement: addRequirement,
        bindRequirementEvent: bindRequirementEvent,
        bindPageEvents: bindPageEvents,
        unCheckAllRequirementList: unCheckAllRequirementList,
        createRequirementRadioButtons: createRequirementRadioButtons,
        addRow: addRow,
        groupBy: groupBy,
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
        deleteRow: deleteRow,
        data: data
    }
})();


$(document).ready(function() {
    Index.init();
});