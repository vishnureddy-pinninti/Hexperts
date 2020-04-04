import React from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';

const FileUpload = (props) => {
    const {
        open,
        handleClose,
        handleUpload,
    } = props;

    return (
        <div>
            <DropzoneDialog
                open={ open }
                onSave={ handleUpload }
                acceptedFiles={ [ 'image/*' ] }
                showPreviews={ false }
                filesLimit={ 1 }
                showPreviewsInDropzone
                maxFileSize={ 5000000 }
                onClose={ handleClose }
                showFileNamesInPreview />
        </div>
    );
};

export default FileUpload;
