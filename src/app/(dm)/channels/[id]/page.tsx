"use client";
import { Page, PageContent, PageHeader } from "@/components/layout/page";
import Avatar from "@/components/ui/avatar";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import {
  AiFillGift,
  AiFillPlusCircle,
  AiOutlineFileText,
  AiOutlineGif,
} from "react-icons/ai";
import { CgSmileMouthOpen } from "react-icons/cg";
import { useChannelStore } from "@/state/channel-list";
import React from "react";
import InputField from "@/components/ui/input/input-field";
import { useCurrentUserStore } from "@/state/user";
import { useFriendStore } from "@/state/friend-list";

export default function ChannelPage({ params }: { params: { id: string } }) {
  const { channels } = useChannelStore();
  const { friends, setFriends } = useFriendStore();
  const { currentUser } = useCurrentUserStore();
  const user = channels?.find((channel) => channel.id === params.id);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString(
    "default",
    { month: "long" },
  )} ${currentDate.getFullYear()}`;
  const [newMessage, setNewMessageText] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      userId: user?.id,
      text: "Hello! How are you?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const chatContainerRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [showDetailMessage, setShowDetailMessage] = React.useState<{
    [key: number]: boolean;
  }>({});

  const handleSubmit = () => {
    const newMessageObj = {
      id: messages.length + 1,
      userId: currentUser?.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    setNewMessageText("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessageText(e.target.value);
  };
  const intersection = channels?.filter(
    (channel) => friends?.includes(channel),
  );
  const isFriend = intersection?.some((friend) => friend.id === params.id);

  const handleAddDelete = () => {
    if (friends !== null) {
      if (isFriend) {
        setFriends(friends.filter((friend) => friend.id !== params.id));
      } else {
        const newFriend = channels?.find((channel) => channel.id === params.id);
        if (newFriend) {
          setFriends([newFriend, ...friends]);
        }
      }
    }
  };

  return (
    <Page>
      {!user?.id ? (
        <div className="p-4 text-base text-gray-400">
          Ups probably we cannot find your conversation please back to main page
        </div>
      ) : (
        <>
          <PageHeader>
            <div className="flex items-center gap-4">
              <div className="flex flex-none items-center gap-3 text-sm font-semibold">
                <Avatar
                  size="sm"
                  src={user?.avatar}
                  alt="avatar"
                  status={user?.status}
                />
                {user?.name}
              </div>
              <Divider vertical />
              <div className="text-xs text-gray-400">{user?.username}</div>
            </div>
          </PageHeader>
          <PageContent className="h-full w-full flex-col pl-6 pr-1 ">
            <div className="max-h-[86vh] !overflow-y-auto ">
              <div className="flex flex-col ">
                <Avatar
                  className=" relative left-4 top-4 mb-12 scale-[2]"
                  src={user?.avatar}
                  alt="avatar"
                />
                <p className="text-3xl font-bold"> {user?.name}</p>
                <p className="my-3 text-xl font-semibold"> {user?.username}</p>
                <span className="text-base text-gray-300">
                  this is the beginning of your story with
                  <span className="ml-1 font-semibold text-gray-200">
                    {user?.name}
                  </span>
                </span>
                <div className="my-4 flex h-fit items-center gap-4 text-[14px]">
                  <p>no shared servers</p>
                  <button
                    onClick={() => {
                      handleAddDelete();
                    }}
                    className={`duration-400 ${
                      isFriend
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    } rounded px-3 py-0.5 transition-colors ease-in-out `}
                  >
                    {isFriend ? " Delete Friend" : "Add Friend"}
                  </button>
                  <button className="duration-400 rounded bg-gray-600 px-3 py-0.5 transition-colors ease-in-out hover:bg-gray-500">
                    Block
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <Divider className="h-[1px] w-full" />
                <p className="flex  whitespace-nowrap px-1 text-xs font-semibold text-gray-400">
                  {formattedDate}
                </p>
                <Divider className="h-[1px] w-full" />
              </div>
              {messages.map((message, index) => (
                <div
                  ref={chatContainerRef}
                  key={message.id}
                  className={`  ${
                    index === 0 ||
                    messages[index]?.userId !== messages[index - 1]?.userId
                      ? "my-4"
                      : "my-0 h-fit"
                  } relative flex items-start gap-2`}
                >
                  <Avatar
                    className={` ${
                      index === 0 ||
                      messages[index]?.userId !== messages[index - 1]?.userId
                        ? "opacity-100"
                        : "!h-0 opacity-0"
                    } z-[1]`}
                    size="sm"
                    src={
                      message?.userId === user?.id
                        ? user?.avatar
                        : currentUser?.avatar
                    }
                    alt="Avatar"
                    status={user?.status}
                  />
                  {showDetailMessage[message.id] && (
                    <div className="absolute top-1.5 z-0 text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </div>
                  )}
                  <div className="flex w-full flex-col overflow-hidden">
                    {(index === 0 ||
                      messages[index]?.userId !==
                        messages[index - 1]?.userId) && (
                      <div className="flex items-center justify-start">
                        <div className="text-sm font-semibold">
                          {message?.userId === user?.id
                            ? user?.name
                            : currentUser?.name}
                        </div>
                        <div className=" ml-2 text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                    <div
                      onMouseEnter={() => {
                        setShowDetailMessage((prev) => ({
                          ...prev,
                          [message.id]: true,
                        }));
                      }}
                      onMouseLeave={() => {
                        setShowDetailMessage((prev) => ({
                          ...prev,
                          [message.id]: false,
                        }));
                      }}
                      className="break-words pr-12"
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <InputField
              startIcon={
                <AiFillPlusCircle
                  className="cursor-pointer hover:text-gray-200"
                  size={22}
                />
              }
              endIcon={
                <div className="absolute right-4 top-0 flex h-full cursor-pointer items-center space-x-2.5 text-gray-400 ">
                  <AiFillGift className="hover:text-gray-300" size={22} />
                  <AiOutlineGif className="hover:text-gray-300" size={22} />
                  <AiOutlineFileText
                    className="hover:text-gray-300"
                    size={22}
                  />
                  <CgSmileMouthOpen className="hover:text-gray-300" size={22} />
                </div>
              }
              className="!absolute bottom-0 left-0 right-0 mx-6 mb-4 w-auto"
            >
              <Input
                className=" py-2 pl-12 pr-36 !placeholder-gray-600"
                type="text"
                placeholder={`write something to @${user.name}`}
                value={newMessage}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit();
                  }
                }}
                onChange={handleInputChange}
              />
            </InputField>
          </PageContent>
        </>
      )}
    </Page>
  );
}
