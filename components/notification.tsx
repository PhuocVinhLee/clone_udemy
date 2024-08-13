"use client";

import { useUser } from "@clerk/clerk-react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopoverCpn } from "@/components/popover";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  QandAType,
  TransformedUserId,
  TransformedChapterId,
} from "@/lib/database/models/qanda.model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TimeAgo from "./time-ago";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useNotification } from "./context/notificationContext";
import NotificationSound from "./notification-sound";
import NotificationHandler from "./notification-handler";
import PermissionHandler from "./permission-handler";
import { NotificationType, TransformedCourseId } from "@/lib/database/models/notification .model";

interface TransformedQandAUserIdAndChapterIdAndCourseId
  extends Omit<NotificationType, "userId" | "chapterId" | "courseId"> {
  userId: TransformedUserId;
  chapterId: TransformedChapterId;
  courseId: TransformedCourseId
}
const Notification = () => {
  const { setTarget, setTargetType } = useNotification();
  const { user } = useUser();
  //const userId = user?.publicMetadata?.userId;
  const Router = useRouter();
  const pathName = usePathname();

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (user?.username && typeof user.username === "string") {
      setUserName(user?.username);
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<
    TransformedQandAUserIdAndChapterIdAndCourseId[]
  >([]);

  const getDataNotifications = async () => {
    try {
      setIsLoading(true);
      const respone = await axios.get(`/api/notifications`);
      setNotifications(respone?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDataNotifications();
  }, []);

  useEffect(() => {
    const notificationHandle = (
      notification: TransformedQandAUserIdAndChapterIdAndCourseId
    ) => {
      getDataNotifications();
      setPlaySound(notification._id);

    };
    //const channelName = `private-${userId}`;
    pusherClient.subscribe(userName ? userName : "");
    pusherClient.bind("notification:new", notificationHandle);

    return () => {
      pusherClient.unsubscribe(userName ? userName : "");
      pusherClient.unbind("notification:new");
    };
  }, [userName]);

  const handldeSeenAndRedirect = async (
    notification: TransformedQandAUserIdAndChapterIdAndCourseId
  ) => {
    try {
      if (!notification?.isSeen) {
        console.log(notification);
        const respone = await axios.patch(
          `/api/notifications/seen/${notification._id}`
        );
      }
      if (notification?.type == "NEW:QANDA") {
        Router.push(
          `/courses/${notification.courseId._id}/chapters/${notification.chapterId._id}/qanda?c=${notification.id_message}`
        );
      } else if (notification?.type == "REPLAY:QANDA") {
        const message = await axios.get(
          `/api/chapters/${notification.courseId._id}/${notification.chapterId}/qanda/root/${notification.id_message}`
        );
        console.log("data", message.data);
        Router.push(
          `/courses/${notification.courseId._id}/chapters/${notification.chapterId._id}/qanda?c=${message?.data.rootId}&s=${notification.id_message}`
        );
      } else if (notification?.type == "NEW:REVIEW") {
        Router.push(
          `/courses/${notification.courseId._id}/chapters/${notification.chapterId._id}/review?c=${notification.id_message}`
        );
      }
      if (notification?.type == "REPLAY:REVIEW") {
        console.log("lkascnlksanclkasn");

        Router.push(
          `/courses/${notification.courseId._id}/chapters/${notification.chapterId._id}/review?c=${notification.id_message}`
        );
      }

      getDataNotifications();
    } catch (error) {
      toast.error("Some thing went wrong");
    }
  };
  const renderNotification = (
    notification: TransformedQandAUserIdAndChapterIdAndCourseId
  ) => {
    return (
      <div
        onClick={() => {
          handldeSeenAndRedirect(notification);
        }}
        className={cn(
          " hover:bg-slate-900 p-2  flex gap-x-2  items-start  justify-between",
          notification?.isSeen && " bg-customDark"
        )}
      >
        <div className="flex  gap-x-2 ">
          <div className="w-17 ">
            <Avatar className="">
              <AvatarImage src={notification?.userId?.photo} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className=" max-w-[400px] ">
            <div className="flex gap-x-2 mb-2">
              <h5 className=" font-bold">@{notification?.userId?.username}</h5>{" "}
              <span className=" font-light">{notification?.title}: </span>
            </div>
            <div>
              {notification.message}
              
            </div>

            <div className="  text-slate-300">
              {notification?.createdAt && (
                <TimeAgo date={notification?.createdAt}></TimeAgo>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <Image
            width={50}
            height={20}
            src={notification?.courseId?.imageUrl}
            alt="@shadcn"
          ></Image>
        </div>
      </div>
    );
  };

  const notificationContent = (
    <div className="   max-h-full overflow-auto flex  flex-col ">
      {notifications.length ? (
        notifications.map((notification, index) => (
          <div key={index}>{renderNotification(notification)}</div>
        ))
      ) : (
        <div className="p-5"> You dont have notification </div>
      )}
    </div>
  );
  const [playSound, setPlaySound] = useState<string>("");

  return (
    <div>
      <PermissionHandler />
      <NotificationHandler playSoundProp={playSound}></NotificationHandler>

      <PopoverCpn content={notificationContent}>
        <Button variant="ghost" className="p-1   ">
          <div className=" relative ">
            <Bell />
            {notifications.find((noti) => noti.isSeen === false) && (
              <span className="absolute top-0 right-0 transform translate-x-1/1 -translate-y-1/2   bg-red-500 text-white rounded-full p-1 text-sm font-bold"></span>
            )}
          </div>
        </Button>
      </PopoverCpn>
    </div>
  );
};

export default Notification;
