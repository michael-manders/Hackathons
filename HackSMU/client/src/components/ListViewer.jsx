import React from "react";

import "../assets/css/ListViewer.css";

const ListViewer = (props) => {
    const { title = "TITLE", items = [] } = props;
    return (
        <div id="listviewer">
            {title}
            <div id="content">{/* map shit */}</div>
        </div>
    );
};

export default ListViewer;
