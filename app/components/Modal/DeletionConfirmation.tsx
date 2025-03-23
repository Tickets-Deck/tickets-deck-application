import {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import ComponentLoader from "../Loader/ComponentLoader";

interface DeletionConfirmationModalProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  deleteFunction: () => Promise<void>;
  isLoading: boolean;
  title?: string;
  actionText?: string;
}

const DeletionConfirmationModal: FunctionComponent<
  DeletionConfirmationModalProps
> = ({
  visibility,
  setVisibility,
  deleteFunction,
  isLoading,
  actionText,
  title,
}): ReactElement => {
  return (
    <ModalWrapper
      disallowOverlayFunction
      visibility={visibility}
      setVisibility={setVisibility}
      styles={{
        backgroundColor: "transparent",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <div className='w-[21.875rem] p-6 rounded-[20px] bg-container-grey'>
        <div className='flex justify-between items-start'>
          <div className='flex flex-col items-start border-b-[0.625rem] border-white/40'>
            <h3 className=''>{title ?? "Are you sure?"}</h3>
            <p className='text-[0.8rem] font-light text-grey opacity-80'>
              This action cannot be reversed.
            </p>
          </div>
          <span
            className='ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-[#fff] [&_svg_path]:fill-[#fff]'
            onClick={() => setVisibility(false)}
          >
            <Icons.Close />
          </span>
        </div>
        {/* <div className={styles.miniEventDetailsContainer}>
                    <div className={styles.miniEventDetails}>
                        <div className={styles.miniEventDetails__image}>
                            <Image src={images.event_flyer} alt='Event flyer' fill />
                        </div>
                        <div className={styles.miniEventDetails__text}>
                            <h4>Event title</h4>
                            <p>Event date</p>
                        </div>
                    </div>
                </div> */}
        <div className='flex justify-end mt-4 gap-2'>
          <button
            className="'py-2 px-4 w-fit rounded-[3.125rem] cursor-pointer text-sm border-none bg-white text-dark-grey flex items-center gap-2"
            onClick={() => setVisibility(false)}
          >
            Cancel
          </button>
          <button
            className="'py-2 px-4 w-fit rounded-[3.125rem] cursor-pointer text-sm border-none bg-failed-color text-white hover:bg-[darken(#dc143c,_10%)] flex items-center gap-2"
            onClick={() => deleteFunction()}
            disabled={isLoading}
          >
            {actionText ?? "Delete"}
            {isLoading && (
              <ComponentLoader
                isSmallLoader
                customBackground='#DC143C'
                lightTheme
                customLoaderColor='#fff'
              />
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeletionConfirmationModal;
