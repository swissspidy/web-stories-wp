// the entrire render time since execution of this file (likely on page load)
let cumulativeDuration = {};

// profiler callback
// https://reactjs.org/docs/profiler.html#onrender-callback
export const getProfileData = ([
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions, // the Set of interactions belonging to this update
]) => {
  if (!cumulativeDuration[id]) cumulativeDuration[id] = 0;
  cumulativeDuration[id] = Number(
    (cumulativeDuration[id] + actualDuration).toFixed(2)
  );
  return {
    id,
    interactions,
    phase,
    actualDuration: Number(actualDuration.toFixed(2)),
    baseDuration: Number(baseDuration.toFixed(2)),
    commitTime: Number(commitTime.toFixed(2)),
    cumulativeDuration: cumulativeDuration[id],
    startTime: Number(startTime.toFixed(2)),
  };
};

export const logProfileData = ({
  actualDuration,
  baseDuration,
  cumulativeDuration,
  phase,
  id,
}) => {
  console.group(id);
  console.table({
    actualDuration,
    baseDuration,
    cumulativeDuration,
  });
  console.groupEnd();
};
