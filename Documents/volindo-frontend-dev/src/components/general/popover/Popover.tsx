import { useEffect, useRef, useState } from 'react';
import styles from './Popover.module.scss';
import { useFloating, offset, flip, Placement } from '@floating-ui/react-dom';

interface PopoverProps {
  /**
   * The label displayed on the button.
   */
  buttonLabel?: string;
  /**
   * The placement relative to the button (anchored).
   */
  placement?: Placement;
  /**
   * The Popover content.
   */
  children: JSX.Element;
  /**
   * The className to style the button.
   */
  classNameButton?: string;
  /**
   * The className to style the Popover.
   */
  classNameMenu?: string;
  /**
   * Whether the Popover can be flipped. In other words, if it can change his position depending on the view of the user.
   */
  flipable?: boolean;
  /**
   * The margin relative to the button (anchored).
   */
  margin?: number;
}

/**
 * General `Popover` component that can be used to **display a component anchored to a button**, opened with the button and close onClickOutside the component.
 *
 * This component is fully customizable (overriding default classNames) and can be placed in many positions.
 */
const Popover = ({
  buttonLabel = 'Button',
  placement = 'bottom',
  children,
  classNameButton = '',
  classNameMenu = '',
  flipable = false,
  margin = 10,
}: PopoverProps) => {
  const { x, y, refs, strategy, update } = useFloating({
    placement: placement,
    middleware: [offset(margin), flipable && flip()],
  });
  const refClickOutside = useRef<((_e: any) => void) | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [update]);

  useEffect(() => {
    refClickOutside.current = handleClickOutside;
  }, []);

  // * Handlers * //

  const handleClickOutside = (event: any) => {
    if (
      refs.floating.current &&
      !refs.floating.current.contains(event.target)
    ) {
      handleCloseMenu();
    }
  };

  const handleOpenMenu = (e: any) => {
    e.preventDefault();
    setOpenMenu(true);
    update();
    if (refClickOutside.current)
      document.addEventListener('mousedown', refClickOutside.current);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
    if (refClickOutside.current)
      document.removeEventListener('mousedown', refClickOutside.current);
  };

  return (
    <>
      <button
        id="popover-trigger"
        ref={refs.setReference}
        onClick={handleOpenMenu}
        className={classNameButton ? classNameButton : styles.popover_button}
      >
        {buttonLabel}
      </button>
      <div
        id="popover-content"
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y,
          left: x,
          zIndex: 10,
          display: openMenu ? 'block' : 'none',
        }}
        className={classNameMenu ? classNameMenu : styles.popover_menu}
      >
        {children}
      </div>
    </>
  );
};

export default Popover;
