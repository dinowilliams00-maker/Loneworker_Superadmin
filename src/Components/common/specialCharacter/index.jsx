export const handleKeyPress = (
  event,
  type
) => {
  const { key } = event;

  const navigationKeys = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
    "Tab",
  ];

  // Allow navigation/editing keys
  if (navigationKeys.includes(key)) return;

  const forbiddenChars = [
    "!",
    "#",
    "$",
    "%",
    "&",
    "*",
    "(",
    ")",
    "+",
    "@",
    "^",
    "_",
    "/",
    " ",
  ];

  // Prevent forbidden characters
  if (forbiddenChars.includes(key)) {
    event.preventDefault();
    return;
  }

  // Character type check
  const isLetter = /^[a-zA-Z]$/.test(key);
  const isNumber = /^[0-9]$/.test(key);

  if (
    (type === "number" && !isNumber) ||
    (type === "string" && !isLetter) ||
    (type === "both" && !isLetter && !isNumber)
  ) {
    event.preventDefault();
  }
};