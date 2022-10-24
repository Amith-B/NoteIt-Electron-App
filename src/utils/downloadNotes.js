import xlsx from "json-as-xlsx";

export const downloadXLSX = (notes) => {
  const data = Object.keys(notes).map((folderId, i) => {
    return {
      sheet: `${notes[folderId].folderName}_${i + 1}`,
      columns: [
        {
          label: "Notes Title",
          value: "title",
        },
        {
          label: "Notes Content",
          value: "content",
        },
      ],
      content: notes[folderId].list.map(({ title, content }) => ({
        title,
        content,
      })),
    };
  });

  let settings = {
    fileName: "Notes",
    extraLength: 3,
    writeOptions: {},
  };

  xlsx(data, settings);
};

export const downloadJSON = (notes) => {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
  const dlAnchorElem = document.getElementById("downloadAnchorElem");
  if (dlAnchorElem) {
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "Notes.json");
    dlAnchorElem.click();
  }
};

const download = (notes, type) => {
  switch (type) {
    case "xlsx":
      downloadXLSX(notes);
      break;
    case "json":
      downloadJSON(notes);
      break;

    default:
      break;
  }
};

export default download;
