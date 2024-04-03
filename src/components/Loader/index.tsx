import React, { ReactNode } from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import RingLoader from 'react-spinners/RingLoader';

interface LoaderProps extends React.RefAttributes<HTMLDivElement> {
  active?: boolean;
  children?: ReactNode;
  className?: string;
}

const Loader = (props: LoaderProps) => {
  return (
    <LoadingOverlay {...props} spinner={<RingLoader color="rgb(54, 214, 171)" />} active={props.active}>
      {props.children}
    </LoadingOverlay>
  );
};

export default Loader;
