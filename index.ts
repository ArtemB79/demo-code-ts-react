export const generateElementsWithPath = (paths: Path[], points: Point[]) => {
  const pathMain = paths.find((path) => path.variant === PathVariant.Main);
  if (!pathMain) return { elements: [], renderedPaths: [] };

  const sortedPoints = sortByOrder({ data: points });
  const newElements: Element[] = [];
  const allPaths = [...paths];
  const currentPaths: (Path | null)[] = [pathMain];
  const endPoints: IEndPoint[] = [];
  const renderedElements: Element["id"][] = [];
  const renderedPaths: Path["id"][] = [pathMain.id];

  // if currentBranches does not contain paths (or is an array of null)- return;
  if (!currentPaths.find((path) => path)) {
    return { elements: [], renderedPaths: [] };
  }

  let y = START_Y;
  let lastElementHeight = 0;

  const renderPoint = (currentPoint: Point, x: string | number) => {
    const currentElementHeight = currentPoint.height ?? OFFSET / 2;
    lastElementHeight = currentElementHeight;

    const element = generateElementByPoint(
      currentPoint,
      {
        x: START_X - Number(x) * Size.DistanceBetweenPaths,
        y,
      },
      currentElementHeight
    );
    newElements.push(element);
    renderedElements.push(currentPoint.id);
  };

  while (currentPaths.length) {
    y += lastElementHeight + OFFSET;
    
    if (!currentPaths.find((path) => path)) {
      break;
    }

    let hasDivider = false;
    for (const [x, path] of Object.entries(currentPaths)) {
      if (!path) continue;

      const currentPoint = sortedPoints.find(
        (el) => el.pathId === path.id && !renderedElements.includes(el.id)
      );
      if (!currentPoint) continue;
      if (currentPoint.direction === Direction.Divider) {
        renderPoint(currentPoint, x);
        hasDivider = true;
        break;
      }
    }
    if (hasDivider) continue;

    for (const [x, path] of Object.entries(currentPaths)) {
      if (!path) continue;

      const currentPoint = sortedPoints.find(
        (el) => el.pathId === path.id && !renderedElements.includes(el.id)
      );
      if (!currentPoint) {
        if (path.variant === PathVariant.Branch && path.endPointId) {
          removeItemById(endPoints, path.endPointId);
        }

        const index = currentPaths.indexOf(path);
        if (index !== -1) {
          currentPaths[index] = null;
        }
        continue;
      }

      const foundEndPoints = endPoints.filter(
        (endPoint) => endPoint.id === currentPoint.id
      );
      //  if "end"-points array contains current point AND not all paths from that array are ready to be closed - skip it
      if (foundEndPoints.length > 0) {
        const pathsReadyToBeClosed = foundEndPoints.find(
          (endPoint) =>
            !sortedPoints.find(
              (point) =>
                point.pathId === endPoint.path &&
                !renderedElements.includes(point.id)
            )
        );
        if (!pathsReadyToBeClosed) continue;
      }

      // HERE draw current point
      renderPoint(currentPoint, x);

      // check non-current paths for "start"-relationS;
      const pathsThatStartFromCurrentPoint = allPaths.filter(
        (path) =>
          path.variant === PathVariant.Branch &&
          path.startPointId === currentPoint.id
      );
      // if relation(s) exists,
      if (pathsThatStartFromCurrentPoint.length) {
        pathsThatStartFromCurrentPoint.forEach((nonCurrentBranch) => {
          if (nonCurrentBranch.variant === PathVariant.Main) return;

          // - add THEM to currentBranches
          currentPaths.push(nonCurrentBranch);
          renderedPaths.push(nonCurrentBranch.id);
          removeItemOnce(allPaths, nonCurrentBranch);
          // - store "end"-point for just added path
          if (nonCurrentBranch.endPointId) {
            endPoints.push({
              id: nonCurrentBranch.endPointId,
              path: nonCurrentBranch.id,
            });
          }
        });
        // - skip other paths for this iteration
        break;
      }
    }
  }

  return { elements: newElements, renderedPaths };
};
