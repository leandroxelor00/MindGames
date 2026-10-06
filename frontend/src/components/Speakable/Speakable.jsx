import { useAccessibility } from "../../context/AccessibilityContext";

export function Speakable({
  children,
  text,
  as: Component = "span",
  keyboard = false,
  ...props
}) {
  const {
    narracaoHover,
    speak,
    stopSpeaking,
  } = useAccessibility();

  const content =
    text || (typeof children === "string" ? children : "");

  function handleEnter() {
    if (narracaoHover && content) {
      speak(content);
    }
  }

  function handleLeave() {
    if (narracaoHover) {
      stopSpeaking();
    }
  }

  const isNativeInteractive =
    typeof Component === "string" &&
    [
      "button",
      "a",
      "input",
      "select",
      "textarea",
      "summary",
    ].includes(Component);

  const shouldReceiveTabIndex =
    keyboard && !isNativeInteractive;

  return (
    <Component
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      {...(shouldReceiveTabIndex
        ? { tabIndex: 0 }
        : {})}
      {...props}
    >
      {children}
    </Component>
  );
}