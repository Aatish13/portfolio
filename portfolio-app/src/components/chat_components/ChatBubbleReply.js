import React from 'react';
const ChatBubbleReply = ({ name, content, chat_dp, time, }) => {
   return (
      <div className="flex py-2">
         <div className="flex items-start gap-2.5">
            <img className="w-8 h-8 rounded-full" src={chat_dp} />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700">
               <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{time}</span>
               </div>
               <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{content}</p>
            </div>
         </div>
      </div>


   );
};

export default ChatBubbleReply;