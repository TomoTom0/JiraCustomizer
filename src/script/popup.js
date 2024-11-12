"use strict";

const main_toggleView = async (mode="toggle") => {
    const cols = document.getElementById("cols").value;

    const response = send_message({command:"toggleView", args:{ mode, cols }});
    return response;
};

const send_message = async (message) => {
    let response;
    console.log("sending message", message);
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message, (responseFromContent) => {
            console.log("received response", responseFromContent);
            if (responseFromContent.close!==false) window.close();
            response = responseFromContent;
        });
    });
    return response;
};

window.onload = async function () {
    const stored_config = await getSyncStorage(["popup_config"]);
    let popup_config = Object.assign({cols: 4}, stored_config.popup_config || {});
    const input_cols = document.getElementById("cols");
    input_cols.value = popup_config.cols;    
    // const div_result = document.getElementById("result");
    document.addEventListener('click', async function (e) {
        const flag_view = await getSyncStorage(["flag_view"]).then(res => res.flag_view);
        if (e.target.id === "button_toggleView") {
            await main_toggleView();
            await setSyncStorage({popup_config: {cols: input_cols.value}, flag_view: !flag_view});
        } else if (e.target.id === "button_applyView") {
            await main_toggleView("on");
            await setSyncStorage({popup_config: {cols: input_cols.value}, flag_view: true});
        }
    });
}