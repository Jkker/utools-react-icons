import { Button, Empty, message, Tooltip } from "antd";
import { useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";

const columnWidth = 104 + 8;
const rowHeight = 80 + 8;
const padding = 4;

const getFirstCapitalizedWord = (str = "") =>
  str.match(/[A-Z][a-z]+/)[0].toLowerCase();

const IconButton = ({ onClick, Icon, name, style }) => (
  <div
    style={{
      padding,
      ...style,
    }}
  >
    <Button
      onClick={() => onClick(name)}
      style={{
        height: rowHeight - padding * 2,
        width: "100%",
        whiteSpace: "nowrap",
        padding
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onClick(name, true);
      }}
    >
      <Icon
        style={{
          fontSize: "1.75rem",
          opacity: 0.9,
        }}
      />
      <Tooltip
        title={name}
        overlayInnerStyle={{
          fontSize: "0.75rem",
        }}
        placement="bottom"
      >
        <div
          style={{
            fontSize: "0.75rem",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </div>
      </Tooltip>
    </Button>
  </div>
);

const IconsList = ({ items = {}, style }) => {
  const list = Object.entries(items);

  if (!list?.length) {
    return (
      <Empty
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        description="没有找到图标"
      />
    );
  }

  const onClick = useCallback((text, full = false) => {
    text = full
      ? `import { ${text} } from "react-icons/${getFirstCapitalizedWord(
          text
        )}";`
      : text;

    navigator.clipboard
      .writeText(text)
      .then(() => message.success(`已复制 ${text}`))
      .catch(() => message.error(`复制失败 ${text}`));
  }, []);

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style, data }) => {
      const index = rowIndex * data.columnCount + columnIndex;
      if (!data.list || index >= data.list.length) {
        return null;
      }
      const [name, Icon] = data.list?.[index];
      return (
        <IconButton onClick={onClick} Icon={Icon} name={name} style={style} />
      );
    },
    [onClick]
  );

  return (
    <AutoSizer
      style={{
        ...style,
      }}
    >
      {({ height, width }) => {
        const columnCount = Math.floor(width / columnWidth);
        const rowCount = Math.ceil(list.length / Math.floor(width / rowHeight));
        return (
          <Grid
            columnCount={columnCount}
            columnWidth={width / columnCount}
            height={height}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={width}
            itemData={{
              columnCount,
              rowCount,
              list,
            }}
          >
            {Cell}
          </Grid>
        );
      }}
    </AutoSizer>
  );
};

export default IconsList;
