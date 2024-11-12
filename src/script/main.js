"use strict";

let JIRA_DOMAIN = null;

//------------------------------------
//         #  on loading
window.onload = async () => {
    const url_now = location.href;
    const url_splits=url_now.split("://")[1].split("/");
    const url_domain = url_splits[0];
    if (!/^jira\.\w+\.com$/.test(url_domain)) return;
    JIRA_DOMAIN = url_domain;
    if (url_splits[1] !== "secure" || !url_splits[2].startsWith("RapidBoard.jspa")) return;
    const usp = new URLSearchParams(location.search);
    const stored_config = await getSyncStorage(["flag_view"]);
    let flag_view = stored_config.flag_view;
    if (flag_view === undefined) flag_view = true;
    if (flag_view) toggleView("on");


    chrome.runtime.onMessage.addListener(async (message, _ev, sendResponse) => {
        console.log("received message", message);
        const args = message.args;
        if (message.command === "toggleView") {
            toggleView(args.mode, args.cols);
            sendResponse({close: false});
        }
        return true;
      });
};

//------------------------------------
//         #  on click
const toggleView = async (mode="toggle", cols = 4) => {
    const usp = new URLSearchParams(location.search);
    if (usp.get("view").startsWith("planning")) {
        const checkInterval = setInterval(() => {
            const ghx_content_group = document.querySelector("#ghx-content-group");
            if (!ghx_content_group) return;
            clearInterval(checkInterval);
            const ghx_sprint_gorup = ghx_content_group.querySelector("div.ghx-sprint-group");
            const ghx_backlog_column = document.querySelector("#ghx-backlog-column div.ghx-backlog-group > div.ghx-backlog-container.ghx-open.ghx-everything-else.ui-droppable > div.ghx-issues.js-issue-list.ghx-has-issues");
            // const announcement_banner = document.querySelector("#announcement-banner");
            const elms = [document.getElementsByTagName("body")[0]];
            if (mode==="toggle"){
                elms.forEach(elm => elm.classList.toggle("yt-jira"));
            } else if (mode==="on") {
                elms.forEach(elm => elm.classList.add("yt-jira"));
            } else if (mode==="off") {
                elms.forEach(elm => elm.classList.remove("yt-jira"));
            }
            const elms_cols = [ghx_sprint_gorup, ghx_backlog_column];
            for (const elm of elms_cols){
                if (elm) {
                    elm.classList.remove("col-1", "col-2", "col-3", "col-4", "col-5");
                    elm.classList.add(`col-${cols}`);
                }
            }
            // ghx_sprint_gorup.classList.add(`col-${cols}`);
            // ghx_backlog_column.classList.add(`col-${cols}`);
            // announcement_banner.classList.add(`col-${cols}`);
            // document.querySelector("#ghx-content-group > div.ghx-sprint-group").style["column-count"] = "3";
            // document.querySelector("#ghx-content-group > div.ghx-backlog-group > div.ghx-backlog-container.ghx-open.ghx-everything-else.ui-droppable > div.ghx-issues.js-issue-list.ghx-has-issues").style["column-count"] = "3";
            // document.styleSheets[0].insertRule(`
            // #announcement-banner {display: none;}
            // div.ghx-sprint-info, div.iic {display: none;}
            // div.ghx-description {display: none;}
            // div.ghx-sprint-planned.js-sprint-container div.aui-item {display: block;}
            // div.ghx-sprint-planned.js-sprint-container div.aui-item div.ghx-stat-total {display: none;}
            // `, document.styleSheets[0].cssRules.length);
            // document.querySelector("#announcement-banner").style.display = "none";
            // for (const el of document.querySelectorAll("div.ghx-sprint-info, div.iic")){
            //     el.style.display="none";
            // }
            // for (const el of document.querySelectorAll("div.ghx-description")){
            //     el.innerHTML = "no tasks";
            // }
            // for (const sprint_container of document.querySelectorAll("div.ghx-sprint-planned.js-sprint-container")){
            //     const aui_item = sprint_container.querySelector("div.aui-item:has(button)");
            //     const ghx_stat_total = sprint_container.querySelector("div.ghx-stat-total");
            //     aui_item.innerHTML = ghx_stat_total.innerHTML;
            //     ghx_stat_total.style.display = "none";
            //     console.log(aui_item);
            // }
        }, 100)



    }

}
