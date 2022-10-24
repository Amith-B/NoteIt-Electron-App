import "./Tabs.scss";
import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useContext,
} from "react";
import NotesContext from "../../context/notesContext";
import verticalDot from "../../assets/vertical_dots.svg";
import hamburger from "../../assets/hamburger.svg";
import arrowLeft from "../../assets/arrow-previous-left.svg";
import SidePanel from "../SidePanel/SidePanel";
import { downloadXLSX, downloadJSON } from "../../utils/downloadNotes";
import getFilePath from "../../utils/resolveFilePath";

function Tabs({ onSidePanelToggle }) {
  const {
    themes,
    activeTheme,
    setActiveTheme,
    notes,
    activeFolderId,
    closeTab,
    activeNoteId,
    setActiveNoteId,
    addNote,
  } = useContext(NotesContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const tabGroup = useRef();

  useEffect(() => {
    onSidePanelToggle(panelOpen);
    // eslint-disable-next-line
  }, [panelOpen]);

  const handleHorizontalScroll = useCallback(
    (event) => {
      const tabRef = tabGroup.current;

      const toLeft = event.deltaY < 0 && tabRef.scrollLeft > 0;
      const toRight =
        event.deltaY > 0 &&
        tabRef.scrollLeft < tabRef.scrollWidth - tabRef.clientWidth;

      if (toLeft || toRight) {
        event.preventDefault();
        tabGroup.current.scrollLeft += event.deltaY;
      }
    },
    [tabGroup]
  );

  useEffect(() => {
    const tabRef = tabGroup.current;
    tabRef.addEventListener("wheel", handleHorizontalScroll);

    return () => tabRef.removeEventListener("wheel", handleHorizontalScroll);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleScroll();
  }, [activeFolderId, activeNoteId]);

  const handleScroll = () => {
    const activeTab = document.querySelector(".tab.active");

    if (activeTab) {
      activeTab.scrollIntoView();
    }
  };

  const handleDownloadXlsx = () => {
    downloadXLSX(notes);
  };

  const handleDownloadJson = () => {
    downloadJSON(notes);
  };

  return (
    <section className="tab__container">
      <button
        className="clickable notes-panel__toggle flex-center"
        onClick={() => setPanelOpen((toggle) => !toggle)}
      >
        <img
          style={{ height: "16px" }}
          src={getFilePath(panelOpen ? arrowLeft : hamburger)}
          alt="3-dot"
        />
      </button>
      <div className="tab__controls">
        {" "}
        <div className="tab-group hide-scrollbar" ref={tabGroup}>
          {activeFolderId &&
            notes[activeFolderId]?.list?.map((note) => (
              <button
                className={
                  "tab " +
                  (notes[activeFolderId].activeNoteId === note.id
                    ? "active"
                    : "clickable")
                }
                key={note.id}
                onClick={() => setActiveNoteId(activeFolderId, note.id)}
                tabIndex={
                  notes[activeFolderId].activeNoteId === note.id ? "-1" : "0"
                }
              >
                <div className="tab-title" title={note.title}>
                  {note.title}
                </div>
                <div
                  className="clickable tab-close flex-center"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(activeFolderId, note.id);
                  }}
                >
                  +
                </div>
              </button>
            ))}
        </div>
        {activeFolderId && (
          <button className="clickable tab-add flex-center" onClick={addNote}>
            +
          </button>
        )}
      </div>
      <button
        className="clickable notes-menu__toggle flex-center"
        onClick={() => setMenuOpen(true)}
      >
        <img
          style={{ height: "16px" }}
          src={getFilePath(verticalDot)}
          alt="3-dot"
        />
      </button>
      <div
        className={"notes-menu__overlay " + (menuOpen ? "visible" : "")}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className="notes-menu"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <h4>Choose Theme</h4>
          <hr />
          {themes.map((theme) => (
            <div
              className={
                "clickable notes-menu-item " +
                (theme === activeTheme ? "active" : "")
              }
              key={theme}
              onClick={() => {
                setActiveTheme(theme);
              }}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </div>
          ))}
          <hr />
          <h4>Export As</h4>
          <hr />
          <div className="notes-menu-item export">
            <button
              className="export-button clickable"
              onClick={handleDownloadXlsx}
            >
              .xlsx
            </button>
            <button
              className="export-button clickable"
              onClick={handleDownloadJson}
            >
              .json
            </button>
            <a id="downloadAnchorElem" style={{ display: "none" }} href="/#">
              Download
            </a>
          </div>
        </div>
      </div>
      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </section>
  );
}

export default Tabs;
