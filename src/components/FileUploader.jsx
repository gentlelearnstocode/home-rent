import React from 'react';
import FileUpload from 'react-mui-fileuploader';

const FileUploader = () => {
  return (
    <FileUpload
      multiFile={true}
      disabled={false}
      title="My awesome file uploader"
      header="[Drag to drop]"
      leftLabel="or"
      rightLabel="to select files"
      buttonLabel="click here"
      buttonRemoveLabel="Remove all"
      maxFileSize={10}
      maxUploadFiles={0}
      maxFilesContainerHeight={357}
      errorSizeMessage={'fill it or move it to use the default error message'}
      allowedExtensions={['jpg', 'jpeg']}
      onFilesChange={() => {}}
      onError={() => {}}
      imageSrc={'path/to/custom/image'}
      bannerProps={{ elevation: 0, variant: 'outlined' }}
      containerProps={{ elevation: 0, variant: 'outlined' }}
    />
  );
};

export default FileUploader;
