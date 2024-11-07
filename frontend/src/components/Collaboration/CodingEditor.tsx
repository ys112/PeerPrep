// References: https://github.com/yjs/y-codemirror.next, https://liveblocks.io/docs/get-started/yjs-codemirror-react
import * as Y from "yjs";
// @ts-ignore
import { yCollab } from "y-codemirror.next";

import { EditorView, basicSetup } from "codemirror";
import { keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { accessTokenStorage } from "../../utils/accessTokenStorage";
import { notifications } from "@mantine/notifications";
import { userStorage } from "../../utils/userStorage";

interface Props {
  roomId: string;
  isOpen: boolean;
  onCodeChange: (code: string) => void;
}

export default function CodingEditor({ roomId, isOpen, onCodeChange }: Props) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ydoc: Y.Doc;
    let view: EditorView;

    ydoc = new Y.Doc();
    const accessToken = accessTokenStorage.getAccessToken();
    console.log("Creating editor with access token:", accessToken);
    const provider = new HocuspocusProvider({
      url: import.meta.env.VITE_COLLABORATION_SERVICE_WS_URL,
      name: roomId,
      document: ydoc,
      token: accessToken,
      onAuthenticationFailed: () => {
        notifications.show({
          title: "Authentication failed",
          message: "Server failed to authenticate you, please login again",
          color: "red",
        });
        console.error("Authentication failed");
      },
      onStatus: (status) => {
        console.log("Connection status:", status);
      },
    });

    const yText = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(yText);

    yText.observe(() => {
      onCodeChange(yText.toString());
    });

    provider.setAwarenessField("user", {
      name: userStorage.getUser()?.username,
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
        //TODO add more languages and do basic setup
        [keymap.of(defaultKeymap)],
        lineNumbers(),
        javascript(),
        fixedHeightEditor,
        EditorState.readOnly.of(!isOpen), // Disable editing when room closed
        yCollab(yText, provider.awareness, { undoManager }),
      ],
    });

    view = new EditorView({
      state,
      parent: elementRef.current!,
    });

    return () => {
      console.log("Editor unmounted");
      ydoc?.destroy();
      provider?.destroy();
      view?.destroy();
    };
  }, [roomId, isOpen]);

  return (
    <div
      ref={elementRef}
      style={{
        height: "100%",
        width: "100%",
        border: "1px solid #000",
        margin: "0 auto",
      }}
    />
  );
}
