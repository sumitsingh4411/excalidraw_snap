import React, { useEffect, useState, useRef } from "react";
import Excalidraw, {
  exportToBlob
} from "@excalidraw/excalidraw";
import InitialData from "./initialData";
import "./styles.scss";
import initialData from "./initialData";
let url_hash = {};
let first=0;
export default function App() {
  const excalidrawRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);
  
  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
    
  }, []);
  setInterval(async () => {
    if (excalidrawRef.current && excalidrawRef.current.getSceneElements()) {
      const blob =await exportToBlob({
        elements: excalidrawRef.current.getSceneElements(),
        mimeType: "image/png",
        appState: {
          ...initialData.appState,
        }
      });
      setBlobUrl(window.URL.createObjectURL(blob));
      if(blobUrl && (Date.now()-first>=10000 || first===0 ) )
      {
      const data=Date.now();
      first=Date.now();
      url_hash[data] = blobUrl;
      console.log(data);
      } 
    }
  }, 10000);

  return (
    <div className="App">
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={InitialData}
          name="Custom name of drawing"
          UIOptions={{ canvasActions: { loadScene: false } }}
        />
      </div>
      <div>
        {
         true && Object.keys(url_hash)
            .map(key => <h3 key={key}>{url_hash[key]}</h3>)
        }
      </div>
    </div>
  );
}
