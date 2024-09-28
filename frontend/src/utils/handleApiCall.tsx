import { notifications } from "@mantine/notifications";

/**
 * Wraps API response with notification
 *
 * @param {Function} [finallyFunction] - Optional function to call in the finally block
 */
export function handleApiCall(
  apiCall: Promise<any>,
  successMsg: string,
  errorMsg: string,
  finallyFunction?: Function
): void {
  apiCall
    .then((data) => {
      // Show success message
      notifications.show({
        title: successMsg,
        message: "",
        color: "green",
      });
    })
    .catch((error) => {
      // Show error message
      notifications.show({
        title: errorMsg,
        message: "",
        color: "red",
      });
    })
    .finally(() => {
      if (finallyFunction) {
        finallyFunction();
      }
    });
}
