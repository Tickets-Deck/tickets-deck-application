import { FunctionComponent, ReactElement } from 'react';
import LoaderStyle from '../../styles/Loader.module.scss';

interface FullPageLoaderProps {
    backgroundColor?: any;
}

const FullPageLoader: FunctionComponent<FullPageLoaderProps> = ({backgroundColor}): ReactElement => {
    return (
        <>
        <div className={LoaderStyle.loader} style={{backgroundColor:`${backgroundColor}`}}>
                <div className={LoaderStyle.loadingSpinner}>
                    <svg className={LoaderStyle.loadingSpinner__circleSvg} viewBox="25 25 50 50">
                        <circle className={LoaderStyle.loadingSpinner__circleStroke} cx="50" cy="50" r="20" fill="none" strokeWidth="2" stroke-miterlimit="10" />
                    </svg>
                </div>
            </div>
        </>
    );
}

export default FullPageLoader;