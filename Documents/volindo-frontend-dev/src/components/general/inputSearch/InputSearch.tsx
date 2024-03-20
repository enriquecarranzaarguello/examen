import { useState, useEffect, useRef, ReactNode } from 'react';
import styles from './InputSearch.module.scss';
import Image, { StaticImageData } from 'next/image';

export interface InputSearchItem {
  value: string | number;
  label: string | ReactNode;
  labelOnSelection?: string | ReactNode;
  sublevel?: boolean;
  imageType?: string;
}

interface InputSearchProps {
  /**
   * The selectable items to display on the dropdown *(items from a external search)*
   */
  items: InputSearchItem[];
  /**
   * Text to display when there is no selected option
   */
  placeholder?: string;
  /**
   * Text to display on the input search field
   */
  placeholderOnSearch?: string;
  /**
   * The default option to display when there is no selected option
   */
  defaultSelectedOption?: InputSearchItem | null;
  /**
   * Image to display beside a selectable item *(this image will be displayed on all items)*
   */
  imageItem?: string | StaticImageData;
  /**
   * Images to display beside specifics selectables items *(items will display a specific image*
   *  *if its `imageType` attribute corresponds to some key of the required images object)*
   */
  imagesItemByType?: {
    [key: string]: string | StaticImageData;
  };
  /**
   * Callback triggered when a item is selected
   */
  onChange?: (value: string | number) => void;
  /**
   * Callback triggered when the input search field is changed *(by default with a `"debounce"` delay)*
   */
  onSearch?: (value: string) => void;
  /**
   * CSS classes to be applied on the selection field
   */
  className?: string;
  /**
   * CSS classes to be applied on the dropdown menu
   */
  classNameMenu?: string;
  /**
   * CSS classes to be applied on the main wrapper of all the component
   */
  classNameWrapper?: string;
  /**
   * Delay on miliseconds for trigger the onSearch callback
   */
  delayOnSearchTime?: number;
  /**
   * Type of delay for trigger the onChange callback
   */
  delayOnSearchType?: 'debounce' | 'throttle' | 'none';
}

/**
 * General InputSearch component that can be used to **trigger a search** and **select an option**
 * from a supplied list of items *(ideally provided by the triggered search)*.
 */
const InputSearch = ({
  placeholder = 'Select an option...',
  placeholderOnSearch = 'Search...',
  items,
  defaultSelectedOption = null,
  imageItem,
  imagesItemByType,
  onChange,
  onSearch,
  className = '',
  classNameMenu = '',
  classNameWrapper = '',
  delayOnSearchTime = 300,
  delayOnSearchType = 'debounce',
}: InputSearchProps) => {
  const [selectedOption, setSelectedOption] = useState<InputSearchItem | null>(
    null
  );

  const [inputSearch, setInputSearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [focusItem, setFocusItem] = useState(0);

  const refMenu = useRef<HTMLDivElement>(null);
  const refClickOutside = useRef<((_e: any) => void) | null>(null);
  const refInput = useRef<HTMLInputElement>(null);
  const refMenuItems = useRef<HTMLDivElement>(null);

  const throttleLastRun = useRef(Date.now());

  // * Effects * //

  useEffect(() => {
    refClickOutside.current = handleClickOutside;
  }, []);

  //Debounce or throttle the search
  useEffect(() => {
    if (onSearch) {
      let timer: NodeJS.Timeout | null = null;

      switch (delayOnSearchType) {
        case 'debounce':
          timer = setTimeout(() => {
            onSearch(inputSearch);
          }, delayOnSearchTime);
          break;
        case 'throttle':
          timer = setTimeout(
            () => {
              if (Date.now() - throttleLastRun.current >= delayOnSearchTime) {
                onSearch(inputSearch);
                throttleLastRun.current = Date.now();
              }
            },
            delayOnSearchTime - (Date.now() - throttleLastRun.current)
          );
          break;
        default: // 'none'
          onSearch(inputSearch);
          break;
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [inputSearch]);

  useEffect(() => {
    if (openSearch) refInput.current?.focus();
  }, [openSearch]);

  useEffect(() => {
    const buttonsItems = refMenuItems.current;

    const handleKeyDownOnItems = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusItem(prev => (prev < items.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusItem(prev => {
          if (prev > 0) {
            return prev - 1;
          } else {
            refInput.current?.focus();
            return prev;
          }
        });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseMenu();
      }
    };

    buttonsItems?.addEventListener('keydown', handleKeyDownOnItems);

    return () => {
      buttonsItems?.removeEventListener('keydown', handleKeyDownOnItems);
    };
  }, [refMenuItems, items.length]);

  useEffect(() => {
    const focusButton: HTMLButtonElement = refMenuItems.current?.querySelector(
      `#item-${focusItem}`
    ) as HTMLButtonElement;
    if (focusButton) focusButton.focus();
  }, [focusItem]);

  // * Handlers * //

  const handleClickOutside = (event: any) => {
    if (refMenu.current && !refMenu.current.contains(event.target)) {
      handleCloseMenu();
    }
  };

  const handleOpenMenu = () => {
    setOpenSearch(true);
    if (refClickOutside.current)
      document.addEventListener('mousedown', refClickOutside.current);
  };

  const handleCloseMenu = () => {
    setOpenSearch(false);
    if (refClickOutside.current)
      document.removeEventListener('mousedown', refClickOutside.current);
  };

  const handleSelectOption = (item: InputSearchItem) => {
    setSelectedOption(item);
    if (onChange !== undefined && item !== undefined) onChange(item.value);
    handleCloseMenu();
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSelectOption(items[0]);
      handleCloseMenu();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusItem(0);
      const focusButton: HTMLButtonElement =
        refMenuItems.current?.querySelector('#item-0') as HTMLButtonElement;
      if (focusButton) focusButton.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleCloseMenu();
    }
  };

  // * Renders * //

  const renderSelectedOption = () => {
    let option = selectedOption ? selectedOption : defaultSelectedOption;

    if (!option) return placeholder;

    const label = option.labelOnSelection
      ? option.labelOnSelection
      : option.label;

    return <span>{label}</span>;
  };

  const renderMenuItem = (item: InputSearchItem, index: number) => {
    const imageSrc =
      imagesItemByType && item.imageType && imagesItemByType[item.imageType]
        ? imagesItemByType[item.imageType]
        : imageItem;

    const option = selectedOption || defaultSelectedOption;

    return (
      <button
        key={`${item.value}-${index}`}
        id={`item-${index}`}
        data-testid={`item-${index}`}
        onClick={e => {
          e.preventDefault();
          handleSelectOption(item);
        }}
        className={`${item.sublevel ? styles.sublevel : ''} ${option && option.value === item.value ? styles.active : ''}`}
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            width={21}
            height={21}
            alt={item.imageType ? item.imageType : 'default'}
          />
        )}
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className={`${styles.inputSearch} ${classNameWrapper}`}>
      <div
        className={`${styles.inputSearch_selection} ${className}`}
        onClick={handleOpenMenu}
      >
        {renderSelectedOption()}
      </div>
      <div
        className={`${styles.inputSearch_menu} ${openSearch ? styles.open : ''} ${classNameMenu}`}
        ref={refMenu}
      >
        <input
          type="text"
          name="search"
          autoComplete="off"
          value={inputSearch}
          onChange={e => setInputSearch(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholderOnSearch}
          ref={refInput}
        />

        <div
          className={styles.inputSearch_menu_items}
          ref={refMenuItems}
          tabIndex={0}
        >
          {items.map((item, index) => renderMenuItem(item, index))}
        </div>
      </div>
    </div>
  );
};

export default InputSearch;
