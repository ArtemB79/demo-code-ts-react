interface Props {
  pos: Vector2d;
  element: Element;
  index: number;
}

export const DiamondWithText: FC<Props> = (props) => {
  const { pos, element, index } = props;
  /** Store */
  const { zoomModifierDown, viewModifierDown, isEditing } =
    useTimeLineToolsStore();
  const { isRightSidePanelOpen } = useTimeLineRightPanelStore();
  const render = debugMenuStore.use.render();

  /** Utils */
  const { changeCursor } = useTimeLineToolsUtils();
  const { changePointName, createStaticPoint } = usePointUtils();
  const { selectElement } = usePointSelect();
  const { handleConnectBranch } = useTimeLinePathUtils();
  const { isCreatePointByPressingKey } = useConfigStore();

  /** Local state */
  const { id, type } = element;
  const [isShowTextArea, setIsShowTextArea] = useState(element.isEditing);

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (viewModifierDown) return;

    if (zoomModifierDown || isRightSidePanelOpen) {
      changeCursor(CursorType.Pointer);
    }
    if (e.type === "mouseenter") {
      setIsShowTextArea(true);
    }

    if (e.type === "mouseout") {
      if (!isEditing) {
        setIsShowTextArea(false);
      }
      changeCursor(CursorType.Create);
    }
  };

  const handleDiamondClick = (event: KonvaEventObject<MouseEvent>) => {
    if (event.evt.which === 1 && event.evt.shiftKey) {
      handleConnectBranch(id);
    }

    handleClick(event);
  };

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if ((e.evt.which === 1 && zoomModifierDown) || isRightSidePanelOpen) {
      return selectElement(id);
    }
  };

  const startTextX = pos.x + Size.Point / 2 + Size.DistBetweenPointLine;

  const handleCreateNewPoint = () => {
    if (!isCreatePointByPressingKey) return;

    createStaticPoint({
      afterPointId: id,
      pathId: element.pathId,
    });
  };

  const handleChandePointText = (newText: string) => {
    changePointName(id, newText);
    setIsShowTextArea(false);
  };

  return (
    <>
      <Diamond
        pos={pos}
        element={element}
        onMouseMove={handleMouseMove}
        onClick={handleDiamondClick}
        index={index}
      />
      {type !== ElementType.Temp && type !== ElementType.Transparent && (
        <>
          <EditableText
            x={pos.x + Size.Point / 2 + Size.DistBetweenPointLine + 5}
            y={pos.y + Size.Point + Size.DistBetweenPointLine}
            text={element.text}
            isEditing={element.isEditing ?? false}
            isShowTextArea={isShowTextArea ?? false}
            onChangeText={(newText) => {
              handleChandePointText(newText);
              handleCreateNewPoint();
            }}
            onEditEscape={handleChandePointText}
            handleMouseMove={handleMouseMove}
          />
          {render.metadata && type !== ElementType.Drag && (
            <TimelineMetadata
              targetElementId={id}
              pos={{ x: startTextX, y: pos.y }}
              data={element.metadata}
            />
          )}
        </>
      )}
    </>
  );
};
