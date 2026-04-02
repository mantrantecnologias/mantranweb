import {
    SeVazioUndefinedOuNulo
} from '../utils/Utilidades'


export function fetchingDataLoading() {

    var div = document.getElementById("spinner_loading");
    var spinner = document.getElementById("spinner");

    if (!SeVazioUndefinedOuNulo(div)) {
        div.className = "spinner_loading";
        spinner.className = "spinner";
    }
}

export function stopFetchingDataLoading() {

    var div = document.getElementById("spinner_loading");
    var spinner = document.getElementById("spinner");

    if (!SeVazioUndefinedOuNulo(div)) {
        div.className = "";
        spinner.className = "";
    }
}

export default function EnableLoading() {
    return (
        <div id="spinner_loading">
            <div id="spinner"></div>
        </div>
    )
}