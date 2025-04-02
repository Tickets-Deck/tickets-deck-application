import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  ReactNode,
  SetStateAction,
  useRef,
  CSSProperties,
} from "react";
import useRemoveHtmlElementFromDOM from "../../hooks/useRemoveHtmlElementFromDOM";

interface ModalWrapperProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visibility: boolean;
  children: ReactNode;
  styles?: CSSProperties;
  disallowOverlayFunction?: boolean;
}

const ModalWrapper: FunctionComponent<ModalWrapperProps> = ({
  visibility,
  setVisibility,
  children,
  styles,
  disallowOverlayFunction,
}): ReactElement => {
  const modalContainerRef = useRef<HTMLDivElement>(null);

  useRemoveHtmlElementFromDOM(modalContainerRef, visibility, 350, "flex");

  return (
    <div
      className={`fixed size-full top-0 left-0 z-[120] grid place-items-center sectionPadding p-[1.25rem] ${
        visibility ? "" : "pointer-events-none"
      }`}
      ref={modalContainerRef}
    >
      <div
        className={`bg-[rgba(34,34,34,0.6)] absolute size-full top-0 left-0 ${
          visibility ? "" : "opacity-0 animate-modalBumpIn"
        }`}
        onClick={() => (disallowOverlayFunction ? {} : setVisibility(false))}
      ></div>
      <div
        className={`w-full sm:w-auto sm:max-w-[90%] md:w-full md:max-w-full m-auto !z-[120] translate-y-0 bg-primary-color-sub ${
          visibility ? "" : "opacity-0 animate-modalBumpOut translate-y-[3rem]"
        }`}
        style={styles}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
