import { useRef } from "react";
import ScrollingCircle from "./ScrollingCircle";

interface StoryReaderProps {
  body: string;
}

const StoryReader = ({ body }: StoryReaderProps) => {
  const ref = useRef(null);

  return (
    <section>
      <div className="note-background mt-2 font-bold text-2xl content-center text-left">
        <ScrollingCircle refProp={ref} />
        <pre ref={ref}>{body}</pre>
      </div>
    </section>
  );
};

export default StoryReader;
