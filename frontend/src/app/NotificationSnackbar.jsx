import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, Link } from "@mui/material";
import { removeNotificationByIndex } from "../redux/notificationsSlice";

const NotificationSnackbar = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  const handleClose = (index) => {
    dispatch(removeNotificationByIndex(index));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={index}
          open={true}
          autoHideDuration={4000}
          onClose={() => handleClose(index)}
        >
          <Alert
            onClose={() => handleClose(index)}
            variant="filled"
            severity={notification.type}
          >
            {notification.message}
            {notification.link && (
              <Link
                color="inherit"
                href={notification.link.href}
                target="_blank"
              >
                {notification.link.text}
              </Link>
            )}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationSnackbar;
