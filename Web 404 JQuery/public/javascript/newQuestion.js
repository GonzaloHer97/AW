"use strict"



$(function() {
    $(".tag").on("click", function() {
        let valor = $(this).text().trim();
        if (!$("#etiquetasId").val().includes("@" + valor)) {
            $("#etiquetasId").val($("#etiquetasId").val() + "@" + valor);
        }
    })
})