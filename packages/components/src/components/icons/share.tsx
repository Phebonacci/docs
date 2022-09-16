import { ReactElement } from 'react';
import { DEFAULT_PATH_PROPS } from '../../helpers/utils.js';

export const ShareIcon = ({ className }: { className?: string }): ReactElement => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5 6C14.7426 6 15.75 4.99264 15.75 3.75C15.75 2.50736 14.7426 1.5 13.5 1.5C12.2574 1.5 11.25 2.50736 11.25 3.75C11.25 4.99264 12.2574 6 13.5 6Z"
        {...DEFAULT_PATH_PROPS}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 11.25C5.74264 11.25 6.75 10.2426 6.75 9C6.75 7.75736 5.74264 6.75 4.5 6.75C3.25736 6.75 2.25 7.75736 2.25 9C2.25 10.2426 3.25736 11.25 4.5 11.25Z"
        {...DEFAULT_PATH_PROPS}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5 16.5C14.7426 16.5 15.75 15.4926 15.75 14.25C15.75 13.0074 14.7426 12 13.5 12C12.2574 12 11.25 13.0074 11.25 14.25C11.25 15.4926 12.2574 16.5 13.5 16.5Z"
        {...DEFAULT_PATH_PROPS}
      />
      <path d="M6.44336 10.1325L11.5659 13.1175" {...DEFAULT_PATH_PROPS} />
      <path d="M11.5584 4.88251L6.44336 7.86751" {...DEFAULT_PATH_PROPS} />
    </svg>
  );
};
