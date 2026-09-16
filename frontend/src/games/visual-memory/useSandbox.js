export function useSandbox() {
  function gameGrid() {
    return Array.from({ length: 5 }, (_, index) => (
      <div key={index}>Item {index}</div>
    ));
  }
  return gameGrid;
}
