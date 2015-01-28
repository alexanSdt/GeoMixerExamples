function InitCalcTool(LMap) {
    try {
        LMap.addControl(new L.Control.gmxIcon({
            id: 'myCountButton',
            //togglable: true,
            regularImageUrl: 'next.png',     // '../images/gis/calc.png',
            activeImageUrl: 'next_a.png',   // '../images/gis/calc_a.png',
            title: 'Подсчет объектов в полигоне'
          })
            .on('click', function (ev) {
                var curLayer;
/*
                var strTabContent = '';
                var regcolor = 0x0000ff;
                var regionFilter = (EMISMap.SelectRegion != null ? '"RegionID" = ' + EMISMap.SelectRegion.Regions.join(' OR "RegionID" = ') : undefined);

                $('#mini_content').html('<h3 class="map_title icon_calc">Количество объектов</h3>');
                var cntTable = $('<table />').attr({ id: 'cnt_table', cellspacing: 3, cellpadding: 2, border: 0 });
                var cntTable_head = $('<thead />');
                var cntTable_body = $('<tbody />');
                cntTable_head.appendTo(cntTable);
                cntTable_body.appendTo(cntTable);

                strTabContent += '<tr><th>&nbsp;</th>';

                // Отрисовка заголовка, раскрашиваем области разными цветами
                GlobalMap.drawing.forEachObject(function (o) {
                    var gO = o.getGeometry();
                    if (gO.type == 'POLYGON') {
                        regcolor = DynamicColor(regcolor);
                        o.setStyle({ marker: { size: 3, color: regcolor }, outline: { color: regcolor, thickness: 2, opacity: 100} }, { marker: { size: 3, color: regcolor }, outline: { color: regcolor, thickness: 3, opacity: 100} });
                        var stRegColor = regcolor.toString(16);
                        while (stRegColor.length < 6)
                            stRegColor = '0' + stRegColor;
                        strTabContent += '<th width="25" style="background-color: #' + stRegColor + '"><b>П</b></th>';
                    }
                });
                for (var numcircle = 0; numcircle < circles.length; numcircle++) {
                    regcolor = DynamicColor(regcolor);
                    circles[numcircle].setStyle({ outline: { color: regcolor, thickness: 2, opacity: 100} }, { outline: { color: regcolor, thickness: 3, opacity: 100} });
                    var stRegColor = regcolor.toString(16);
                    while (stRegColor.length < 6)
                        stRegColor = '0' + stRegColor;
                    strTabContent += '<th width="25" style="background-color: #' + stRegColor + '"><b>O</b></th>';
                }
                strTabContent += '</tr>';
                cntTable_head.html(strTabContent);

                // Подсчет
                $('#menu input:checkbox[value!="layergroup_expander"]:checked').each(function () {
                    curLayer = $(this).attr('layername');
                    var drawingIndex = 0;

                    var tableLine = $('<tr />');
                    tableLine.appendTo(cntTable_body);
                    $('<td />').css('border-bottom', '1px solid silver').text(GlobalMap.layers[GUIDIO[curLayer]].properties.title).appendTo(tableLine);

                    GlobalMap.drawing.forEachObject(function (o) {
                        var cellID = 'p-' + curLayer + '-' + drawingIndex;
                        drawingIndex++;
                        $('<td />').css({ 'text-align': 'center', 'border-bottom': '1px solid silver' }).attr('id', cellID).html('<img src="../images/loader2.gif" />').appendTo(tableLine);
                        var gO = o.getGeometry();
                        if (gO.type == 'POLYGON') {
                            GlobalMap.layers[GUIDIO[curLayer]].getFeatures(function (features) {
                                $('#' + cellID, cntTable).html(features.length);
                            }, gO, regionFilter);
                        }
                    });
                    $.each(circles, function (numcircle, value) {
                        var cCellID = 'c-' + curLayer + '-' + numcircle;
                        $('<td />').css({ 'text-align': 'center', 'border-bottom': '1px solid silver' }).attr('id', cCellID).html('<img src="../images/loader2.gif" />').appendTo(tableLine);
                        GlobalMap.layers[GUIDIO[curLayer]].getFeatures(function (features) {
                            $('#' + cCellID, cntTable).html(features.length);
                        }, circles[numcircle].getGeometry(), regionFilter);
                    });
                });

                $('#mini_content').append(cntTable);
*/                
                alert('click');
                //GlobalMap.drawing.tools['move'].select();
            })
        );
    }
    catch (e) {
        alert('Инструмент Подсчет объектов: ' + e);
    }
}