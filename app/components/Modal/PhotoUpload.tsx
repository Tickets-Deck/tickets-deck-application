import { ReactElement, FunctionComponent, Dispatch, SetStateAction } from 'react';
import ModalWrapper from './ModalWrapper';

interface PhotoUploadProps {
    visibility: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
}

const PhotoUpload: FunctionComponent<PhotoUploadProps> = ({ visibility, setVisibility }): ReactElement => {
    return (
        <ModalWrapper visibility={visibility} setVisibility={setVisibility}>
            Upload photo
        </ModalWrapper>
    );
}

export default PhotoUpload;