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

interface PanelWrapperProps {
  setVisibility: Dispatch<SetStateAction<boolean>>;
  visibility: boolean;
  children: ReactNode;
  styles?: CSSProperties;
  disallowOverlayFunction?: boolean;
}

const PanelWrapper: FunctionComponent<PanelWrapperProps> = ({
  visibility,
  setVisibility,
  children,
  styles,
  disallowOverlayFunction,
}): ReactElement => {
  const panelContainerRef = useRef<HTMLDivElement>(null);

  useRemoveHtmlElementFromDOM(panelContainerRef, visibility, 600, "flex");

  return (
    <div
      className={`w-screen z-[120] md:z-[3] min-w-full h-screen fixed left-0 bottom-0 ${
        visibility ? "" : "opacity-0"
      }`}
      ref={panelContainerRef}
    >
      <div
        className='fixed size-full bg-black/50 top-0 left-0 z-[1] cursor-pointer'
        onClick={() => (disallowOverlayFunction ? {} : setVisibility(false))}
      ></div>
      <div
        className={`bg-dark-grey h-[90%] overflow-x-hidden right-0 top-[4%] w-full z-[120] absolute md:z-[4] flex flex-col rounded-[1.5rem] p-5 md:w-auto ${
          visibility ? "animate-drawerBumpIn" : "animate-drawerBumpOut"
        }`}
        style={styles}
      >
        {children}
      </div>
    </div>
  );
};

export default PanelWrapper;
