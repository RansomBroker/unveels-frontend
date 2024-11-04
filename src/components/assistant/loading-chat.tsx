import { Player } from "@lottiefiles/react-lottie-player";
import SarahAvatar from "../../assets/sarah-avatar.png";

interface LoadingChatProps {
  showAvatar?: boolean;
}

const LoadingChat: React.FC<LoadingChatProps> = ({ showAvatar = true }) => {
  return (
    <p className="flex items-center">
      {showAvatar && (
        <img
          alt="Agent"
          className="mr-2 size-14 rounded-full"
          src={SarahAvatar}
        />
      )}
      <Player
        autoplay
        loop
        src="https://lottie.host/53673526-413a-4acf-973e-2ac3b6383934/mNYFsWZBHh.json"
        style={{ width: "50px", height: "50px" }}
      />
    </p>
  );
};

export default LoadingChat;