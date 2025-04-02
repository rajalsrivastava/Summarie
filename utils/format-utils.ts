export function formatFileNameAsTitle(fileName: string) {
  //remove the extension from the file name and replace special characters with a space
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const withSpaces = withoutExtension
    .replace(/[-_]/g, " ") //replace dashes and underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2"); //insert space between camel case words

  //convert to title case (capitalize first letter of each word)

  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
