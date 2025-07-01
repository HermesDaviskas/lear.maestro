import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

interface Props {
  bufferActivity: BufferActivity;
  bufferUsage: BufferUsage;
  quantity: number;
  setQuantity: (q: number) => void;
}

export default function StatusPanel({
  bufferActivity,
  bufferUsage,
  quantity,
  setQuantity,
}: Props) {
  const isDisabled = bufferUsage === "unload";
  const lastActionWasButton = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastActionWasButton.current = false;
    const value = e.target.value;
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed >= 0) setQuantity(parsed);
    else if (value === "") setQuantity(0);
  };

  const increase = () => {
    lastActionWasButton.current = true;
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    lastActionWasButton.current = true;
    setQuantity(Math.max(0, quantity - 1));
  };

  const AnimatedWrapper = lastActionWasButton.current ? motion.div : "div";

  return (
    <div className="flex flex-col h-full gap-4 justify-between">
      {/* Status */}
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">Status</div>
        <div className="text-lg font-bold text-gray-400 lowercase">
          {bufferActivity ? bufferActivity : "No activity"}
        </div>
      </div>

      {/* Usage */}
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">Used for</div>
        <div
          className={`text-lg font-bold lowercase ${
            bufferUsage === "load" ? "text-yellow-400" : "text-blue-400"
          }`}
        >
          {bufferUsage}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex flex-col h-16 gap-1 border border-gray-700 rounded-md px-4 py-2 bg-gray-800 justify-between">
        <div className="text-xs tracking-widest uppercase text-gray-400">Quantity</div>
        <div className="flex text-lg font-bold text-gray-400 lowercase">
          <input
            value={quantity}
            min={0}
            onChange={handleInputChange}
            disabled={isDisabled}
            className={`w-18 h-6 text-center bg-gray-700 text-sm rounded-md px-2
              ${
                isDisabled
                  ? "text-gray-500 border-gray-600"
                  : "text-white border-gray-400"
              }`}
          />

          <AnimatedWrapper
            key={quantity}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="flex w-full  px-1 gap-2 items-center justify-between"
          >
            <Minus
              className={`w-6 h-6 ${
                isDisabled
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-red-400 cursor-pointer"
              }`}
              onClick={!isDisabled ? decrease : undefined}
            />
            <Plus
              className={`w-6 h-6 ${
                isDisabled
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-green-400 cursor-pointer"
              }`}
              onClick={!isDisabled ? increase : undefined}
            />
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
}
