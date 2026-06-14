import { createContext, useContext } from 'react';

export const ChatContext = createContext<any>(null);
export function useChatContext() {
  return useContext(ChatContext);
}
