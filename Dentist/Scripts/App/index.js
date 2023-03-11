var Index = (function () {
    var data = null;
    var requirementListId = 1;
    var rows = [];
    var areaListData = [];
    var areaListDataIds = [];
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
        var toothNum = '';
        if (tooth1) {
            if (tooth2) {
                toothNum = tooth2 + " - " + tooth1;
                toothText = " שיניים";
            } else {
                toothNum = tooth1;
                toothText = " שן";
            }
        }

        var html = "";
       
        html = html + "(<label> " + toothText + "&nbsp</label>";
        
        html = html + "<label>" + toothNum + "</label>";
        html = html + "<label> &nbsp" + treatmentList + "</label>)";

        $("#final-row-text").html(html);
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
                Index.resetDialog();

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

        $("#delete-row-button").on("click",
            function() {
                Index.deleteRow(changeReqRowId);
            });
    }

    var deleteRow = function(rowId) {
        var delRow = rows.filter(x => x.id === changeReqRowId)[0];

        if (delRow.isAreaList) {

            var areaListName = delRow.areaList;

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].areaList === areaListName) {
                    rows[i].areaList = "_" + rows[i].id;
                }
            }

            areaListData = areaListData.filter(x => x !== areaListName);
            areaListDataIds = areaListDataIds.filter(x => x !== rowId);
        }

        rows = rows.filter(x => x.id !== rowId);
        Index.drawPerscription();
        Index.resetDialog();
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
        
        if (areaListData.filter(x => x === areaList).length === 0 && !changeReqRowId) {
            areaListData.push((areaList));
            areaListDataIds.push(rowId);

            rows.push({
                id: rowId,
                isReq: false,
                reqName: null,
                areaList: areaList,
                isAreaList: true,
                tooth1: null,
                tooth2: null,
                treatment: null,
                category: null,
                price: null,
                notes: null
            });

            rowId = rowId + 1;
        }
        

        if (changeReqRowId) {

            var row = rows.filter(x => x.id === changeReqRowId)[0];

            for (var j = 0; j < areaListData.length; j++) {
                if (areaListData[j] === row.areaList) {
                    areaListData[j] = $("#araList").val();
                }
            }

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].areaList === row.areaList) {
                    rows[i].areaList = $("#araList").val();
                }
            }
            row.tooth1 = tooth1;
            row.tooth2 = tooth2;
            row.treatment = treatmentList;
            row.category = category;
            row.price = price;
            row.notes = notes;
            row.tooth1 = tooth1;
        } else {
            areaListData.push(("_" + rowId));
            areaListDataIds.push(rowId);
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
        Index.resetDialog();
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

            var className = "selected-row-" + areaListDataIds[k];
            var areaListTitle = areaListData[k];
            if (areaListData[k][0] === "_") {
                areaListTitle = "";
                className = "";
            }

            var areaListId = "area-list-" + k;

            areaListHtml = areaListHtml + " <div  class='left_list'>";
            if (areaListTitle) {
                areaListHtml =
                    areaListHtml + "<h3 onClick='Index.changeRow(" + areaListDataIds[k] + ")'  class='pointer-hover " + className +"'>" + areaListTitle + "</h3> <ul id='" + areaListId + "'></ul>";
            } else {
                areaListHtml =
                    areaListHtml + "<ul class='margin-less' id='" + areaListId + "'></ul>";
            }
           
            areaListHtml = areaListHtml + "</div>";

            $("#perscription").append(areaListHtml);
            if (data) {
                for (var d = 0; d < data.length; d++) {
                    var toothText = '';
                    var toothNum = '';

                    if (data[d].tooth1) {
                        if (data[d].tooth2) {
                            toothNum = data[d].tooth2 + " - " + data[d].tooth1;
                            toothText = " שיניים";
                        } else {
                            toothNum = data[d].tooth1;
                            toothText = " שן";
                        }
                    }

                    var treatmentList = "";
                    if (data[d].treatment) {
                        treatmentList = treatmentList + data[d].treatment;
                    }
                    var html = "";

                    html = html + "<label> " + toothText + "&nbsp</label>";

                    html = html + "<label>" + toothNum + "</label>";
                    html = html + "<label> &nbsp" + treatmentList + "</label>";


                    if (data[d].treatment || data[d].tooth1 || data[d].tooth2) {
                        var rowHtml = "";
                        rowHtml = rowHtml + "<li class='selected-row-" + data[d].id +"'>";
                        rowHtml = rowHtml + " <p lang='he' dir='rtl'>";
                        rowHtml = rowHtml + data[d].price + "ש'ח";
                        rowHtml = rowHtml + " </p>";
                        rowHtml = rowHtml +
                            "<p onClick='Index.changeRow(" +
                            data[d].id +
                            ")' class='pointer-hover' lang='he' dir='rtl'>";
                            rowHtml = rowHtml + html;
                        rowHtml = rowHtml + "</li>";

                        var notes = data[d].notes;
                        if (notes) {
                            rowHtml = rowHtml + "<li class='selected-row-" + data[d].id +"'>";
                            rowHtml = rowHtml + " </p>";
                            rowHtml = rowHtml + "<p class='notes'>" + data[d].notes + "</p>";
                            rowHtml = rowHtml + "</li>";
                        }

                        $("#" + areaListId).append(rowHtml);
                    }

                }
            }
        }
    }

    var resetDialog = function () {
        $("#final-row-text").text('');
        $("#araList").val('');
        $("#rightHeader").val('');
        $("#centerHeader").val('');
        $("#tooth1").val('');
        $("#tooth2").val('');
        $("#treatmentCategory").val('');
        $("#treatmentList").val('');
        $("#notesArea").val('');
        $("#notes").val('');
        $("#price").val('');

        $("#treatmentList").html("<option value=''>Select an Option</option>");

        $(".selected-row").removeClass("selected-row");
        $("#delete-row-button").hide();
        changeReqRowId = null;
    }

    var changeReq = function (rowId) {
        Index.unCheckAllRequirementList();
        changeReqRowId = rowId;
        $("#del-req").show();
        $("#modal-window-requirement").modal('show');
    }

    var changeRow = function (rowId) {

        Index.resetDialog();
        $("#delete-row-button").show();
        $(".selected-row-" + rowId).addClass("selected-row");

        changeReqRowId = rowId;

        var row = rows.filter(x => x.id === rowId)[0];

        var areaListTax = "";

        if (row.areaList && row.areaList[0] !== "_") {
            $("#araList").val(row.areaList);
            areaListTax = row.areaList;
        }
        //treatment: null,
            //category: null,
        if (row.category) {

            $("#treatmentCategory").val(row.category);
            $('#treatmentCategory').trigger('change');

            if (row.treatment) {
                $("#treatmentList").val(row.treatment);
            }
        }

        if (row.notes) {
            $("#notesArea").val(row.notes);
        }

        if (row.price) {
            $("#price").val(row.price);
        }

        if (row.tooth1) {
            $("#tooth1").val(row.tooth1);
        }

        if (row.tooth2) {
            $("#tooth2").val(row.tooth2);
        }

        $("#final-row-text").text("( " + areaListTax + " )");

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