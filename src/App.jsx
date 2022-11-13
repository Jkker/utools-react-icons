import { Button, Checkbox, Select, Tag } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconsManifest } from 'react-icons/lib';
import IconsList from './IconList';
import * as ReactIcons from './ReactIcons';

const { Option } = Select;

const ICON_KEYS = Object.keys(ReactIcons).sort((a, b) => a.localeCompare(b));

const SortedIconsManifest = IconsManifest.sort((a, b) =>
  a.id.localeCompare(b.id)
);
const camelCaseToWords = (str) => str.split(/(?=[A-Z])/);

const matchIconName = (iconName, query) =>
  camelCaseToWords(iconName)
    .slice(1)
    .some((word) => word.toLowerCase().includes(query));

const SEARCH_KEYS = ['/'];
const CTRL_SEARCH_KEYS = ['f', 'k'];

const tagRender = (props) => {
  const { label, closable, onClose } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    // event.stopPropagation();
  };

  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      className="ant-select-selection-item tag"
      // style={{
      //   marginRight: 3,
      //   maginTop: 3,
      //   border: 0,
      //   height: 24,
      // }}
    >
      {label}
    </Tag>
  );
};

function App() {
  const [iconSets, setIconSets] = useState(ICON_KEYS);
  const [query, setQuery] = useState('');

  const handleQueryChange = useCallback(
    debounce((value) => {
      setQuery(value?.text ? value?.text.trim().toLowerCase() : '');
    }, 150),
    []
  );

  const listItems = useMemo(() => {
    const filtered = {};
    const setNames = iconSets.length ? iconSets : ICON_KEYS;

    const match = (iconName) =>
      query.split(' ').some((q) => matchIconName(iconName, q));

    for (const setName of setNames) {
      const icons = ReactIcons[setName];
      for (const iconName in icons) {
        if (query === '' || match(iconName)) {
          filtered[iconName] = icons[iconName];
        }
      }
    }
    return filtered;
  }, [iconSets, query]);

  useEffect(() => {
    if (!window.utools) return;
    window.utools.onPluginEnter(() => {
      window.utools.setSubInput(handleQueryChange, 'Search React Icons', true);
    });

    // 退出插件
    window.utools.onPluginOut(() => {
      setQuery('');
      setIconSets(ICON_KEYS);
    });

    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && CTRL_SEARCH_KEYS.includes(e.key)) ||
        SEARCH_KEYS.includes(e.key)
      )
        window.utools.subInputFocus(true);
    });
  }, []);

  return (
    <>
      <Select
        mode="multiple"
        style={{
          flexWrap: 'nowrap',
          paddingTop: 4,
          paddingBottom: 4,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          boxShadow: '0px 9px 24px rgb(0 0 0 / 6%)',
          zIndex: 10,
        }}
        placeholder="全部图标库"
        onChange={(value) => {
          setIconSets(value);
        }}
        maxTagCount="responsive"
        value={iconSets}
        optionLabelProp="label"
        bordered={false}
        virtual={false}
        tagRender={tagRender}
        showArrow
        menuItemSelectedIcon={<></>}
        dropdownRender={(menu) => (
          <>
            {menu}
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 12px',
                width: '100%',
              }}
            >
              <Checkbox
                style={{
                  minWidth: '40%',
                  cursor: 'pointer',
                }}
                checked={iconSets.length === ICON_KEYS.length}
                onChange={({ target }) =>
                  setIconSets(target.checked ? ICON_KEYS : [])
                }
              >
                全选
              </Checkbox>
              <Button
                style={{
                  minWidth: '15%',
                  cursor: 'pointer',
                }}
                type="primary"
                onClick={() => document.activeElement.blur()}
              >
                确认
              </Button>
            </div>
          </>
        )}
      >
        {SortedIconsManifest.map(({ id, name }) => (
          <Option key={id} value={id} label={name}>
            <span className="option-icon-id">{id}</span>
            {name}
          </Option>
        ))}
      </Select>

      <main
        style={{
          marginTop: 40,
          width: '100%',
          height: 'calc(100vh - 40px)',
        }}
      >
        <IconsList items={listItems} />
      </main>
    </>
  );
}

export default App;
