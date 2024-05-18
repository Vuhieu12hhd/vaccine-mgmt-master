import Loader from 'components/Loader';
import React, { useEffect, useState } from 'react';
import { TEModal, TEModalDialog, TEModalContent, TEModalHeader, TEModalBody, TEModalFooter, TERipple } from 'tw-elements-react';

export default function Modal(props: {
  size?: 'fullscreen' | 'sm' | 'lg' | 'xl';
  show?: boolean;
  onHide(): void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  loading?: boolean;
  unMounted?: boolean;
  bodyClassName?: string;
}): JSX.Element {
  const [mount, setMount] = useState(props.show);
  useEffect(() => {
    if (props.unMounted) {
      if (props.show) {
        setMount(true);
      } else {
        setTimeout(() => {
          setMount(false);
        }, 300);
      }
    }
  }, [props.show]);
  return (
    <div>
      {/* <!-- Modal --> */}
      <TEModal show={props.show ?? false} scrollable setShow={props.onHide}>
        <TEModalDialog size={props.size ?? 'lg'} centered>
          <TEModalContent>
            <Loader active={props.loading}>
              <TEModalHeader>
                {/* <!-- Modal title --> */}
                <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">{props.title}</h5>
                {/* <!--Close button--> */}
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  onClick={props.onHide}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </TEModalHeader>
              {/* <!--Modal body--> */}
              <TEModalBody className={`max-h-[80vh] overflow-y-auto ${props.bodyClassName}`}>{!props.unMounted || mount ? props.children : null}</TEModalBody>
              {props.onConfirm && (
                <TEModalFooter>
                  <TERipple rippleColor="light">
                    <button
                      type="button"
                      className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      onClick={props.onHide}
                    >
                      Đóng
                    </button>
                  </TERipple>
                  <TERipple rippleColor="light">
                    <button
                      type="button"
                      onClick={props.onConfirm}
                      className="inline-block w-full rounded px-7 py-1.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(32,189,189,0.4)] transition duration-150 ease-in-out hover:shadow-[0_8px_18px_-4px_rgba(32,189,189,0.5)] hover:bg-[#0F9191]"
                      style={{ backgroundColor: '#20BDBD' }}
                    >
                      Xác nhận
                    </button>
                  </TERipple>
                </TEModalFooter>
              )}
            </Loader>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
