import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Props {
  value: string;
  onChange: (data: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <CKEditor
      editor={
        ClassicEditor as unknown as {
          create(...args: any): Promise<any>;
          EditorWatchdog: any;
          ContextWatchdog: any;
        }
      }
      data={value}
      config={{
        removePlugins: ["ImageUpload", "EasyImage"],
      }}
      onChange={(_, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      onReady={(editor) => {
        // Optional: Completely disable image uploading by removing upload adapter
        editor.plugins.get("FileRepository").createUploadAdapter = () => {
          return {
            upload: () => Promise.reject("Image upload disabled"),
            abort: () => {},
          };
        };
      }}
    />
  );
};

export default RichTextEditor;
