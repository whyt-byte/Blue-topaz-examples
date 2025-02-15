/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var SortOrder;
(function (SortOrder) {
    SortOrder[SortOrder["DEFAULT"] = 0] = "DEFAULT";
    SortOrder[SortOrder["ASCENDING"] = 1] = "ASCENDING";
    SortOrder[SortOrder["DESCENDING"] = 2] = "DESCENDING";
})(SortOrder || (SortOrder = {}));
var AttributeName;
(function (AttributeName) {
    AttributeName["tableHeader"] = "sortable-style";
    AttributeName["cssAscending"] = "sortable-asc";
    AttributeName["cssDescending"] = "sortable-desc";
})(AttributeName || (AttributeName = {}));
class TableState {
    constructor() {
        this.columnIdx = null;
        this.sortOrder = SortOrder.DEFAULT;
        this.defaultOrdering = null;
    }
}
function shouldSort(htmlEl) {
    // dataview table: parent must be a "dataview" HTMLTableElement
    const p = htmlEl.matchParent(".dataview");
    if (p instanceof HTMLTableElement)
        return true;
    // reading mode, i.e. non-editing
    return null !== htmlEl.matchParent(".markdown-reading-view");
}
function onHeadClick(evt, tableStates) {
    // check if the clicked element is a table header
    const htmlEl = evt.target;
    if (!shouldSort(htmlEl)) {
        return;
    }
    const th = htmlEl.closest("thead th");
    if (th === null) {
        return;
    }
    const table = htmlEl.closest("table");
    const tableBody = table.querySelector("tbody");
    const thArray = Array.from(th.parentNode.children);
    const thIdx = thArray.indexOf(th);
    // create a new table state if does not previously exist
    if (!tableStates.has(table)) {
        tableStates.set(table, new TableState());
    }
    const tableState = tableStates.get(table);
    thArray.forEach((th, i) => {
        if (i !== thIdx) {
            th.removeAttribute(AttributeName.tableHeader);
        }
    });
    if (tableState.defaultOrdering === null) {
        tableState.defaultOrdering = Array.from(tableBody.rows);
    }
    // sorting the same column, again
    if (tableState.columnIdx === thIdx) {
        tableState.sortOrder = (tableState.sortOrder + 1) % 3;
    }
    // sorting a new column
    else {
        tableState.columnIdx = thIdx;
        tableState.sortOrder = SortOrder.ASCENDING;
    }
    sortTable(tableState, tableBody);
    switch (tableState.sortOrder) {
        case SortOrder.ASCENDING:
            th.setAttribute(AttributeName.tableHeader, AttributeName.cssAscending);
            break;
        case SortOrder.DESCENDING:
            th.setAttribute(AttributeName.tableHeader, AttributeName.cssDescending);
            break;
    }
    // if the current state is now the default one, then forget about this table
    if (tableState.sortOrder === SortOrder.DEFAULT) {
        tableStates.delete(table);
        th.removeAttribute(AttributeName.tableHeader);
    }
}
function sortTable(tableState, tableBody) {
    emptyTable(tableBody, tableState.defaultOrdering);
    if (tableState.sortOrder === SortOrder.DEFAULT) {
        fillTable(tableBody, tableState.defaultOrdering);
        return;
    }
    const xs = [...tableState.defaultOrdering];
    xs.sort((a, b) => compareRows(a, b, tableState.columnIdx, tableState.sortOrder));
    fillTable(tableBody, xs);
}
function resetTable(tableState, tableBody) {
    emptyTable(tableBody, tableState.defaultOrdering);
    fillTable(tableBody, tableState.defaultOrdering);
}
function compareRows(a, b, index, order) {
    let valueA = valueFromCell(a.cells[index]);
    let valueB = valueFromCell(b.cells[index]);
    if (order === SortOrder.DESCENDING) {
        [valueA, valueB] = [valueB, valueA];
    }
    if (typeof valueA === "number" && typeof valueA === "number") {
        return valueA < valueB ? -1 : 1;
    }
    return valueA.toString().localeCompare(valueB.toString());
}
function tryParseFloat(x) {
    const y = parseFloat(x);
    return isNaN(y) ? x : y;
}
function valueFromCell(element) {
    // TODO: extend to other data-types.
    return tryParseFloat(element.textContent);
}
function emptyTable(tableBody, rows) {
    rows.forEach(() => tableBody.deleteRow(-1));
}
function fillTable(tableBody, rows) {
    rows.forEach((row) => tableBody.appendChild(row));
}

class SortablePlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Sortable: loading plugin...");
            this.tableStates = new WeakMap();
            this.registerDomEvent(document, "click", (ev) => onHeadClick(ev, this.tableStates));
            console.log("Sortable: loaded plugin.");
        });
    }
    onunload() {
        // get all HTMLTableElements present in the map and reset their state
        const tables = Array.from(document.querySelectorAll("table"));
        for (const table of tables) {
            if (this.tableStates.has(table)) {
                const state = this.tableStates.get(table);
                resetTable(state, table.querySelector("tbody"));
                const th = table.querySelector(`thead th:nth-child(${state.columnIdx + 1})`);
                th.removeAttribute(AttributeName.tableHeader);
                this.tableStates.delete(table);
            }
        }
        delete this.tableStates;
        console.log("Sortable: unloaded plugin.");
    }
}

module.exports = SortablePlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zb3J0YWJsZS50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJ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
