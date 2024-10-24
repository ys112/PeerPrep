// References: https://github.com/yjs/y-codemirror.next, https://liveblocks.io/docs/get-started/yjs-codemirror-react
import * as Y from "yjs";
// @ts-ignore
import { yCollab } from "y-codemirror.next";
import { WebsocketProvider } from "y-websocket";

import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import {  useEffect, useRef } from "react";

export default function CodingEditor() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  // const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

  // legacy: callback ref
  // const ref = useCallback((element: HTMLDivElement) => {
  //   if (!element) return;
  //   setElementRef(element);
  // }, []);

  useEffect(() => {
    let ydoc: Y.Doc;
    let view: EditorView;

    ydoc = new Y.Doc();
    // TODO: take props for room name and host url
    const provider = new WebsocketProvider(
      import.meta.env.VITE_COLLABORATION_SERVICE_WS_URL,
      "room",
      ydoc
    );

    const yText = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(yText);

    // TODO: for future use of user awareness
    provider.awareness.setLocalStateField("user", {
      // name: "Anonymous " + Math.floor(Math.random() * 100),
      color: "#30bced",
      colorLight: "#30bced33",
    });

    const fixedHeightEditor = EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    });

    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        javascript(),
        fixedHeightEditor,
        yCollab(yText, provider.awareness, { undoManager }),
      ],
    });

    view = new EditorView({
      state,
      parent: elementRef.current!,
    });

    return () => {
      ydoc?.destroy();
      provider?.disconnect();
      view?.destroy();
    };
  }, [elementRef]);

  return (
    <div
      ref={elementRef}
      style={{
        height: "100%",
        width: "50vw",
        border: "1px solid #000",
        margin: "0 auto",
      }}
    />
  );
}
