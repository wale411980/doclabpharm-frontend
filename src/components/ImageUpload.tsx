import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadHandlerEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESETS;

type TemplateDemoProps = {
  onUploadComplete?: (url: string) => void;
};

export default function ImageUpload({ onUploadComplete }: TemplateDemoProps) {
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [uploading, setUploading] = useState(false);

    const fileUploadRef = useRef<FileUpload>(null);

        const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize;
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const acceptedFiles: File[] = [];
    const rejectedFiles: File[] = [];

    for (let file of e.files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext && validExtensions.includes(ext)) {
            _totalSize += file.size || 0;
            acceptedFiles.push(file);
        } else {
            rejectedFiles.push(file);
        }
    }

    // Show error for rejected files
    if (rejectedFiles.length > 0) {
        toast.current?.show({
            severity: 'error',
            summary: 'Invalid File Type',
            detail: `Only .jpg, .jpeg, .png, .gif, .webp, and .svg files are allowed.`,
        });
    }

    // Manually update the files in FileUpload instance if some were rejected
    if (fileUploadRef.current && acceptedFiles.length !== e.files.length) {
        fileUploadRef.current.setState((prevState: any) => ({
            ...prevState,
            files: acceptedFiles,
        }));
    }

    setTotalSize(_totalSize);
};

    const onTemplateUpload = async (event: FileUploadHandlerEvent) => {
        setUploading(true); // Begin upload
        try {
            for (const file of event.files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', UPLOAD_PRESET);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                console.log('Uploaded URL:', data.secure_url);

                if (onUploadComplete) {
                  onUploadComplete(data.secure_url);
                }

                toast.current?.show({
                    severity: 'info',
                    summary: 'Upload Successful',
                    detail: `File uploaded`,
                });
            }

            setTotalSize(0);
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: 'Could not upload file',
            });
        } finally {
        setUploading(false); // End upload
    }
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formattedValue = fileUploadRef.current?.formatSize(totalSize) || '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formattedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {/* @ts-ignore */}
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined', disabled: uploading };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div>
            <Toast ref={toast} />
            <Tooltip target=".custom-choose-btn" content="Browse" position="bottom" />
            <Tooltip target=".custom-upload-btn" content={uploading ? 'Uploading...' : 'Upload'} position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload
                ref={fileUploadRef}
                name="demo[]"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                customUpload
                uploadHandler={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
            />
        </div>
    );
}
