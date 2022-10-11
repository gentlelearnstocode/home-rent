import React from 'react';
import PropTypes from 'prop-types';
import FileUpload from 'react-mui-fileuploader';

const FileUploader = (props) => {
  const { multiFile, disabled, uploadTitle, onChangeUpload } = props;
  return (
    <FileUpload
      multiFile={multiFile}
      disabled={disabled}
      title={uploadTitle}
      header="[Drag to drop]"
      leftLabel="or"
      rightLabel="to select files"
      buttonLabel="click here"
      buttonRemoveLabel="Remove all"
      maxFileSize={10}
      maxUploadFiles={0}
      maxFilesContainerHeight={357}
      errorSizeMessage={'fill it or move it to use the default error message'}
      allowedExtensions={['jpg', 'jpeg', 'png']}
      onFilesChange={onChangeUpload}
      onError={() => {}}
      imageSrc={'path/to/custom/image'}
      bannerProps={{ elevation: 0, variant: 'outlined' }}
      containerProps={{ elevation: 0, variant: 'outlined' }}
    />
  );
};

FileUploader.propTypes = {
  multiFile: PropTypes.bool,
  disabled: PropTypes.bool,
  uploadTitle: PropTypes.string,
  onChangeUpload: PropTypes.func.isRequired
};

export default FileUploader;
