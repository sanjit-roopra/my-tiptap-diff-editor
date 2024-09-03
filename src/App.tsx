import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { diffChars } from 'diff';

const TipTapDiffEditor: React.FC = () => {
  const [content1] = useState('<p>Normaler kompartimentographischer Befund erkennbar, kein pathologisches Herdbeweis, keine erkennbare Gehirnaktentürung. Kein Nachweis einer tumorspezifischen Befundes, keine Zeichen einer Gefäßerkrankung. Keine Gewebsläsionen erkennbar, keine vaskuläre Läsionen. Keine Liquorzirkulationsstörung.</p>');
  const [content2, setContent2] = useState('<p>Nicht Normaler Befund erkennbar, kein pathologisches Herdbeweis, keine erkennbare Gehirnaktentürung. Kein Nachweis einer tumorspezifischen Befundes, keine Zeichen einer Gefäßerkrankung. Keine Gewebsläsionen erkennbar, keine vaskuläre Läsionen. Keine Liquorzirkulationsstörung.</p>');

  const editor1 = useEditor({
    extensions: [StarterKit],
    content: content1,
    editable: false,
  });

  const editor2 = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true })
    ],
    content: content2,
    editorProps: {
      attributes: {
        class: 'prose max-w-full',
      },
    },
    onUpdate: ({ editor }) => {
      setContent2(editor.getHTML());
    },
  });

  const updateDiff = useCallback(() => {
    if (editor1 && editor2) {
      const text1 = editor1.getText();
      const text2 = editor2.getText();
      const diff = diffChars(text1, text2);

      editor2.commands.setContent('');
      
      diff.forEach((part) => {
        if (part.added) {
          editor2.commands.setTextSelection({
            from: editor2.state.doc.content.size,
            to: editor2.state.doc.content.size
          });
          editor2.commands.setHighlight({ color: 'red' });
          editor2.commands.insertContent(part.value);
          editor2.commands.unsetHighlight();
        } else if (!part.removed) {
          editor2.commands.insertContent(part.value);
        }
      });
    }
  }, [editor1, editor2]);

  useEffect(() => {
    if (editor2 && editor2.isEditable) {
      updateDiff();
    }
  }, [updateDiff, editor2]);

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Befund von Dr. med. Radiologie Assistenzarzt signiert am 24.11.2023</span>
        <span>Befund von Prof. Dr. med. Arzt signiert am 24.11.2023</span>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Gesamtfragestellung</h2>
          <EditorContent editor={editor1} />
        </div>
        <div className="w-1/2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Gesamtfragestellung</h2>
          <EditorContent editor={editor2} />
        </div>
      </div>
    </div>
  );
};

export default TipTapDiffEditor;
