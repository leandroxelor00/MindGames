import { useContext } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";
 
export function useAccessibility() {
  return useContext(AccessibilityContext);
}