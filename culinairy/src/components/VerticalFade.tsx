import React from "react";

interface VerticalFadeProps {
  /**
   * The distance from the bottom of the parent container to the bottom of the fadeout.
   * Defaults to parent's height.
   * @default 0
   */
  offset?: number;
  /**
   * The rate at which the fadeout fades out.
   * A higher value means a faster fadeout.
   * @default 1.4
   */
  decay?: number;
  /**
   * The z-index of the fadeout.
   * @default Number.MAX_SAFE_INTEGER
   */
  zIndex?: number;
  /**
   * The direction of the gradient.
   * @default 'Down'
   */
  direction?: "Up" | "Down";
  /**
   * The starting position from the bottom of parent.
   * @default 0
   */
  position?: number;
  /**
   * The color, in rgb or hex format.
   * @default 'rgba(242, 242, 242)'
   */
  color?: string;
  /**
   * The parent id, or null for document.
   * @default ''
   */
  parentId?: string;
  /**
   * The starting position from the bottom/top of parent.
   * @default 'bottom'
   */
  stick?: "top" | "bottom";
}

/**
 * Converts a color string in either hex or rgb format to rgba format with a given opacity value.
 *
 * @param color - The color string to convert.
 * @param opacity - The opacity value to apply to the color.
 * @returns The color string in rgba format with the given opacity value.
 */
function convertColorToRgba(color: string, opacity: number): string {
  // Clean up the color string and convert a hex color to rgba
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      color = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    } else if (hex.length !== 6) {
      throw new Error(`Invalid hex color: ${color}`);
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;

    // Convert an rgb color to rgba
  } else if (color.startsWith("rgb(")) {
    const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      throw new Error(`Invalid rgb color: ${color}`);
    }
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;

    // Return the default rgba color if none of the above cases match
  } else {
    return `rgba(242, 242, 242, ${opacity})`;
  }
}

/**
 * A component that creates a fadeout effect.
 * @param {object} props - The props object.
 * @param {number} [props.offset=0] - The distance from the bottom of the parent container to the bottom of the fadeout. Defaults to parent's height.
 * @param {number} [props.decay=0.5] - The rate at which the fadeout fades out. A higher value means a faster fadeout.
 * @param {number} [props.zIndex=2147483647] - The z-index of the fadeout. Defaults to max.
 * @param {number} [props.direction='Down'] - The direction of the gradient. Defaults to 'Down'.
 * @param {number} [props.position=0] - The starting position from the bottom of parent.
 * @param {number} [props.color='rgba(242, 242, 242)'] - The color, in rgb or hex format.
 * @param {string} [props.parentId=''] - The parent id, or null for document.
 * @returns {JSX.Element} - The fadeout component.
 */
const VerticalFade: React.FC<VerticalFadeProps> = ({
  offset = 0,
  decay = 1.4,
  zIndex = Number.MAX_SAFE_INTEGER,
  direction = "Down",
  position = 0,
  color = "rgba(242, 242, 242)",
  parentId = "",
  stick = "bottom",
}) => {
  // State to store the height difference between the parent element and the fade element
  const [heightDifference, setHeightDifference] = React.useState<number>(0);
  // State to store the height of the parent element
  const [parentHeight, setParentHeight] = React.useState<number>(0);

  // Function to update the height difference based on the parent element's height and the offset
  const updateHeightDifference = React.useCallback(() => {
    const parent =
      document.getElementById(parentId) ?? document.documentElement;
    setParentHeight(parent.clientHeight);
    const diff = Math.min(Math.max(0, parentHeight - offset), parentHeight);
    setHeightDifference(diff);
  }, [parentHeight, offset, parentId]);

  // Update the height difference when the component mounts or the parent element resizes
  React.useEffect(() => {
    updateHeightDifference();

    window.addEventListener("resize", updateHeightDifference);
    return () => {
      window.removeEventListener("resize", updateHeightDifference);
    };
  }, [updateHeightDifference]);

  // This memoized variable calculates an array of colors with varying opacity levels to create the gradient effect.
  const colors = React.useMemo(() => {
    return Array.from({ length: heightDifference }, (_, i) => {
      const opacity = Math.max(
        0,
        Math.pow((heightDifference - i) / heightDifference, decay) // Calculate the opacity level based on the height difference and decay value.
      );
      return convertColorToRgba(color, opacity); // Convert the color to rgba with the calculated opacity level.
    });
  }, [heightDifference, decay, color]); // Re-run the memoized variable only when these dependencies change.

  // This code calculates the position of the gradient and renders the component with the calculated styles.
  const top = stick === "top"; // Determine if the gradient sticks to the top or bottom.
  position =
    direction === "Up" ? position + (top ? -1 : 1) * parentHeight : position; // Calculate the position based on the direction, parent height, and stick position.
  const positionStyle = top
    ? position
    : `calc(100% - ${heightDifference + parentHeight}px + ${position}px)`; // Calculate the position style based on the stick position and height difference.

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        [top ? "top" : "bottom"]: positionStyle,
        zIndex: zIndex,
        height: heightDifference,
        backgroundImage: `linear-gradient(${
          direction !== "Up" ? "to bottom," : "to top,"
        } ${colors.join(", ")})`, // Set the gradient background image with the calculated colors.
        pointerEvents: "none", // Disable pointer events on the component.
      }}
    />
  );
};

export default VerticalFade;
