export const getChatName = (chat, authUserId) => {
    if (!chat) return "Unknown Chat";

    // For one-on-one chats, find the other user's name
    if (chat.users && chat.users.length === 2) {
        const otherUser = chat.users.find((user) => user._id !== authUserId);
        if (otherUser) {
            // Return the full name if both firstName and lastName exist
            if (otherUser.username) {
                return `${otherUser.username}`.trim();
            }
            // Return username
            if (otherUser.username) {
                return otherUser.username;
            }
            
        }
    }

    // Default name for unknown users
    return "Unknown User";
};


export const getUserDetail = (chat, authUserId) => {
    if (!chat) return "Unknown Chat";

    // For one-on-one chats, find the other user's name
    if (chat.users && chat.users.length === 2) {
        const otherUser = chat.users.find((user) => user._id !== authUserId);
        if (otherUser) {
            // Return the full name if both firstName and lastName exist
            return otherUser
            
        }
    }

    // Default name for unknown users
    return "Unknown User";
};

export const getChatImage = () => {
    return "https://s3-alpha-sig.figma.com/img/2251/bcc1/90c79d5b9c428484581b2a811dd92aa7?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ldACfoaBwSqFjjaL6JQ9avJCRmY93xqFqMHzylDTOHhQy21erEs8FhTReXkSbo-PEde2LZE5uUw1DDbD8B3Mf617lCfM3DbJgkcuOAIKDJmFU1Mms7XmS9a8weKYpNQi~5TPJSDHm5qpTJzlVeoH~lO6~9Sno7hKopt0PFq0MjEK14FwRLcgzAabFWD33nZKC0l0WfhX7RTWmHvC1ABELbsxxWSxWFPz-QpnjjstuqJGoQNu4YOcuuJx2lVy-fR~5KbT1Kptszddml~kPTHSTwarIv9fuk0PiWIDlRDQDakjIuqmnQpBqZtydh6-4d-n4FNgo8PIS7c7O7bduqW8yA__";
};
export default getChatName;